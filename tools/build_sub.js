/**
 * build_sub.js
 * Sử dụng: node tools/build_sub.js <original_template.ass> <translated_dialogues.json> [output_base_path]
 * Tạo ra cả 2 file: .vie.ass (giữ nguyên hiệu ứng & font) và .vie.srt (cho TV/thiết bị khác).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getFfmpegPath } = require('./ffmpeg-helper');

const templateAss = process.argv[2];
const transJson = process.argv[3];
let outputBase = process.argv[4];

if (!templateAss || !transJson) {
  console.error('Lỗi: Cần cung cấp file mẫu (.ass) và file bản dịch (.json).');
  console.log('Cách dùng: node tools/build_sub.js <template.ass> <translations.json> [output_prefix]');
  process.exit(1);
}

if (!outputBase) {
  const dir = path.dirname(templateAss);
  const base = path.basename(templateAss, path.extname(templateAss)).replace('_extracted', '');
  outputBase = path.join(dir, base);
}

const outAss = outputBase.endsWith('.ass') ? outputBase : `${outputBase}.vie.ass`;
const outSrt = outputBase.endsWith('.srt') ? outputBase : `${outputBase}.vie.srt`;

const transData = JSON.parse(fs.readFileSync(transJson, 'utf8'));
const list = transData.dialogues || transData;
const translations = list.map(item => (typeof item === 'string' ? item : (item.translatedText !== undefined ? item.translatedText : item.text)));

const rawAss = fs.readFileSync(templateAss, 'utf8');
const lines = rawAss.split(/\r?\n/);

let dIdx = 0;
const newLines = lines.map(line => {
  if (line.startsWith('Dialogue: ')) {
    const parts = line.substring(10).split(',');
    const prefix = parts.slice(0, 9).join(',');
    const trans = translations[dIdx];
    dIdx++;
    // Tự động chuẩn hóa \n thành \N trong ASS
    const normalized = (trans !== undefined ? trans : parts.slice(9).join(',')).replace(/\\n/g, '\\N');
    return 'Dialogue: ' + prefix + ',' + normalized;
  }
  if (line.startsWith('Title: ')) {
    return 'Title: Vietnamese (VietSub)';
  }
  return line;
});

fs.writeFileSync(outAss, newLines.join('\r\n'), 'utf8');
console.log(`[1/2] Đã xuất file ASS tiếng Việt: ${outAss} (${dIdx} câu thoại)`);

// Chuyển đổi sang file SRT bằng ffmpeg
try {
  const ffmpeg = getFfmpegPath();
  const cmd = `"${ffmpeg}" -i "${outAss}" "${outSrt}" -y`;
  execSync(cmd, { stdio: 'ignore' });
  console.log(`[2/2] Đã tạo file SRT tương thích: ${outSrt}`);
} catch (e) {
  console.warn(`[Chú ý] Không thể chuyển đổi SRT tự động (${e.message}). Vẫn giữ file ASS chuẩn.`);
}

console.log('[Hoàn thành] Đã tạo phụ đề thành công!');
