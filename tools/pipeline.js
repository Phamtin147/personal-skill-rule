/**
 * pipeline.js
 * Master orchestrator for the Anime Subtitle Translation Framework.
 * Sử dụng: node tools/pipeline.js <action> [options]
 *
 * Các action:
 *   node tools/pipeline.js raw <video.mkv>
 *     -> Tự động bóc tách âm thanh, nhận diện lời thoại sang dialogues.json
 *
 *   node tools/pipeline.js prepare <video.mkv>
 *     -> Tự động trích xuất phụ đề và xuất ra file dialogues.json để AI dịch
 *
 *   node tools/pipeline.js finish <video.mkv> [translations.json] [flags]
 *     -> [MẶC ĐỊNH] Tạo file phụ đề rời .vie.ass và .vie.srt trùng tên video (MPC-HC/VLC tự động nhận, 0MB dung lượng thừa phát sinh)
 *     -> [TÙY CHỌN --remux] Đóng gói vào MKV an toàn (thay thế in-place để không nhân đôi dung lượng)
 *     -> [TÙY CHỌN --copy] Tạo file copy riêng [video]_vi.mkv nếu muốn giữ cả 2 bản
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const action = process.argv[2];
const videoFile = process.argv[3];

if (!action || !videoFile) {
  console.log(`
=== ANIME SUBTITLE PIPELINE TOOLKIT (By Phamtin147) ===
Cách dùng:
  1. Xử lý video thô (Chưa có sub):
     node tools/pipeline.js raw <duong_dan_video.mkv>
     -> Tự động tách âm, loại bỏ nhạc nền và chép lời thoại gốc (tiếng Nhật/Hàn/Anh) sang dialogues.json.

  2. Chuẩn bị dữ liệu từ phim đã có sẵn sub tiếng Anh:
     node tools/pipeline.js prepare <duong_dan_video.mkv>
     -> Tự động trích xuất sub và tạo dialogues.json sẵn sàng đưa vào AI dịch.

  3. Hoàn thiện sau khi AI trả về kết quả dịch:
     node tools/pipeline.js finish <duong_dan_video.mkv> [file_dich.json]
     -> [MẶC ĐỊNH] Tạo file .vie.ass, .ass và .vie.srt (Mở video trên MPC-HC/VLC là tự nạp ngay, 0MB tốn thêm!).
     -> [ĐÓNG GÓI MKV]: node tools/pipeline.js finish <video.mkv> [file_dich.json] --remux
        (In-place replace an toàn, không sinh file _vi.mkv trùng lặp làm đầy ổ cứng).
`);
  process.exit(0);
}

const toolsDir = __dirname;
const dir = path.dirname(videoFile);
const base = path.basename(videoFile, path.extname(videoFile));
const extractedAss = path.join(dir, `${base}_extracted.ass`);
const dialoguesJson = path.join(dir, `${base}_dialogues.json`);

if (action === 'raw') {
  console.log(`\n=== CHẾ ĐỘ XỬ LÝ VIDEO THÔ (SPEECH-TO-TEXT ENGINE) ===`);
  const rootDir = path.join(toolsDir, '..');
  const batScript = path.join(rootDir, 'run_transcribe.bat');
  try {
    execSync(`cmd.exe /c "${batScript}" "${videoFile}"`, { stdio: 'inherit' });
  } finally {
    // Tự động tắt và dọn dẹp Docker container sau khi xử lý xong
    try {
      execSync('docker compose down', { cwd: rootDir, stdio: 'ignore' });
      console.log(`[Docker Lifecycle] Đã tự động tắt Docker để giải phóng 100% tài nguyên RAM/VRAM.`);
    } catch (e) {}
  }
  console.log(`\n[HOÀN TẤT BÓC TÁCH ÂM THANH] File ${dialoguesJson} đã sẵn sàng cho AI dịch!`);
} else if (action === 'prepare') {
  console.log(`\n=== BƯỚC 1: TRÍCH XUẤT SUBTITLE TỪ VIDEO ===`);
  execSync(`node "${path.join(toolsDir, 'extract.js')}" "${videoFile}" "${extractedAss}"`, { stdio: 'inherit' });

  console.log(`\n=== BƯỚC 2: PHÂN TÍCH DIALOGUES CHO AI ===`);
  execSync(`node "${path.join(toolsDir, 'parse_dialogues.js')}" "${extractedAss}" "${dialoguesJson}"`, { stdio: 'inherit' });

  console.log(`\n[SẴN SÀNG CHO AI DỊCH]`);
  console.log(`Hãy mở file: ${dialoguesJson}`);
  console.log(`Áp dụng System Prompt trong thư mục 'prompts/AI_TRANSLATION_PROMPT.md' để AI tiến hành dịch.`);
} else if (action === 'finish') {
  const extraArgs = process.argv.slice(4);
  let transJson = path.join(dir, `${base}_translations.json`);

  // Nếu arg thứ 4 là file json thì dùng file đó
  if (extraArgs[0] && !extraArgs[0].startsWith('-') && extraArgs[0].endsWith('.json')) {
    transJson = extraArgs[0];
  }

  if (!fs.existsSync(transJson)) {
    console.error(`Lỗi: Không tìm thấy file bản dịch: ${transJson}`);
    process.exit(1);
  }

  const shouldRemux = extraArgs.includes('--remux');
  const isCopy = extraArgs.includes('--copy');

  console.log(`\n=== BƯỚC 1: KIỂM THỬ TÍNH TOÀN VẸN (VERIFY) ===`);
  execSync(`node "${path.join(toolsDir, 'verify_sub.js')}" "${dialoguesJson}" "${transJson}"`, { stdio: 'inherit' });

  console.log(`\n=== BƯỚC 2: TÁI TẠO FILE PHỤ ĐỀ VIỆT (.ASS & .SRT) ===`);
  const templateAss = fs.existsSync(extractedAss) ? extractedAss : path.join(dir, `${base}_raw.ass`);
  const subViAss = path.join(dir, `${base}.vie.ass`);
  execSync(`node "${path.join(toolsDir, 'build_sub.js')}" "${templateAss}" "${transJson}" "${path.join(dir, base)}"`, { stdio: 'inherit' });

  if (shouldRemux) {
    console.log(`\n=== BƯỚC 3: ĐÓNG GÓI VIDEO (REMUX) ===`);
    const remuxFlag = isCopy ? '--copy' : '--replace';
    execSync(`node "${path.join(toolsDir, 'remux.js')}" "${videoFile}" "${subViAss}" ${remuxFlag}`, { stdio: 'inherit' });
  } else {
    console.log(`\n======================================================`);
    console.log(`=== BẢO VỆ DUNG LƯỢNG Ổ CỨNG (ZERO DISK BLOAT) ===`);
    console.log(`======================================================`);
    console.log(`[+] Đã tạo file phụ đề rời chuẩn Fansub:`);
    console.log(`    1. ${subViAss}`);
    console.log(`    2. ${path.join(dir, base + '.ass')}`);
    console.log(`    3. ${path.join(dir, base + '.vie.srt')}`);
    console.log(`\n-> Trình phát (MPC-HC, VLC, PotPlayer, MPV) sẽ TỰ ĐỘNG NẠP SUB VIỆT ngay khi mở file video gốc.`);
    console.log(`-> Dung lượng video phát sinh: 0 MB (Không nhân đôi dung lượng ổ đĩa, giữ nguyên hash seed torrent!).`);
    console.log(`-> Nếu muốn tích hợp thẳng vào container MKV, chạy lại với cờ: --remux`);
  }

  console.log(`\n[HOÀN TẤT TOÀN BỘ QUY TRÌNH!]`);
} else {
  console.error(`Action không hợp lệ: ${action}. Hãy dùng 'raw', 'prepare' hoặc 'finish'.`);
}
