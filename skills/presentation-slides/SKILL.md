---
name: presentation-slides
description: Generate polished, scroll-snapped HTML presentation slide decks based on the user's signature editorial template (from Phamtin147/project-dotnet-prn). Features vertical scroll-snap, nav dots, dark mode toggle, slide number badges (SLIDE XX / YY), clean visual-only presentation content, and paired Markdown outline. Use whenever the user asks to create, update, or design presentation slides, or types /presentation-slides.
---

# Presentation Slides Skill (Editorial Scroll-Snap Template)

Always use this skill when creating presentations, decks, or slide-like deliverables.

## Core Rules

1. **Paired Outputs**:
   - Always deliver a standalone interactive `.html` presentation deck (zero build steps, zero external CDN dependencies).
   - Also provide a companion `.md` outline document structured with `### 📌 SLIDE XX / YY: [Title]`.
2. **Slide Numbering (MANDATORY)**:
   - Every slide MUST display a slide badge in the eyebrow: `<span class="slide-badge">SLIDE XX / YY</span>` (e.g. `SLIDE 01 / 14`, `SLIDE 02 / 14`).
   - Bottom-left counter `#counter` dynamically reflects current slide index `X / Y`.
   - In Markdown, every slide header explicitly shows `### 📌 SLIDE XX / YY: [Title]`.
3. **Pure Visual Slide Content**:
   - Do NOT include long speaker scripts, dialogues, or spoken words inside the slide content by default.
   - Do NOT include speaker assignment badges ("Người 1", "Người 2", "Người 3") on the slide.
   - Use clean summary cards (`.card-box`), structured comparison tables (`.styled-table`), flow steps (`.flow-row`), and quote boxes (`.quote-box`).
4. **Theme Consistency**:
   - NEVER use `.slide.invert` or forced black/dark backgrounds on the final slide.
   - All slides must consistently adhere to the current theme (light in Light mode, dark in Dark mode).
5. **Language & Pedagogy**:
   - Default to Vietnamese when the user prompt/context is in Vietnamese or for Vietnamese university courses (MLN, PRN, PRM...).
   - Emphasize solid theoretical depth, dialectical relationships, and clear pedagogical explanations.
6. **Typography & Design Tokens**:
   - Serif: `"Playfair Display", "Source Serif 4", Georgia, serif`
   - Sans: `"Inter", system-ui, -apple-system, sans-serif`
   - Mono: `"JetBrains Mono", ui-monospace, monospace`
   - Tokens: Ivory (`#FAF9F5`), Slate (`#141413`), Clay (`#D97757`), Olive (`#788C5D`), Sage (`#A3B18A`), Sand (`#C4A882`), Coral (`#E07A5F`), Teal (`#3D5A80`).
7. **Code Blocks Formatting**:
   - Always use `<pre class="code-content"><code>...</code></pre>` with `white-space: pre; tab-size: 4;` and exact 4-space indentation starting at column 0.
   - Include macOS-style header with 3 dots (🔴 🟡 🟢) and context/language badge.
8. **Controls & Motion**:
   - Right-aligned navigation dots (`#nav-dots`) generated dynamically by JS.
   - Slide counter at bottom-left (`#counter`).
   - Dark mode toggle button at bottom-right (`#dark-toggle`).
   - `IntersectionObserver` observing all slides with threshold `0.4` to set active dot, counter, and `.visible` class.
   - Keyboard events for `ArrowRight`, `ArrowLeft`, `ArrowDown`, `ArrowUp`, `Space`, `Home`, `End`.
   - Touch swipe detection for mobile.
