/**
 * verify_sub.js
 * Sử dụng: node tools/verify_sub.js <original_dialogues.json> <translated_dialogues.json hoặc file_ass_dich.ass>
 * Kiểm tra tính toàn vẹn 100% của phụ đề sau khi AI dịch thuật.
 */

const fs = require('fs');

const origPath = process.argv[2];
const transPath = process.argv[3];

if (!origPath || !transPath) {
  console.error('Lỗi: Cần cung cấp file gốc (.json) và file dịch (.json hoặc .ass).');
  console.log('Cách dùng: node tools/verify_sub.js <original_dialogues.json> <translated.json|translated.ass>');
  process.exit(1);
}

const origData = JSON.parse(fs.readFileSync(origPath, 'utf8'));
const origList = origData.dialogues || origData;
const origCount = origList.length;

let transTexts = [];

if (transPath.endsWith('.json')) {
  const transData = JSON.parse(fs.readFileSync(transPath, 'utf8'));
  const transList = transData.dialogues || transData;
  transTexts = transList.map(item => (typeof item === 'string' ? item : item.translatedText || item.text));
} else {
  // Read ASS file directly
  const content = fs.readFileSync(transPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    if (line.startsWith('Dialogue: ')) {
      const parts = line.substring(10).split(',');
      transTexts.push(parts.slice(9).join(','));
    }
  });
}

console.log(`--- BÁO CÁO KIỂM THỬ PHỤ ĐỀ (SUBTITLE QUALITY ASSURANCE) ---`);
console.log(`Số dòng gốc : ${origCount}`);
console.log(`Số dòng dịch: ${transTexts.length}`);

let errors = 0;
let warnings = 0;

// 1. Kiểm tra lệch dòng
if (origCount !== transTexts.length) {
  console.error(`[ERROR LỆCH DÒNG] Số lượng câu thoại không khớp! Thiếu hoặc thừa ${Math.abs(origCount - transTexts.length)} dòng.`);
  errors++;
} else {
  console.log(`[PASS] Số lượng câu thoại khớp 100% (1:1).`);
}

// 2. Kiểm tra lỗi escape ASS (\n thay vì \N)
transTexts.forEach((text, idx) => {
  if (/\\[nN]/.test(text)) {
    if (/\\n/.test(text)) {
      console.warn(`[WARNING Dòng #${idx}] Phát hiện ký tự xuống dòng '\\n' viết thường thay vì '\\N': "${text}"`);
      warnings++;
    }
  }

  // 3. Kiểm tra thẻ unclosed ASS
  const openCount = (text.match(/\{/g) || []).length;
  const closeCount = (text.match(/\}/g) || []).length;
  if (openCount !== closeCount) {
    console.error(`[ERROR Dòng #${idx}] Thẻ hiệu ứng ASS không đóng/mở đúng cặp: "${text}"`);
    errors++;
  }

  // 4. Kiểm tra dòng trống
  if (!text || text.trim() === '') {
    console.warn(`[WARNING Dòng #${idx}] Dòng dịch rỗng.`);
    warnings++;
  }
});

console.log(`-----------------------------------------------------------`);
if (errors === 0 && warnings === 0) {
  console.log(`[HOÀN HẢO] Phụ đề đạt chuẩn chất lượng 10/10. Sẵn sàng đóng gói!`);
} else if (errors === 0) {
  console.log(`[ĐẠT] Không có lỗi nghiêm trọng (${warnings} cảnh báo nhỏ).`);
} else {
  console.error(`[THẤT BÀI] Phát hiện ${errors} lỗi nghiêm trọng cần khắc phục trước khi remux.`);
  process.exit(1);
}
