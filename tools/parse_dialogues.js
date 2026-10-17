/**
 * parse_dialogues.js
 * Sử dụng: node tools/parse_dialogues.js <file_sub.ass> [output_dialogues.json]
 * Trích xuất toàn bộ câu thoại và thông tin nhân vật để gửi cho AI dịch thuật.
 */

const fs = require('fs');
const path = require('path');

const subFile = process.argv[2];
if (!subFile) {
  console.error('Lỗi: Cần cung cấp đường dẫn file subtitle (.ass hoặc .srt).');
  console.log('Cách dùng: node tools/parse_dialogues.js <sub.ass> [dialogues.json]');
  process.exit(1);
}

const isAss = subFile.toLowerCase().endsWith('.ass') || subFile.toLowerCase().endsWith('.ssa');
const content = fs.readFileSync(subFile, 'utf8');
const lines = content.split(/\r?\n/);

let outputFile = process.argv[3];
if (!outputFile) {
  const dir = path.dirname(subFile);
  const base = path.basename(subFile, path.extname(subFile));
  outputFile = path.join(dir, `${base}_dialogues.json`);
}

const dialogues = [];
const speakersCount = {};

if (isAss) {
  lines.forEach((line, idx) => {
    if (line.startsWith('Dialogue: ')) {
      const payload = line.substring(10);
      const parts = payload.split(',');
      const layer = parts[0];
      const start = parts[1];
      const end = parts[2];
      const style = parts[3];
      const speaker = parts[4];
      const marginL = parts[5];
      const marginR = parts[6];
      const marginV = parts[7];
      const effect = parts[8];
      const text = parts.slice(9).join(',');

      speakersCount[speaker || 'UNKNOWN'] = (speakersCount[speaker || 'UNKNOWN'] || 0) + 1;

      dialogues.push({
        id: dialogues.length,
        fileLine: idx,
        prefix: parts.slice(0, 9).join(','),
        speaker: speaker || '',
        start,
        end,
        style,
        text
      });
    }
  });
} else {
  // Simple SRT parser
  let currentBlock = [];
  lines.forEach((line) => {
    if (line.trim() === '') {
      if (currentBlock.length >= 2) {
        const timeLine = currentBlock[1];
        const textLines = currentBlock.slice(2).join('\n');
        const [start, end] = timeLine.split(' --> ');
        dialogues.push({
          id: dialogues.length,
          start: start.trim(),
          end: end.trim(),
          text: textLines
        });
      }
      currentBlock = [];
    } else {
      currentBlock.push(line);
    }
  });
  if (currentBlock.length >= 2) {
    const timeLine = currentBlock[1];
    const textLines = currentBlock.slice(2).join('\n');
    const [start, end] = timeLine.split(' --> ');
    dialogues.push({
      id: dialogues.length,
      start: start.trim(),
      end: end.trim(),
      text: textLines
    });
  }
}

const summary = {
  totalDialogues: dialogues.length,
  format: isAss ? 'ASS' : 'SRT',
  speakers: speakersCount,
  dialogues
};

fs.writeFileSync(outputFile, JSON.stringify(summary, null, 2), 'utf8');

console.log(`[Thành công] Đã phân tích ${dialogues.length} câu thoại.`);
console.log(`Danh sách nhân vật và tần suất xuất hiện:`);
console.table(speakersCount);
console.log(`File JSON xuất tại: ${outputFile}`);
