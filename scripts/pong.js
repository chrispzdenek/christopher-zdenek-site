/* ───── Timeline show more/less ───── */
function toggleTimeline() {
  var tl = document.getElementById('workTimeline');
  var btn = document.getElementById('timelineShowMore');
  var isCollapsed = tl.classList.contains('timeline-collapsed');
  if (isCollapsed) {
    tl.classList.remove('timeline-collapsed');
    btn.querySelector('span').textContent = 'Show less';
    btn.classList.add('expanded');
    // trigger reveal animation on newly visible items
    var items = tl.querySelectorAll('.timeline-item');
    items.forEach(function(el, i) {
      if (i >= 3 && !el.classList.contains('visible')) {
        setTimeout(function() { el.classList.add('visible'); }, (i - 3) * 80);
      }
    });
  } else {
    tl.classList.add('timeline-collapsed');
    btn.querySelector('span').textContent = 'Show all experiences';
    btn.classList.remove('expanded');
    // scroll back to top of section
    tl.closest('section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/* ───── Essay toggle ───── */
let essayOpen = false;
function toggleEssay() {
  essayOpen = !essayOpen;
  const body = document.getElementById('essayBody');
  const btn  = document.getElementById('essayToggle');
  const card = document.getElementById('essayCard');
  if (essayOpen) {
    body.style.maxHeight = 'none';
    body.style.overflow  = 'visible';
    body.style.position  = 'relative';
    // remove gradient fade
    body.style.setProperty('--fade', 'none');
    card.classList.remove('essay-collapsed');
    btn.textContent = 'Show Less';
  } else {
    body.style.maxHeight = '';
    body.style.overflow  = '';
    body.style.position  = '';
    body.style.removeProperty('--fade');
    card.classList.add('essay-collapsed');
    btn.textContent = 'Read Full Essay';
  }
}
// Start collapsed
document.getElementById('essayCard').classList.add('essay-collapsed');

/* ───── Pong Game ───── */
const canvas  = document.getElementById('pongCanvas');
const ctx     = canvas.getContext('2d');
const overlay = document.getElementById('pongOverlay');

// Retina / HiDPI support — keeps logical coords unchanged
const dpr = window.devicePixelRatio || 1;
const ORIG_W = 700, ORIG_H = 400;
let W = canvas.width;
let H = canvas.height;
canvas.width  = W * dpr;
canvas.height = H * dpr;
canvas.style.width  = W + 'px';
canvas.style.height = H + 'px';
ctx.scale(dpr, dpr);

var PAD_W = 36;
var PAD_H = 96;
var BALL_R = 8;
const PAD_W_ORIG = 36, PAD_H_ORIG = 96, BALL_R_ORIG = 8;
const WIN_SCORE = 7;

// Defer cat sprite loading until #cats section is near viewport
const CAT_SPRITES = {};
var catSpritesLoaded = false;
function loadCatSprites() {
  if (catSpritesLoaded) return;
  catSpritesLoaded = true;
  ['juneau', 'elie'].forEach(key => {
    const img = new Image();
    img.src = `images/${key}-sprite.png`;
    CAT_SPRITES[key] = img;
  });
}
(function() {
  var catsEl = document.getElementById('cats');
  if (!catsEl || !('IntersectionObserver' in window)) { loadCatSprites(); return; }
  var spriteObs = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting) {
      loadCatSprites();
      spriteObs.disconnect();
    }
  }, { rootMargin: '200px' });
  spriteObs.observe(catsEl);
})();

// Cat themes — Balinese colorpoint accurate palettes
const CATS = {
  juneau: {
    name:        'Juneau',
    // Blue Point Balinese: cool grey points, cream body
    bodyBase:    '#f4f1ec',
    pointColor:  '#8a9aa6',  // cool grey — accurate Blue Point
    eyeColor:    '#1a4e8a',  // deep dark sapphire
    noseColor:   '#b09aaa',
    tongueColor: '#d06878',
    glowColor:   'rgba(138,154,166,0.5)',
    label:       'JUNEAU',
    labelClass:  'juneau-label',
    tongue:      false,
  },
  elie: {
    name:        'Elie',
    // Seal Point Balinese: very dark brown points, warm fawn body
    bodyBase:    '#f5ede0',
    pointColor:  '#2c1208',  // dark seal — very dark brown, near-black (accurate from photo)
    eyeColor:    '#1a4e8a',  // same sapphire blue
    noseColor:   '#1a0a04',  // near-black nose (as in photo)
    tongueColor: '#e04060',
    glowColor:   'rgba(44,18,8,0.35)',
    label:       'ELIE',
    labelClass:  'elie-label',
    tongue:      true,       // Elie's signature move
  }
};

