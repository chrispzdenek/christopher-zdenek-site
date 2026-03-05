# Site Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add collapsible experience sections, interactive hero, UX polish features, Phosphor icons, and deployment readiness to chriszdenek.com.

**Architecture:** Single-file static HTML site (index.html) with all CSS in `<style>` and JS in `<script>` blocks. No build tools, no package.json. All changes are edits to index.html. Phosphor icons are inlined as SVGs (no CDN). Verification is visual via preview tools.

**Tech Stack:** HTML, CSS, vanilla JS, Phosphor Icons (inline SVG)

---

### Task 1: Collapsible Experience Section — CSS

**Files:**
- Modify: `index.html` (CSS section, around lines 312-372)

**Step 1: Add collapsible timeline CSS**

Add after the existing `.timeline-tag` styles (around line 353):

```css
/* ── Collapsible Timeline ── */
.timeline-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  cursor: pointer; gap: 1rem;
  padding: 0.5rem 0;
  border-radius: 8px;
  transition: background 0.2s;
}
.timeline-header:hover {
  background: rgba(0,0,0,0.02);
  margin: 0 -0.75rem; padding: 0.5rem 0.75rem;
}
.timeline-chevron {
  flex-shrink: 0; margin-top: 0.6rem;
  transition: transform 0.3s ease;
  color: var(--muted); opacity: 0.5;
}
.timeline-item.expanded .timeline-chevron {
  transform: rotate(180deg);
}
.timeline-details {
  max-height: 0; overflow: hidden;
  transition: max-height 0.45s cubic-bezier(0.25, 0.1, 0.25, 1),
              opacity 0.35s ease;
  opacity: 0;
}
.timeline-item.expanded .timeline-details {
  opacity: 1;
}
.timeline-details-inner {
  padding-top: 0.75rem;
}
```

**Step 2: Verify CSS compiles (no syntax errors)**

Open the site in preview, check for console errors.

**Step 3: Commit**

```bash
git add index.html
git commit -m "style: add collapsible timeline CSS"
```

---

### Task 2: Collapsible Experience Section — HTML Restructuring

**Files:**
- Modify: `index.html` (Experience section, lines ~1162-1525)

**Step 1: Restructure each timeline item**

For EVERY `.timeline-item` in both Work and Education sections, wrap the content into a clickable header and collapsible details. The pattern for each item:

```html
<div class="timeline-item reveal">
  <div class="timeline-header" onclick="this.parentElement.classList.toggle('expanded'); var d=this.nextElementSibling; if(d.style.maxHeight){d.style.maxHeight=null;}else{d.style.maxHeight=d.scrollHeight+'px';}">
    <div>
      <div class="timeline-period">DATE</div>
      <div class="timeline-role">ROLE TITLE</div>
      <div class="timeline-company-row">
        <div class="timeline-company">COMPANY</div>
        <div class="company-logos"><!-- logos --></div>
      </div>
    </div>
    <svg class="timeline-chevron" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"/></svg>
  </div>
  <div class="timeline-details">
    <div class="timeline-details-inner">
      <div class="timeline-desc">DESCRIPTION</div>
      <div class="timeline-tags"><!-- tags --></div>
      <!-- photo grids, youtube embeds if any -->
    </div>
  </div>
</div>
```

Apply this pattern to all 12 work items and 2 education items. The header contains: period, role, company-row. The details contains: desc, tags, photo-thumb-grid, yt-thumb-link.

Note: The Phosphor CaretDown SVG path used above is: `M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z`

**Step 2: Verify in preview**

