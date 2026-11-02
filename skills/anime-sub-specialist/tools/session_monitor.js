#!/usr/bin/env node

/**
 * Antigravity Session Monitor Tool
 * Pure Node.js CLI to monitor, inspect, and track Antigravity brain conversations.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');

const BRAIN_DIR = path.join(os.homedir(), '.gemini', 'antigravity', 'brain');

function getCurrentConvId() {
  if (process.env.ANTIGRAVITY_SOURCE_METADATA) {
    try {
      const meta = JSON.parse(process.env.ANTIGRAVITY_SOURCE_METADATA);
      return meta.tool?.conversationId || null;
    } catch (_) {}
  }
  return null;
}

function getAllConversations() {
  if (!fs.existsSync(BRAIN_DIR)) return [];
  const entries = fs.readdirSync(BRAIN_DIR, { withFileTypes: true });
  const convs = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === 'tempmediaStorage') continue;
    const convId = entry.name;
    const convPath = path.join(BRAIN_DIR, convId);
    const transcriptPath = path.join(convPath, '.system_generated', 'logs', 'transcript.jsonl');
    const planPath = path.join(convPath, 'plan.md');
    const planMetaPath = path.join(convPath, 'plan.md.metadata.json');

    let mtime = 0;
    try {
      const stat = fs.statSync(convPath);
      mtime = stat.mtimeMs;
      if (fs.existsSync(transcriptPath)) {
        const tStat = fs.statSync(transcriptPath);
        if (tStat.mtimeMs > mtime) mtime = tStat.mtimeMs;
      }
    } catch (_) {}

    convs.push({
      id: convId,
      path: convPath,
      transcriptPath: fs.existsSync(transcriptPath) ? transcriptPath : null,
      planPath: fs.existsSync(planPath) ? planPath : null,
      planMetaPath: fs.existsSync(planMetaPath) ? planMetaPath : null,
      mtime
    });
  }

  convs.sort((a, b) => b.mtime - a.mtime);
  return convs;
}

function parseLastSteps(transcriptPath, count = 10) {
  if (!transcriptPath || !fs.existsSync(transcriptPath)) return { steps: [], lastUserPrompt: '' };

  const content = fs.readFileSync(transcriptPath, 'utf8');
  const lines = content.trim().split('\n').filter(Boolean);
  const steps = [];
  let lastUserPrompt = '';

  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const data = JSON.parse(lines[i]);
      if (!lastUserPrompt && data.type === 'USER_INPUT') {
        const rawContent = data.content || '';
        const match = rawContent.match(/<USER_REQUEST>([\s\S]*?)<\/USER_REQUEST>/);
        lastUserPrompt = match ? match[1].trim() : rawContent.slice(0, 150).trim();
      }
      if (steps.length < count) {
        steps.unshift(data);
      }
      if (lastUserPrompt && steps.length >= count) {
        break;
      }
    } catch (_) {}
  }

  return { steps, lastUserPrompt, totalSteps: lines.length };
}

function getConversationDetails(conv) {
  const { steps, lastUserPrompt, totalSteps } = parseLastSteps(conv.transcriptPath, 6);
  let planSummary = '';
  let requestFeedback = false;

  if (conv.planMetaPath && fs.existsSync(conv.planMetaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(conv.planMetaPath, 'utf8'));
      planSummary = meta.summary || '';
      requestFeedback = !!meta.requestFeedback;
    } catch (_) {}
  }

  const lastStep = steps.length > 0 ? steps[steps.length - 1] : null;
  let status = 'Idle';
  let currentAction = 'No activity';

  if (lastStep) {
    const timeDiffSeconds = Math.round((Date.now() - new Date(lastStep.created_at).getTime()) / 1000);
    const isRecent = timeDiffSeconds < 180; // active within last 3 minutes

    if (lastStep.type === 'PLANNER_RESPONSE' && lastStep.tool_calls && lastStep.tool_calls.length > 0) {
      const tc = lastStep.tool_calls[0];
      const summary = tc.args ? (tc.args.toolSummary || tc.name) : tc.name;
      currentAction = `Executing tool: ${summary}`;
      status = isRecent ? 'RUNNING (Calling Tool)' : 'PAUSED (Tool Call)';
    } else if (lastStep.type === 'GENERIC' && lastStep.source === 'MODEL') {
      currentAction = 'Tool finished execution, waiting for model response';
      status = isRecent ? 'RUNNING (Generating response)' : 'WAITING';
    } else if (lastStep.type === 'USER_INPUT') {
      currentAction = 'Received user prompt, processing';
      status = isRecent ? 'RUNNING (Starting turn)' : 'PENDING';
    } else {
      if (requestFeedback) {
        status = 'AWAITING APPROVAL (Feedback requested)';
        currentAction = planSummary || 'Awaiting user to approve plan / feedback';
      } else {
        status = isRecent ? 'ACTIVE' : 'COMPLETED / IDLE';
        currentAction = (lastStep.content || '').slice(0, 120).replace(/\n/g, ' ') || 'Finished turn';
      }
    }
  }

  return {
    ...conv,
    totalSteps: totalSteps || 0,
    lastUserPrompt,
    planSummary,
    requestFeedback,
    status,
    currentAction,
    lastStepTime: lastStep ? lastStep.created_at : null
  };
}

// Commands
const command = process.argv[2] || 'status';
const targetArg = process.argv[3];

const currentId = getCurrentConvId();
const convs = getAllConversations();

if (command === 'list') {
  console.log(`\n=== DANH SÁCH CÁC PHIÊN GẦN NHẤT ===`);
  const topConvs = convs.slice(0, 6);
  topConvs.forEach((c, idx) => {
    const isCurrent = c.id === currentId;
    const details = getConversationDetails(c);
    const updated = new Date(c.mtime).toLocaleString('vi-VN');
    console.log(`\n[${idx + 1}] ID: ${c.id} ${isCurrent ? '*(Phiên hiện tại)*' : ''}`);
    console.log(`    Cập nhật: ${updated} | Tổng số bước: ${details.totalSteps}`);
    console.log(`    Trạng thái: ${details.status}`);
    console.log(`    Hành động: ${details.currentAction}`);
    console.log(`    Yêu cầu: "${details.lastUserPrompt.slice(0, 80)}..."`);
    if (details.planSummary) console.log(`    Plan: ${details.planSummary}`);
  });
  console.log('');
} else if (command === 'status') {
  let targetConv = null;

  if (targetArg && targetArg !== 'peer' && targetArg !== 'other') {
    const q = targetArg.toLowerCase();
    targetConv = convs.find(c => c.id.toLowerCase().startsWith(q)) ||
                 convs.find(c => {
                   const details = getConversationDetails(c);
                   return details.lastUserPrompt.toLowerCase().includes(q) ||
                          (details.planSummary && details.planSummary.toLowerCase().includes(q));
                 });
  } else if (targetArg === 'peer' || targetArg === 'other' || !targetArg) {
    // If no argument or 'peer', prefer the most recently active session that is NOT current session
    targetConv = convs.find(c => c.id !== currentId) || convs[0];
  }

  if (!targetConv) {
    console.log(`[Error] Không tìm thấy phiên làm việc phù hợp với: ${targetArg || 'default'}`);
    process.exit(1);
  }

  const details = getConversationDetails(targetConv);
  console.log(`\n======================================================`);
  console.log(`  BÁO CÁO TIẾN ĐỘ PHIÊN: ${details.id}`);
  console.log(`======================================================`);
  console.log(`- Trạng thái     : ${details.status}`);
  console.log(`- Hành động gần  : ${details.currentAction}`);
  console.log(`- Tổng bước log  : ${details.totalSteps}`);
  console.log(`- Cập nhật cuối  : ${details.lastStepTime || new Date(details.mtime).toISOString()}`);
  console.log(`- Yêu cầu chính  : "${details.lastUserPrompt.slice(0, 120)}"`);
  if (details.planSummary) {
    console.log(`- Tiến độ Plan   : ${details.planSummary}`);
    console.log(`- Chờ Duyệt (QA) : ${details.requestFeedback ? 'CÓ (Chờ Proceed)' : 'KHÔNG (Tự động)'}`);
  }
  console.log(`======================================================\n`);
} else if (command === 'tail') {
  let targetConv = convs.find(c => c.id !== currentId) || convs[0];
  let lineCount = 10;

  if (targetArg) {
    if (!isNaN(parseInt(targetArg, 10))) {
      lineCount = parseInt(targetArg, 10);
    } else {
      const q = targetArg.toLowerCase();
      targetConv = convs.find(c => c.id.toLowerCase().startsWith(q)) ||
                   convs.find(c => {
                     const details = getConversationDetails(c);
                     return details.lastUserPrompt.toLowerCase().includes(q);
                   }) || targetConv;
      if (process.argv[4] && !isNaN(parseInt(process.argv[4], 10))) {
        lineCount = parseInt(process.argv[4], 10);
      }
    }
  }

  const { steps } = parseLastSteps(targetConv.transcriptPath, lineCount);

  console.log(`\n=== ${steps.length} BƯỚC GẦN NHẤT CỦA PHIÊN ${targetConv.id} ===`);
  steps.forEach(s => {
    const tool = (s.tool_calls && s.tool_calls[0]) ? `[Tool: ${s.tool_calls[0].name} | ${s.tool_calls[0].args?.toolSummary || ''}]` : '';
    const content = s.content ? s.content.slice(0, 80).replace(/\n/g, ' ') : '';
    console.log(`[Step ${s.step_index}] (${s.created_at ? s.created_at.slice(11, 19) : ''}) ${s.source}/${s.type}: ${tool} ${content}`);
  });
  console.log('');
} else {
  console.log(`Sử dụng:
  node session_monitor.js status [id|từ_khóa|peer] : Xem tiến độ phiên đang chạy khác
  node session_monitor.js list                     : Danh sách các phiên gần nhất
  node session_monitor.js tail [id|từ_khóa] [số_dòng] : Xem các bước log mới nhất`);
}