// AI always plays as the other cat
function getAICat(playerKey) {
  return playerKey === 'juneau' ? CATS.elie : CATS.juneau;
}

let selectedCat = null;
let gameRunning = false;
let gameOver    = false;
let animId      = null;
let idleAnimId  = null;
let winAnimId   = null;
let confettiParts = [];

// State
let playerY, aiY, ballX, ballY, ballVX, ballVY;
let scorePlayer = 0, scoreAI = 0;
let keys = {};

// AI
let aiTargetY;
let aiSpeed = 3.2;
let aiReactDelay = 0;
let aiReactTimer = 0;

function selectCat(key) {
  selectedCat = key;
  document.getElementById('btnJuneau').classList.toggle('active', key === 'juneau');
  document.getElementById('btnElie').classList.toggle('active', key === 'elie');

  const cat = CATS[key];
  const aiCat = getAICat(key);
  document.getElementById('playerLabel').textContent = cat.label;
  document.getElementById('playerLabel').className = 'pong-score-name ' + cat.labelClass;
  document.getElementById('aiLabel').textContent = aiCat.label + ' (COM)';
  document.getElementById('aiLabel').className = 'pong-score-name ' + aiCat.labelClass;
}

function initBall(towardsPlayer) {
  ballX = W / 2;
  ballY = H / 2;
  var speed = 4.5;
  // Slow down 15% in vertical mobile mode
  if (pongOrientChoice === 'portrait') speed *= 0.85;
  const angle = (Math.random() * 0.8 - 0.4); // radians
  const dir = towardsPlayer ? -1 : 1;
  ballVX = dir * speed * Math.cos(angle);
  ballVY = speed * Math.sin(angle);
  aiReactDelay = 20 + Math.random() * 30;
  aiReactTimer = 0;
}

function resetGame() {
  if (animId)     { cancelAnimationFrame(animId);     animId    = null; }
  if (idleAnimId) { cancelAnimationFrame(idleAnimId); idleAnimId = null; }
  if (winAnimId)  { cancelAnimationFrame(winAnimId);  winAnimId  = null; }
  gameRunning = false;
  gameOver    = false;
  scorePlayer = 0; scoreAI = 0;
  document.getElementById('scorePlayer').textContent = '0';
  document.getElementById('scoreAI').textContent = '0';
  playerY = H / 2 - PAD_H / 2;
  aiY     = H / 2 - PAD_H / 2;
  overlay.innerHTML = '<h4>Cat Laser Pong</h4><p>Choose your cat — then press Start!</p>';
  overlay.style.display    = 'flex';
  overlay.style.background = '';
  overlay.style.pointerEvents = '';
  startIdleLoop();
}

function startGame() {
  if (!selectedCat) {
    // This is a static, hardcoded string — no user input involved (safe)
    overlay.innerHTML = '<h4>Pick a cat first! \u{1F431}</h4><p>Choose Juneau or Elie above</p>';
    overlay.style.display = 'flex';
    return;
  }
  if (gameRunning) return;

  // On mobile, enter fullscreen and show orientation choice
  if (isMobileDevice() && !pongIsFullscreen) {
    enterPongFullscreen();
    // Game will launch after user picks orientation via choosePongOrientation()
    return;
  }
  launchGame();
}

function launchGame() {
  if (idleAnimId) { cancelAnimationFrame(idleAnimId); idleAnimId = null; }
  gameOver = false;
  gameRunning = true;
  playerY = H / 2 - PAD_H / 2;
  aiY     = H / 2 - PAD_H / 2;
  initBall(Math.random() > 0.5);
  overlay.style.display = 'none';
  loop();
}