- All items should show collapsed (period + role + company only)
- Clicking an item should expand to show description, tags, photos
- Multiple items can be open at once
- Chevron rotates on expand

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: make experience timeline items collapsible"
```

---

### Task 3: Hero — Cursor-Reactive Name Tilt

**Files:**
- Modify: `index.html` (add JS before closing `</body>`, and add CSS)

**Step 1: Add CSS for tilt transition**

Add to the hero CSS section (after `.hero-name` styles, ~line 114):

```css
.hero-name {
  /* existing styles... */
  transition: transform 0.15s ease-out;
  will-change: transform;
}
```

**Step 2: Add tilt JS**

Add a new `<script>` block before the closing `</body>`:

```javascript
/* ── Hero cursor tilt ── */
(function() {
  var hero = document.getElementById('hero');
  var name = document.querySelector('.hero-name');
  if (!hero || !name) return;
  var isMobile = 'ontouchstart' in window;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isMobile || prefersReduced) return;

  hero.addEventListener('mousemove', function(e) {
    var rect = hero.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;  // -0.5 to 0.5
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    var maxTilt = 3;
    name.style.transform = 'perspective(800px) rotateY(' + (x * maxTilt) + 'deg) rotateX(' + (-y * maxTilt) + 'deg)';
  });

  hero.addEventListener('mouseleave', function() {
    name.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
  });
})();
```

**Step 3: Verify in preview**

- Move cursor over hero — name should subtly tilt following cursor
- Leave hero — name returns to flat
- On mobile (resize to mobile preset) — no tilt behavior

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add cursor-reactive tilt to hero name"
```

---

### Task 4: Hero — Time-of-Day Greeting + Currently Status Pill

**Files:**
- Modify: `index.html` (hero HTML ~line 1087-1103, CSS, and JS)

**Step 1: Add "Currently" pill CSS**

Add to CSS section:

```css
/* ── Currently status pill ── */
.hero-currently {
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 1rem; border-radius: 100px;
  background: rgba(0,0,0,0.04);
  border: 1px solid rgba(0,0,0,0.08);
  font-size: 0.8rem; color: var(--muted);
  margin-bottom: 1.5rem;
}
.hero-currently-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #34c759;
  animation: pulse-dot 2s ease-in-out infinite;
}
@keyframes pulse-dot {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52,199,89,0.4); }
  50% { opacity: 0.7; box-shadow: 0 0 0 5px rgba(52,199,89,0); }
}
```

**Step 2: Update hero HTML**

Change the hero-eyebrow to have an id for JS targeting. Add the currently pill after the tagline:

```html
<p class="hero-eyebrow hero-enter hero-enter-1" id="heroGreeting">Welcome</p>
```

And after the `.hero-tagline`, before `.hero-tags`:

```html
<div class="hero-currently hero-enter hero-enter-3">
  <span class="hero-currently-dot"></span>
  Currently at The Groundlings
</div>
```

Adjust hero-enter delay numbers so the currently pill is sequenced in.

**Step 3: Add greeting JS**

```javascript
/* ── Time-of-day greeting ── */
(function() {
  var el = document.getElementById('heroGreeting');
  if (!el) return;
  var h = new Date().getHours();
  var greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  el.textContent = greeting;
})();
```

**Step 4: Verify in preview**

- Eyebrow shows appropriate greeting for current time
- Green pulsing dot visible next to "Currently at The Groundlings"
- Both animate in with the hero entrance sequence

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add time greeting and currently status pill to hero"
```

---

### Task 5: Hero — Continuous Tag Rotation + Film Grain

**Files:**
- Modify: `index.html` (rotating tag script ~lines 2911-2946, hero CSS)

**Step 1: Make tag rotation loop continuously**

In the rotating hero pill script, change the `advance()` function to loop instead of stopping:

```javascript
function advance() {
  idx = (idx + 1) % phrases.length;
  // ... rest of function unchanged, but remove the clearInterval line
}
```

Remove: `if (idx >= phrases.length) { clearInterval(timer); return; }`

**Step 2: Add film grain CSS**

Add to hero CSS:

```css
#hero::after {
  content: '';
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.025;
  pointer-events: none;
  z-index: 1;
  mix-blend-mode: multiply;
}
```

**Step 3: Verify**

- Tags cycle continuously through all phrases and loop back
- Very subtle noise texture visible on hero background (barely perceptible)

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: continuous tag rotation and film grain on hero"
```

---

### Task 6: Active Nav Highlighting + Scroll Progress Bar

**Files:**
- Modify: `index.html` (CSS and JS)

