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
let trackIndex = process.argv[4];

// Tự động phân tích stream phụ đề nếu chưa chỉ định track
// Thứ tự ưu tiên: 1) Arabic ASS/SSA (FX) -> 2) Arabic bất kỳ -> 3) English ASS full/dialogue -> 4) Track không phải signs/songs -> 5) Track 0
if (trackIndex === undefined) {
  try {
    const probeCmd = `ffprobe -v error -select_streams s -show_entries stream=index,codec_name:stream_tags=title,language -of json "${videoFile}"`;
    const probeData = JSON.parse(execSync(probeCmd, { encoding: 'utf8' }));
    if (probeData.streams && probeData.streams.length > 0) {
      const getLang = s => (s.tags && s.tags.language ? s.tags.language.toLowerCase() : '');
      const getTitle = s => (s.tags && s.tags.title ? s.tags.title.toLowerCase() : '');
      const isAss = s => ['ass', 'ssa'].includes((s.codec_name || '').toLowerCase());
      const isArabic = s => {
        const lang = getLang(s);
        const title = getTitle(s);
        return lang === 'ara' || lang === 'ar' || title.includes('arabic') || title.includes('العربية');
      };
      const isEnglish = s => {
        const lang = getLang(s);
        const title = getTitle(s);
        return lang === 'eng' || lang === 'en' || title.includes('english');
      };

      // 1. Ưu tiên cao nhất: Phụ đề tiếng Ả Rập định dạng ASS/SSA (giàu hiệu ứng Typesetting/FX)
      let bestSubIdx = probeData.streams.findIndex(s => isArabic(s) && isAss(s) && !getTitle(s).includes('sign') && !getTitle(s).includes('song'));
      if (bestSubIdx === -1) {
        bestSubIdx = probeData.streams.findIndex(s => isArabic(s) && isAss(s));
      }
      // 2. Phụ đề tiếng Ả Rập bất kỳ (SRT/khác)
      if (bestSubIdx === -1) {
        bestSubIdx = probeData.streams.findIndex(s => isArabic(s));
      }
      // 3. Phụ đề tiếng Anh ASS full/dialogue
      if (bestSubIdx === -1) {
        bestSubIdx = probeData.streams.findIndex(s => isEnglish(s) && isAss(s) && !getTitle(s).includes('sign') && !getTitle(s).includes('song'));
      }
      // 4. Track có title chứa 'dialogue' hoặc 'full'
      if (bestSubIdx === -1) {
        bestSubIdx = probeData.streams.findIndex(s => {
          const title = getTitle(s);
          return title.includes('dialogue') || title.includes('full');
        });
      }
      // 5. Track tiếng Anh bất kỳ không phải signs / songs
      if (bestSubIdx === -1) {
        bestSubIdx = probeData.streams.findIndex(s => isEnglish(s) && !getTitle(s).includes('sign') && !getTitle(s).includes('song'));
      }
      // 6. Track đầu tiên không phải signs / songs
      if (bestSubIdx === -1) {
        bestSubIdx = probeData.streams.findIndex(s => {
          const title = getTitle(s);
          return !title.includes('sign') && !title.includes('song');
        });
      }
      trackIndex = (bestSubIdx !== -1 ? bestSubIdx : 0).toString();
      const chosen = probeData.streams[parseInt(trackIndex)];
      const chosenLang = chosen ? getLang(chosen) : '';
      const chosenCodec = chosen ? (chosen.codec_name || '') : '';
      const chosenTitle = (chosen && chosen.tags && chosen.tags.title) ? ` - ${chosen.tags.title}` : '';
      console.log(`[Tự động chọn] Track s:${trackIndex} [${chosenLang || 'und'}/${chosenCodec}${chosenTitle}]`);
    } else {
      trackIndex = '0';
    }
  } catch (probeErr) {
    trackIndex = '0';
  }
}
let outputFile = process.argv[3];

if (!outputFile) {
  const dir = path.dirname(videoFile);
  const base = path.basename(videoFile, path.extname(videoFile));
  outputFile = path.join(dir, `${base}_extracted.ass`);
}

console.log(`[1/2] Đang trích xuất subtitle track s:${trackIndex} từ: ${videoFile}`);

try {
  let cmd = `"${ffmpeg}" -nostdin -i "${videoFile}" -map 0:s:${trackIndex} -c:s copy "${outputFile}" -y`;
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (copyErr) {
    // Nếu source là subrip (srt) hoặc format khác, tự động convert sang .ass
    cmd = `"${ffmpeg}" -nostdin -i "${videoFile}" -map 0:s:${trackIndex} -c:s ass "${outputFile}" -y`;
    execSync(cmd, { stdio: 'inherit' });
  }
  console.log(`[2/2] Trích xuất thành công: ${outputFile}`);
} catch (err) {
  console.error('Lỗi khi trích xuất subtitle:', err.message);
  process.exit(1);
}
