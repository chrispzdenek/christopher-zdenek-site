# Design — "Things I'm building" Projects Section

**Date:** 2026-04-16
**Branch:** refactor/extract-inline-assets

## Context

Christopher's site shows his traditional entertainment-industry career (Gotham Group, Paramount, Nickelodeon, Syracuse) but nothing about the AI-augmented dev work he's been doing outside of that — despite having 15+ shipped projects. A recruiter scanning the site today would see him as an entertainment assistant, not an AI-native builder who ships production apps in days. This section fixes that.

**Intended audience:** balanced — primarily recruiters who should see "wait, he also builds real stuff with AI," secondarily potential freelance collaborators. **Explicitly NOT a services page** — no pricing, no tiers, no proposals. Just proof-of-capability.

## Placement

Inserted between `#franchises` ("Stories I've helped ship") and `#writing` ("Things I've written & captured"). New section order becomes:

1. Hero → About → Experience → Franchises → **Projects** → Writing → Interests → Volunteer → Cats → Contact

Rationale: tells a capability ladder — *where I've worked → IP I contributed to → AI/dev work I've shipped → creative writing*. Above-the-fold-ish for a recruiter scrolling, but not the first thing below the traditional resume (that stays the anchor).

## Structure

**Anatomy:**
- Kicker: `BUILDING`
- H2: **"Things I'm building"**
- Lede (~2 sentences), adapted from the side-business positioning doc:
  > *"I use AI-powered development tools to ship production-quality web apps in hours, not weeks. Full-stack applications, real data, real users — built for entertainment, built for life."*
- Project grid (7 cards)
- Soft closing line: *"Available for select freelance work — [chrispzdenek@gmail.com](mailto:chrispzdenek@gmail.com)"* — no pricing, no pitch.

**Card style:** reuses the existing `.interest-card` component so the section visually harmonizes with Interests. No new CSS beyond minor chip styling.

**Card anatomy (per project):**
- Icon/monogram (optional — SVG glyph matching project vibe)
- Project name (h3)
- One-line tagline (15–20 words)
- 1–2 sentence description (40–60 words)
- Tech chips (e.g. `React` `Firebase` `Claude API`)
- Link: **Visit →** for public deploys (new tab, `rel="noopener"`); **View details →** for private/internal tools (opens existing project-modal UI, consistent with Interests)

## Projects featured (7)

| # | Project | Tagline | Platform | Audience signal |
|---|---|---|---|---|
| 1 | **Entertainment Command Centers** | Operational dashboards for a management company and a production company (names intentionally omitted) | Firebase Hosting | Real clients, entertainment enterprise — consolidated from McChief of Staff + 72nd Street Command Center, framed vaguely |
| 2 | **Operation Doomsday** | AI-powered murder-mystery party game with Gemini-generated plots | Fly.io (`murder-mystery-party`) | AI-native, playful, Docker deploy |
| 3 | **PopPick** | Movie/TV recommendation app with real-time bracket voting | Vercel + Railway | Consumer app, full-stack, entertainment-adjacent |
| 4 | **Wedding Command Center** | Multi-tenant wedding-planning SaaS built from my own wedding needs | Vercel + Neon Postgres | Commercial SaaS thinking |
| 5 | **SpaceWork** | Solo performance practice for improv, acting, and singing | Vercel PWA | Personal passion + broader performance scope (not just improv) |
| 6 | **JamNest** | Music creation + learning companion (hum → MIDI, arrangement, theory, DJ tools) | Vercel + Railway | AI music, education, DJ tooling |
| 7 | **Divvy** | Shared-expense & reputation PWA — social contract around splitting bills | Vercel + Supabase | Universal / social utility, AI-augmented |

Public URLs will be filled in during implementation from each project's `DEPLOYMENT.md`.

**Design notes on framing** (per feedback 2026-04-16):
- Command centers card intentionally omits client company names ("a management company and a production company") — keeps it professional without implying name-dropping.
- SpaceWork description broadened beyond improv to cover singing + acting + the full performance-practice scope; references to "Groundlings" / "UCB" / "Intermediate" removed to avoid any appearance of appropriating their specific curriculum — replaced with "fundamentals from the top improv schools."
- VoxMuse name dropped entirely; project is only "JamNest" now. Copy expanded to cover DJ workflow tools and learn-by-doing education in addition to hum→MIDI.

## Copy (first draft — each card)

Written to 40–60 words per description, one tagline line. Tech chips are 2–3 items each, not a full stack dump.

