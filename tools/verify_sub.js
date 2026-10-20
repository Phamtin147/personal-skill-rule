/**
 * verify_sub.js
 * Sử dụng: node tools/verify_sub.js <original_dialogues.json> <translated_dialogues.json hoặc file_ass_dich.ass>
 * Kiểm tra tính toàn vẹn 100% của phụ đề sau khi AI dịch thuật và kiểm tra chuẩn hóa Font tiếng Việt.
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
let assStyles = [];

if (transPath.endsWith('.json')) {
  const transData = JSON.parse(fs.readFileSync(transPath, 'utf8'));
  const transList = transData.dialogues || transData.translations || transData;
  transTexts = transList.map(item => (typeof item === 'string' ? item : item.translatedText || item.text));
} else {
  // Đọc file ASS trực tiếp
  const content = fs.readFileSync(transPath, 'utf8');
  content.split(/\r?\n/).forEach(line => {
    if (line.startsWith('Style: ')) {
      assStyles.push(line);
    }
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

// 2. Kiểm tra Font chữ tiếng Việt nếu là file ASS
if (assStyles.length > 0) {
  console.log(`\n[KIỂM TRA TYPOGRAPHY & FONT TIẾNG VIỆT]`);
  const safeFonts = ['segoe ui', 'arial', 'tahoma', 'verdana', 'calibri', 'noto sans', 'svn-'];
  const dangerousFonts = ['trebuchet', 'aparajita', 'adobe arabic', 'times new roman', 'georgia', 'roboto medium'];

  assStyles.forEach(styleLine => {
    const parts = styleLine.substring(7).split(',');
    const styleName = parts[0];
    const fontName = parts[1] || '';
    const encoding = parts[parts.length - 1];

    const lowerFont = fontName.toLowerCase();
    const isDangerous = dangerousFonts.some(f => lowerFont.includes(f));
    const isSafe = safeFonts.some(f => lowerFont.includes(f));

    if (isDangerous) {
      console.error(`[ERROR FONT LỖI TIẾNG VIỆT] Style "${styleName}" dùng font "${fontName}" - nguy cơ cao bị biến dấu tiếng Việt thành ô vuông tofu □! Hãy đổi sang Segoe UI.`);
      errors++;
    } else if (!isSafe) {
      console.warn(`[WARNING FONT] Style "${styleName}" dùng font lạ: "${fontName}". Khuyên dùng Segoe UI hoặc Arial.`);
      warnings++;
    }

    if (encoding === '0') {
      console.warn(`[WARNING ENCODING] Style "${styleName}" đang dùng Encoding ANSI (0) thay vì Unicode (1).`);
      warnings++;
    }
  });
}

// 3. Kiểm tra chi tiết từng câu thoại
transTexts.forEach((text, idx) => {
  if (/\\[nN]/.test(text)) {
    if (/\\n/.test(text)) {
      console.warn(`[WARNING Dòng #${idx}] Phát hiện ký tự xuống dòng '\\n' viết thường thay vì '\\N': "${text}"`);
      warnings++;
    }
  }

  // Kiểm tra thẻ unclosed ASS
  const openCount = (text.match(/\{/g) || []).length;
  const closeCount = (text.match(/\}/g) || []).length;
  if (openCount !== closeCount) {
    console.error(`[ERROR Dòng #${idx}] Thẻ hiệu ứng ASS không đóng/mở đúng cặp: "${text}"`);
    errors++;
  }

  // Kiểm tra dòng trống
  if (!text || text.trim() === '') {
    console.warn(`[WARNING Dòng #${idx}] Dòng dịch rỗng.`);
    warnings++;
  }
});

console.log(`-----------------------------------------------------------`);
if (errors === 0 && warnings === 0) {
  console.log(`[HOÀN HẢO] Phụ đề đạt chuẩn chất lượng 10/10. Sẵn sàng xem trên mọi thiết bị!`);
} else if (errors === 0) {
  console.log(`[ĐẠT] Không có lỗi nghiêm trọng (${warnings} cảnh báo nhỏ).`);
} else {
  console.error(`[THẤT BÀI] Phát hiện ${errors} lỗi nghiêm trọng cần khắc phục.`);
  process.exit(1);
}
