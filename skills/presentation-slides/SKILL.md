---
name: slides
description: Generate polished, scroll-snapped 16:9 HTML presentation slide decks and matching Markdown outlines. Features slide number badges (SLIDE XX / YY), clean visual-only presentation content (zero speaker dialogue/notes), strict zero-emoji anti-slop typography, responsive tables, light/dark mode, and macOS code blocks. Use whenever the user asks to create or update slides, or types /slides, /slide, or /presentation-slides.
---

# Presentation Slides Skill (Editorial Scroll-Snap Template)

Always use this skill when creating presentations, decks, or slide-like deliverables.

---

## 🎯 8 NON-NEGOTIABLE CORE RULES

1. **Paired Deliverables (Always generate both):**
   - **Standalone HTML slide deck:** Self-contained file with embedded CSS and JavaScript. Zero build steps, zero external CDN dependencies.
   - **Companion Markdown outline:** Structured with `### 📌 SLIDE XX / YY: [Title]`, preserving the exact information hierarchy.

2. **Slide Number Badges (MANDATORY):**
   - On every slide, the `eyebrow` header **MUST** contain a slide badge:
     `<span class="slide-badge">SLIDE XX / YY</span>` (e.g., `SLIDE 01 / 10`, `SLIDE 02 / 10`).
   - A fixed slide counter at bottom-left: `<div id="counter">1 / 10</div>`.
   - In Markdown, every slide header explicitly states: `### 📌 SLIDE XX / YY: [Title]`.

3. **ZERO EMOJIS & ZERO AI SLOP (Strict Aesthetic Quality):**
   - **STRICTLY PROHIBIT** using emojis (e.g., 🔐, 🛡️, 🌐, 🚀, 💡, 🎯, 📦, 🧪, 📱, ☁️, ⚙️, 📋, 🔑, etc.) in headings, cards, subtitles, or bullet points. Emojis make slides look like cheap, automated "AI slop".
   - Rely strictly on refined editorial typography: uppercase tracked mono tags (`font-family: var(--mono)`), clean numbered prefixes (`1.`, `2.`), serif titles, and subtle color accent lines (`border-top: 2px solid var(--clay)`).
   - The only acceptable colored dots are the 3 macOS window controls (🔴 🟡 🟢) inside code block headers.

4. **Pure Visual Presentation Content:**
   - **REMOVE** all spoken speaker scripts, dialogues, or lengthy paragraphs from the slides.
   - **REMOVE** presenter assignment badges ("Speaker 1", "Speaker 2", "Người 1, 2, 3").
   - Present information cleanly through summary cards (`.card-box`), structured comparison tables (`.styled-table`), flow steps (`.flow-row`), and quote boxes (`.quote-box`).

5. **Theme Consistency (Light & Dark Mode):**
   - Provide an interactive `#dark-toggle` button.
   - **NEVER** use `.slide.invert` or forced black/dark backgrounds on the final slide. All slides must consistently adhere to the active theme.

6. **Refined Typography & Warm Editorial Palette:**
   - **Colors:**
     - Light background: `--ivory: #FAF9F5` | Dark background: `--slate: #141413`
     - Primary accent: `--clay: #D97757`
     - Editorial tones: `--olive: #788C5D`, `--sage: #A3B18A`, `--sand: #C4A882`, `--coral: #E07A5F`, `--teal: #3D5A80`
   - **Typography:**
     - Serif: `"Playfair Display", "Source Serif 4", Georgia, serif` (H1, H2, quotes).
     - Sans: `"Inter", system-ui, -apple-system, sans-serif` (body, cards).
     - Mono: `"JetBrains Mono", ui-monospace, monospace` (slide badge, tags, code).

7. **macOS Code Blocks:**
   - Use `<pre class="code-content"><code>...</code></pre>` with `white-space: pre; tab-size: 4;` and exact 4-space indentation.
   - Include macOS header with 3 window dots (`.code-dot.red`, `.code-dot.yellow`, `.code-dot.green`) and context/file badge.

