# Interactive Visual Upgrades Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a WebGL particle field to the hero, a glowing border effect on interest cards, and a 3D scroll entrance to the About section — all in vanilla JS with no build step.

**Architecture:** Three independent features added to the single `index.html` file. Each feature gets its own CSS block (before line 1658 `</style>`) and its own `<script>` block (before line 4720 `</body>`). All features gate on desktop + `prefers-reduced-motion` checks.

**Tech Stack:** Vanilla WebGL (canvas 2D for particles), CSS conic-gradient + mask-image (glow), IntersectionObserver + scroll events (3D entrance). No libraries.

---

### Task 1: Hero Particle Field — Canvas Setup & Particle System

**Files:**
- Modify: `index.html:136-150` (replace `.hero-gradient-mesh` CSS with conditional desktop-only display)
- Modify: `index.html:179-182` (update `prefers-reduced-motion` rules)
- Modify: `index.html:1687` (add canvas element alongside gradient mesh)
- Modify: `index.html` (add new `<script>` block before `</body>`)

**Step 1: Add CSS for the particle canvas**

Insert before line 1658 (`</style>`):

```css
/* ─── HERO PARTICLE CANVAS ────────────────────────────── */
.hero-particle-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
/* Hide gradient mesh on desktop when canvas is active */
@media (min-width: 769px) {
  .hero-gradient-mesh { display: none; }
  .hero-particle-canvas { display: block; }
}
@media (max-width: 768px) {
  .hero-particle-canvas { display: none; }
  .hero-gradient-mesh { display: block; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-particle-canvas { display: none; }
  .hero-gradient-mesh { display: block; animation: none; opacity: 0.5; }
}
```

**Step 2: Add canvas element to hero HTML**

After line 1687 (`<div class="hero-gradient-mesh"></div>`), insert:

```html
<canvas class="hero-particle-canvas" id="heroParticles"></canvas>
```

**Step 3: Write the particle system script**

Add a new `<script>` block before `</body>`. The particle system:

```javascript
<!-- ── Hero Particle Field ── -->
<script>
(function() {
  var isMobile = 'ontouchstart' in window || window.innerWidth < 769;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isMobile || prefersReduced) return;

  var canvas = document.getElementById('heroParticles');
  var hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouseX = -1000, mouseY = -1000;
  var PARTICLE_COUNT = 120;
  var CONNECTION_DIST = 100;
  var MOUSE_RADIUS = 150;
  var REPEL_RADIUS = 40;

  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Simple noise-like drift using sin waves
  function createParticle(i) {
    // Bias toward edges: use a distribution that avoids center
    var angle = Math.random() * Math.PI * 2;
    var dist = 0.3 + Math.random() * 0.7; // bias away from center
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var x = cx + Math.cos(angle) * dist * cx;
    var y = cy + Math.sin(angle) * dist * cy;
    // Clamp to canvas
    x = Math.max(10, Math.min(canvas.width - 10, x));
    y = Math.max(10, Math.min(canvas.height - 10, y));
    return {
      x: x, y: y,
      baseX: x, baseY: y,
      size: 1 + Math.random() * 2,
      opacity: 0.15 + Math.random() * 0.35,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
      freq: 0.002 + Math.random() * 0.003
    };
  }

  for (var i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(createParticle(i));
  }

  hero.addEventListener('mousemove', function(e) {
    var rect = hero.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', function() {
    mouseX = -1000;
    mouseY = -1000;
  });

  // Radial fade: particles near center are dimmer
  function centerFade(x, y) {
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var dx = (x - cx) / cx;
    var dy = (y - cy) / cy;
    var dist = Math.sqrt(dx * dx + dy * dy);
    // Full opacity at edges (dist=1), fade to 0.2 at center (dist=0)
    return 0.2 + 0.8 * Math.min(dist / 0.6, 1);
  }

  var time = 0;
  function animate() {
    time++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      // Drift with sin-based noise
      p.x = p.baseX + Math.sin(time * p.freq + p.phase) * 20;
      p.y = p.baseY + Math.cos(time * p.freq * 0.7 + p.phase) * 15;
      // Slow base drift
      p.baseX += p.speedX;
      p.baseY += p.speedY;
      // Bounce off edges
      if (p.baseX < 10 || p.baseX > canvas.width - 10) p.speedX *= -1;
      if (p.baseY < 10 || p.baseY > canvas.height - 10) p.speedY *= -1;

      // Mouse repulsion
      var dmx = p.x - mouseX;
      var dmy = p.y - mouseY;
      var mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
      if (mouseDist < REPEL_RADIUS && mouseDist > 0) {
        var force = (REPEL_RADIUS - mouseDist) / REPEL_RADIUS;
        p.x += (dmx / mouseDist) * force * 8;
        p.y += (dmy / mouseDist) * force * 8;
      }
    }

    // Draw connections
    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          // Only draw connections near the mouse
          var midX = (particles[i].x + particles[j].x) / 2;
          var midY = (particles[i].y + particles[j].y) / 2;
          var mouseDistToMid = Math.sqrt((midX - mouseX) * (midX - mouseX) + (midY - mouseY) * (midY - mouseY));
          if (mouseDistToMid < MOUSE_RADIUS) {
            var lineOpacity = (1 - dist / CONNECTION_DIST) * (1 - mouseDistToMid / MOUSE_RADIUS) * 0.3;
            var fade = Math.min(centerFade(midX, midY), centerFade(particles[i].x, particles[i].y), centerFade(particles[j].x, particles[j].y));
            ctx.strokeStyle = 'rgba(0, 102, 204, ' + (lineOpacity * fade) + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    // Draw particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var fade = centerFade(p.x, p.y);
      ctx.fillStyle = 'rgba(100, 120, 180, ' + (p.opacity * fade) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }
  animate();
})();
</script>
```

