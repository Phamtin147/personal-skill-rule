---
name: slides
description: Tạo bộ slide trình chiếu tương tác 16:9 scroll-snap HTML và file dàn ý Markdown chuẩn. Tự động hiển thị số slide rõ ràng (SLIDE XX / YY), thuần nội dung màn chiếu (không kèm thoại/phân vai rườm rà), hỗ trợ Light/Dark mode, dot nav, phím tắt điều hướng, bảng so sánh responsive và macOS code block. Kích hoạt khi gõ /slides, /slide hoặc yêu cầu làm slide thuyết trình.
---

# Kỹ Năng Thiết Kế Slide Thuyết Trình (Slides Generator)

Kỹ năng này chuyên dùng để tạo hoặc chuyển đổi nội dung thuyết trình thành **bộ slide HTML tương tác 16:9 scroll-snap** kèm **tài liệu dàn ý Markdown** chuẩn chỉnh, hiện đại, phục vụ trình chiếu chuyên nghiệp và học tập/thi cử.

---

## 🎯 7 NGUYÊN TẮC BẮT BUỘC (NON-NEGOTIABLES)

1. **Bộ Đôi Sản Phẩm Luôn Đi Kèm (Paired Deliverables):**
   - **File HTML độc lập:** Chứa toàn bộ CSS & JS nội tuyến, zero build-step, không phụ thuộc thư viện ngoài/CDN, chạy mượt trên mọi trình duyệt.
   - **File Markdown song hành:** Dàn ý cô đọng, định dạng chuẩn `### 📌 SLIDE XX / YY: [Tiêu đề]`.

2. **Bắt Buộc Đánh Số Slide Rõ Ràng (Slide Number Badges):**
   - Trên mỗi slide HTML, phần `eyebrow` **BẮT BUỘC** có huy hiệu số slide:
     `<span class="slide-badge">SLIDE XX / YY</span>` (Ví dụ: `SLIDE 01 / 14`, `SLIDE 02 / 14`).
   - Có bộ đếm cố định góc dưới bên trái: `<div id="counter">X / Y</div>`.
   - Trên file Markdown, tiêu đề từng slide phải ghi rõ: `### 📌 SLIDE XX / YY: [Tiêu đề]`.

3. **Thuần Nội Dung Trình Chiếu (Pure Visual Slide Content):**
   - **LOẠI BỎ** toàn bộ lời thoại (speaker notes) hoặc kịch bản đọc dài dòng khỏi màn chiếu (trừ khi người dùng yêu cầu làm kịch bản thuyết trình riêng).
   - **LOẠI BỎ** các nhãn phân vai người nói (Người 1, Người 2, Người 3) trên slide.
   - Trình bày thông tin bằng: thẻ card (`.card-box`), danh sách ngắn gọn, bảng biểu so sánh (`.styled-table`), quy trình luồng (`.flow-row`), hộp trích dẫn (`.quote-box`).

4. **Đồng Nhất Giao Diện & Theme Tối/Sáng (Theme Consistency):**
   - Hỗ trợ chuyển đổi giao diện Sáng/Tối qua nút `#dark-toggle`.
   - **TUYỆT ĐỐI KHÔNG** dùng `.slide.invert` hay ép màu nền đen ở slide cuối cùng. Mọi slide (kể cả slide kết luận/Q&A) phải đồng bộ nền theo theme đang chọn.

5. **Hệ Thống Thiết Kế Editorial Tinh Tế (Design Tokens & Typography):**
   - **Màu sắc Warm Editorial:**
     - Nền sáng: `--ivory: #FAF9F5` | Nền tối: `--slate: #141413`
     - Màu nhấn chính: `--clay: #D97757`
     - Màu phối học thuật: `--olive: #788C5D`, `--sage: #A3B18A`, `--sand: #C4A882`, `--coral: #E07A5F`, `--teal: #3D5A80`
   - **Font chữ:**
     - Serif: `"Playfair Display", "Source Serif 4", Georgia, serif` (dành cho tiêu đề H1, H2, trích dẫn).
     - Sans: `"Inter", system-ui, -apple-system, sans-serif` (nội dung chính).
     - Mono: `"JetBrains Mono", ui-monospace, monospace` (số slide, thẻ tag, code).

6. **Khối Code macOS Chuẩn (Nếu có mã nguồn):**
   - Luôn bọc trong `<pre class="code-content"><code>...</code></pre>` với thụt lề chuẩn 4 dấu cách, `white-space: pre; tab-size: 4;`.
   - Header kiểu macOS có 3 chấm tròn đỏ - vàng - xanh (`.code-dot.red`, `.code-dot.yellow`, `.code-dot.green`) và tên file/ngôn ngữ.

