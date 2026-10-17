/**
 * remux.js
 * Sử dụng: node tools/remux.js <file_video_goc.mkv> <file_sub_tieng_viet.ass> [output_movie_vi.mkv]
 * Đóng gói phim với sub Việt mặc định, giữ nguyên toàn bộ âm thanh, hình ảnh và font chữ gốc (stream copy).
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { getFfmpegPath } = require('./ffmpeg-helper');

const videoFile = process.argv[2];
const subViFile = process.argv[3];
let outputFile = process.argv[4];

if (!videoFile || !subViFile) {
  console.error('Lỗi: Cần cung cấp đường dẫn video gốc và file phụ đề tiếng Việt (.ass).');
  console.log('Cách dùng: node tools/remux.js <video_goc.mkv> <sub_vi.ass> [output_vi.mkv]');
  process.exit(1);
}

if (!outputFile) {
  const dir = path.dirname(videoFile);
  const ext = path.extname(videoFile);
  const base = path.basename(videoFile, ext);
  outputFile = path.join(dir, `${base}_vi${ext}`);
}

const ffmpeg = getFfmpegPath();
console.log(`[Bắt đầu remux] Đang ghép phụ đề Việt vào phim: ${path.basename(videoFile)}...`);

try {
  // Lệnh ffmpeg stream copy:
  // -map 0:v (video)
  // -map 0:a (audio)
  // -map 1:0 (sub Việt mới tạo)
  // -map 0:s:0? (sub Anh gốc để làm sub phụ)
  // -map 0:t? (tất cả font chữ đính kèm)
  // -disposition:s:0 default (bật sub Việt làm mặc định)
  const cmd = `"${ffmpeg}" -i "${videoFile}" -i "${subViFile}" ` +
    `-map 0:v -map 0:a -map 1:0 -map 0:s:0? -map 0:t? ` +
    `-c copy ` +
    `-metadata:s:s:0 language=vie -metadata:s:s:0 title="Tiếng Việt" -disposition:s:0 default ` +
    `-metadata:s:s:1 language=eng -metadata:s:s:1 title="English" -disposition:s:1 0 ` +
    `"${outputFile}" -y`;

  execSync(cmd, { stdio: 'inherit' });
  console.log(`\n[THÀNH CÔNG] File phim mới đã tích hợp sẵn phụ đề Việt: ${outputFile}`);
} catch (err) {
  console.error('Lỗi trong quá trình remux:', err.message);
  process.exit(1);
}