8. **Language & Technical Rigor:**
   - Default to **English** for technical topics, engineering, Web API, and computer science presentations, unless the user explicitly asks for Vietnamese.
   - Maintain high educational depth, architectural precision, and production-grade clarity.

---

## 🛠 STANDARD HTML BOILERPLATE

```html
<!-- Copyright 2026 · [Presentation Title] -->
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>[Presentation Title]</title>
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
    padding: 5vh 6vw;
    position: relative;
    overflow: hidden;
  }
  .slide-inner {
    width: 100%;
    max-width: 900px;
    opacity: 0;
    transform: translateY(22px);
    transition: opacity .6s cubic-bezier(0.16, 1, 0.3, 1), transform .6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .slide.visible .slide-inner { opacity: 1; transform: translateY(0); }

  .eyebrow {
    font-family: var(--mono);
    font-size: 11.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-soft);
    margin-bottom: 12px;
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
    padding: 2.5px 8.5px;
    border-radius: 4px;
    letter-spacing: 0.06em;
  }

  h1 { font-family: var(--serif); font-weight: 500; font-size: clamp(30px, 4.6vw, 46px); line-height: 1.15; margin-bottom: 12px; }
  h2 { font-family: var(--serif); font-weight: 500; font-size: clamp(22px, 3.2vw, 32px); line-height: 1.22; margin-bottom: 12px; }
  h3 { font-family: var(--sans); font-weight: 600; font-size: 14.5px; margin-bottom: 8px; color: var(--text); }
  .subtitle { font-size: 14px; line-height: 1.55; color: var(--text-muted); max-width: 820px; margin-bottom: 16px; }

  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 13px; }
  .card-box { padding: 15px 17px; border: 1px solid var(--border); border-radius: 8px; background: var(--card-bg); }

  .flow-row { display: flex; align-items: center; gap: 7px; flex-wrap: wrap; margin-top: 10px; margin-bottom: 14px; }
  .flow-step { font-family: var(--mono); font-size: 11px; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--border); background: var(--card-bg); }
  .flow-step.highlight { background: var(--clay); color: #fff; border-color: var(--clay); }
  .flow-arrow { font-size: 12px; color: var(--text-soft); }

  .styled-table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12.2px; }
  .styled-table th { text-align: left; padding: 7px 10px; background: rgba(217,119,87,0.1); color: var(--text); border-bottom: 2px solid var(--border); font-family: var(--mono); font-size: 11px; }
  .styled-table td { padding: 7px 10px; border-bottom: 1px solid var(--border); }

  #nav-dots { position: fixed; right: 20px; top: 50%; transform: translateY(-50%); display: flex; flex-direction: column; gap: 8px; z-index: 20; }
  .nav-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--nav-dot); border: none; cursor: pointer; transition: background .25s, transform .25s; padding: 0; }
  .nav-dot.active { background: var(--nav-dot-active); transform: scale(1.45); }

  #counter {
    position: fixed;
    bottom: 20px;
    left: 24px;
    font-family: var(--mono);
    font-size: 11.5px;
    font-weight: 600;
    color: var(--text-soft);
    background: var(--card-bg);
    border: 1px solid var(--border);
    padding: 4px 11px;
    border-radius: 999px;
    user-select: none;
    z-index: 10;
  }

  #dark-toggle {
    position: fixed;
    bottom: 18px;
    right: 20px;
    z-index: 20;
    background: none;
    border: 1px solid var(--border);
    border-radius: 999px;
    padding: 5px 12px;
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
  <div id="counter">1 / 10</div>
  <button id="dark-toggle" aria-label="Toggle dark mode">
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    <span>Dark</span>
  </button>

  <!-- Slide 1 -->
  <section class="slide" id="s1">
    <div class="slide-inner">
      <div class="eyebrow">
        <span class="slide-badge">SLIDE 01 / 10</span>
        <span>TOPIC CATEGORY · SUBSECTION</span>
      </div>
      <h1>Presentation Title</h1>
      <p class="subtitle">Subtitle explaining the core architectural value.</p>
    </div>
  </section>

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
      dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
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