**Step 1: Add progress bar HTML + CSS**

Add right after `<body>` (before `<nav>`):

```html
<div class="scroll-progress" id="scrollProgress"></div>
```

CSS:

```css
/* ── Scroll progress bar ── */
.scroll-progress {
  position: fixed; top: 0; left: 0; height: 2px;
  background: linear-gradient(90deg, var(--accent), #5b4fbf);
  width: 0%; z-index: 1001;
  transition: width 0.1s linear;
}

/* ── Active nav link ── */
.nav-links a.nav-active {
  color: var(--navy);
}
.nav-links a.nav-active::after {
  content: ''; display: block;
  width: 100%; height: 1.5px;
  background: var(--navy);
  margin-top: 2px; border-radius: 1px;
}
```

**Step 2: Add JS for both features**

```javascript
/* ── Scroll progress + active nav ── */
(function() {
  var progressBar = document.getElementById('scrollProgress');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var sections = [];
  navLinks.forEach(function(link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) sections.push({ el: section, link: link });
  });

  function onScroll() {
    // Progress bar
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';

    // Active nav
    var current = '';
    sections.forEach(function(s) {
      var rect = s.el.getBoundingClientRect();
      if (rect.top <= 100) current = s.link.getAttribute('href').slice(1);
    });
    navLinks.forEach(function(link) {
      link.classList.toggle('nav-active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
```

**Step 3: Verify**

- Thin gradient bar at top of page grows as you scroll
- Nav links highlight as you scroll through sections

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: scroll progress bar and active nav highlighting"
```

---

### Task 7: Nav Dark/Light Adaptation

**Files:**
- Modify: `index.html` (CSS and JS)

**Step 1: Add nav-dark CSS**

```css
/* ── Nav dark mode adaptation ── */
nav.nav-dark {
  background: rgba(29,29,31,0.88);
  border-bottom-color: rgba(255,255,255,0.07);
}
nav.nav-dark .nav-logo { color: var(--white); }
nav.nav-dark .nav-links a { color: rgba(255,255,255,0.6); }
nav.nav-dark .nav-links a:hover,
nav.nav-dark .nav-links a.nav-active { color: var(--white); }
nav.nav-dark .nav-links a.nav-active::after { background: var(--white); }
nav.nav-dark .nav-hamburger span { background: var(--white); }
nav {
  transition: background 0.3s, border-color 0.3s;
}
nav .nav-logo, nav .nav-links a, nav .nav-hamburger span {
  transition: color 0.3s, background 0.3s;
}
```

**Step 2: Add JS**

```javascript
/* ── Nav dark/light adaptation ── */
(function() {
  var nav = document.querySelector('nav');
  var darkSections = document.querySelectorAll('#writing, #photography, #contact');
  if (!nav || !darkSections.length) return;

  var observer = new IntersectionObserver(function(entries) {
    // Check if any dark section is at the top of the viewport
    var isDark = false;
    darkSections.forEach(function(section) {
      var rect = section.getBoundingClientRect();
      if (rect.top <= 60 && rect.bottom >= 60) isDark = true;
    });
    nav.classList.toggle('nav-dark', isDark);
  }, { threshold: [0], rootMargin: '-59px 0px -90% 0px' });

  darkSections.forEach(function(s) { observer.observe(s); });

  // Also check on scroll for edge cases
  window.addEventListener('scroll', function() {
    var isDark = false;
    darkSections.forEach(function(section) {
      var rect = section.getBoundingClientRect();
      if (rect.top <= 60 && rect.bottom >= 60) isDark = true;
    });
    nav.classList.toggle('nav-dark', isDark);
  }, { passive: true });
})();
```

**Step 3: Verify**

- Scroll to Writing section — nav should transition to dark background + white text
- Scroll to Interests section — nav returns to light
- Scroll to Photography — dark again

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: nav adapts dark/light based on current section"
```

---

### Task 8: Stat Counter Animations

**Files:**
- Modify: `index.html` (JS section)

**Step 1: Add counter animation JS**