7. **Tính Sư Phạm & Chiều Sâu Kiến Thức:**
   - Khi làm slide môn học đại học (MLN111, PRN232, PRM392...), nội dung phải súc tích nhưng đầy đủ chiều sâu lý luận, bản chất kỹ thuật, sơ đồ quan hệ biện chứng và bảng so sánh trực quan.

---

## 🛠 CẤU TRÚC HTML BOILERPLATE MẪU

```html
<!-- Copyright 2026 · [Tên bài thuyết trình] -->
<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>[Tiêu đề thuyết trình]</title>
<style>
  :root {
    --ivory:   #FAF9F5;
    --slate:   #141413;
    --clay:    #D97757;
    --oat:     #E3DACC;
    --olive:   #788C5D;
    --sage:    #A3B18A;
    --sand:    #C4A882;
    --coral:   #E07A5F;
    --teal:    #3D5A80;
    --gray-150:#F0EEE6;
    --gray-300:#D1CFC5;
    --gray-500:#87867F;
    --gray-700:#3D3D3A;

    --serif:  "Playfair Display", "Source Serif 4", Georgia, serif;
    --sans:   "Inter", system-ui, -apple-system, sans-serif;
    --mono:   "JetBrains Mono", ui-monospace, monospace;

    --bg:         var(--ivory);
    --text:       var(--slate);
    --text-soft:  var(--gray-500);
    --text-muted: var(--gray-700);
    --border:     var(--gray-300);
    --card-bg:    rgba(217,119,87,0.06);
    --nav-dot:    var(--gray-300);
    --nav-dot-active: var(--clay);
  }

  body.dark {
    --bg:         #1A1A18;
    --text:       #EFEEE8;
    --text-soft:  #87867F;
    --text-muted: #B0AFA6;
    --border:     #3D3D3A;
    --card-bg:    rgba(217,119,87,0.1);
    --nav-dot:    #3D3D3A;
    --nav-dot-active: var(--clay);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body {
    font-family: var(--sans);
    background: var(--bg);
    color: var(--text);
    scroll-snap-type: y mandatory;
    overflow-x: hidden;
    transition: background .35s ease, color .35s ease;
  }

  .slide {
    width: 100vw;
    height: 100vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6vh 6vw;
    position: relative;
  }
  .slide-inner {
    width: 100%;
    max-width: 880px;
    opacity: 0;
    transform: translateY(24px);
    transition: opacity .6s ease, transform .6s ease;
  }
  .slide.visible .slide-inner { opacity: 1; transform: translateY(0); }

  .eyebrow {
    font-family: var(--mono);
    font-size: 11.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-soft);
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .slide-badge {
    display: inline-flex;
    align-items: center;
    background: var(--clay);
    color: #ffffff;
    font-family: var(--mono);
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
    letter-spacing: 0.06em;
  }

  h1 { font-family: var(--serif); font-size: clamp(34px, 5.2vw, 50px); line-height: 1.15; margin-bottom: 14px; }
  h2 { font-family: var(--serif); font-size: clamp(24px, 3.4vw, 34px); line-height: 1.22; margin-bottom: 16px; }
  .subtitle { font-size: 15px; line-height: 1.6; color: var(--text-muted); max-width: 800px; margin-bottom: 20px; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .card-box { padding: 18px 20px; border: 1px solid var(--border); border-radius: 10px; background: var(--card-bg); }

  .flow-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-top: 14px; margin-bottom: 16px; }
  .flow-step { font-family: var(--mono); font-size: 11.5px; padding: 7px 13px; border-radius: 6px; border: 1px solid var(--border); background: var(--card-bg); }
  .flow-step.highlight { background: var(--clay); color: #fff; border-color: var(--clay); }
  .flow-arrow { font-size: 12px; color: var(--text-soft); }

  .styled-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px; }
  .styled-table th { text-align: left; padding: 10px 12px; background: rgba(217,119,87,0.1); color: var(--text); border-bottom: 2px solid var(--border); font-family: var(--mono); }
  .styled-table td { padding: 10px 12px; border-bottom: 1px solid var(--border); }

  #nav-dots { position: fixed; right: 22px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 9px; z-index: 20; }
  .nav-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--nav-dot); border: none; cursor: pointer; transition: background .25s, transform .25s; padding: 0; }
  .nav-dot.active { background: var(--nav-dot-active); transform: scale(1.45); }

  #counter {
    position: fixed;
    bottom: 20px;
    left: 24px;
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--text-soft);
    background: var(--card-bg);
    border: 1px solid var(--border);
    padding: 5px 12px;
    border-radius: 999px;
    user-select: none;
    z-index: 10;
  }

  #dark-toggle {
    position: fixed;
    bottom: 18px;
    right: 22px;
    z-index: 20;
    background: none;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 6px 13px;
    font-family: var(--mono);
    font-size: 11px;
    color: var(--text-soft);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
  }
</style>
</head>
<body>

  <div id="nav-dots"></div>
  <div id="counter">1 / 14</div>
  <button id="dark-toggle" aria-label="Toggle dark mode">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    <span>Dark</span>
  </button>

  <!-- Slide 1 -->
  <section class="slide" id="s1">
    <div class="slide-inner">
      <div class="eyebrow">
        <span class="slide-badge">SLIDE 01 / 14</span>
        <span>HỌC PHẦN: [TÊN MÔN HỌC]</span>
      </div>
      <h1>[Tiêu Đề Lớn Của Báo Cáo]</h1>
      <p class="subtitle">[Tóm tắt giá trị cốt lõi của đề tài]</p>
      ...
    </div>
  </section>

  <!-- Slide 2 -->
  <section class="slide" id="s2">
    <div class="slide-inner">
      <div class="eyebrow">
        <span class="slide-badge">SLIDE 02 / 14</span>
        <span>[CHỦ ĐỀ SLIDE]</span>
      </div>
      <h2>[Tiêu Đề Nội Dung Slide]</h2>
      ...
    </div>
  </section>

  <!-- JS Controller -->
  <script>
  (function () {
    var slides = Array.from(document.querySelectorAll('.slide'));
    var counter = document.getElementById('counter');
    var navDots = document.getElementById('nav-dots');
    var darkToggle = document.getElementById('dark-toggle');
    var current = 0;

    slides.forEach(function (_, i) {
      var dot = document.createElement('button');
      dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function () { go(i); });
      navDots.appendChild(dot);
    });

    var dots = Array.from(navDots.children);
    function go(i) {
      current = Math.max(0, Math.min(slides.length - 1, i));
      slides[current].scrollIntoView({ behavior: 'smooth' });
    }

    document.addEventListener('keydown', function (e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); go(current + 1); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); go(current - 1); }
      if (e.key === 'Home') { e.preventDefault(); go(0); }
      if (e.key === 'End') { e.preventDefault(); go(slides.length - 1); }
    });

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var idx = slides.indexOf(en.target);
        if (en.isIntersecting) {
          current = idx;
          counter.textContent = (current + 1) + ' / ' + slides.length;
          dots.forEach(function (d, i) { d.classList.toggle('active', i === current); });
          en.target.classList.add('visible');
        }
      });
    }, { threshold: 0.4 });

    slides.forEach(function (s) { obs.observe(s); });
    slides[0].classList.add('visible');

    darkToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark');
      darkToggle.querySelector('span').textContent = document.body.classList.contains('dark') ? 'Light' : 'Dark';
    });
  })();
  </script>
</body>
</html>
```