function loop() {
  if (!gameRunning) return;
  update();
  draw();
  animId = requestAnimationFrame(loop);
}

function update() {
  // Player movement
  const speed = 7;
  if (keys['w'] || keys['arrowup']) {
    playerY = Math.max(0, playerY - speed);
  }
  if (keys['s'] || keys['arrowdown']) {
    playerY = Math.min(H - PAD_H, playerY + speed);
  }

  // AI movement
  aiReactTimer++;
  if (aiReactTimer >= aiReactDelay) {
    // Predict ball landing position
    const timeToReach = (W - PAD_W*2 - ballX) / Math.abs(ballVX + 0.001);
    let predictY = ballY + ballVY * timeToReach;
    // Bounce prediction (rough)
    while (predictY < 0 || predictY > H) {
      if (predictY < 0) predictY = -predictY;
      if (predictY > H) predictY = 2*H - predictY;
    }
    aiTargetY = predictY - PAD_H / 2;
  }
  if (aiTargetY !== undefined) {
    const diff = aiTargetY - aiY;
    if (Math.abs(diff) > 3) {
      aiY += (diff > 0 ? 1 : -1) * Math.min(aiSpeed, Math.abs(diff));
    }
    aiY = Math.max(0, Math.min(H - PAD_H, aiY));
  }

  // Ball movement
  ballX += ballVX;
  ballY += ballVY;

  // Top / bottom wall
  if (ballY - BALL_R <= 0)     { ballY = BALL_R;        ballVY = Math.abs(ballVY); }
  if (ballY + BALL_R >= H)     { ballY = H - BALL_R;    ballVY = -Math.abs(ballVY); }

  // Player paddle (left)
  const playerPadX = PAD_W + 20;
  if (ballX - BALL_R <= playerPadX + PAD_W &&
      ballX - BALL_R >= playerPadX &&
      ballY >= playerY && ballY <= playerY + PAD_H) {
    ballVX = Math.abs(ballVX) * 1.04;
    const hitPos = (ballY - playerY) / PAD_H; // 0-1
    ballVY = (hitPos - 0.5) * 10;
    ballX = playerPadX + PAD_W + BALL_R;
    aiReactDelay = 10 + Math.random() * 20;
    aiReactTimer = 0;
  }

  // AI paddle (right)
  const aiPadX = W - PAD_W - 20 - PAD_W;
  if (ballX + BALL_R >= aiPadX &&
      ballX + BALL_R <= aiPadX + PAD_W + 5 &&
      ballY >= aiY && ballY <= aiY + PAD_H) {
    ballVX = -Math.abs(ballVX) * 1.04;
    const hitPos = (ballY - aiY) / PAD_H;
    ballVY = (hitPos - 0.5) * 10;
    ballX = aiPadX - BALL_R;
  }

  // Clamp max speed
  const maxSpd = 14;
  const spd = Math.sqrt(ballVX*ballVX + ballVY*ballVY);
  if (spd > maxSpd) { ballVX = ballVX/spd*maxSpd; ballVY = ballVY/spd*maxSpd; }

  // Score
  if (ballX < 0) {
    scoreAI++;
    document.getElementById('scoreAI').textContent = scoreAI;
    checkWin();
    if (!gameOver) initBall(false);
  }
  if (ballX > W) {
    scorePlayer++;
    document.getElementById('scorePlayer').textContent = scorePlayer;
    checkWin();
    if (!gameOver) initBall(true);
  }
}

function checkWin() {
  if (scorePlayer >= WIN_SCORE || scoreAI >= WIN_SCORE) {
    gameOver    = true;
    gameRunning = false;
    const cat    = CATS[selectedCat];
    const aiCat  = getAICat(selectedCat);
    const youWon = scorePlayer >= WIN_SCORE;
    drawWinScreen(youWon ? cat : aiCat, youWon);
  }
}

