# Interactive Carousels & Interests Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add clickable modals to film/album carousels with metadata, upgrade carousels to cursor-responsive scrolling, and make interest cards open modals with expanded content.

**Architecture:** All changes go into the single `index.html` file. New CSS in the `<style>` block, new HTML modal elements after the existing lightbox overlay, new JS data arrays and functions in new `<script>` blocks. Carousel scrolling moves from CSS animation to JS-driven `requestAnimationFrame` loop with cursor-responsive speed control (adapted from Gotham Group site pattern).

**Tech Stack:** Vanilla HTML/CSS/JavaScript (no dependencies)

---

## Task 1: Add Modal CSS

**Files:** Modify `index.html` — insert CSS after lightbox styles (~line 1154), before VOLUNTEER comment

Add CSS for: `.project-modal-overlay`, `.project-modal-close`, `.project-modal-nav`, `.project-modal-content` (flex two-column), `.project-modal-poster` (flex 0 0 280px), `.project-modal-info`, `.project-modal-type/.title/.year/.meta/.logline/.counter`, `.album-link-btn` (Spotify green #1DB954, Apple red #fc3c44 pill buttons), `.interest-modal-content` (column layout), `.interest-modal-header/.icon/.title/.body/.video`. Make `.interest-card` have `cursor: pointer` and hover lift. Add responsive breakpoint at 768px stacking modal columns vertically.

Also remove CSS animation from `.marquee-track` (line 698) — JS will drive scrolling. Add `cursor: pointer` to `.marquee-item`.

Commit: `style: add modal CSS for films, albums, and interests`

---

## Task 2: Add Modal HTML and Data Arrays

**Files:** Modify `index.html`

**Modal HTML** — insert after lightbox overlay (after ~line 3403):
```html
<div class="project-modal-overlay" id="projectModal">
  <button class="project-modal-close" id="projectModalClose">&times;</button>
  <button class="project-modal-nav project-modal-prev" id="projectModalPrev">&#8249;</button>
  <button class="project-modal-nav project-modal-next" id="projectModalNext">&#8250;</button>
  <div id="projectModalContent"></div>
  <div class="project-modal-counter" id="projectModalCounter"></div>
</div>
```

**Film data** — 19 films with: title, year, director, genre, plot, img (matching existing image paths)

**Album data** — 18 albums with: title, artist, year, img, spotify URL, apple URL

**Interest data** — 10 interests with: id, title, body (expanded text), video (YouTube embed URL or null), photos array. Pro Wrestling gets the YouTube video `https://www.youtube.com/embed/BQCPj-bGYro`. Others get expanded placeholder text.

Commit: `feat: add modal HTML and data arrays for films, albums, interests`

---

## Task 3: Implement JS-Driven Carousel Scrolling

**Files:** Modify `index.html` — new `<script>` block after lightbox JS (~line 3504)

Port the Gotham Group's `buildMarquee()` pattern adapted for the existing HTML structure:
- `initCarousel(marqueeEl, dataArray, category)` function
- Remove CSS animation from track, drive with `requestAnimationFrame`
- Cursor-responsive speed: left 25% reverses, right 25% accelerates, center gentle
- Drag support (mouse + touch) with momentum
- Click handler on `.marquee-item` elements — calls `openProjectModal(category, realIndex)` (using `idx % dataArray.length` to handle duplicated items)
- Initialize for both `.taste-marquee` elements

Commit: `feat: replace CSS carousel with JS-driven cursor-responsive scrolling`

---

## Task 4: Implement Modal Open/Close/Navigate Logic

**Files:** Modify `index.html` — same or adjacent script block

Functions:
- `openProjectModal(category, index)` — sets category/index, calls appropriate render function, shows modal
- `renderFilmModal()` — two-column: poster left, title/year/director/genre/plot right
- `renderAlbumModal()` — two-column: cover left (1:1 aspect ratio), title/artist/year right + Spotify/Apple Music pill buttons
- `renderInterestModal()` — single column: icon+title header, expanded body text, optional YouTube iframe. Hides prev/next nav buttons
- `closeProjectModal()` — hides overlay, restores scroll, stops YouTube if playing
- `navigateProjectModal(dir)` — cycles through film or album arrays
- Event listeners: close button, prev/next buttons, click-outside, keyboard (Escape, ArrowLeft, ArrowRight)

Commit: `feat: implement modal rendering for films, albums, and interests`

---

## Task 5: Wire Interest Cards to Modals

**Files:** Modify `index.html`

Add click listeners to all `.interest-card` elements:
```javascript
document.querySelectorAll('.interest-card').forEach(function(card, i) {
  card.addEventListener('click', function() { openProjectModal('interest', i); });
});
```

Verify: Click Pro Wrestling card shows modal with blurb + YouTube embed. Other cards show expanded text. Escape/click-outside closes.

Commit: `feat: wire interest cards to modal overlays`

---

## Task 6: Polish and Responsive Testing

Test at mobile viewport (375px):
- Modals stack vertically
- Carousels draggable on touch
- All 19 films, 18 albums, 10 interests open correct modals
- Spotify/Apple Music links work (new tab)
- Keyboard nav works
- No console errors

Fix any issues found.

Commit: `fix: polish modal responsiveness and edge cases`