**Step 4: Verify in browser**

Open `localhost:8090`, verify:
- Desktop: particles visible, drifting, constellation lines appear near cursor
- Particles are dimmer/sparser near center text
- Mobile: gradient mesh shown instead, no canvas
- `prefers-reduced-motion`: gradient mesh shown, no canvas

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add WebGL particle field to hero section"
```

---

### Task 2: Interest Card Glowing Border Effect

**Files:**
- Modify: `index.html:745-772` (update `.interest-card` CSS)
- Modify: `index.html` (add new CSS block before `</style>`)
- Modify: `index.html` (add new `<script>` block before `</body>`)

**Step 1: Add glow CSS**

Insert before line 1658 (`</style>`), after the particle canvas CSS:

```css
/* ─── INTEREST CARD GLOW EFFECT ───────────────────────── */
.interest-card {
  position: relative;
  overflow: hidden;
}
.interest-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: conic-gradient(
    from var(--glow-angle, 0deg) at 50% 50%,
    transparent 0%,
    rgba(0, 102, 204, 0.6) 10%,
    rgba(99, 102, 241, 0.4) 20%,
    transparent 40%
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: var(--glow-opacity, 0);
  transition: opacity 0.25s ease;
  pointer-events: none;
  z-index: 1;
}
.interest-card > * {
  position: relative;
  z-index: 2;
}
```

**Step 2: Update existing interest-card CSS**

On line 745, add `position: relative;` and `overflow: hidden;` to `.interest-card` if not already present (check first — these may need to be added to the existing rule).

**Step 3: Write the glow tracking script**

Add a new `<script>` block before `</body>`:

```javascript
<!-- ── Interest Card Glow Effect ── -->
<script>
(function() {
  if ('ontouchstart' in window) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var cards = document.querySelectorAll('.interest-card');
  if (!cards.length) return;

  var PROXIMITY = 250;

  document.addEventListener('mousemove', function(e) {
    cards.forEach(function(card) {
      var rect = card.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < PROXIMITY) {
        var angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
        var opacity = (1 - dist / PROXIMITY) * 0.9;
        card.style.setProperty('--glow-angle', angle + 'deg');
        card.style.setProperty('--glow-opacity', opacity);
      } else {
        card.style.setProperty('--glow-opacity', '0');
      }
    });
  });

  document.addEventListener('mouseleave', function() {
    cards.forEach(function(card) {
      card.style.setProperty('--glow-opacity', '0');
    });
  });
})();
</script>
```

**Step 4: Verify in browser**

Open `localhost:8090`, scroll to Interests section, verify:
- Moving cursor near cards causes border glow to appear
- Glow angle tracks cursor position
- Multiple cards can glow simultaneously
- Glow fades smoothly as cursor moves away
- No glow on touch devices

**Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add proximity glow border effect to interest cards"
```