/* ── Confetti helpers ─────────────────────────────────── */
function initConfetti() {
  const cols = ['#ff6b6b','#ffd93d','#6bcb77','#4d96ff','#f97316','#a855f7','#ec4899','#22d3ee'];
  confettiParts = Array.from({length: 90}, () => ({
    x:    Math.random() * W,
    y:   -Math.random() * H * 0.7,
    vx:   (Math.random() - 0.5) * 3,
    vy:   1.6 + Math.random() * 3,
    rot:  Math.random() * Math.PI * 2,
    rotV: (Math.random() - 0.5) * 0.15,
    w:    7 + Math.random() * 8,
    h:    4 + Math.random() * 4,
    color: cols[Math.floor(Math.random() * cols.length)]
  }));
}
function stepConfetti() {
  confettiParts.forEach(p => {
    p.x   += p.vx + (Math.random() - 0.5) * 0.3;
    p.y   += p.vy;
    p.rot += p.rotV;
    if (p.y > H + 12) { p.y = -10; p.x = Math.random() * W; }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle   = p.color;
    ctx.globalAlpha = 0.88;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
  ctx.globalAlpha = 1;
}

/* ── Animated win screen ──────────────────────────────── */
function drawWinScreen(winnerCat, youWon) {
  initConfetti();
  // Hide overlay completely — all UI is drawn on canvas
  overlay.style.display = 'none';

  const sw = 160, sh = 240;           // sprite draw size
  const sx = W / 2 - sw / 2;
  const sy = 18;                       // tight top padding
  const textY1 = sy + sh + 32;        // winner headline
  const textY2 = textY1 + 22;         // subtitle
  const textY3 = H - 16;              // "Press Reset" at very bottom

  const spriteKey = winnerCat.name.toLowerCase();
  const sprite    = CAT_SPRITES[spriteKey];
  let frame = 0;

  function winFrame() {
    ctx.clearRect(0, 0, W, H);

    // Dark backdrop
    ctx.fillStyle = 'rgba(8,13,20,0.93)';
    ctx.fillRect(0, 0, W, H);

    // Confetti
    stepConfetti();

    // Winner sprite — glowing, centered
    ctx.save();
    ctx.shadowColor = winnerCat.glowColor;
    ctx.shadowBlur  = 44;
    if (sprite && sprite.complete && sprite.naturalWidth > 0) {
      // Rounded-corner clip on win screen sprite too
      ctx.beginPath();
      ctx.roundRect(sx, sy, sw, sh, 12);
      ctx.clip();
      ctx.drawImage(sprite, sx, sy, sw, sh);
    } else {
      drawCatFace(W / 2, sy + sh / 2, 72, winnerCat);
    }
    ctx.restore();

    // Text — fade in over first 25 frames
    const alpha = Math.min(1, frame / 25);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.textAlign   = 'center';

    // Winner headline
    ctx.fillStyle = '#ffffff';
    ctx.font      = '300 26px "DM Sans", sans-serif';
    ctx.fillText(youWon ? `${winnerCat.name} Wins! 🎉` : `${winnerCat.name} (COM) Wins!`, W / 2, textY1);

    // Flavour subtitle
    ctx.fillStyle = 'rgba(255,255,255,0.50)';
    ctx.font      = '400 12px "DM Sans", sans-serif';
    ctx.fillText(
      youWon ? 'Impressive paw work. The laser never stood a chance.'
             : 'The COM cat got you this time… practice your swipe.',
      W / 2, textY2
    );

    // "Press Reset" hint at bottom
    ctx.fillStyle = 'rgba(255,255,255,0.28)';
    ctx.font      = '400 11px "DM Sans", sans-serif';
    ctx.fillText(pongIsFullscreen ? 'Tap Reset to play again or X to exit' : 'Press Reset to play again', W / 2, textY3);

    ctx.restore();
    ctx.textAlign = 'left';

    frame++;
    if (gameOver) { winAnimId = requestAnimationFrame(winFrame); }
    else          { winAnimId = null; }
  }
  winFrame();
}

/* ─── Shared helper: draw one cat ear triangle ─── */
function drawEarTriangle(ctx, tipX, tipY, baseX, baseY, halfW, pointColor) {
  ctx.beginPath();
  ctx.moveTo(baseX - halfW, baseY);
  ctx.lineTo(tipX, tipY);
  ctx.lineTo(baseX + halfW, baseY);
  ctx.closePath();
  ctx.fillStyle = pointColor;
  ctx.fill();
}

/* ─── Win screen cat face — big, simple, cute ─── */
function drawCatFace(cx, cy, r, cat) {
  ctx.save();

  // Soft glow
  ctx.shadowColor = cat.glowColor;
  ctx.shadowBlur  = 28;

  // Ears (behind head) — white rim + fill + inner accent
  drawEarTriangle(ctx, cx - r*0.52, cy - r*1.27, cx - r*0.52, cy - r*0.69, r*0.31, 'rgba(255,255,255,0.5)');
  drawEarTriangle(ctx, cx + r*0.52, cy - r*1.27, cx + r*0.52, cy - r*0.69, r*0.31, 'rgba(255,255,255,0.5)');
  drawEarTriangle(ctx, cx - r*0.52, cy - r*1.22, cx - r*0.52, cy - r*0.72, r*0.28, cat.pointColor);
  drawEarTriangle(ctx, cx + r*0.52, cy - r*1.22, cx + r*0.52, cy - r*0.72, r*0.28, cat.pointColor);
  drawEarTriangle(ctx, cx - r*0.52, cy - r*0.98, cx - r*0.52, cy - r*0.75, r*0.14, 'rgba(255,195,185,0.65)');
  drawEarTriangle(ctx, cx + r*0.52, cy - r*0.98, cx + r*0.52, cy - r*0.75, r*0.14, 'rgba(255,195,185,0.65)');

  // Head
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.fillStyle = cat.bodyBase;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Face mask — soft oval of point color in center of face
  ctx.beginPath();
  ctx.ellipse(cx, cy + r*0.08, r*0.58, r*0.65, 0, 0, Math.PI*2);
  ctx.fillStyle = cat.pointColor;
  ctx.globalAlpha = 0.22;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Eyes — big, round, expressive
  const eyeY = cy - r*0.1;
  [-0.36, 0.36].forEach(xOff => {
    const ex = cx + xOff * r;
    // Iris
    ctx.beginPath();
    ctx.arc(ex, eyeY, r*0.195, 0, Math.PI*2);
    ctx.fillStyle = cat.eyeColor;
    ctx.fill();
    // Pupil
    ctx.beginPath();
    ctx.arc(ex, eyeY, r*0.095, 0, Math.PI*2);
    ctx.fillStyle = '#030810';
    ctx.fill();
    // Shine
    ctx.beginPath();
    ctx.arc(ex + r*0.07, eyeY - r*0.07, r*0.06, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fill();
  });

  // Nose — small dot
  ctx.beginPath();
  ctx.arc(cx, cy + r*0.26, r*0.06, 0, Math.PI*2);
  ctx.fillStyle = cat.noseColor;
  ctx.fill();

  // Elie: tongue out  /  Juneau: little smile
  if (cat.tongue) {
    ctx.beginPath();
    ctx.ellipse(cx, cy + r*0.44, r*0.10, r*0.14, 0, 0, Math.PI*2);
    ctx.fillStyle = cat.tongueColor;
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(cx, cy + r*0.30, r*0.14, 0.2, Math.PI - 0.2);
    ctx.strokeStyle = cat.pointColor + 'aa';
    ctx.lineWidth = r*0.04;
    ctx.lineCap = 'round';
    ctx.stroke();
    // Blush
    [-0.4, 0.4].forEach(xOff => {
      ctx.beginPath();
      ctx.ellipse(cx + xOff*r, eyeY + r*0.38, r*0.14, r*0.07, 0, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(230,150,160,0.3)';
      ctx.fill();
    });
  }

  // Two whiskers each side
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.5; ctx.lineCap = 'round';
  [[-0.05, -0.02], [0.05, 0.08]].forEach(([a, b]) => {
    ctx.beginPath(); ctx.moveTo(cx - r*0.14, cy + r*0.2 + a*r); ctx.lineTo(cx - r*0.95, cy + r*0.2 + b*r); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + r*0.14, cy + r*0.2 + a*r); ctx.lineTo(cx + r*0.95, cy + r*0.2 + b*r); ctx.stroke();
  });

  ctx.restore();
}

/* ───── Drawing ───── */
function drawPad(x, y, cat, isSwipe, side) {
  ctx.save();

  const spriteKey = cat.name.toLowerCase();
  const sprite    = CAT_SPRITES[spriteKey];

  const cx    = x + PAD_W / 2;
  const drawH = PAD_H;
  // Use the actual sprite aspect ratio so cats aren't stretched
  const ratio = (sprite && sprite.naturalWidth && sprite.naturalHeight)
    ? sprite.naturalWidth / sprite.naturalHeight : (2 / 3);
  const drawW = Math.round(drawH * ratio);
  const drawX = cx - drawW / 2;
  const drawY = y;
  const cr    = 10; // corner radius for the cat card

  if (sprite && sprite.complete && sprite.naturalWidth > 0) {
    // Clip to rounded rect — clean card edges
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawW, drawH, cr);
    ctx.clip();
    if (side === 'right') {
      ctx.translate(drawX * 2 + drawW, 0);
      ctx.scale(-1, 1);
    }
    ctx.drawImage(sprite, drawX, drawY, drawW, drawH);
    ctx.restore();
  } else {
    // Fallback while sprite loads
    ctx.fillStyle = cat.bodyBase;
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawW, drawH, cr);
    ctx.fill();
  }

  ctx.restore();
}

function drawBall(x, y) {
  // Glow
  ctx.save();
  const glow = ctx.createRadialGradient(x, y, 0, x, y, BALL_R * 3);
  glow.addColorStop(0, 'rgba(255,50,50,0.7)');
  glow.addColorStop(0.5, 'rgba(255,50,50,0.2)');
  glow.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(x, y, BALL_R * 3, 0, Math.PI * 2);
  ctx.fillStyle = glow;
  ctx.fill();

  // Dot
  ctx.beginPath();
  ctx.arc(x, y, BALL_R, 0, Math.PI * 2);
  const dg = ctx.createRadialGradient(x - BALL_R*0.3, y - BALL_R*0.3, 0, x, y, BALL_R);
  dg.addColorStop(0, '#ff8888');
  dg.addColorStop(0.5, '#ff2222');
  dg.addColorStop(1, '#cc0000');
  ctx.fillStyle = dg;
  ctx.fill();
  ctx.restore();
}

function drawCourt() {
  // ── Hardwood floor planks ──────────────────────────────
  const plankH = 42;
  // Warm honey-oak color pairs [topEdge, mid, bottomEdge]
  const planks = [
    ['#d4922e','#c8882a','#bc7e24'],
    ['#c07828','#cc8c32','#b87426'],
    ['#ca8c30','#be8028','#d49638'],
    ['#b87a26','#c6882c','#bc8028'],
    ['#d09038','#c4842c','#b87a26'],
    ['#c88a2e','#bc7e28','#cc9032'],
    ['#be7e28','#d09038','#c4862a'],
    ['#cc8c32','#c07828','#c88a2e'],
    ['#c4862a','#b87a26','#d09038'],
    ['#d49638','#c8882a','#c07828'],
  ];

  let row = 0;
  for (let py = 0; py < H; py += plankH, row++) {
    const [c1, c2, c3] = planks[row % planks.length];
    // Plank fill gradient
    const pg = ctx.createLinearGradient(0, py, 0, py + plankH);
    pg.addColorStop(0,   c1);
    pg.addColorStop(0.45, c2);
    pg.addColorStop(1,   c3);
    ctx.fillStyle = pg;
    ctx.fillRect(0, py, W, plankH);

    // Grain lines — subtle wavy strokes
    ctx.strokeStyle = 'rgba(0,0,0,0.055)';
    ctx.lineWidth = 0.9;
    for (let gi = 0; gi < 5; gi++) {
      const gy = py + 4 + gi * 7;
      const s  = Math.sin(row * 1.9 + gi * 2.3) * 4;
      ctx.beginPath();
      ctx.moveTo(0, gy + s * 0.3);
      ctx.bezierCurveTo(
        W * 0.3, gy + s,
        W * 0.65, gy - s * 0.8,
        W,       gy + s * 0.5
      );
      ctx.stroke();
    }

    // Plank edge (horizontal seam)
    ctx.strokeStyle = 'rgba(70,35,5,0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, py); ctx.lineTo(W, py);
    ctx.stroke();
  }

  // Overhead light — brightens centre slightly
  const glow = ctx.createRadialGradient(W/2, H*0.38, 0, W/2, H/2, W * 0.68);
  glow.addColorStop(0, 'rgba(255,248,215,0.22)');
  glow.addColorStop(1, 'rgba(0,0,0,0.14)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // Centre dashed line — white tape on the floor
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = 'rgba(255,255,255,0.55)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(W/2, 0); ctx.lineTo(W/2, H);
  ctx.stroke();
  ctx.setLineDash([]);

  // Centre circle
  ctx.beginPath();
  ctx.arc(W/2, H/2, 50, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  drawCourt();

  if (!selectedCat) return; // shouldn't happen while gameRunning
  const cat   = CATS[selectedCat];
  const aiCat = getAICat(selectedCat);

  // Determine swipe (near ball)
  const playerPadX = PAD_W + 20;
  const aiPadX     = W - PAD_W - 20 - PAD_W;

  const playerSwipe = gameRunning && Math.abs(ballX - playerPadX) < 80;
  const aiSwipe     = gameRunning && Math.abs(ballX - (aiPadX + PAD_W)) < 80;

  drawPad(playerPadX, playerY, cat,   playerSwipe, 'left');
  drawPad(aiPadX,     aiY,     aiCat, aiSwipe,     'right');

  if (gameRunning || gameOver) {
    drawBall(ballX, ballY);
  }
}

/* ── Idle animation loop — always starts fresh with a cleared canvas ── */
function startIdleLoop() {
  if (idleAnimId) { cancelAnimationFrame(idleAnimId); idleAnimId = null; }
  idleAnimId = requestAnimationFrame(drawIdleFrame);
}
var pongIdleVisible = true;
(function() {
  var catsSection = document.getElementById('cats');
  if (catsSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      pongIdleVisible = entries[0].isIntersecting;
      if (pongIdleVisible && !gameRunning && !gameOver && !idleAnimId) { startIdleLoop(); }
    }, { threshold: 0 }).observe(catsSection);
  }
})();
function drawIdleFrame() {
  if (!pongIdleVisible && !gameRunning) { idleAnimId = null; return; }
  ctx.clearRect(0, 0, W, H);
  drawCourt();
  const cat   = selectedCat ? CATS[selectedCat] : CATS.juneau;
  const aiCat = selectedCat ? getAICat(selectedCat) : CATS.elie;
  playerY = H / 2 - PAD_H / 2;
  aiY     = H / 2 - PAD_H / 2;
  drawPad(PAD_W + 20,              playerY, cat,   false, 'left');
  drawPad(W - PAD_W - 20 - PAD_W, aiY,     aiCat, false, 'right');
  // Idle laser dot wiggle
  const t  = Date.now() / 800;
  const ix = W / 2 + Math.cos(t) * 60;
  const iy = H / 2 + Math.sin(t * 1.3) * 40;
  drawBall(ix, iy);
  if (!gameRunning && !gameOver) { idleAnimId = requestAnimationFrame(drawIdleFrame); }
  else                            { idleAnimId = null; }
}
// Backward-compat alias
function drawIdle() { startIdleLoop(); }

// Keyboard
document.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
  if (gameRunning && ['arrowup','arrowdown'].includes(e.key.toLowerCase())) e.preventDefault();
});
document.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });

