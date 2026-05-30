# Deployment Guide - Christopher Zdenek Personal Site

## Hosting & Deployment
- **Platform:** Netlify + Cloudflare Workers
- **URL:** Custom domain (see CNAME file)
- **Deploy Command:** `git push` (Netlify auto-deploys from repo) or `netlify deploy --prod`

## Services Used
- Netlify: Static site hosting with auto-deploy from git
- Cloudflare Workers: Edge functions

## Environment Variables
- Check Netlify dashboard and Cloudflare Workers dashboard for any configured env vars

## Local Development
- **No build step.** This is a static site (plain HTML/CSS/JS) — there is no `package.json`.
- **Run a local server** (any static server works), e.g.:
  - `npx http-server . -p 8090 -c-1`
  - `python3 -m http.server 8090`
- Then open `http://localhost:8090/`.
- **Edit directly:** `index.html`, `pool-parties.html`, `styles.css`, `scripts/main.js`, `scripts/pong.js`.

## Images & Performance
- Heavy referenced JPEGs have optimized `.webp` siblings (e.g. `images/headshot.jpg.webp`),
  wired via `<picture><source type="image/webp">` with the original JPEG as the `<img>` fallback.
- Regenerate WebP after replacing a source image: `cwebp -q 82 input.jpg -o input.jpg.webp`
  (keep dimensions identical to the original — never distort).
- All `<img>` should carry explicit `width`/`height`, `loading="lazy"` (except above-the-fold),
  and `decoding="async"`.

## Notes
- Has `.netlify/` directory for Netlify project linking
- Has `.wrangler/` directory for Cloudflare Workers configuration
- Has `CNAME` file for custom domain configuration
- Netlify auto-deploys on push to the connected branch
- Cloudflare Workers handle edge function logic
