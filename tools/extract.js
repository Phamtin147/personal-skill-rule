/**
 * extract.js
 * Sử dụng: node tools/extract.js <đường_dẫn_file_video> [đường_dẫn_file_sub_xuat] [track_index]
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { getFfmpegPath } = require('./ffmpeg-helper');

const videoFile = process.argv[2];
if (!videoFile) {
  console.error('Lỗi: Cần cung cấp đường dẫn video file.');
  console.log('Cách dùng: node tools/extract.js <duong_dan_video.mkv> [output_sub.ass] [track_sub_index=0]');
  process.exit(1);
}

const ffmpeg = getFfmpegPath();
const trackIndex = process.argv[4] || '0';
let outputFile = process.argv[3];

if (!outputFile) {
  const dir = path.dirname(videoFile);
  const base = path.basename(videoFile, path.extname(videoFile));
  outputFile = path.join(dir, `${base}_extracted.ass`);
}

console.log(`[1/2] Đang trích xuất subtitle track s:${trackIndex} từ: ${videoFile}`);

try {
  let cmd = `"${ffmpeg}" -i "${videoFile}" -map 0:s:${trackIndex} -c:s copy "${outputFile}" -y`;
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (copyErr) {
    // Nếu source là subrip (srt) hoặc format khác, tự động convert sang .ass
    cmd = `"${ffmpeg}" -i "${videoFile}" -map 0:s:${trackIndex} -c:s ass "${outputFile}" -y`;
    execSync(cmd, { stdio: 'inherit' });
  }
  console.log(`[2/2] Trích xuất thành công: ${outputFile}`);
} catch (err) {
  console.error('Lỗi khi trích xuất subtitle:', err.message);
  process.exit(1);
}