// Touch support for mobile
let touchStartY = null;
canvas.addEventListener('touchstart', e => {
  touchStartY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });
canvas.addEventListener('touchmove', e => {
  if (touchStartY === null) return;
  const dy = e.touches[0].clientY - touchStartY;
  playerY = Math.max(0, Math.min(H - PAD_H, playerY + dy));
  touchStartY = e.touches[0].clientY;
  e.preventDefault();
}, { passive: false });

/* ───── Mobile Fullscreen Pong ───── */
let pongIsFullscreen = false;
const pongSection = document.getElementById('pongSection');
const rotateOverlay = document.getElementById('pongRotateOverlay');

function isMobileDevice() {
  return 'ontouchstart' in window && window.innerWidth <= 1024;
}

function resizeCanvasTo(w, h) {
  W = w; H = h;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
}

var pongOrientChoice = null; // 'landscape' or 'portrait'

function choosePongOrientation(orient) {
  pongOrientChoice = orient;
  rotateOverlay.classList.remove('visible');
  if (orient === 'landscape') {
    // Try to lock orientation (Android)
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(function(){});
    }
  }
  fitCanvasToScreen();
  launchGame();
}

// Expose to onclick
window.choosePongOrientation = choosePongOrientation;

// Cancel button on orientation overlay
(function() {
  var cancelBtn = document.getElementById('pongOrientCancel');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', function() {
      rotateOverlay.classList.remove('visible');
      exitPongFullscreen();
    });
  }
})();

