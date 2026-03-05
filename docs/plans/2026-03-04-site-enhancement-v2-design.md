# Site Enhancement V2 — Design Document

**Date:** 2026-03-04
**File:** `/Volumes/Boh/Coding/christopher-zdenek-site/index.html`

---

## 1. Timeline Layout — One-Line Company Row (Desktop)

**Goal:** Company name, location, and logo on a single horizontal line on desktop to reduce vertical whitespace.

**Changes:**
- Desktop (>768px): `.timeline-company-row` gets `flex-wrap: nowrap`
- Shorten Syracuse education company lines:
  - "Syracuse University, Martin J. Whitman School of Management" → "Syracuse University"
  - "S.I. Newhouse School of Public Communications, Syracuse University" → "Syracuse University"
  - Full school names remain in the degree title (`.timeline-role`)
- Add Syracuse logo (`images/logos/syracuse-seal.webp`) to Graduate Student Consultant entry (currently missing)
- Increase `.timeline-chevron` opacity from 0.5 → 0.7 for better expand affordance
- Add `title="Click to expand"` attribute to `.timeline-header` elements

## 2. Company Name Color

- Add `color: var(--accent)` to `.timeline-company` to draw recruiter eyes to recognizable studio/company names
- The existing hover effect (logos go grayscale → color) complements this

## 3. Groundlings Badge

- Add a small inline pill/badge next to "Improvisational Performance Track" role title
- Text: "Personal Growth" with a star/sparkle
- Style: muted background, smaller font, pill shape — similar to timeline-tag but inline with the role

## 4. Film & Album Marquee — Hover Magnify + Click Info

**Hover (CSS):**
- Remove `pointer-events: none` from `.marquee-track img`
- Add `transition: transform 0.3s ease` to posters/albums
- On hover: `transform: scale(1.35); z-index: 2; position: relative;`
- Pause marquee animation on hover (already exists via `.taste-marquee:hover .marquee-track`)

**Click (JS):**
- Clicking a poster/album toggles a dark semi-transparent overlay on the image
- Overlay shows white text: film title (from `alt`) or "Artist — Album" (from `alt`)
- Click again or click elsewhere to dismiss
- Use a small `.marquee-info-overlay` div appended to the image's parent

## 5. Pool Photo + Essay Enhancement

**Pool Photo:**
- Add `images/Essay Photo/Pool Parties Photo.jpg` as a hero image above the essay card
- Style: full-width within the essay container, rounded corners, slight shadow
- `loading="lazy"` since it's below the fold

**Floating Pool Title:**
- CSS `@keyframes pool-float` — gentle `translateY(0) → translateY(-3px) → translateY(0)` over 3s, infinite
- Soft blue `text-shadow: 0 0 20px rgba(100, 180, 255, 0.3)` on `.essay-title`
- Applied only to this specific essay (scoped via parent class or ID)
- Respects `prefers-reduced-motion: reduce`

## 6. Section Restructure

**Current order:** Writing → Interests → Cats/Pong → Volunteer → Photography → Contact

**New order:**
1. **"Creative Side"** section (replaces "Writing")
   - Section label: "Creative Side" instead of "Writing"
   - Section title: something like "A little more about me" or keep "Things I've put to paper"
   - Content: Essay card (with pool photo) + personal photos grid below
   - Hero CTA button text: "See My Creative Side" (replaces "Read My Writing")
2. **Interests** — unchanged
3. **"Giving Back"** (Volunteer) — restructured:
   - Header stays "Recent volunteer work"
   - Add intro line: "Giving back matters to me. Whether it's coaching kids, honoring first responders, or supporting independent filmmakers, I try to show up."
   - Firefighter event moves here as hero/featured card at top (keeps current large dimensions)
   - Basketball coach and Film Festival cards follow in 2-column grid below
   - All three entries share consistent card formatting
4. **Cats/Pong** — moved to last content section (fun send-off before contact)
5. **Contact/Footer** — unchanged

**Photography section dissolves:**
- Firefighter event → Volunteer section (hero card)
- Personal photos → Creative Side section (below essay)
- Photography section removed entirely

## 7. Friends School of Baltimore

- Add as third education entry after Bachelor's degree
- Period: "2016" (graduation year — to be confirmed by user)
- Role: "High School Diploma"
- Company: "The Friends School of Baltimore · Baltimore, MD"
- Logo: `images/Friends School Logo/Friends School of Baltimore Logo.png.webp`
- Details (collapsed): minimal — 1-2 tags like "Baltimore" and "College Prep"
- No detailed description needed

## 8. Hero CTA Rename

- "Read My Writing" button → "See My Creative Side"
- `href="#writing"` stays (section ID stays `#writing` or changes to match)
