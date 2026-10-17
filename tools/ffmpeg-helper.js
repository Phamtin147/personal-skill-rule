const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getFfmpegPath() {
  // 1. Check local node_modules
  const localFfmpeg = path.join(__dirname, '..', 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
  if (fs.existsSync(localFfmpeg)) return localFfmpeg;

  // 2. Check brain/scratch cache
  const scratchFfmpeg = 'C:\\Users\\NOFACE\\.gemini\\antigravity\\brain\\14f59f2b-50a9-4d10-a527-2add25c86bac\\scratch\\node_modules\\ffmpeg-static\\ffmpeg.exe';
  if (fs.existsSync(scratchFfmpeg)) return scratchFfmpeg;

  // 3. Try requiring ffmpeg-static directly
  try {
    const staticPath = require('ffmpeg-static');
    if (staticPath && fs.existsSync(staticPath)) return staticPath;
  } catch (e) {}

  // 4. Check system PATH
  try {
    const which = process.platform === 'win32' ? 'where ffmpeg' : 'which ffmpeg';
    const sysPath = execSync(which, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim().split('\r\n')[0];
    if (sysPath && fs.existsSync(sysPath)) return sysPath;
  } catch (e) {}

  throw new Error('Không tìm thấy ffmpeg. Hãy chạy `npm install` trong thư mục này để tải ffmpeg-static tự động.');
}

module.exports = { getFfmpegPath };
