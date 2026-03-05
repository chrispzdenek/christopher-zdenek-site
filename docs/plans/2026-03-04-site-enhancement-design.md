# Site Enhancement Design — March 4, 2026

## Overview

Enhance chriszdenek.com with collapsible experience sections, an interactive hero, quick-win polish features, Phosphor icon migration, and deployment to production.

## 1. Experience Section — Collapsible Expand-in-Place

**Goal:** Reduce vertical scroll in the Experience section while allowing more content.

### Collapsed State (default for all items)
- Timeline dot + date range
- Role title (`.timeline-role`)
- Company name + logos row (`.timeline-company-row`)
- Clickable chevron icon (Phosphor `CaretDown`) on the right
- Entire header row is clickable

### Expanded State (on click)
- Smooth expand via CSS `max-height` transition + `overflow: hidden`
- Reveals: description, tags, photo gallery, YouTube embed
- Chevron rotates 180deg to point up
- Subtle background highlight on expanded item
- Multiple items can be open simultaneously

### Implementation
- Wrap expandable content in a `.timeline-details` div
- Add `.timeline-header` wrapper around title/company/date for click target
- CSS: `.timeline-details { max-height: 0; overflow: hidden; transition: max-height 0.4s ease; }`
- JS: On click, calculate `scrollHeight` and set `max-height` to that value
- Apply to both Work and Education timelines

## 2. Hero — Interactive Personality

### 2a. Cursor-Reactive Name Tilt
- `mousemove` on `#hero` calculates offset from center
- Apply `transform: perspective(800px) rotateY(Xdeg) rotateX(Ydeg)` on `.hero-name`
- Max tilt: 3deg. Smooth with CSS `transition: transform 0.1s ease-out`
- Disabled on mobile / touch devices
- Respects `prefers-reduced-motion`

### 2b. Dynamic Time-of-Day Greeting
- Replace static `.hero-eyebrow` text with JS-generated greeting
- Before 12pm: "Good morning" / 12-5pm: "Good afternoon" / 5pm+: "Good evening"
- Fallback: keep static text for no-JS

### 2c. "Currently" Status Pill
- New element below `.hero-tagline`
- Pulsing green dot + "Currently at The Groundlings"
- Styled as a small pill/badge
- Easy to update (single text string)

### 2d. Continuous Tag Rotation
- Make the `.hero-tag-rotate` cycle continuously (loop back to first tag after last)
- 3-second interval between transitions

### 2e. Film Grain Overlay
- CSS `::after` pseudo-element on `#hero` with a base64 noise PNG
- `opacity: 0.03`, `pointer-events: none`, covers full hero
- Subtle animated position shift for "living" grain effect

## 3. Quick Wins

### 3a. Active Nav Highlighting
- `IntersectionObserver` on each section
- Toggle `.nav-active` class on corresponding nav link
- Style: subtle underline or color change to `var(--navy)`

### 3b. Scroll Progress Bar
- Thin (2px) gradient bar at the very top of viewport, above nav
- Width tied to `scrollY / (docHeight - viewportHeight) * 100%`
- Uses CSS `position: fixed; top: 0; z-index: 1001`

### 3c. Stat Counter Animations
- `IntersectionObserver` on `.stat-number` elements
- Animate from 0 to target value over 1.5s using `requestAnimationFrame`
- Parse target from text content (handle "10+", "25+", "2x", "2")
- Only animate once (flag to prevent re-triggering)

### 3d. Marquee Pause on Hover
- CSS: `.taste-marquee:hover .marquee-track { animation-play-state: paused; }`
- Tooltip on hover over individual posters/covers showing alt text

### 3e. Lazy Loading
- Add `loading="lazy"` to all `<img>` tags below the fold
- Exclude: headshot (above fold in about), hero content

### 3f. Open Graph Meta Tags
- `og:title`: "Christopher Zdenek"
- `og:description`: summary tagline
- `og:image`: headshot or a designed OG card
- `og:url`: chriszdenek.com
- Twitter card tags

### 3g. Return-to-Top Button
- Fixed position, bottom-right, appears after scrolling past hero
- Phosphor `ArrowUp` icon in a small circle
- Smooth scroll to top on click
- Fade in/out with CSS transition

### 3h. Nav Dark/Light Adaptation
- `IntersectionObserver` on dark sections (`#writing`, `#photography`, `#contact`)
- When dark section is under the nav, add `.nav-dark` class to `<nav>`
- `.nav-dark`: white text, dark frosted glass background
- Smooth color transition

### 3i. Magnetic Buttons
- `mousemove` on `.btn` elements in hero
- Calculate offset from button center, apply small translate (max 4px)
- Reset on `mouseleave`
- Desktop only

## 4. Phosphor Icons Migration

Replace all inline SVG icons with Phosphor equivalents:

| Current | Phosphor Replacement |
|---------|---------------------|
| Music note (interests) | `MusicNotes` |
| Film/TV (interests) | `FilmSlate` |
| Pen/animation (interests) | `PaintBrush` |
| Lightning/wrestling (interests) | `Lightning` |
| Globe/basketball (interests) | `Basketball` |
| Heart/cats (interests) | `Cat` |
| Trophy/sports (interests) | `Trophy` |
| Pen/writing (interests) | `PencilLine` |
| Headphones/music (interests) | `Headphones` |
| Mic/karaoke (interests) | `Microphone` |
| Mail (contact) | `EnvelopeSimple` |
| Map pin (contact) | `MapPin` |
| Chevron for expand | `CaretDown` |
| Arrow up for back-to-top | `ArrowUp` |

Implementation: Use Phosphor SVGs inline (copy from phosphor-icons.com). No CDN dependency — keeps it fast and self-contained.

## 5. Deployment Plan

### Step-by-step for tonight:

1. **Purchase domain**: `chriszdenek.com` on Namecheap (~$10/year)
2. **Create Netlify account**: Sign up at netlify.com (free)
3. **Initial deploy**: Drag project folder into Netlify deploy zone
4. **Verify**: Site live at `[random].netlify.app`
5. **Add custom domain**: In Netlify dashboard > Domain settings > Add `chriszdenek.com`
6. **Configure DNS**: In Namecheap, set nameservers to Netlify's provided values
7. **Wait for propagation**: 10-60 minutes for DNS
8. **Enable HTTPS**: Netlify auto-provisions SSL certificate
9. **Connect GitHub repo** (optional, for auto-deploy): Push code to GitHub, connect repo in Netlify settings, set deploy branch to `main`

### Ongoing workflow:
- Edit locally, preview in browser
- `git push` to deploy automatically
- Netlify provides deploy previews for branches
