# Dark Mode Design — chriszdenek.com

**Date:** 2026-03-27
**Status:** Approved

## Decisions

- **Toggle location:** Nav bar (sun/moon icon, left of hamburger on mobile)
- **Initial theme:** OS preference via `prefers-color-scheme`, overridden by localStorage if user has manually toggled
- **Dark sections (#writing, #contact):** Shift to deeper black (#0A0A0A) in dark mode for subtle differentiation
- **Approach:** CSS custom properties override via `[data-theme="dark"]` on `<html>`

## Color Palette

| Variable | Light | Dark |
|---|---|---|
| `--bg` | `#ffffff` | `#141414` |
| `--bg-alt` | `#F5F5F7` | `#1C1C1E` |
| `--bg-elevated` | `#ffffff` | `#2C2C2E` |
| `--text` | `#1D1D1F` | `rgba(255,255,255,0.92)` |
| `--text-secondary` | `#636366` | `rgba(255,255,255,0.55)` |
| `--border` | `rgba(0,0,0,0.06)` | `rgba(255,255,255,0.08)` |
| `--accent` | `#0066CC` | `#4DA3FF` |
| `--navy` | `#1D1D1F` | `#F5F5F7` |
| `--card-bg` | `#ffffff` | `#1C1C1E` |

Dark sections (#writing, #contact) use `#0A0A0A` in dark mode.

## Flash Prevention

Inline `<script>` in `<head>` before CSS:
1. Check localStorage for `theme` key
2. If absent, check `prefers-color-scheme` media query
3. Set `data-theme` on `<html>` synchronously before first paint

## Toggle Behavior

- Sun icon in dark mode, moon icon in light mode
- Smooth icon transition (rotate + fade, 300ms)
- `aria-label` updates with state ("Switch to dark mode" / "Switch to light mode")
- `.theme-transitioning` class added during toggle for 200ms color transitions, removed after to avoid scroll perf impact

## Nav Behavior

- In dark mode: nav is always in `.nav-dark` styling, scroll detection bypassed
- In light mode: existing scroll-based detection continues

## Section Mapping

| Section | Light | Dark |
|---|---|---|
| Hero, About, Franchises, Interests | `--bg` | `--bg` |
| Experience, Volunteer, Cats | `--bg-alt` | `--bg-alt` |
| Writing, Contact | #1D1D1F | #0A0A0A |
| Cards, modals, lightbox | `--card-bg` | `--card-bg` |

## Accessibility

- All pairs maintain WCAG AA 4.5:1 contrast
- Focus outlines: blue on light, bright blue (#4DA3FF) on dark
- `prefers-color-scheme` respected, overridable
- Toggle has `aria-label` that updates with state

## Images & Media

No filters or changes needed — logos already grayscale, photos/posters look fine on dark, particle canvas and Pong assets are theme-agnostic.
