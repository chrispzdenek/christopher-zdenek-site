# Site Enhancement V2 — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Tighten the timeline layout, add marquee interactivity, restructure bottom sections, add pool photo/floating title to essay, add Friends School education entry, and differentiate the Groundlings entry.

**Architecture:** All changes in a single `index.html` file (inline CSS + HTML + JS). No build tools. Preview at localhost:8090.

**Tech Stack:** HTML, CSS, vanilla JS. Static site served via `npx serve`.

**Design doc:** `docs/plans/2026-03-04-site-enhancement-v2-design.md`

---

### Task 1: Timeline CSS — One-Line Company Row + Company Color + Chevron Visibility

**Files:**
- Modify: `index.html` CSS section (~lines 452-500)

**Step 1: Update CSS**

In the CSS, make these changes:

1. `.timeline-company-row` — add desktop rule to prevent wrapping:
```css
@media (min-width: 769px) {
  .timeline-company-row { flex-wrap: nowrap; }
}
```

2. `.timeline-company` — add accent color:
```css
.timeline-company { color: var(--accent); }
```

3. `.timeline-chevron` — increase opacity from 0.5 to 0.7

**Step 2: Verify** — reload preview, check that company names are blue and company+logo sit on one line on desktop.

---

### Task 2: Timeline HTML — Shorten Syracuse Names + Add Syracuse Logo to Consultant + Groundlings Badge

**Files:**
- Modify: `index.html` HTML (~lines 1335-1800)

**Step 1: Groundlings badge**

On the Groundlings entry (~line 1338), after the role text "Improvisational Performance Track", add an inline badge:
```html
<div class="timeline-role">Improvisational Performance Track <span class="timeline-badge">✦ Personal Growth</span></div>
```

Add CSS for `.timeline-badge`:
```css
.timeline-badge {
  display: inline-block; font-size: 0.6rem; font-weight: 600;
  background: rgba(100,85,191,0.08); color: var(--accent);
  padding: 0.15rem 0.5rem; border-radius: 100px;
  margin-left: 0.5rem; vertical-align: middle;
  letter-spacing: 0.03em; text-transform: uppercase;
}
```

**Step 2: Graduate Student Consultant — add logo**

Replace the simple `.timeline-company` div (~line 1453) with the `.timeline-company-row` + `.company-logos` pattern:
```html
<div class="timeline-company-row">
  <div class="timeline-company">Syracuse University &nbsp;·&nbsp; Syracuse, NY</div>
  <div class="company-logos">
    <img src="images/logos/syracuse-seal.webp" class="company-logo" alt="Syracuse University" style="height:34px;" loading="lazy">
  </div>
</div>
```

**Step 3: Shorten education Syracuse names**

- Master's (~line 1739): Change "Syracuse University, Martin J. Whitman School of Management" → "Syracuse University"
- Bachelor's (~line 1771): Change "S.I. Newhouse School of Public Communications, Syracuse University" → "Syracuse University"

**Step 4: Add title attribute to all timeline-header elements**

Add `title="Click to expand"` to each `.timeline-header` div.

---

### Task 3: Friends School of Baltimore — Education Entry

