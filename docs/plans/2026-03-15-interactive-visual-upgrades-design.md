# Interactive Visual Upgrades — Design Document

**Date:** 2026-03-15
**Status:** Approved
**Stack:** Vanilla HTML/CSS/JS (no framework, no build step)

---

## Overview

Add three interactive visual features to chriszdenek.com that elevate the site from polished static to immersive — without overwhelming the Apple-inspired design or introducing framework dependencies.

## Feature 1: Hero Particle Field (WebGL Canvas)

### Purpose
Fill the "blank space" in the hero section with a living, interactive background that communicates creativity + technical depth.

### Visuals
- Full-viewport `<canvas>` behind all hero content
- ~120 soft white/blue-tinted particles drifting with Perlin noise movement
- Particles: 1-3px, varying opacity (0.15-0.5)
- Denser at top and edges, thinning toward center — natural frame for the name
- Radial fade-out toward center so text always reads clean
- Constellation effect: faint lines between nearby nodes when cursor is within 150px

### Interaction
- Particles gently repel from cursor (30-40px push radius)
- Connection lines fade based on distance (max ~100px between nodes)
- On mouse leave, particles drift back to natural positions

### Performance & Fallback
- Vanilla WebGL (no Three.js)
- `requestAnimationFrame` loop, ~60fps target
- Canvas resizes on window resize
- Desktop only — mobile keeps existing CSS gradient mesh
- Disabled for `prefers-reduced-motion`
- Replaces current `.hero-gradient-mesh` on desktop

## Feature 2: Glowing Border Effect on Interest Cards

### Purpose
Add a discovery moment to the interest cards — reward cursor exploration with a beautiful proximity glow.

### Visuals
- Gradient glow traces the card border, facing the cursor
- Colors: accent blue (#0066CC) → subtle purple (#6366F1)
- Glow arc: ~80px width along border, soft falloff
- CSS `conic-gradient` + `mask-image` compositing (border-only)
- Intensity scales with proximity — closer = brighter

### Interaction
- Activates when cursor is within ~250px of a card
- Glow angle rotates to always face cursor position
- Multiple cards can glow simultaneously
- Smooth ~200ms easing on opacity/position

### Implementation
- `::before` pseudo-element per card with conic gradient
- JS calculates angle + distance from cursor to each card center
- Updates CSS custom properties (`--glow-angle`, `--glow-opacity`) per card
- Disabled for `prefers-reduced-motion` and touch devices

## Feature 3: About Section 3D Scroll Entrance

### Purpose
Make the first content section after the hero feel like a cinematic reveal — the about block "rises" into view with 3D perspective.

### Visuals
- Transforms from `rotateX(8deg) scale(0.97) translateY(40px) opacity(0.4)` to natural position
- Smooth transition over ~300px of scroll distance
- Subtle box shadow grows during transition
- `perspective(1200px)` on parent, `transform-origin: center top`

### Interaction
- Driven by scroll position via IntersectionObserver + scroll interpolation
- Maps scroll progress (0→1) to transform values
- Locks at final state once complete (no reverse on scroll up)

### Fallback
- Replaces existing flat `.reveal` fade-up on About section
- Falls back to existing reveal for `prefers-reduced-motion`

## What Stays the Same
- Vanilla HTML/CSS/JS, single-file deployment
- All existing features: floating nav, hero cursor glow, staggered reveals, contact shimmer, interest icon hover glow
- Mobile experience unchanged
- `prefers-reduced-motion` respected everywhere

## Constraints
- No React, no build step, no npm dependencies
- No Three.js — vanilla WebGL for the particle field
- All new code goes in `index.html` (inline `<style>` and `<script>`)
- Must not degrade Lighthouse performance score meaningfully