```javascript
/* ── Stat counter animation ── */
(function() {
  var stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  function animateCounter(el) {
    var text = el.textContent.trim();
    var suffix = '';
    var target = 0;

    // Parse: "10+", "25+", "2×", "2"
    if (text.includes('+')) {
      suffix = '+';
      target = parseInt(text);
    } else if (text.includes('×') || text.includes('x')) {
      suffix = '×';
      target = parseInt(text);
    } else {
      target = parseInt(text);
    }

    if (isNaN(target)) return;

    var duration = 1500;
    var start = performance.now();
    el.textContent = '0' + suffix;

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(function(el) { observer.observe(el); });
})();
```

**Step 2: Verify**

- Scroll to About section — stat numbers count up from 0
- Animation only plays once
- Suffixes (+, ×) preserved

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: animate stat counters on scroll into view"
```

---

### Task 9: Marquee Pause on Hover + Return-to-Top Button

**Files:**
- Modify: `index.html` (CSS and HTML)

**Step 1: Add marquee pause CSS**

```css
.taste-marquee:hover .marquee-track {
  animation-play-state: paused;
}
.marquee-track img {
  position: relative;
}
.marquee-track img:hover::after {
  content: attr(alt);
}
```

Since `::after` doesn't work on `img`, add tooltip via JS instead. Add to a script block:

```javascript
/* ── Marquee hover tooltips ── */
(function() {
  document.querySelectorAll('.marquee-track img').forEach(function(img) {
    img.style.cursor = 'default';
    img.title = img.alt;
  });
})();
```

**Step 2: Add return-to-top button**

HTML (before `</body>`):

```html
<button class="back-to-top" id="backToTop" aria-label="Back to top" onclick="window.scrollTo({top:0,behavior:'smooth'})">
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 256 256" fill="currentColor"><path d="M205.66,165.66a8,8,0,0,1-11.32,0L128,99.31,61.66,165.66a8,8,0,0,1-11.32-11.32l72-72a8,8,0,0,1,11.32,0l72,72A8,8,0,0,1,205.66,165.66Z"/></svg>
</button>
```

CSS:

```css
/* ── Back to top ── */
.back-to-top {
  position: fixed; bottom: 2rem; right: 2rem;
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--navy); color: var(--white);
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s, transform 0.2s;
  z-index: 999;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}
.back-to-top.visible {
  opacity: 1; pointer-events: auto;
}
.back-to-top:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}
```

JS:

```javascript
/* ── Back to top visibility ── */
(function() {
  var btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    btn.classList.toggle('visible', window.scrollY > window.innerHeight);
  }, { passive: true });
})();
```

**Step 3: Verify**

- Hover over film/album marquee — it pauses, shows title tooltip
- Scroll down past hero — back-to-top button fades in at bottom-right
- Click it — smooth scroll to top

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: marquee hover pause + back-to-top button"
```

---

### Task 10: Magnetic Hero Buttons

**Files:**
- Modify: `index.html` (JS)

**Step 1: Add magnetic button JS**

```javascript
/* ── Magnetic buttons ── */
(function() {
  if ('ontouchstart' in window) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.hero-cta .btn').forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      var maxMove = 4;
      btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = '';
    });
  });
})();
```

**Step 2: Verify**

- Hover over "Get to Know Me" or "Read My Writing" — buttons subtly pull toward cursor
- Leave — snaps back

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: magnetic hover effect on hero buttons"
```

---

### Task 11: Phosphor Icons — Replace All Interest Card Icons

**Files:**
- Modify: `index.html` (interests section ~lines 1601-1725)

**Step 1: Replace all 10 interest card SVGs with Phosphor equivalents**

Get SVGs from phosphor-icons.com. Use "regular" weight, 24x24 viewport. Set `fill="none"` and `stroke="var(--accent)"` with `stroke-width="1.5"` (Phosphor uses fill-based, so use `fill="var(--accent)"` for filled variants or the regular weight path data).

Replace each interest card's SVG with the correct Phosphor icon. The mapping:

1. Musical Theater → MusicNotes
2. Film & Television → FilmSlate
3. Animation → PaintBrush
4. Professional Wrestling → Lightning
5. Playing Basketball → Basketball
6. Cat Dad → Cat
7. Sports Fanatic → Trophy
8. Writing → PencilLine
9. Guitar, Trumpet & Ukulele → Guitar (or MusicNotes variant)
10. Karaoke → Microphone

Each SVG follows the Phosphor pattern: `viewBox="0 0 256 256"`, `fill="var(--accent)"`, paths from phosphor-icons.com.

**Step 2: Replace contact card SVGs**

Replace mail icon with Phosphor EnvelopeSimple, map pin with MapPin.

**Step 3: Verify**

- All interest cards show Phosphor-style icons
- Icons are consistent weight and style
- Contact section icons match

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: replace all icons with Phosphor equivalents"
```

