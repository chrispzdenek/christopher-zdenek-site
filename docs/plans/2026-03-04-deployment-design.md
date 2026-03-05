# Deployment Design — christopherzdenek.com

**Date:** 2026-03-04
**Platform:** Netlify (free tier)
**Domain:** Free subdomain initially (christopherzdenek.netlify.app), custom domain later

---

## 1. Image Optimization

The site is ~143MB, mostly images and two ~30MB coaching videos. Before deploying:

- **Compress JPGs > 500KB** — target ~80% quality, max 1600px wide for full photos, proportional for smaller images
- **Convert large PNGs to WebP** where the browser already supports it (logos, sprites, thumbnails)
- **Coaching videos** — compress or consider external hosting (YouTube unlisted embed) since they're 60MB combined
- **Update `index.html`** references if any filenames change (e.g., `.png` → `.webp`)

Target: reduce total image payload from ~135MB to ~20-30MB.

## 2. GitHub Repository

- Create a public GitHub repo (e.g., `christopher-zdenek-site`)
- Push the full project including optimized images
- `.gitignore` already handles `.DS_Store`

## 3. Netlify Deployment

- Connect GitHub repo to Netlify via the Netlify CLI or dashboard
- **Build command:** none (static site, no build step)
- **Publish directory:** root `/`
- Auto-deploys on every push to `main`
- Free subdomain: `christopherzdenek.netlify.app`

## 4. Post-Deploy Verification

- All images load correctly
- Lightbox galleries work
- Mobile responsive
- Video playback
- All nav links and scroll anchors work
- OG meta tags render correctly (test with social share preview tools)
