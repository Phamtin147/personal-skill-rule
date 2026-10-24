/**
 * sync_repo.js
 * Tự động đồng bộ phụ đề hoàn thiện sang Kho lưu trữ GitHub:
 * https://github.com/Phamtin147/sub-film-vietnamese
 *
 * Đảm bảo:
 *  - BỎ QUA 100% file video (.mkv, .mp4, .avi, .ts,...)
 *  - Chỉ lưu trữ file phụ đề (.ass, .vie.ass, .vie.srt) và tài liệu dịch thuật (_TRANSLATION_GUIDE.md)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const repoRoot = 'F:/sub-film-vietnamese';
if (!fs.existsSync(repoRoot) || !fs.existsSync(path.join(repoRoot, '.git'))) {
  process.exit(0);
}

const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : null;
const base = process.argv[3] || '';

function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
}

if (targetDir && fs.existsSync(targetDir)) {
  const relPath = path.relative('F:/anime', targetDir);
  let category = 'Anime';
  let subRel = relPath;

  if (targetDir.toLowerCase().includes('midnight diner')) {
    category = 'Midnight Diner';
    subRel = path.relative('D:/Midnight Diner', targetDir);
  } else if (!targetDir.toLowerCase().includes('anime')) {
    category = 'Movies & Series';
    subRel = path.basename(targetDir);
  }

  // Copy sub files
  const files = fs.readdirSync(targetDir);
  let copied = 0;
  for (const f of files) {
    const lower = f.toLowerCase();
    if (lower.endsWith('.vie.ass') || lower.endsWith('.ass') || lower.endsWith('.vie.srt') || lower.endsWith('_guide.md')) {
      const dest = path.join(repoRoot, category, subRel, f);
      copyFile(path.join(targetDir, f), dest);
      copied++;
    }
  }

  // Also check parent folder for TRANSLATION_GUIDE.md
  const parentDir = path.dirname(targetDir);
  if (fs.existsSync(parentDir)) {
    for (const pf of fs.readdirSync(parentDir)) {
      if (pf.toLowerCase().endsWith('_guide.md')) {
        const destP = path.join(repoRoot, category, path.basename(parentDir), pf);
        copyFile(path.join(parentDir, pf), destP);
      }
    }
  }

  if (copied > 0) {
    console.log(`[Git Backup] Đã đồng bộ ${copied} file phụ đề vào kho: ${repoRoot}`);
    try {
      execSync(`git -C "${repoRoot}" add .`, { stdio: 'ignore' });
      execSync(`git -C "${repoRoot}" commit -m "feat(sub): auto-sync subtitles for ${base || 'episodes'}"`, { stdio: 'ignore' });
      execSync(`git -C "${repoRoot}" push origin main`, { stdio: 'ignore' });
      console.log(`[Git Backup] Đã đẩy thành công lên GitHub: https://github.com/Phamtin147/sub-film-vietnamese`);
    } catch (err) {
      console.log(`[Git Backup] Không có thay đổi mới cần đẩy hoặc đã đồng bộ.`);
    }
  }
}