**1. Entertainment Command Centers**
> *Operational command centers for a management company and a production company.*
> Two internal platforms replacing spreadsheets, email threads, and slide decks with 40+ interconnected modules: talent + IP tracking, project pipelines, submissions management, call sheets, location scouting with shared team maps, script coverage, automated morning briefings and weekly reports, competitive intel, and one-click deck generation from live data. Built to let entertainment teams see everything in one place and move across every function seamlessly.
> `React` · `Firebase` · `PPTX Generation`

**2. Operation Doomsday**
> *Host a murder-mystery party in under 10 minutes — AI writes the plot, cast, and clues.*
> Gemini generates a full scenario from a theme prompt; Three.js handles ambient visuals; the game state syncs across players' phones during play. Containerized and deployed on Fly.io.
> `Next.js` · `Gemini` · `Three.js`

**3. PopPick**
> *Movie and TV recommendation app with real-time "pick-or-pass" bracket voting.*
> Full-stack PWA with 6,000+ cached movies, group bracket sessions, and a recommendation engine that learns from your passes. 255+ commits of polish.
> `React` · `Express` · `PostgreSQL`

**4. Wedding Command Center**
> *A wedding-planning command center that grew into a multi-tenant SaaS.*
> Built from scratch to run my own wedding, now being rebuilt as a Zola/Joy/TheKnot alternative with budget tools, RSVPs, vendor tracking, and a public guest site per couple.
> `Next.js` · `Neon Postgres`

**5. SpaceWork**
> *A solo performance practice companion for improv, acting, and singing.*
> Offline-first drills for improv scenework and character, exercises for actors working on scripts and technique, and a vocalist toolkit with a vocal-range finder, song catalog, and karaoke-style practice for finding what's actually in your range. Everything a working performer needs for the hotel-room rehearsal, on their phone.
> `React` · `Vite` · `Dexie`

**6. JamNest**
> *A music creation, learning, and DJ companion for non-classically-trained musicians.*
> Hum or sing a melody → get MIDI, a full arrangement, and plain-English theory that explains why it works. No instrument required — your voice is the input. Includes a DJ workspace, an academy with learn-by-doing lessons and challenges, collaboration with other artists, and tools for genre, notation, and transcription.
> `React` · `FastAPI` · `Claude API`

**7. Divvy**
> *Shared-expense splitting built around trust and reputation, not receipts.*
> A social-contract layer over bill splitting: group agreements, reputation scores, and dispute resolution. Designed for the roommate / travel-group case that Splitwise doesn't quite solve.
> `React` · `Supabase`

## Technical implementation notes

- **Section HTML** goes into `index.html` as a new `<section id="projects">` inserted between `#franchises` and `#writing` (around line ~840 in the current refactored file).
- **CSS:** reuse `.interest-card` and `.interest-grid` rules verbatim; add only `.project-card-link` styling (underlined arrow link color, hover). Likely < 30 new CSS lines in `styles.css`.
- **JS:** if private/internal projects use "View details →" → wire into the existing `projectModal` with a new `projectData` array in `scripts/main.js`. If every project has a public URL, no JS change needed at all — just `<a target="_blank">` anchors.
- **Nav:** add a `<li><a href="#projects">Projects</a></li>` into the main nav (position between Creative and Interests, or replace one — tbd during implementation).

## Out of scope (explicitly)

- No services catalog, pricing, tiers, or "work with me" call-to-action.
- No contact form.
- No per-project case-study pages (could be a future add).
- No filter/tag system for the project grid.
- No content hashing for assets (would go with the earlier `_headers` refactor if desired).

## Verification plan

1. Preview desktop (1440×900) in both themes — confirm the new section sits cleanly between Franchises and Writing, card grid reflows, lede reads well.
2. Preview mobile (375×812) in both themes — confirm single-column card stack, tap targets ≥ 44px, tech chips wrap cleanly.
3. Accessibility: each card has a proper `<h3>`, `<a>` with meaningful text, `aria-label` only if needed, tech chips don't get announced as headings.
4. Ensure all Visit → links open in a new tab with `rel="noopener"`.
5. Theme parity: flip dark mode and confirm card backgrounds, text, chip bg, and link color all inherit correctly.
6. Nav: clicking the new Projects link scrolls smoothly to the section.

## Deployment

After verification: merge `refactor/extract-inline-assets` into `main`, `git push origin main` — Netlify auto-deploys from main per `DEPLOYMENT.md`.