---

## 📝 MẪU ĐỊNH DẠNG DÀN Ý MARKDOWN

Mỗi khi tạo slide, luôn tạo kèm file `.md` với cấu trúc sau:

```markdown
# BỘ SLIDE THUYẾT TRÌNH: [TÊN ĐỀ TÀI]
**Môn học:** [Mã HP & Tên môn học]
**Số lượng slide:** [Tổng số slide] slide

---

### 📌 SLIDE 01 / [TỔNG SỐ]: [Tiêu đề Slide 1]
* **Nội dung chính:**
  - Điểm cốt lõi 1
  - Điểm cốt lõi 2
* **Mục tiêu:** Định vị vấn đề nghiên cứu

---

### 📌 SLIDE 02 / [TỔNG SỐ]: [Tiêu đề Slide 2]
* **Khái niệm / Định nghĩa:**
  > "[Nội dung trích dẫn hoặc định nghĩa chính thức]"
* **Phân tích cấu trúc:**
  - 1. Thành phần thứ nhất
  - 2. Thành phần thứ hai
...
```

---

## 🚀 QUY TRÌNH THỰC HIỆN KHI ĐƯỢC KÍCH HOẠT

1. **Phân Tích Yêu Cầu:**
   - Xác định chủ đề, đối tượng nghe, số lượng slide mong muốn (hoặc tự tính toán phân bổ tối ưu nếu người dùng chưa chỉ định).
2. **Soạn Thảo Dàn Ý (Markdown First):**
   - Đảm bảo cấu trúc sư phạm chặt chẽ, chắt lọc nội dung màn chiếu cô đọng.
   - Đánh số `SLIDE XX / YY` chuẩn xác.
3. **Hiện Thực Hóa Slide HTML:**
   - Dùng template chuẩn ở trên.
   - Gắn huy hiệu `<span class="slide-badge">SLIDE XX / YY</span>` cho từng slide.
   - Đảm bảo slide kết luận đồng bộ theme, không đảo màu nền.
4. **Kiểm Tra & Bàn Giao:**
   - Lưu trữ tại thư mục làm việc của dự án (ví dụ `slides.html` và `slides.md`).
   - Cung cấp link có thể click trực tiếp `file://...` cho người dùng.
