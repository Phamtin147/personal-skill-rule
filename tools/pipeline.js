/**
 * pipeline.js
 * Master orchestrator for the Anime Subtitle Translation Framework.
 * Sử dụng: node tools/pipeline.js <action> [options]
 *
 * Các action:
 *   node tools/pipeline.js prepare <video.mkv>
 *     -> Tự động trích xuất phụ đề và xuất ra file dialogues.json để AI dịch
 *
 *   node tools/pipeline.js finish <video.mkv> <translations.json>
 *     -> Tự động verify, build .vie.ass, .vie.srt và remux ra video_vi.mkv
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const action = process.argv[2];
const videoFile = process.argv[3];

if (!action || !videoFile) {
  console.log(`
=== ANIME SUBTITLE PIPELINE TOOLKIT ===
Cách dùng:
  1. Chuẩn bị dữ liệu cho AI dịch:
     node tools/pipeline.js prepare <duong_dan_video.mkv>
     -> Tạo file extracted.ass và dialogues.json sẵn sàng đưa vào prompt AI.

  2. Hoàn thiện sau khi AI trả về kết quả:
     node tools/pipeline.js finish <duong_dan_video.mkv> <file_dich.json>
     -> Kiểm tra lỗi, tạo file .vie.ass, .vie.srt và đóng gói file phim mới.
`);
  process.exit(0);
}

const toolsDir = __dirname;
const dir = path.dirname(videoFile);
const base = path.basename(videoFile, path.extname(videoFile));
const extractedAss = path.join(dir, `${base}_extracted.ass`);
const dialoguesJson = path.join(dir, `${base}_dialogues.json`);

if (action === 'prepare') {
  console.log(`\n=== BƯỚC 1: TRÍCH XUẤT SUBTITLE TỪ VIDEO ===`);
  execSync(`node "${path.join(toolsDir, 'extract.js')}" "${videoFile}" "${extractedAss}"`, { stdio: 'inherit' });

  console.log(`\n=== BƯỚC 2: PHÂN TÍCH DIALOGUES CHO AI ===`);
  execSync(`node "${path.join(toolsDir, 'parse_dialogues.js')}" "${extractedAss}" "${dialoguesJson}"`, { stdio: 'inherit' });

  console.log(`\n[SẴN SÀNG CHO AI DỊCH]`);
  console.log(`Hãy mở file: ${dialoguesJson}`);
  console.log(`Áp dụng System Prompt trong thư mục 'prompts/AI_TRANSLATION_PROMPT.md' để AI tiến hành dịch.`);
} else if (action === 'finish') {
  const transJson = process.argv[4] || path.join(dir, `${base}_translations.json`);
  if (!fs.existsSync(transJson)) {
    console.error(`Lỗi: Không tìm thấy file bản dịch: ${transJson}`);
    process.exit(1);
  }

  console.log(`\n=== BƯỚC 1: KIỂM THỬ TÍNH TOÀN VẸN (VERIFY) ===`);
  execSync(`node "${path.join(toolsDir, 'verify_sub.js')}" "${dialoguesJson}" "${transJson}"`, { stdio: 'inherit' });

  console.log(`\n=== BƯỚC 2: TÁI TẠO FILE PHỤ ĐỀ VIỆT (.ASS & .SRT) ===`);
  const subViAss = path.join(dir, `${base}.vie.ass`);
  execSync(`node "${path.join(toolsDir, 'build_sub.js')}" "${extractedAss}" "${transJson}" "${path.join(dir, base)}"`, { stdio: 'inherit' });

  console.log(`\n=== BƯỚC 3: ĐÓNG GÓI VIDEO (REMUX) ===`);
  execSync(`node "${path.join(toolsDir, 'remux.js')}" "${videoFile}" "${subViAss}"`, { stdio: 'inherit' });

  console.log(`\n[HOÀN TẤT TOÀN BỘ QUY TRÌNH!]`);
} else {
  console.error(`Action không hợp lệ: ${action}. Hãy dùng 'prepare' hoặc 'finish'.`);
}