function enterPongFullscreen() {
  if (pongIsFullscreen) return;
  pongIsFullscreen = true;
  pongSection.classList.add('pong-fullscreen');
  document.body.style.overflow = 'hidden';

  // Try native fullscreen (Android)
  if (pongSection.requestFullscreen) {
    pongSection.requestFullscreen().catch(function(){});
  } else if (pongSection.webkitRequestFullscreen) {
    pongSection.webkitRequestFullscreen();
  }

  // Show orientation choice
  rotateOverlay.classList.add('visible');
  window.addEventListener('resize', onPongResize);
}

function exitPongFullscreen() {
  if (!pongIsFullscreen) return;
  pongIsFullscreen = false;
  pongOrientChoice = null;
  pongSection.classList.remove('pong-fullscreen');
  rotateOverlay.classList.remove('visible');
  document.body.style.overflow = '';

  // Exit native fullscreen
  if (document.fullscreenElement) {
    document.exitFullscreen().catch(function(){});
  } else if (document.webkitFullscreenElement) {
    document.webkitExitFullscreen();
  }

  // Unlock orientation
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  }

  window.removeEventListener('resize', onPongResize);

  // Restore original canvas and element sizes
  PAD_W = PAD_W_ORIG; PAD_H = PAD_H_ORIG; BALL_R = BALL_R_ORIG;
  resizeCanvasTo(ORIG_W, ORIG_H);
  resetGame();
}

