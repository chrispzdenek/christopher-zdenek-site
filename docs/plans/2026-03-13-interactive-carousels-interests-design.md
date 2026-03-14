# Interactive Carousels & Interests Design

**Date:** 2026-03-13
**Status:** Approved

## Overview

Add click-to-view-details modals to the film and album carousels, upgrade carousel scrolling to be cursor-responsive (matching the Gotham Group site pattern), and make interest cards clickable with expanded content modals.

## 1. Film Carousel & Modal

### Carousel Upgrade
- Replace CSS `animation: marquee-scroll` with JavaScript-driven continuous scrolling
- Add cursor-responsive speed control:
  - Left 25% of carousel: scrolls backward (right-to-left reversed)
  - Right 25%: scrolls forward faster
  - Center 50%: gentle default scroll speed
  - Speed intensity increases near edges
- Posters become clickable (click opens modal, drag does not)

### Film Modal
- Full-screen overlay with dark semi-transparent backdrop + blur
- Two-column layout:
  - **Left:** Film poster (larger version)
  - **Right:** Title, Year, Director, Genre, Plot summary
- Navigation: prev/next buttons, arrow keys, Escape to close
- Click outside to close
- Data: hardcoded `filmData[]` JS array with metadata for all 20 films

## 2. Album Carousel & Modal

### Carousel Upgrade
- Same cursor-responsive scrolling as films

### Album Modal
- Same overlay pattern as films
- Two-column layout:
  - **Left:** Album cover (larger)
  - **Right:** Album title, Artist, Year, Spotify link (pill button), Apple Music link (pill button)
- Same navigation pattern
- Data: hardcoded `albumData[]` JS array with metadata for all 18 albums

## 3. Interest Modals

### Interaction
- Click any interest card → opens modal overlay
- Same overlay style as film/album modals for consistency

### Modal Content
- Icon + title header
- Expanded personal commentary text
- Optional YouTube video embed (responsive 16:9 iframe)
- Optional photo grid

### Content Plan
- **Pro Wrestling:** Commentary about it being a fascinating part of Americana that blurs the line between reality and narrative. Embedded YouTube video: https://www.youtube.com/watch?v=BQCPj-bGYro
- **Other 7 cards:** Placeholder text expanding on existing descriptions, ready for future content

## 4. Technical Approach

- All code in `index.html` — no new files, no build tools, no external APIs
- New JS data arrays: `filmData[]`, `albumData[]`, `interestData[]`
- One shared modal overlay element, with type-specific render functions
- CSS additions in existing `<style>` block
- Responsive: two-column on desktop, single-column stacked on mobile
- Reuse existing lightbox CSS patterns where possible

## 5. Data Sources

- Film metadata: researched and hardcoded (title, year, director, genre, plot)
- Album metadata: researched and hardcoded (title, artist, year, Spotify URL, Apple Music URL)
- Interest content: manually authored
