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

const IGNORED_FOLDERS = new Set([
  'graphify-out', 'anime-sub-toolkit', 'ebook', '$recycle.bin', 
  'system volume information', '.trash-1000', '.cache', 'phim'
]);

/**
 * Chuẩn hóa chuỗi tên để so khớp mờ (Fuzzy / Normalized Matching)
 */
function normalizeName(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\[.*?\]|\(.*?\)/g, ' ')
    .replace(/season\s*\d+|s\d+|\b1st\b|\b2nd\b|\b3rd\b|\b\d+th\b|\bpart\s*\d+|\bseason\b|\btv\b/gi, ' ')
    .replace(/[._\-:!?,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Tìm kiếm thư mục anime đã tồn tại trong targetDir trước khi quyết định tạo mới.
 * Nếu đã có thư mục phù hợp (kể cả tên có Season, viết tắt, hoặc biến thể), BẮT BUỘC tái sử dụng!
 */
function findExistingSeriesFolder(targetDir, desiredSeries, rawFilename = '') {
  if (!fs.existsSync(targetDir)) return desiredSeries;

  const entries = fs.readdirSync(targetDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && !IGNORED_FOLDERS.has(d.name.toLowerCase()))
    .map(d => d.name);

  // 1. So khớp chính xác 100% (không phân biệt hoa/thường)
  const exact = entries.find(e => e.toLowerCase() === desiredSeries.toLowerCase());
  if (exact) return exact;

  const normDesired = normalizeName(desiredSeries);
  const desiredTokens = normDesired.split(' ').filter(t => t.length > 1);

  // 2. So khớp sau khi chuẩn hóa (loại bỏ Season, ký tự đặc biệt, khoảng trắng thừa)
  for (const entry of entries) {
    const normEntry = normalizeName(entry);
    if (normEntry === normDesired) {
      console.log(`    [Smart Match] Phát hiện thư mục có sẵn: "${entry}" (thay vì tạo "${desiredSeries}")`);
      return entry;
    }
  }

  // 3. So khớp từ khóa chính (Keyword token matching)
  let bestMatch = null;
  let bestScore = 0;

  for (const entry of entries) {
    const normEntry = normalizeName(entry);
    const entryTokens = normEntry.split(' ').filter(t => t.length > 1);

    if (desiredTokens.length > 0 && desiredTokens.every(t => entryTokens.includes(t))) {
      const score = desiredTokens.length / entryTokens.length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    } else if (entryTokens.length > 0 && entryTokens.every(t => desiredTokens.includes(t))) {
      const score = entryTokens.length / desiredTokens.length;
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }
  }

  if (bestMatch) {
    console.log(`    [Smart Match] Phát hiện thư mục có sẵn theo từ khóa: "${bestMatch}" (thay vì tạo "${desiredSeries}")`);
    return bestMatch;
  }

  // 4. So khớp theo tên file video gốc nếu tên file chứa tên một folder có sẵn
  if (rawFilename) {
    const normRaw = normalizeName(rawFilename);
    for (const entry of entries) {
      const normEntry = normalizeName(entry);
      if (normEntry.length > 3 && normRaw.includes(normEntry)) {
        console.log(`    [Smart Match] Phát hiện thư mục có sẵn từ tên video: "${entry}"`);
        return entry;
      }
    }
  }

  return desiredSeries;
}

/**
 * Tự động quét và sáp nhập các thư mục bị trùng lặp/phân tách ngoài ý muốn
 * (Ví dụ: "Black Clover" và "Black Clover 2nd Season")
 */
function mergeDuplicateSeriesFolders(targetDir) {
  if (!fs.existsSync(targetDir)) return;
  const entries = fs.readdirSync(targetDir, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.') && !IGNORED_FOLDERS.has(d.name.toLowerCase()))
    .map(d => d.name);

  const groups = new Map();
  for (const entry of entries) {
    const norm = normalizeName(entry);
    if (!norm) continue;
    if (!groups.has(norm)) groups.set(norm, []);
    groups.get(norm).push(entry);
  }

  for (const [norm, dirList] of groups.entries()) {
    if (dirList.length > 1) {
      // Ưu tiên chọn thư mục có nhiều mục con nhất làm thư mục chính (Primary)
      dirList.sort((a, b) => {
        try {
          const countA = fs.readdirSync(path.join(targetDir, a)).length;
          const countB = fs.readdirSync(path.join(targetDir, b)).length;
          return countB - countA;
        } catch (e) {
          return 0;
        }
      });

      const primary = dirList[0];
      const primaryPath = path.join(targetDir, primary);

      for (let i = 1; i < dirList.length; i++) {
        const secondary = dirList[i];
        const secondaryPath = path.join(targetDir, secondary);
        console.log(`[Auto-Merge] Phát hiện thư mục trùng lặp: "${secondary}" ➔ Đang gộp vào "${primary}"...`);
        try {
          const subItems = fs.readdirSync(secondaryPath);
          for (const item of subItems) {
            const sItemPath = path.join(secondaryPath, item);
            const dItemPath = path.join(primaryPath, item);
            if (fs.existsSync(dItemPath)) {
              if (fs.statSync(sItemPath).isDirectory() && fs.statSync(dItemPath).isDirectory()) {
                for (const child of fs.readdirSync(sItemPath)) {
                  safeMove(path.join(sItemPath, child), path.join(dItemPath, child));
                }
                try { fs.rmdirSync(sItemPath); } catch (e) {}
              } else if (item.endsWith('_TRANSLATION_GUIDE.md')) {
                try { fs.unlinkSync(sItemPath); } catch (e) {}
              }
            } else {
              safeMove(sItemPath, dItemPath);
            }
          }
          if (fs.readdirSync(secondaryPath).length === 0) {
            fs.rmdirSync(secondaryPath);
            console.log(`[Auto-Merge] Đã dọn dẹp thư mục dư thừa: "${secondary}"`);
          }
        } catch (err) {
          console.error(`[Auto-Merge] Lỗi gộp "${secondary}": ${err.message}`);
        }
      }
    }
  }
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

  // 2c. Chii Fuyo / The Laid Off Cheat Granting Mage
  m = base.match(/(?:Chii\s*Fuyo|The\.Laid\.Off\.Cheat\.Granting\.Mage).*?[sS](\d+)[eE](\d+)/i) || base.match(/(?:Chii\s*Fuyo|The\s*Laid\s*Off\s*Cheat\s*Granting\s*Mage)\s*-\s*(\d+)/i);
  if (m) {
    const ep = m[2] || m[1];
    return {
      series: 'The Laid Off Cheat Granting Mage Enjoys a Second Lease on Life',
      episode: `Tập ${ep.padStart(2, '0')}`,
      epNum: parseInt(ep, 10)
    };
  }

  // 2d. Choujun! Choujou-senpai / Super Psychic Policeman Chojo
  m = base.match(/(?:Choujun!?\s*Choujou-senpai|Super\.Psychic\.Policeman\.Chojo).*?[sS](\d+)[eE](\d+)/i) || base.match(/(?:Choujun!?\s*Choujou-senpai|Super\s*Psychic\s*Policeman\s*Chojo)\s*-\s*(\d+)/i);
  if (m) {
    const ep = m[2] || m[1];
    return {
      series: 'Super Psychic Policeman Chojo',
      episode: `Tập ${ep.padStart(2, '0')}`,
      epNum: parseInt(ep, 10)
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

  // 4b. Blue Box / Ao no Hako
  m = base.match(/Blue\.Box.*?[sS](\d+)[eE](\d+)/i) || base.match(/Blue\s*Box\s*-\s*(\d+)/i);
  if (m) {
    const ep = m[2] || m[1];
    return {
      series: 'Blue Box',
      episode: `Tập ${ep.padStart(2, '0')}`,
      epNum: parseInt(ep, 10)
    };
  }

  // 4c. Black Clover
  m = base.match(/Black\s*Clover.*?(?:Season\s*(\d+)\s*-\s*|S(\d+)E(\d+)|\s*-\s*)(\d+)/i);
  if (m) {
    const ep = m[4] || m[3];
    return {
      series: 'Black Clover',
      episode: `Tập ${ep.padStart(2, '0')}`,
      epNum: parseInt(ep, 10)
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

  // 6. Generic anime pattern with potential hyphens in title: [Group] Name - With - Hyphens - 01 V2 (1080p) [hash]
  m = base.match(/^(?:\[.*?\]\s*)?(.*?)\s*-\s*(\d+)(?:\s*[vV]\d+)?(?:\s*(?:\([^)]*\)|\[[^\]]*\]))*$/i);
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

// 0. Tự động kiểm tra và sáp nhập các thư mục trùng lặp trước khi phân loại
mergeDuplicateSeriesFolders(targetDir);

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
  
  // KIỂM TRA VÀ TÁI SỬ DỤNG THƯ MỤC CÓ SẴN (ZERO DUPLICATE FOLDERS)
  const resolvedSeries = findExistingSeriesFolder(targetDir, info.series, vFile);
  const seriesDir = path.join(targetDir, resolvedSeries);
  const epDir = path.join(seriesDir, info.episode);
  const cacheDir = path.join(epDir, '.cache');

  fs.mkdirSync(epDir, { recursive: true });
  fs.mkdirSync(cacheDir, { recursive: true });

  console.log(`[+] Đang tổ chức: [${resolvedSeries}] -> [${info.episode}]`);

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
  if (resolvedSeries.includes('Student Council') && info.epNum === 3) {
    ['student_council_s01e03_dialogues.json', 'student_council_s01e03_extracted.ass', 'student_council_s01e03_translations.json'].forEach(f => {
      const src = path.join(targetDir, f);
      if (fs.existsSync(src)) {
        safeMove(src, path.join(cacheDir, f));
        console.log(`    ├── (.cache)  : ${f}`);
      }
    });
  }

  if (resolvedSeries.includes('Magical Explorer') && info.epNum === 4) {
    ['magical_explorer_04_dialogues.json', 'magical_explorer_04_extracted.ass', 'magical_explorer_04_translations.json'].forEach(f => {
      const src = path.join(targetDir, f);
      if (fs.existsSync(src)) {
        safeMove(src, path.join(cacheDir, f));
        console.log(`    ├── (.cache)  : ${f}`);
      }
    });
  }

  organizedEpisodes.push({ series: resolvedSeries, episode: info.episode, dir: epDir });
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
    const resolvedSeries = findExistingSeriesFolder(targetDir, seriesName, guideFile);
    const sDir = path.join(targetDir, resolvedSeries);
    fs.mkdirSync(sDir, { recursive: true });
    safeMove(gSrc, path.join(sDir, guideFile));
    console.log(`[Cẩm nang] Đã chuyển ${guideFile} vào thư mục: ${resolvedSeries}`);
  }
});

console.log(`\n======================================================`);
console.log(`[HOÀN TẤT] Đã phân loại gọn gàng ${organizedEpisodes.length} tập anime!`);
console.log(`Thư mục gốc đã được làm sạch, sẵn sàng xem và theo dõi trực quan.`);
console.log(`======================================================\n`);