function checkOrientationForPong() {
  if (!pongIsFullscreen) return;
  // If user already chose an orientation, just refit canvas on resize
  if (pongOrientChoice) {
    fitCanvasToScreen();
  }
  // Otherwise the choice overlay is showing — don't interfere
}

function fitCanvasToScreen() {
  if (!pongIsFullscreen) return;
  var isLandscape = pongOrientChoice !== 'portrait';
  // Minimize controls overhead in landscape to maximize play area
  var controlsH = isLandscape ? 70 : 100;
  var bottomPad = 8; // sliver of space so user sees full court
  var availW = window.innerWidth - 12;
  var availH = window.innerHeight - controlsH - bottomPad;
  // Aspect ratio depends on orientation choice
  var aspect = isLandscape ? (7 / 4) : (4 / 7);
  var newW, newH;
  if (availW / availH > aspect) {
    newH = availH;
    newW = Math.round(newH * aspect);
  } else {
    newW = availW;
    newH = Math.round(newW / aspect);
  }
  resizeCanvasTo(newW, newH);
  // Scale game elements for mobile landscape — slightly smaller for traditional feel
  if (isLandscape && isMobileDevice()) {
    var scale = 0.8;
    PAD_W = Math.round(PAD_W_ORIG * scale);
    PAD_H = Math.round(PAD_H_ORIG * scale);
    BALL_R = Math.round(BALL_R_ORIG * scale);
  } else {
    PAD_W = PAD_W_ORIG;
    PAD_H = PAD_H_ORIG;
    BALL_R = BALL_R_ORIG;
  }
  // Reinit game positions for new dimensions
  if (!gameRunning && !gameOver) {
    resetGame();
  }
}

function onPongResize() {
  checkOrientationForPong();
}

// Listen for orientation/resize changes
window.addEventListener('orientationchange', function() {
  setTimeout(checkOrientationForPong, 100);
});

// Exit fullscreen if native fullscreen is exited (e.g. swipe down on Android)
document.addEventListener('fullscreenchange', function() {
  if (!document.fullscreenElement && pongIsFullscreen) {
    exitPongFullscreen();
  }
});

// Init — resetGame() calls startIdleLoop() internally
resetGame();

/* ── Photo Lightbox initialised after DOM in separate block below ── */