**Files:**
- Modify: `index.html` HTML (after Bachelor's entry, ~line 1798)

**Step 1: Add entry**

After the Bachelor's timeline-item closing `</div>`, add:
```html
<div class="timeline-item reveal">
  <div class="timeline-header" title="Click to expand" onclick="this.parentElement.classList.toggle('expanded'); var d=this.nextElementSibling; if(d.style.maxHeight){d.style.maxHeight=null;}else{d.style.maxHeight=d.scrollHeight+'px';}">
    <div>
      <div class="timeline-period">2016</div>
      <div class="timeline-role">High School Diploma</div>
      <div class="timeline-company-row">
        <div class="timeline-company">The Friends School of Baltimore &nbsp;·&nbsp; Baltimore, MD</div>
        <div class="company-logos">
          <img src="images/Friends School Logo/Friends School of Baltimore Logo.png.webp" class="company-logo" alt="The Friends School of Baltimore" style="height:34px;" loading="lazy">
        </div>
      </div>
    </div>
    <svg class="timeline-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>
  </div>
  <div class="timeline-details">
    <div class="timeline-details-inner">
      <div class="timeline-tags">
        <span class="timeline-tag">Baltimore</span>
        <span class="timeline-tag">College Prep</span>
        <span class="timeline-tag">Quaker Values</span>
      </div>
    </div>
  </div>
</div>
```

Note: Confirm graduation year with user if 2016 is wrong.

---

### Task 4: Marquee Hover Magnify + Click Info Overlay

**Files:**
- Modify: `index.html` CSS (~lines 623-654) and new JS block

**Step 1: CSS changes**

Remove `pointer-events: none` from `.marquee-track img` (line 634). Add hover styles:

```css
.marquee-track img {
  /* existing styles minus pointer-events: none */
  transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
  cursor: pointer;
  position: relative;
}
.marquee-track img:hover {
  transform: scale(1.35);
  z-index: 2;
}
```

Add overlay styles:
```css
.marquee-info-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.7);
  color: #fff; display: flex;
  align-items: center; justify-content: center;
  text-align: center; font-size: 0.65rem;
  font-weight: 600; padding: 0.25rem;
  border-radius: 6px; pointer-events: none;
  line-height: 1.2;
}
```

**Step 2: Wrap images for overlay positioning**

Each `<img>` in the marquee track needs a wrapper `<span style="position:relative; display:inline-block; flex-shrink:0; margin-right:14px;">` so the overlay can be absolutely positioned. Move `margin-right` from img to wrapper.

**Step 3: JS — click handler**

Add a script block that:
1. Adds click listeners to all `.marquee-track img` elements
2. On click, creates/toggles a `.marquee-info-overlay` div with the image's `alt` text
3. Clicking elsewhere or clicking again removes it

---

### Task 5: Pool Photo + Floating Essay Title

**Files:**
- Modify: `index.html` CSS (essay styles ~lines 525-576) and HTML (~lines 1833-1867)

**Step 1: Add pool-float keyframes**

```css
@keyframes pool-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
```

**Step 2: Update essay title style**

Add to `.essay-title`:
```css
animation: pool-float 3s ease-in-out infinite;
text-shadow: 0 0 20px rgba(100, 180, 255, 0.3), 0 0 40px rgba(100, 180, 255, 0.1);
```

Add reduced-motion override:
```css
@media (prefers-reduced-motion: reduce) {
  .essay-title { animation: none; }
}
```

**Step 3: Add pool photo HTML**

Before the `.essay-card` div, add:
```html
<div class="essay-photo reveal reveal-delay-3" style="margin-bottom:1.5rem;">
  <img src="images/Essay Photo/Pool Parties Photo.jpg" alt="Pool party photo" style="width:100%; border-radius:12px; display:block;" loading="lazy">
</div>
```

---

### Task 6: Section Restructure — Creative Side + Volunteer Integration

**Files:**
- Modify: `index.html` HTML (sections from ~lines 1833-2290)

This is the biggest structural change. The new section order after Experience/Franchises:

1. **Creative Side** (was Writing) — essay + personal photos
2. **Interests** — unchanged
3. **Giving Back** (Volunteer) — firefighter hero card + existing volunteer cards
4. **Cats/Pong** — moved last, tongue-in-cheek "reward" reference
5. **Contact** — unchanged

**Step 1: Rename Writing section**

- Change section label "Writing" → "Creative Side"
- Change section title to "Things I've written & captured" or similar
- Change hero CTA button text "Read My Writing" → "See My Creative Side"

**Step 2: Move personal photos into Creative Side section**

Take the personal photos grid from Photography section (~lines 2180-2197) and move it after the essay card, before `</section>` of the writing/creative section.

**Step 3: Move firefighter event into Volunteer section**

Take the `.photo-event-feature` block from Photography (~lines 2146-2175) and move it into the Volunteer section as the first card above the volunteer-grid.

**Step 4: Add volunteer intro line**

After the divider in the Volunteer section, add:
```html
<p class="writing-intro reveal reveal-delay-2" style="margin-bottom:2rem;">
  Giving back matters to me. Whether it's coaching kids, honoring first responders, or supporting independent filmmakers, I try to show up.
</p>
```

**Step 5: Delete the Photography section entirely**

Remove the Photography `<section>` since its content has been redistributed.

**Step 6: Reorder Cats/Pong section**

Move the Cats/Pong section to after Volunteer and before Contact. Update the section label from "The Important Stuff" to something like "You Made It" or add a subtitle: "Your reward for scrolling this far."

**Step 7: Update nav links**

Remove "Photography" from nav if present. Ensure section IDs and anchor links still work.

---

### Task 7: Verify + Commit

**Step 1:** Reload preview, scroll through entire site checking:
- Timeline company rows on one line (desktop)
- Company names in blue
- Groundlings badge visible
- Marquee hover magnifies, click shows info
- Pool photo above essay, floating title
- Creative Side section with photos below essay
- Firefighter in Volunteer section
- Cats/Pong last with reward copy
- Friends School in education
- All lightbox galleries still work
- Mobile responsive check

**Step 2:** Commit all changes.
