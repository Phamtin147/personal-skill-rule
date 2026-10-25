/**
 * organize.js
 * Quản lý và phân loại cấu trúc thư mục Anime Fansub chuẩn mực:
 *   <Root>/<Tên Anime>/<Tập XX>/
 *     ├── [Video].mkv
 *     ├── [Video].ass
 *     ├── [Video].vie.ass
 *     ├── [Video].vie.srt
 *     └── .cache/ (chứa _dialogues.json, _extracted.ass, _translations.json)
 *
 * Cách dùng: node tools/organize.js [targetDir]
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : path.resolve(__dirname, '..', '..');

console.log(`\n======================================================`);
console.log(`  HỆ THỐNG PHÂN LOẠI & TỔ CHỨC THƯ MỤC ANIME FANSUB   `);
console.log(`======================================================`);
console.log(`Thư mục mục tiêu: ${targetDir}\n`);

if (/Tập\s*\d+/i.test(path.basename(targetDir))) {
  console.log(`[Bỏ qua] Thư mục đã ở cấp độ Tập: ${targetDir}`);
  process.exit(0);
}

if (!fs.existsSync(targetDir)) {
  console.error(`Lỗi: Thư mục không tồn tại: ${targetDir}`);
  process.exit(1);
}

function parseAnimeInfo(filename) {
  const base = path.basename(filename, path.extname(filename));

  // 1. Dark Summoner to Dekiteiru
  let m = base.match(/Dark\s*Summoner\s*to\s*Dekiteiru\s*-\s*(\d+)/i);
  if (m) {
    return {
      series: 'Dark Summoner to Dekiteiru',
      episode: `Tập ${m[1].padStart(2, '0')}`,
      epNum: parseInt(m[1], 10)
    };
  }

  // 2. Shinja Zero no Megami-sama
  m = base.match(/Shinja\s*Zero\s*no\s*Megami-sama\s*to\s*Hajimeru\s*Isekai\s*Kouryaku\s*-\s*(\d+)/i);
  if (m) {
    return {
      series: 'Shinja Zero no Megami-sama to Hajimeru Isekai Kouryaku',
      episode: `Tập ${m[1].padStart(2, '0')}`,
      epNum: parseInt(m[1], 10)
    };
  }

  // 2b. Kashita Maryoku
  m = base.match(/Kashita\s*Maryoku.*?\s*-\s*(\d+)/i);
  if (m) {
    return {
      series: 'Kashita Maryoku',
      episode: `Tập ${m[1].padStart(2, '0')}`,
      epNum: parseInt(m[1], 10)
    };
  }

  // 3. Even the Student Council Has Its Holes / Seitokai ni mo Ana wa Aru
  m = base.match(/Even\.the\.Student\.Council\.Has\.Its\.Holes.*?[sS](\d+)[eE](\d+)/i);
  if (m) {
    return {
      series: 'Even the Student Council Has Its Holes',
      episode: `Tập ${m[2].padStart(2, '0')}`,
      epNum: parseInt(m[2], 10)
    };
  }

  // 4. Magical Explorer
  m = base.match(/Magical\.Explorer.*?[sS](\d+)[eE](\d+)/i);
  if (m) {
    return {
      series: 'Magical Explorer',
      episode: `Tập ${m[2].padStart(2, '0')}`,
      epNum: parseInt(m[2], 10)
    };
  }

  // 5. Generic SxxExx: Name.S01E02...
  m = base.match(/^(.*?)[.\s]+[sS](\d+)[eE](\d+)/i);
  if (m) {
    const cleanSeries = m[1].replace(/\./g, ' ').replace(/\s*-\s*$/, '').trim();
    return {
      series: cleanSeries,
      episode: `Tập ${m[3].padStart(2, '0')}`,
      epNum: parseInt(m[3], 10)
    };
  }

  // 6. Generic anime pattern with potential hyphens in title: [Group] Name - With - Hyphens - 01 (1080p) [hash]
  m = base.match(/^(?:\[.*?\]\s*)?(.*?)\s*-\s*(\d+)(?:\s*(?:\([^)]*\)|\[[^\]]*\]))*$/i);
  if (m && m[1].trim().length > 1) {
    return {
      series: m[1].trim(),
      episode: `Tập ${m[2].padStart(2, '0')}`,
      epNum: parseInt(m[2], 10)
    };
  }

  return null;
}

function safeMove(src, dest) {
  if (!fs.existsSync(src)) return;
  if (path.resolve(src) === path.resolve(dest)) return;
  
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  try {
    fs.renameSync(src, dest);
  } catch (err) {
    // Nếu rename bị khóa (EBUSY do torrent client đang seed hoặc app đang mở)
    // Ưu tiên tạo Hardlink để 0MB dung lượng thừa và video có ngay trong thư mục tập!
    try {
      execSync(`cmd.exe /c mklink /H "${dest}" "${src}"`, { stdio: 'ignore' });
      try { fs.unlinkSync(src); } catch (e) {}
    } catch (linkErr) {
      // Fallback copy nếu khác ổ đĩa
      try {
        fs.copyFileSync(src, dest);
        try { fs.unlinkSync(src); } catch (e) {}
      } catch (copyErr) {
        console.error(`[Lỗi di chuyển] Không thể chuyển ${src} sang ${dest}: ${copyErr.message}`);
      }
    }
  }
}

// Quét toàn bộ file trong thư mục targetDir (chỉ quét cấp 1 để tổ chức)
const allFiles = fs.readdirSync(targetDir);
const videoExts = ['.mkv', '.mp4', '.avi', '.ts'];
const videoFiles = allFiles.filter(f => {
  const p = path.join(targetDir, f);
  return fs.statSync(p).isFile() && videoExts.includes(path.extname(f).toLowerCase());
});

console.log(`Tìm thấy ${videoFiles.length} file video ở thư mục gốc cần phân loại.\n`);

const organizedEpisodes = [];

videoFiles.forEach(vFile => {
  const info = parseAnimeInfo(vFile);
  if (!info) {
    console.log(`[Bỏ qua] Không nhận diện được series từ video: ${vFile}`);
    return;
  }

  const vBase = path.basename(vFile, path.extname(vFile));
  const seriesDir = path.join(targetDir, info.series);
  const epDir = path.join(seriesDir, info.episode);
  const cacheDir = path.join(epDir, '.cache');

  fs.mkdirSync(epDir, { recursive: true });
  fs.mkdirSync(cacheDir, { recursive: true });

  console.log(`[+] Đang tổ chức: [${info.series}] -> [${info.episode}]`);

  // 1. Di chuyển file video
  const vSrc = path.join(targetDir, vFile);
  const vDest = path.join(epDir, vFile);
  safeMove(vSrc, vDest);
  console.log(`    ├── Video     : ${vFile}`);

  // 2. Di chuyển các file phụ đề thành phẩm (.ass, .vie.ass, .srt, .vie.srt)
  const subExts = ['.ass', '.vie.ass', '.srt', '.vie.srt'];
  subExts.forEach(ext => {
    const subFile = `${vBase}${ext}`;
    const sSrc = path.join(targetDir, subFile);
    if (fs.existsSync(sSrc)) {
      safeMove(sSrc, path.join(epDir, subFile));
      console.log(`    ├── Subtitle  : ${subFile}`);
    }
  });

  // 3. Di chuyển các file kỹ thuật trung gian vào .cache
  const interSuffixes = [
    '_dialogues.json', '_extracted.ass', '_translations.json'
  ];
  interSuffixes.forEach(sfx => {
    const iFile = `${vBase}${sfx}`;
    const iSrc = path.join(targetDir, iFile);
    if (fs.existsSync(iSrc)) {
      safeMove(iSrc, path.join(cacheDir, iFile));
      console.log(`    ├── (.cache)  : ${iFile}`);
    }
  });

  // 4. Các file phụ đặc thù (manual names)
  if (info.series.includes('Student Council') && info.epNum === 3) {
    ['student_council_s01e03_dialogues.json', 'student_council_s01e03_extracted.ass', 'student_council_s01e03_translations.json'].forEach(f => {
      const src = path.join(targetDir, f);
      if (fs.existsSync(src)) {
        safeMove(src, path.join(cacheDir, f));
        console.log(`    ├── (.cache)  : ${f}`);
      }
    });
  }

  if (info.series.includes('Magical Explorer') && info.epNum === 4) {
    ['magical_explorer_04_dialogues.json', 'magical_explorer_04_extracted.ass', 'magical_explorer_04_translations.json'].forEach(f => {
      const src = path.join(targetDir, f);
      if (fs.existsSync(src)) {
        safeMove(src, path.join(cacheDir, f));
        console.log(`    ├── (.cache)  : ${f}`);
      }
    });
  }

  organizedEpisodes.push({ series: info.series, episode: info.episode, dir: epDir });
});

// 5. Di chuyển các file cẩm nang dịch thuật về thư mục gốc của bộ phim tương ứng
const guideMap = {
  'DARK_SUMMONER_TRANSLATION_GUIDE.md': 'Dark Summoner to Dekiteiru',
  'BLACK_CLOVER_TRANSLATION_GUIDE.md': 'Black Clover',
  'KASHITA_MARYOKU_TRANSLATION_GUIDE.md': 'Kashita Maryoku',
  'SHUIRO_NO_KAMEN_TRANSLATION_GUIDE.md': 'Shuiro no Kamen'
};

Object.entries(guideMap).forEach(([guideFile, seriesName]) => {
  const gSrc = path.join(targetDir, guideFile);
  if (fs.existsSync(gSrc)) {
    const sDir = path.join(targetDir, seriesName);
    fs.mkdirSync(sDir, { recursive: true });
    safeMove(gSrc, path.join(sDir, guideFile));
    console.log(`[Cẩm nang] Đã chuyển ${guideFile} vào thư mục: ${seriesName}`);
  }
});

console.log(`\n======================================================`);
console.log(`[HOÀN TẤT] Đã phân loại gọn gàng ${organizedEpisodes.length} tập anime!`);
console.log(`Thư mục gốc đã được làm sạch, sẵn sàng xem và theo dõi trực quan.`);
console.log(`======================================================\n`);
