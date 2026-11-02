/**
 * remux.js
 * Sử dụng: node tools/remux.js <file_video_goc.mkv> <file_sub_tieng_viet.ass> [options]
 *
 * Chế độ hoạt động (Chống nhân đôi dung lượng ổ đĩa):
 *   1. Mặc định / --replace: Remux an toàn và thay thế file gốc trực tiếp (In-place Replace).
 *      -> Đảm bảo trong thư mục LUÔN CHỈ CÓ 1 FILE VIDEO, KHÔNG TỐN GẤP ĐÔI Ổ CỨNG!
 *   2. --copy: Xuất ra file riêng biệt ([Tên_phim]_vi.mkv) nếu muốn giữ lại cả 2 bản.
 *   3. -o <output_path>: Chỉ định đường dẫn file xuất tùy biến.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { getFfmpegPath } = require('./ffmpeg-helper');

const videoFile = process.argv[2];
const subViFile = process.argv[3];
const args = process.argv.slice(4);

if (!videoFile || !subViFile) {
  console.error('Lỗi: Cần cung cấp đường dẫn video gốc và file phụ đề tiếng Việt (.ass).');
  console.log('\nCách dùng:');
  console.log('  Thay thế an toàn file gốc (không tốn dung lượng): node tools/remux.js <video.mkv> <sub.ass> [--replace]');
  console.log('  Xuất bản sao video riêng:                         node tools/remux.js <video.mkv> <sub.ass> --copy');
  console.log('  Chỉ định file xuất tùy chọn:                     node tools/remux.js <video.mkv> <sub.ass> -o <duong_dan_moi.mkv>');
  process.exit(1);
}

const dir = path.dirname(videoFile);
const ext = path.extname(videoFile);
const base = path.basename(videoFile, ext);

let isCopy = args.includes('--copy');
let isReplace = args.includes('--replace') || args.includes('-r');
let customOutput = null;

const oIdx = args.findIndex(a => a === '-o' || a === '--output');
if (oIdx !== -1 && args[oIdx + 1]) {
  customOutput = args[oIdx + 1];
}

// Nếu người dùng truyền đường dẫn file kết thúc bằng đuôi mở rộng ở arg thứ 4 (tương thích ngược)
if (!customOutput && args[0] && !args[0].startsWith('-')) {
  customOutput = args[0];
}

// Nếu không chỉ định rõ ràng: Mặc định là --replace để bảo vệ dung lượng ổ đĩa người dùng
if (!isCopy && !customOutput) {
  isReplace = true;
}

const ffmpeg = getFfmpegPath();
console.log(`[Bắt đầu remux] Đang ghép phụ đề Việt vào phim: ${path.basename(videoFile)}...`);

const tempOutputFile = path.join(dir, `.${base}.tmp_remux_${Date.now()}${ext}`);
const workOutputFile = isReplace ? tempOutputFile : (customOutput || path.join(dir, `${base}_vi${ext}`));

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
    `"${workOutputFile}" -y`;

  execSync(cmd, { stdio: 'inherit' });

  // Kiểm tra file remux mới tạo thành công
  if (!fs.existsSync(workOutputFile) || fs.statSync(workOutputFile).size < 1024 * 100) {
    throw new Error('File remux tạo ra không hợp lệ hoặc kích thước quá nhỏ.');
  }

  if (isReplace) {
    const backupFile = path.join(dir, `.${base}.orig_backup_${Date.now()}${ext}`);
    try {
      // Đổi tên file cũ sang backup tạm
      fs.renameSync(videoFile, backupFile);
      // Đổi tên file remux tạm vào vị trí file chính
      fs.renameSync(tempOutputFile, videoFile);
      // Xóa file backup tạm
      fs.unlinkSync(backupFile);
      console.log(`\n[THÀNH CÔNG - TIẾT KIỆM Ổ CỨNG] Đã tích hợp Sub Việt trực tiếp vào: ${videoFile}`);
      console.log(`(Không tạo thêm video copy thừa, dung lượng ổ đĩa giữ nguyên 100%!)`);
    } catch (lockErr) {
      console.warn(`\n[LƯU Ý] File gốc đang bị khóa (bởi trình phát hoặc phần mềm torrent như qBittorrent): ${lockErr.message}`);
      const fallbackOutput = path.join(dir, `${base}_vi${ext}`);
      if (fs.existsSync(tempOutputFile)) {
        if (fs.existsSync(fallbackOutput)) fs.unlinkSync(fallbackOutput);
        fs.renameSync(tempOutputFile, fallbackOutput);
        console.log(`[Đã chuyển hướng lưu an toàn sang file riêng]: ${fallbackOutput}`);
      }
    }
  } else {
    console.log(`\n[THÀNH CÔNG] File phim mới đã tích hợp sẵn phụ đề Việt: ${workOutputFile}`);
  }
} catch (err) {
  if (fs.existsSync(tempOutputFile)) {
    try { fs.unlinkSync(tempOutputFile); } catch (e) {}
  }
  console.error('Lỗi trong quá trình remux:', err.message);
  process.exit(1);
}