---

### Task 3: About Section 3D Scroll Entrance

**Files:**
- Modify: `index.html:388-394` (add perspective to `#about`)
- Modify: `index.html:1715-1719` (update About section HTML classes)
- Modify: `index.html` (add new CSS block before `</style>`)
- Modify: `index.html` (add new `<script>` block before `</body>`)

**Step 1: Add 3D entrance CSS**

Insert before line 1658 (`</style>`):

```css
/* ─── ABOUT 3D SCROLL ENTRANCE ────────────────────────── */
#about {
  perspective: 1200px;
}
.about-3d-entrance {
  transform-origin: center top;
  will-change: transform, opacity;
}
@media (prefers-reduced-motion: reduce) {
  .about-3d-entrance {
    transform: none !important;
    opacity: 1 !important;
  }
}
```

**Step 2: Add the `about-3d-entrance` class to the About container**

On line 1716, change:
```html
<div class="container">
```
to:
```html
<div class="container about-3d-entrance">
```

**Step 3: Remove existing `.reveal` classes from About section children**

The About section's direct children (`.about-visual`, `.about-text`) currently have `.reveal` class. Remove these so the 3D entrance handles the animation instead. Check lines ~1719-1770 for elements with `class="... reveal"` inside `#about` and remove the `reveal` class from them.

**Step 4: Write the scroll-driven 3D entrance script**

Add a new `<script>` block before `</body>`:

```javascript
<!-- ── About 3D Scroll Entrance ── -->
<script>
(function() {
  if ('ontouchstart' in window) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var about = document.getElementById('about');
  var container = about ? about.querySelector('.about-3d-entrance') : null;
  if (!container) return;

  // Set initial state
  container.style.transform = 'rotateX(8deg) scale(0.97) translateY(40px)';
  container.style.opacity = '0.4';

  var done = false;

  function onScroll() {
    if (done) return;

    var rect = about.getBoundingClientRect();
    var windowH = window.innerHeight;
    // Start animating when section top enters bottom 80% of viewport
    var start = windowH * 0.8;
    // End when section top reaches 30% from top
    var end = windowH * 0.3;

    if (rect.top > start) {
      // Not yet in view
      container.style.transform = 'rotateX(8deg) scale(0.97) translateY(40px)';
      container.style.opacity = '0.4';
    } else if (rect.top < end) {
      // Fully in view — lock final state
      container.style.transform = 'rotateX(0deg) scale(1) translateY(0px)';
      container.style.opacity = '1';
      done = true;
      window.removeEventListener('scroll', onScroll);
    } else {
      // Interpolate
      var progress = 1 - (rect.top - end) / (start - end);
      var rotateX = 8 * (1 - progress);
      var scale = 0.97 + 0.03 * progress;
      var translateY = 40 * (1 - progress);
      var opacity = 0.4 + 0.6 * progress;
      container.style.transform = 'rotateX(' + rotateX + 'deg) scale(' + scale + ') translateY(' + translateY + 'px)';
      container.style.opacity = opacity;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Check initial position
})();
</script>
```

**Step 5: Verify in browser**

Open `localhost:8090`, scroll from hero to About section, verify:
- About section rotates from 8deg to 0 as you scroll
- Scale and opacity transition smoothly
- Effect locks in place once complete (doesn't reverse)
- Mobile: no 3D effect, standard reveal behavior
- `prefers-reduced-motion`: no 3D effect

**Step 6: Commit**

```bash
git add index.html
git commit -m "feat: add 3D scroll entrance to About section"
```

---

### Task 4: Final Integration & Push

**Step 1: Full page verification**

Test the complete page flow:
- Hero: particles visible on desktop, gradient mesh on mobile
- About: 3D scroll entrance works
- Interest cards: glow border tracks cursor
- All existing features still work (nav, reveals, shimmer, etc.)
- No console errors

**Step 2: Push to production**

```bash
git push origin main
```

Netlify auto-deploys from main. Verify at chriszdenek.com after ~1 minute.