---

### Task 12: Lazy Loading + Open Graph Meta Tags

**Files:**
- Modify: `index.html` (head section + img tags throughout)

**Step 1: Add Open Graph meta tags**

In the `<head>`, after the viewport meta tag:

```html
<meta name="description" content="Christopher Zdenek — creativity meets strategy. Entrepreneur, storyteller, and improv performer based in Los Angeles.">
<meta property="og:title" content="Christopher Zdenek">
<meta property="og:description" content="Creativity meets strategy. Entrepreneur, storyteller, and improv performer based in Los Angeles.">
<meta property="og:image" content="images/headshot.jpg">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Christopher Zdenek">
<meta name="twitter:description" content="Creativity meets strategy. Entrepreneur, storyteller, and improv performer.">
<meta name="twitter:image" content="images/headshot.jpg">
```

**Step 2: Add lazy loading to below-fold images**

Add `loading="lazy"` to ALL `<img>` tags EXCEPT the headshot in the about section (which is near the top). This includes:
- Company logos
- Franchise logos
- Work photos
- Cat photos
- Event photos
- Film posters
- Album covers

**Step 3: Verify**

- Page loads — check network tab that below-fold images load lazily
- No visual regressions

**Step 4: Commit**

```bash
git add index.html
git commit -m "feat: add OG meta tags and lazy loading for images"
```

---

### Task 13: Final Visual Polish + Deployment Readiness

**Files:**
- Modify: `index.html`

**Step 1: Add favicon (optional but recommended)**

If a favicon exists, add to `<head>`:
```html
<link rel="icon" type="image/png" href="images/favicon.png">
```

If not, we can create a simple text-based one later or skip for now.

**Step 2: Update .gitignore for deployment**

Ensure `.claude/` and any temp files are excluded. Current .gitignore already has `.DS_Store`.

**Step 3: Full visual verification**

Run through the complete site from top to bottom:
- Hero: greeting, name tilt, currently pill, tags cycling, grain, magnetic buttons
- About: stat counters animate
- Experience: all items collapsed by default, click to expand works
- Nav: progress bar, active highlighting, dark/light switching
- Marquees: pause on hover
- Back-to-top: appears and works
- All Phosphor icons render correctly
- Mobile responsive: test at mobile viewport

**Step 4: Final commit**

```bash
git add -A
git commit -m "polish: final verification and deployment prep"
```

---

## Deployment Steps (Manual — for the user)

These are instructions for the user, not for the implementing agent:

1. Go to namecheap.com → search `chriszdenek.com` → purchase (~$10/yr)
2. Go to netlify.com → sign up (free) → "Add new site" → "Deploy manually"
3. Drag the project folder onto the deploy zone
4. Site is live at `[random-name].netlify.app` — verify it works
5. In Netlify: Domain settings → Add custom domain → `chriszdenek.com`
6. Netlify will show nameserver values (e.g., `dns1.p01.nsone.net`)
7. In Namecheap: Domain List → Manage → Nameservers → Custom DNS → paste Netlify's nameservers
8. Wait 10-60 minutes for DNS propagation
9. Netlify auto-provisions HTTPS certificate
10. Optional: Create GitHub repo, push code, connect to Netlify for auto-deploy on `git push`
