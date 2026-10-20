/**
 * build_sub.js
 * Sử dụng: node tools/build_sub.js <original_template.ass> <translated_dialogues.json> [output_base_path] [--font <FontName>]
 *
 * Tính năng chống lỗi font tiếng Việt 100%:
 *   1. Chuẩn hóa font trong [V4+ Styles] sang Font hỗ trợ đầy đủ Unicode tiếng Việt (Mặc định: 'Segoe UI').
 *      -> Ngăn chặn tình trạng ăn phải font 1KB subset bị thiếu ký tự đính kèm trong file MKV tiếng Anh (gây ô vuông tofu □).
 *   2. Ép Encoding = 1 (Unicode) trong toàn bộ Style.
 *   3. Chuẩn hóa chuỗi bằng Unicode NFC (Precomposed Characters) cho tất cả dấu thanh tiếng Việt (ẩ, ẫ, ợ, ứ, ...).
 *   4. Xuất file với UTF-8 BOM (\uFEFF) để mọi renderer (xy-VSFilter, Libass, MPC-HC, VLC) luôn nhận diện đúng mã UTF-8.
 *   5. Tạo cả 2 bản: [video].vie.ass và [video].ass (để MPC-HC auto-load ngay tức thì mà không cần cài đặt).
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { getFfmpegPath } = require('./ffmpeg-helper');

const templateAss = process.argv[2];
const transJson = process.argv[3];
let outputBase = (!process.argv[4] || process.argv[4].startsWith('-')) ? null : process.argv[4];

if (!templateAss || !transJson) {
  console.error('Lỗi: Cần cung cấp file mẫu (.ass) và file bản dịch (.json).');
  console.log('Cách dùng: node tools/build_sub.js <template.ass> <translations.json> [output_prefix] [--font "Segoe UI"]');
  process.exit(1);
}

// Xử lý tùy chọn Font tiếng Việt
let targetFont = 'Segoe UI';
const fIdx = process.argv.findIndex(a => a === '--font' || a === '-f');
if (fIdx !== -1 && process.argv[fIdx + 1] && !process.argv[fIdx + 1].startsWith('-')) {
  targetFont = process.argv[fIdx + 1];
}

console.log(`[Cấu hình Typography] Áp dụng Font tiếng Việt: "${targetFont}" (Bảo đảm không bị lỗi ô vuông tofu □)`);

if (!outputBase) {
  const dir = path.dirname(templateAss);
  const base = path.basename(templateAss, path.extname(templateAss)).replace('_extracted', '');
  outputBase = path.join(dir, base);
}

const outAss = outputBase.endsWith('.ass') ? outputBase : `${outputBase}.vie.ass`;
const outSrt = outputBase.endsWith('.srt') ? outputBase : `${outputBase}.vie.srt`;

const transData = JSON.parse(fs.readFileSync(transJson, 'utf8'));
const list = transData.dialogues || transData.translations || transData;
const translations = list.map(item => (typeof item === 'string' ? item : (item.translatedText !== undefined ? item.translatedText : item.text)));

const rawAss = fs.readFileSync(templateAss, 'utf8');
const lines = rawAss.split(/\r?\n/);

let dIdx = 0;
const newLines = lines.map(line => {
  // 1. Chuẩn hóa [V4+ Styles]: Ép font tiếng Việt và Encoding Unicode (1)
  if (line.startsWith('Style: ')) {
    const parts = line.substring(7).split(',');
    if (parts.length >= 2) {
      parts[1] = targetFont;          // Thay Fontname bằng font tiếng Việt an toàn
      parts[parts.length - 1] = '1';   // Encoding = 1 (Unicode Default)
      return 'Style: ' + parts.join(',');
    }
  }

  // 2. Chuẩn hóa Title
  if (line.startsWith('Title: ')) {
    return 'Title: Vietnamese Fansub (VietSub by Amtia(NOFACE))';
  }

  // 3. Chuẩn hóa câu thoại Dialogue
  if (line.startsWith('Dialogue: ')) {
    const parts = line.substring(10).split(',');
    const prefix = parts.slice(0, 9).join(',');
    const trans = translations[dIdx];
    dIdx++;

    let normalized = (trans !== undefined ? trans : parts.slice(9).join(','));

    // Chuyển \n viết thường thành \N chuẩn ASS
    normalized = normalized.replace(/\\n/g, '\\N');

    // Chuẩn hóa Unicode NFC (Precomposed) - quy tụ các dấu thanh tiếng Việt về mã dựng sẵn
    normalized = normalized.normalize('NFC');

    // Khử/thay thế các thẻ override font inline bị dính font subset tiếng Anh
    normalized = normalized.replace(/\\fn([A-Za-z0-9 _\-]+)/gi, (match, font) => {
      const lower = font.toLowerCase().trim();
      if (lower.includes('trebuchet') || lower.includes('times') || lower.includes('georgia') || lower.includes('arabic') || lower.includes('roboto') || lower.includes('aparajita')) {
        return `\\fn${targetFont}`;
      }
      return match;
    });

    return 'Dialogue: ' + prefix + ',' + normalized;
  }

  return line;
});

// Lưu file ASS với UTF-8 with BOM (\uFEFF) để bảo đảm 100% renderer DirectShow/VSFilter nhận diện đúng
const assContentWithBom = '\uFEFF' + newLines.join('\r\n');
fs.writeFileSync(outAss, assContentWithBom, 'utf8');
console.log(`[1/2] Đã xuất file ASS tiếng Việt: ${outAss} (${dIdx} câu thoại, Font: ${targetFont})`);

// Tự động tạo bản trùng tên [video].ass để mọi trình phát (MPC-HC, VLC) tự động nạp ngay
const directAss = outputBase.endsWith('.ass') ? outputBase : `${outputBase}.ass`;
if (outAss !== directAss) {
  try {
    fs.writeFileSync(directAss, assContentWithBom, 'utf8');
    console.log(`[+] Đã tạo file auto-load cho MPC-HC/VLC: ${directAss}`);
  } catch (e) {}
}

// Chuyển đổi sang file SRT bằng ffmpeg
try {
  const ffmpeg = getFfmpegPath();
  const cmd = `"${ffmpeg}" -i "${outAss}" "${outSrt}" -y`;
  execSync(cmd, { stdio: 'ignore' });

  // Đọc lại SRT và ghi thêm UTF-8 BOM nếu cần
  if (fs.existsSync(outSrt)) {
    const srtData = fs.readFileSync(outSrt, 'utf8');
    const srtBom = srtData.startsWith('\uFEFF') ? srtData : ('\uFEFF' + srtData);
    fs.writeFileSync(outSrt, srtBom, 'utf8');
    console.log(`[2/2] Đã tạo file SRT tương thích (UTF-8 BOM): ${outSrt}`);

    const directSrt = outputBase.endsWith('.srt') ? outputBase : `${outputBase}.srt`;
    if (outSrt !== directSrt) {
      try {
        fs.writeFileSync(directSrt, srtBom, 'utf8');
      } catch (e) {}
    }
  }
} catch (e) {
  console.warn(`[Chú ý] Không thể chuyển đổi SRT tự động (${e.message}). Vẫn giữ file ASS chuẩn.`);
}

console.log('[Hoàn thành] Đã tạo phụ đề Fansub thành công (Font chuẩn tiếng Việt & 0MB video thừa)!');
