# Mobile Fullscreen Cat Pong — Design

**Date:** 2026-03-05

## Overview

On mobile devices, tapping "Start Game" triggers a fullscreen landscape experience for Cat Pong. Desktop is completely untouched.

## Flow

1. Mobile user taps "Start Game" → `.pong-section` goes fullscreen
2. If portrait → "Rotate your phone" overlay with rotating phone icon
3. Once landscape detected → canvas resizes to fill screen, game begins
4. Exit button (X) in corner to leave fullscreen at any time
5. Game end: "Play Again" stays fullscreen, "Exit" returns to normal page

## Technical Approach

### Fullscreen
- **Android/Chrome**: `element.requestFullscreen()` API
- **iOS Safari fallback**: CSS-based fake fullscreen (`position: fixed; inset: 0; z-index: 9999`) since iOS doesn't support Fullscreen API

### Orientation Detection
- `window.matchMedia('(orientation: landscape)')` — universal support
- Show/hide rotate overlay based on orientation changes

### Canvas Resize
- On entering fullscreen landscape: recalculate canvas dimensions to fill viewport (`window.innerWidth` x `window.innerHeight`)
- Update internal W/H constants, re-scale for retina
- On exit: restore original 700x400

### Touch Controls
- Already implemented (touchstart/touchmove on canvas) — works as-is

### Mobile Gate
- All fullscreen logic gated behind `window.innerWidth <= 768` or touch device detection
- Desktop experience: zero changes

### UI in Fullscreen
- Cat selection buttons + score row reposition for landscape layout
- Instructions text changes to "Drag to move your cat"
- Close/exit button in top-right corner
