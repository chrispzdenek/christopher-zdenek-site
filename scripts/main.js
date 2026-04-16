(function () {
  var btn   = document.getElementById('navHamburger');
  var links = document.getElementById('navLinks');
  btn.addEventListener('click', function () {
    btn.classList.toggle('open');
    links.classList.toggle('open');
    document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    btn.setAttribute('aria-expanded', links.classList.contains('open'));
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      btn.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      btn.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();

/* ─────────────────────────────────────────────────────────── */

(function () {
  var GALLERIES = {
    firefighter: [
      { src: 'images/event-1.jpg',           alt: 'Mayor Karen Bass with firefighters at Breakfast with the Brave' },
      { src: 'images/event-2.jpg',           alt: 'LAFD honored at Breakfast with the Brave community event' },
      { src: 'images/helmet-and-jacket.jpg', alt: 'LAFD firefighter helmet and jacket' }
    ],
    personal: [
      { src: 'images/photo-1.jpg',    alt: 'Italy — personal travel photography by Christopher Zdenek' },
      { src: 'images/nyc-photo.jpg',  alt: 'New York City — personal travel photography by Christopher Zdenek' },
      { src: 'images/alec-italy.jpg', alt: 'Italy with Alec — personal travel photography by Christopher Zdenek' }
    ],
    paramount: [
      { src: 'images/work/paramount-dodgeball.jpg',   alt: 'Dodgeball Champions — Paramount team' },
      { src: 'images/work/paramount-glsen.jpg',        alt: 'GLSEN Event — Paramount & Nickelodeon' },
      { src: 'images/work/paramount-tmnt.jpg',         alt: 'TMNT Toys — Paramount & Nickelodeon' },
      { src: 'images/work/paramount-transformers.jpg', alt: 'Transformers — Paramount & Nickelodeon' }
    ],
    gotham2122: [
      { src: 'images/work/gotham-team.jpg',  alt: 'The Gotham Group team' },
      { src: 'images/work/gotham-event.jpg', alt: 'The Gotham Group at event' },
      { src: 'images/work/gotham-chris-siobhan.jpg', alt: 'Chris & Siobhan at The Gotham Group' },
      { src: 'images/work/gotham-halloween.jpeg', alt: 'Halloween Contest at The Gotham Group' }
    ],
    syracuse: [
      { src: 'images/work/syracuse-popquiz.jpg',  alt: 'Pop Quiz — Syracuse Screenwriting class' },
      { src: 'images/work/syracuse-roasted.jpg',  alt: 'Rob Edwards — Syracuse Screenwriting class' }
    ],
    dcpoint: [
      { src: 'images/work/dcpoint-gettin-to-the-point.jpg', alt: 'Gettin to the Point — DC Point Productions' }
    ],
    illumination: [
      { src: 'images/work/illumination-annie-awards.jpg', alt: 'Annie Awards — Illumination' }
    ],
    grad: [
      { src: 'images/education/grad-graduation.jpg', alt: 'Grad School Graduation' },
      { src: 'images/education/grad-headmodels.jpg', alt: 'Head Models — Grad School' }
    ],
    undergrad: [
      { src: 'images/education/undergrad-nice.jpg', alt: 'Syracuse University' },
      { src: 'images/education/undergrad-fun.jpg', alt: 'Syracuse University' },
      { src: 'images/education/undergrad-review-crew.jpg', alt: 'Review Crew Producing' },
      { src: 'images/education/undergrad-radio.jpg', alt: 'Syracuse Undergrad Radio' }
    ]
  };

  var lbGallery = 'firefighter';
  var lbCurrent = 0;

  var lbOv  = document.getElementById('lbOverlay');
  var lbImg = document.getElementById('lbImg');
  var lbCap = document.getElementById('lbCaption');
  var lbCnt = document.getElementById('lbCount');

  function lbShow(i) {
    var photos = GALLERIES[lbGallery];
    lbCurrent = ((i % photos.length) + photos.length) % photos.length;
    lbImg.src         = photos[lbCurrent].src;
    lbImg.alt         = photos[lbCurrent].alt;
    lbCap.textContent = photos[lbCurrent].alt;
    lbCnt.textContent = (lbCurrent + 1) + ' / ' + photos.length;
  }
  function lbOpen(gallery, i) {
    lbGallery = gallery;
    lbShow(i);
    lbOv.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function lbClose() {
    lbOv.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-lb]').forEach(function (el) {
    el.addEventListener('click', function () {
      lbOpen(el.dataset.gallery || 'firefighter', parseInt(el.dataset.lb, 10));
    });
  });
  document.getElementById('lbClose').addEventListener('click', lbClose);
  document.getElementById('lbPrev').addEventListener('click', function () { lbShow(lbCurrent - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { lbShow(lbCurrent + 1); });
  lbOv.addEventListener('click', function (e) { if (e.target === lbOv) lbClose(); });
  document.addEventListener('keydown', function (e) {
    if (!lbOv.classList.contains('open')) return;
    if (e.key === 'Escape')     lbClose();
    if (e.key === 'ArrowLeft')  lbShow(lbCurrent - 1);
    if (e.key === 'ArrowRight') lbShow(lbCurrent + 1);
  });

  // Touch drag for lightbox — image follows your finger
  (function () {
    var wrap = document.querySelector('.lb-img-wrap');
    var startX = 0, startY = 0, dragging = false, locked = false, dx = 0;
    lbOv.addEventListener('touchstart', function (e) {
      if (!lbOv.classList.contains('open')) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragging = false; locked = false; dx = 0;
      wrap.classList.remove('snapping');
      wrap.classList.add('dragging');
    }, { passive: true });
    lbOv.addEventListener('touchmove', function (e) {
      if (locked) return;
      var cx = e.touches[0].clientX, cy = e.touches[0].clientY;
      var rawDx = cx - startX, rawDy = cy - startY;
      // Lock direction on first significant move
      if (!dragging && (Math.abs(rawDx) > 8 || Math.abs(rawDy) > 8)) {
        if (Math.abs(rawDy) > Math.abs(rawDx)) { locked = true; wrap.classList.remove('dragging'); return; }
        dragging = true;
      }
      if (!dragging) return;
      e.preventDefault();
      dx = rawDx;
      var progress = Math.min(Math.abs(dx) / window.innerWidth, 1);
      var opacity = 1 - progress * 0.4;
      wrap.style.transform = 'translateX(' + dx + 'px) rotate(' + (dx * 0.02) + 'deg)';
      wrap.style.opacity = opacity;
    }, { passive: false });
    lbOv.addEventListener('touchend', function () {
      wrap.classList.remove('dragging');
      if (!dragging) return;
      var threshold = window.innerWidth * 0.15;
      if (Math.abs(dx) > threshold) {
        // Fling off screen, then show next
        var dir = dx > 0 ? -1 : 1;
        wrap.classList.add('snapping');
        wrap.style.transform = 'translateX(' + (dx > 0 ? '100vw' : '-100vw') + ')';
        wrap.style.opacity = '0';
        setTimeout(function () {
          lbShow(lbCurrent + dir);
          // Reset and slide in from opposite side
          wrap.classList.remove('snapping');
          wrap.style.transform = 'translateX(' + (dir > 0 ? '80px' : '-80px') + ')';
          wrap.style.opacity = '0.5';
          // Force reflow
          wrap.offsetHeight;
          wrap.classList.add('snapping');
          wrap.style.transform = 'translateX(0)';
          wrap.style.opacity = '1';
          setTimeout(function () { wrap.classList.remove('snapping'); wrap.style.transform = ''; wrap.style.opacity = ''; }, 300);
        }, 250);
      } else {
        // Snap back
        wrap.classList.add('snapping');
        wrap.style.transform = 'translateX(0)';
        wrap.style.opacity = '1';
        setTimeout(function () { wrap.classList.remove('snapping'); wrap.style.transform = ''; wrap.style.opacity = ''; }, 300);
      }
      dragging = false;
    });
  })();
})();

/* ─────────────────────────────────────────────────────────── */

/* ── Film, Album & Interest Data ── */
var filmData = [
  { title: "Do the Right Thing", year: "1989", director: "Spike Lee", genre: "Drama", plot: "On the hottest day of the year in Brooklyn, simmering racial tensions reach a boiling point, erupting into violence and forever changing a neighborhood.", img: "images/films/do-the-right-thing.jpg" },
  { title: "Eternal Sunshine of the Spotless Mind", year: "2004", director: "Michel Gondry", genre: "Romance / Sci-Fi", plot: "When a couple undergoes a procedure to erase each other from their memories, their subconscious fights to hold on to what they had.", img: "images/films/eternal-sunshine-of-the-spotless-mind.jpg" },
  { title: "Everything Everywhere All at Once", year: "2022", director: "Daniel Kwan, Daniel Scheinert", genre: "Action / Sci-Fi", plot: "A Chinese-American woman is swept up in an insane adventure where she alone can save existence by exploring other universes and connecting with the lives she could have led.", img: "images/films/everything-everywhere-all-at-once.jpg" },
  { title: "Finding Nemo", year: "2003", director: "Andrew Stanton", genre: "Animation / Adventure", plot: "After his son is captured and taken to Sydney, a timid clownfish sets out on a journey across the ocean, encountering numerous dangers and making unlikely friends along the way.", img: "images/films/finding-nemo-poster.jpg" },
  { title: "Hairspray", year: "2007", director: "Adam Shankman", genre: "Musical / Comedy", plot: "A pleasantly plump teen teaches 1960s Baltimore a thing or two about integration after landing a spot on a local TV dance show.", img: "images/films/hairspray-2007.jpg" },
  { title: "High and Low", year: "1963", director: "Akira Kurosawa", genre: "Thriller / Drama", plot: "A wealthy industrialist faces a moral crisis when his chauffeur's son is kidnapped by mistake, forcing him to choose between his fortune and a child's life.", img: "images/films/high-and-low.jpg" },
  { title: "Spider-Man: Into the Spider-Verse", year: "2018", director: "Bob Persichetti, Peter Ramsey, Rodney Rothman", genre: "Animation / Action", plot: "Teen Miles Morales becomes the Spider-Man of his reality and crosses paths with counterparts from other dimensions to stop a threat to all realities.", img: "images/films/into-the-spiderverse.jpg" },
  { title: "L.A. Confidential", year: "1997", director: "Curtis Hanson", genre: "Crime / Mystery", plot: "Three very different LAPD detectives investigate a series of murders in 1950s Los Angeles, uncovering corruption that reaches the highest levels.", img: "images/films/la-confidential.jpg" },
  { title: "Little Miss Sunshine", year: "2006", director: "Jonathan Dayton, Valerie Faris", genre: "Comedy / Drama", plot: "A dysfunctional family piles into a VW bus and road-trips to California so their daughter can compete in a beauty pageant.", img: "images/films/little-miss-sunshine-poster.jpg.webp" },
  { title: "The Mitchells vs. the Machines", year: "2021", director: "Michael Rianda", genre: "Animation / Comedy", plot: "A quirky, dysfunctional family's road trip is upended when they find themselves in the middle of a robot apocalypse and become humanity's unlikely last hope.", img: "images/films/mitchells-vs-the-machines.jpg" },
  { title: "Moonlight", year: "2016", director: "Barry Jenkins", genre: "Drama", plot: "A young African-American man grapples with his identity and sexuality while growing up in a rough Miami neighborhood across three defining chapters of his life.", img: "images/films/moonlight.jpg" },
  { title: "Parasite", year: "2019", director: "Bong Joon-ho", genre: "Thriller / Dark Comedy", plot: "Greed and class discrimination threaten the newly formed symbiotic relationship between a wealthy family and a destitute clan scheming to infiltrate their household.", img: "images/films/parasite.jpg" },
  { title: "Point Break", year: "1991", director: "Kathryn Bigelow", genre: "Action / Crime", plot: "An FBI agent goes undercover to catch a gang of bank robbers who may be surfers, only to be drawn into their adrenaline-fueled lifestyle.", img: "images/films/point-break.jpg" },
  { title: "Harry Potter and the Prisoner of Azkaban", year: "2004", director: "Alfonso Cuaron", genre: "Fantasy / Adventure", plot: "Harry's third year at Hogwarts is haunted by an escaped prisoner believed to be a dangerous killer with a connection to Harry's past.", img: "images/films/prisoner-of-azkaban.jpg" },
  { title: "Rear Window", year: "1954", director: "Alfred Hitchcock", genre: "Thriller / Mystery", plot: "A wheelchair-bound photographer spies on his neighbors from his apartment window and becomes convinced one of them has committed murder.", img: "images/films/rear-window.jpg" },
  { title: "Spider-Man 2", year: "2004", director: "Sam Raimi", genre: "Action / Superhero", plot: "Peter Parker struggles to balance his life as Spider-Man with his personal relationships while facing the brilliant but tortured Dr. Otto Octavius.", img: "images/films/spider-man-2.jpg" },
  { title: "Spirited Away", year: "2001", director: "Hayao Miyazaki", genre: "Animation / Fantasy", plot: "A young girl becomes trapped in a mysterious spirit world and must find the courage and resourcefulness to free herself and her parents.", img: "images/films/spirited-away.jpg" },
  { title: "The Thing", year: "1982", director: "John Carpenter", genre: "Horror / Sci-Fi", plot: "A research team in Antarctica is hunted by a shape-shifting alien that assumes the appearance of its victims, breeding paranoia and mistrust.", img: "images/films/the-thing.jpg" },
  { title: "Up", year: "2009", director: "Pete Docter", genre: "Animation / Adventure", plot: "A 78-year-old balloon salesman ties thousands of balloons to his house and flies to South America, fulfilling a lifelong dream — with an unexpected stowaway.", img: "images/films/up.jpg.webp" }
];

var albumData = [
  { title: "Blonde", artist: "Frank Ocean", year: "2016", img: "images/albums/blonde---frank-ocean.jpg", spotify: "https://open.spotify.com/album/3mH6qwIy9crq0I9YQbOuDf", apple: "https://music.apple.com/us/album/blonde/1146195596" },
  { title: "Dookie", artist: "Green Day", year: "1994", img: "images/albums/dookie---green-day.jpg", spotify: "https://open.spotify.com/album/4uG8q3GPuWHQlRbswMIRS6", apple: "https://music.apple.com/us/album/dookie/1160081985" },
  { title: "Hadestown", artist: "Original Broadway Cast", year: "2019", img: "images/albums/hadestown---original-broadway-cast.jpg", spotify: "https://open.spotify.com/album/1J1yxODbNlqKbwRqJxYJUP", apple: "https://music.apple.com/us/album/hadestown-original-broadway-cast-recording/1466351033" },
  { title: "Abraxas", artist: "Santana", year: "1970", img: "images/albums/abraxas---santana.jpg", spotify: "https://open.spotify.com/album/1CHUXwuge9A7L2KiA3vnR6", apple: "https://music.apple.com/us/album/abraxas/871146591" },
  { title: "Short n' Sweet", artist: "Sabrina Carpenter", year: "2024", img: "images/albums/short-n-sweet---sabrina-carpenter.jpg", spotify: "https://open.spotify.com/album/3iPSVi54hsacKKl1xIR2eH", apple: "https://music.apple.com/us/album/short-n-sweet/1750307020" },
  { title: "What's Going On", artist: "Marvin Gaye", year: "1971", img: "images/albums/whats-going-on---marvin-gaye.jpg", spotify: "https://open.spotify.com/album/2v6ANhWhZBUKkg6pJJBs3B", apple: "https://music.apple.com/us/album/whats-going-on/1538081586" },
  { title: "A Larum", artist: "Johnny Flynn", year: "2008", img: "images/albums/a-larum---johnny-flynn.jpg", spotify: "https://open.spotify.com/album/4si1HNK1gPFAYfONE19eih", apple: "https://music.apple.com/us/album/a-larum/1440749445" },
  { title: "Gypsy", artist: "2024 Broadway Cast", year: "2024", img: "images/albums/gypsy---2024-broadway-cast.jpg", spotify: "https://open.spotify.com/album/5PA6UdeWgZ5B3308hc7X0S", apple: "https://music.apple.com/us/album/gypsy-starring-audra-mcdonald-2024-broadway-cast-recording/1806741745" },
  { title: "3 Feet High and Rising", artist: "De La Soul", year: "1989", img: "images/albums/3-feet-high-and-rising---de-la-soul.jpeg", spotify: "https://open.spotify.com/album/34LxHI9x14qXUOS8AWRrYD", apple: "https://music.apple.com/us/album/3-feet-high-and-rising/1657705063" },
  { title: "Sketches of Spain", artist: "Miles Davis", year: "1960", img: "images/albums/sketches-in-spain---miles-davis.jpg", spotify: "https://open.spotify.com/album/56WqCnM5giX57Jr3aAN2aK", apple: "https://music.apple.com/us/album/sketches-of-spain/832060615" },
  { title: "Buzzkill", artist: "Lyn Lapid", year: "2023", img: "images/albums/buzzkill---lyn-lapid.jpeg", spotify: "https://open.spotify.com/album/41oBhRyeuyMHkVdp2LYVJE", apple: "https://music.apple.com/us/album/buzzkill/1797221214" },
  { title: "Speaking in Tongues", artist: "Talking Heads", year: "1983", img: "images/albums/speaking-in-tongues---talking-heads.jpg", spotify: "https://open.spotify.com/album/78MM8HrabEGPLVWaJkM2t1", apple: "https://music.apple.com/us/album/speaking-in-tongues/300202199" },
  { title: "Cowboy Carter", artist: "Beyonce", year: "2024", img: "images/albums/beyonce---cowboy-carter.jpg", spotify: "https://open.spotify.com/album/6BzxX6zkDsYKFJ04ziU5xQ", apple: "https://music.apple.com/us/album/cowboy-carter/1738363766" },
  { title: "Next to Normal", artist: "Original London Cast", year: "2025", img: "images/albums/next-to-normal---original-london-cast.jpeg", spotify: "https://open.spotify.com/album/5IWkvoiJdAJgbebPS47Uy6", apple: "https://music.apple.com/us/album/next-to-normal-original-london-cast-recording/1815393191" },
  { title: "Can't Buy a Thrill", artist: "Steely Dan", year: "1972", img: "images/albums/cant-buy-a-thrill---steely-dan.jpg", spotify: "https://open.spotify.com/album/6DlSUW5gmq6Byc3osKDJ2p", apple: "https://music.apple.com/us/album/cant-buy-a-thrill/1650885288" },
  { title: "The Art of Loving", artist: "Olivia Dean", year: "2024", img: "images/albums/the-art-of-loving---olivia-dean.jpg", spotify: "https://open.spotify.com/album/0l8zYqoUeBYg47Gmevq9HZ", apple: "https://music.apple.com/us/album/the-art-of-loving/1817609404" },
  { title: "Maybe Happy Ending", artist: "Original Broadway Cast", year: "2024", img: "images/albums/maybe-happy-ending---original-broadway-cast.jpg", spotify: "https://open.spotify.com/album/6wy7RABc6fzVw6kEzQOkYd", apple: "https://music.apple.com/us/album/maybe-happy-ending-original-broadway-cast-recording/1796379586" },
  { title: "Eternal Sunshine", artist: "Ariana Grande", year: "2024", img: "images/albums/eternal-sunshine---ariana-grande.jpeg", spotify: "https://open.spotify.com/album/5EYKrEDnKhhcNxGedaRQeK", apple: "https://music.apple.com/us/album/eternal-sunshine/1725877944" }
];

var interestData = [
  {
    id: "musical-theater",
    title: "Musical Theater",
    images: [
      { src: "images/interests/musical-hamilton.jpeg", alt: "Hamilton at Pantages" },
      { src: "images/interests/musical-legally-blonde.jpg", alt: "Legally Blonde The Musical" },
      { src: "images/interests/musical-mousetrap.jpeg", alt: "The Mousetrap" }
    ],
    body: "From Sondheim's intricate puzzle-box lyrics to Howard Ashman's gift for making animated characters feel painfully human, musical theater is where music and storytelling fuse into something neither can achieve alone. There's nothing quite like a well-constructed eleven o'clock number that recontextualizes everything you've seen.",
    video: null
  },
  {
    id: "film-tv",
    title: "Film & Television",
    body: "An obsessive consumer and thoughtful analyst of what's on screen \u2014 and what's going on behind the camera. I'm endlessly fascinated by the craft of visual storytelling: the choices directors make, how editors shape emotion, and the invisible architecture that makes a scene land.",
    video: null
  },
  {
    id: "animation",
    title: "Animation",
    body: "Hands down the most underappreciated art form. Animation tells truths live action can't reach. It can externalize internal states, bend physics for emotional effect, and create worlds that feel more real than reality. The idea that it's 'for kids' is one of the great cultural misunderstandings.",
    video: null
  },
  {
    id: "pro-wrestling",
    title: "Professional Wrestling",
    body: "I'm not joking. Professional wrestling is a fascinating part of Americana that blurs the line between reality and narrative in ways no other art form does. It's live athletic theater with long-form serialized storytelling, crowd psychology, and genuine physical stakes. The best wrestlers are actors, athletes, and improvisers all at once.",
    video: "https://www.youtube.com/embed/BQCPj-bGYro"
  },
  {
    id: "basketball-tennis",
    title: "Playing Basketball & Tennis",
    images: [
      { src: "images/interests/basketball-dad.jpg", alt: "Basketball with Dad" },
      { src: "images/interests/tennis-lisa.jpg", alt: "Tennis with Lisa" }
    ],
    body: "On the court, not just from the couch. Basketball demands your full presence \u2014 there's no time to think about anything else when someone's driving to the hoop. It's meditation through movement, and the pickup game community is one of the most democratic spaces in American life.",
    video: null
  },
  {
    id: "cat-dad",
    title: "Cat Dad Extraordinaire",
    images: [
      { src: "images/interests/cat-elie.jpg", alt: "Chris and Baby Elie" },
      { src: "images/interests/cat-juneau.jpg", alt: "Chris Facetime with Juneau" }
    ],
    body: "Elie and Juneau are Balinese cats. They are perfect. Elie is a seal-point diva who believes she runs the household (she does). Juneau is a blue-point sweetheart who follows me from room to room. All other pets are fine, I suppose.",
    video: null
  },
  {
    id: "sports",
    title: "Sports Fanatic",
    images: [
      { src: "images/interests/sports-baby-football.jpg", alt: "Baby Football" },
      { src: "images/interests/sports-dodgers.jpg", alt: "Chris and Dad at Dodgers Game" },
      { src: "images/interests/sports-soccer.jpg", alt: "Chris playing soccer" },
      { src: "images/interests/sports-orioles.jpg", alt: "Lisa and Chris at Orioles Game" }
    ],
    body: "Orioles. Dodgers. Lakers. Ravens. Yes, all four. My allegiances are multifaceted and I stand by them. Sports fandom is about community, narrative, and the rare thrill of watching something unfold that no screenwriter could have planned.",
    video: null
  },
  {
    id: "old-bay",
    title: "Old Bay Seasoning",
    images: [
      { src: "images/interests/oldbay-collection.jpg", alt: "My personal Old Bay Collection" },
      { src: "images/interests/oldbay-beanie.jpg", alt: "My Old Bay Beanie" },
      { src: "images/interests/oldbay-plush.jpg", alt: "Old Bay Plush" }
    ],
    body: "Baltimore in a can. I put Old Bay on almost everything I cook — eggs, fries, popcorn, pasta, you name it. It reminds me of home. I even make a homemade Old Bay Caramel Ice Cream that has earned genuine testimonials from people who were fully prepared to hate it. The obsession is real, and I stand by every shake.",
    video: null
  },
  {
    id: "instruments",
    title: "Guitar, Trumpet & Ukulele",
    body: "Three very different instruments, one common thread: making noise that sounds intentional. Guitar is for when I want to sing along, trumpet is for when I want to feel like I'm in a jazz club, and ukulele is for when I want to annoy my roommates. Piano is next on the list.",
    video: null
  },
  {
    id: "karaoke",
    title: "Karaoke",
    body: "A safe space for commitment, charisma, and questionable song choices. Absolutely no irony \u2014 I mean every word. Karaoke is the great equalizer: it doesn't matter if you can sing, it matters if you commit. The best karaoke performances are acts of pure, unselfconscious joy.",
    video: null
  }
];

/* ─────────────────────────────────────────────────────────── */

(function() {
  function initCarousel(marqueeEl, dataArray, category) {
    var track = marqueeEl.querySelector('.marquee-track');
    if (!track) return;

    // Remove any CSS animation
    track.style.animation = 'none';

    var marqueeVisible = true;
    var marqueeAnimId = null;

    var offset = 0;
    var speed = 0.5;
    var currentSpeed = speed;
    var isDragging = false;
    var dragStartX = 0;
    var dragStartOffset = 0;
    var velocity = 0;
    var isHovering = false;
    var didDrag = false;
    var mouseIsDown = false;

    function getHalfWidth() { return track.scrollWidth / 2; }

    function wrapOffset() {
      var half = getHalfWidth();
      if (half <= 0) return;
      while (offset <= -half) offset += half;
      while (offset > 0) offset -= half;
    }

    function applyTransform() {
      track.style.transform = 'translate3d(' + offset + 'px, 0, 0)';
    }

    // Cursor-driven speed
    marqueeEl.addEventListener('mouseenter', function() { isHovering = true; });
    marqueeEl.addEventListener('mouseleave', function() {
      isHovering = false;
      currentSpeed = speed;
    });

    marqueeEl.addEventListener('mousemove', function(e) {
      if (isDragging) return;
      var rect = marqueeEl.getBoundingClientRect();
      var relX = (e.clientX - rect.left) / rect.width;
      if (relX < 0.25) {
        var intensity = 1 - (relX / 0.25);
        currentSpeed = -speed * (1 + intensity * 5);
      } else if (relX > 0.75) {
        var intensity2 = (relX - 0.75) / 0.25;
        currentSpeed = speed * (1 + intensity2 * 5);
      } else {
        currentSpeed = speed * 0.5;
      }
    });

    // Drag support
    marqueeEl.addEventListener('mousedown', function(e) {
      mouseIsDown = true;
      didDrag = false;
      dragStartX = e.clientX;
      dragStartOffset = offset;
      velocity = 0;
    });

    window.addEventListener('mousemove', function(e) {
      if (!mouseIsDown) return;
      var dx = e.clientX - dragStartX;
      if (Math.abs(dx) > 4) {
        if (!isDragging) { isDragging = true; marqueeEl.classList.add('dragging'); }
        didDrag = true;
      }
      if (isDragging) {
        e.preventDefault();
        velocity = (dragStartOffset + dx) - offset;
        offset = dragStartOffset + dx;
        wrapOffset();
        applyTransform();
      }
    });

    window.addEventListener('mouseup', function() {
      if (!mouseIsDown) return;
      mouseIsDown = false;
      if (isDragging) {
        isDragging = false;
        marqueeEl.classList.remove('dragging');
        setTimeout(function() { didDrag = false; }, 50);
      }
    });

    // Touch support with momentum tracking
    var touchHistory = [];
    marqueeEl.addEventListener('touchstart', function(e) {
      isDragging = true;
      didDrag = false;
      dragStartX = e.touches[0].clientX;
      dragStartOffset = offset;
      velocity = 0;
      touchHistory = [{ x: e.touches[0].clientX, t: Date.now() }];
    }, { passive: true });

    marqueeEl.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      var dx = e.touches[0].clientX - dragStartX;
      if (Math.abs(dx) > 4) didDrag = true;
      offset = dragStartOffset + dx;
      wrapOffset();
      applyTransform();
      var now = Date.now();
      touchHistory.push({ x: e.touches[0].clientX, t: now });
      // Keep only last 80ms of touch history for velocity calc
      while (touchHistory.length > 1 && now - touchHistory[0].t > 80) touchHistory.shift();
    }, { passive: true });

    marqueeEl.addEventListener('touchend', function() {
      isDragging = false;
      // Calculate flick velocity from recent touch history
      if (touchHistory.length >= 2) {
        var first = touchHistory[0];
        var last = touchHistory[touchHistory.length - 1];
        var dt = last.t - first.t;
        if (dt > 0 && dt < 200) {
          velocity = (last.x - first.x) / dt * 16; // scale to per-frame (~16ms)
          // Cap velocity for a controlled feel
          velocity = Math.max(-25, Math.min(25, velocity));
        }
      }
      touchHistory = [];
      setTimeout(function() { didDrag = false; }, 10);
    });

    // Click handler for items
    var items = track.querySelectorAll('.marquee-item');
    items.forEach(function(item, idx) {
      var realIndex = idx % dataArray.length;
      var title = dataArray[realIndex] ? dataArray[realIndex].title : '';
      item.setAttribute('role', 'button');
      item.setAttribute('tabindex', '0');
      if (title) item.setAttribute('aria-label', title);
      item.addEventListener('click', function() {
        if (didDrag) return;
        openProjectModal(category, idx % dataArray.length);
      });
      item.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProjectModal(category, idx % dataArray.length);
        }
      });
    });

    // Animation loop
    function tick() {
      if (!marqueeVisible) { marqueeAnimId = null; return; }
      if (!isDragging) {
        if (Math.abs(velocity) > 0.3) {
          offset += velocity;
          velocity *= 0.95;
        } else {
          velocity = 0;
          offset -= (isHovering ? currentSpeed : speed);
        }
        wrapOffset();
        applyTransform();
      }
      marqueeAnimId = requestAnimationFrame(tick);
    }
    marqueeAnimId = requestAnimationFrame(tick);

    // Pause marquee when offscreen
    var marqueeSection = marqueeEl.closest('.taste-marquee-section');
    if (marqueeSection && 'IntersectionObserver' in window) {
      new IntersectionObserver(function(entries) {
        marqueeVisible = entries[0].isIntersecting;
        if (marqueeVisible && !marqueeAnimId) { marqueeAnimId = requestAnimationFrame(tick); }
      }, { threshold: 0 }).observe(marqueeSection);
    }
  }

  // Initialize both carousels
  var marquees = document.querySelectorAll('.taste-marquee');
  if (marquees[0]) initCarousel(marquees[0], filmData, 'film');
  if (marquees[1]) initCarousel(marquees[1], albumData, 'album');
})();

(function() {
  var modal = document.getElementById('projectModal');
  var modalContent = document.getElementById('projectModalContent');
  var modalCounter = document.getElementById('projectModalCounter');
  var prevBtn = document.getElementById('projectModalPrev');
  var nextBtn = document.getElementById('projectModalNext');
  var currentCategory = 'film';
  var currentIndex = 0;

  function getCurrentData() {
    if (currentCategory === 'film') return filmData;
    if (currentCategory === 'album') return albumData;
    return null;
  }

  function renderFilmModal() {
    var data = getCurrentData();
    var item = data[currentIndex];
    modalContent.className = 'project-modal-content';
    modalContent.textContent = '';

    var posterDiv = document.createElement('div');
    posterDiv.className = 'project-modal-poster';
    var posterImg = document.createElement('img');
    posterImg.src = item.img;
    posterImg.alt = item.title;
    posterDiv.appendChild(posterImg);

    var infoDiv = document.createElement('div');
    infoDiv.className = 'project-modal-info';

    var typeEl = document.createElement('div');
    typeEl.className = 'project-modal-type';
    typeEl.textContent = 'Film';

    var titleEl = document.createElement('h2');
    titleEl.className = 'project-modal-title';
    titleEl.textContent = item.title;

    var yearEl = document.createElement('div');
    yearEl.className = 'project-modal-year';
    yearEl.textContent = item.year;

    var metaDiv = document.createElement('div');
    metaDiv.className = 'project-modal-meta';

    function addMetaRow(label, value) {
      var row = document.createElement('div');
      row.className = 'project-modal-meta-row';
      var labelEl = document.createElement('span');
      labelEl.className = 'project-modal-meta-label';
      labelEl.textContent = label;
      var valEl = document.createElement('span');
      valEl.className = 'project-modal-meta-value';
      valEl.textContent = value;
      row.appendChild(labelEl);
      row.appendChild(valEl);
      metaDiv.appendChild(row);
    }

    addMetaRow('Director', item.director);
    addMetaRow('Genre', item.genre);

    var loglineEl = document.createElement('div');
    loglineEl.className = 'project-modal-logline';
    loglineEl.textContent = item.plot;

    infoDiv.appendChild(typeEl);
    infoDiv.appendChild(titleEl);
    infoDiv.appendChild(yearEl);
    infoDiv.appendChild(metaDiv);
    infoDiv.appendChild(loglineEl);

    modalContent.appendChild(posterDiv);
    modalContent.appendChild(infoDiv);

    modalCounter.textContent = (currentIndex + 1) + ' / ' + data.length;
    prevBtn.style.display = '';
    nextBtn.style.display = '';
    modalCounter.style.display = '';
  }

  function renderAlbumModal() {
    var data = getCurrentData();
    var item = data[currentIndex];
    modalContent.className = 'project-modal-content';
    modalContent.textContent = '';

    var posterDiv = document.createElement('div');
    posterDiv.className = 'project-modal-poster album-modal-poster';
    var posterImg = document.createElement('img');
    posterImg.src = item.img;
    posterImg.alt = item.title;
    posterDiv.appendChild(posterImg);

    var infoDiv = document.createElement('div');
    infoDiv.className = 'project-modal-info';

    var typeEl = document.createElement('div');
    typeEl.className = 'project-modal-type';
    typeEl.textContent = 'Album';

    var titleEl = document.createElement('h2');
    titleEl.className = 'project-modal-title';
    titleEl.textContent = item.title;

    var yearEl = document.createElement('div');
    yearEl.className = 'project-modal-year';
    yearEl.textContent = item.artist + ' \u00B7 ' + item.year;

    var linksDiv = document.createElement('div');
    linksDiv.className = 'album-links';

    if (item.spotify) {
      var spotifyLink = document.createElement('a');
      spotifyLink.href = item.spotify;
      spotifyLink.target = '_blank';
      spotifyLink.rel = 'noopener';
      spotifyLink.className = 'album-link-btn spotify';
      spotifyLink.textContent = '\u25B6 Spotify';
      linksDiv.appendChild(spotifyLink);
    }

    if (item.apple) {
      var appleLink = document.createElement('a');
      appleLink.href = item.apple;
      appleLink.target = '_blank';
      appleLink.rel = 'noopener';
      appleLink.className = 'album-link-btn apple-music';
      appleLink.textContent = '\u25B6 Apple Music';
      linksDiv.appendChild(appleLink);
    }

    infoDiv.appendChild(typeEl);
    infoDiv.appendChild(titleEl);
    infoDiv.appendChild(yearEl);
    infoDiv.appendChild(linksDiv);

    modalContent.appendChild(posterDiv);
    modalContent.appendChild(infoDiv);

    modalCounter.textContent = (currentIndex + 1) + ' / ' + data.length;
    prevBtn.style.display = '';
    nextBtn.style.display = '';
    modalCounter.style.display = '';
  }

  function renderInterestModal() {
    var item = interestData[currentIndex];
    modalContent.className = 'interest-modal-content';
    modalContent.textContent = '';

    // Get icon SVG from the actual interest card
    var cards = document.querySelectorAll('.interest-card');
    var iconWrapSource = null;
    if (cards[currentIndex]) {
      iconWrapSource = cards[currentIndex].querySelector('.interest-icon-wrap');
    }

    var headerDiv = document.createElement('div');
    headerDiv.className = 'interest-modal-header';

    var iconDiv = document.createElement('div');
    iconDiv.className = 'interest-modal-icon';
    if (iconWrapSource) {
      // Clone the SVG icon node from the page's own static elements
      Array.prototype.forEach.call(iconWrapSource.childNodes, function(child) {
        iconDiv.appendChild(child.cloneNode(true));
      });
    }

    var titleEl = document.createElement('h2');
    titleEl.className = 'interest-modal-title';
    titleEl.textContent = item.title;

    headerDiv.appendChild(iconDiv);
    headerDiv.appendChild(titleEl);

    var bodyEl = document.createElement('div');
    bodyEl.className = 'interest-modal-body';
    bodyEl.textContent = item.body;

    modalContent.appendChild(headerDiv);
    modalContent.appendChild(bodyEl);

    if (item.video) {
      var iframe = document.createElement('iframe');
      iframe.className = 'interest-modal-video';
      iframe.src = item.video;
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
      iframe.allowFullscreen = true;
      modalContent.appendChild(iframe);
    }

    if (item.images && item.images.length) {
      var gallery = document.createElement('div');
      gallery.className = 'interest-modal-gallery';
      item.images.forEach(function(img) {
        var imgEl = document.createElement('img');
        imgEl.src = img.src;
        imgEl.alt = img.alt;
        imgEl.loading = 'lazy';
        imgEl.className = 'interest-modal-photo';
        gallery.appendChild(imgEl);
      });
      modalContent.appendChild(gallery);
    }

    // Hide nav for interests
    prevBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    modalCounter.style.display = 'none';
  }

  window.openProjectModal = function(category, index) {
    currentCategory = category;
    currentIndex = index;
    if (category === 'film') renderFilmModal();
    else if (category === 'album') renderAlbumModal();
    else if (category === 'interest') renderInterestModal();
    modal.classList.toggle('interest-mode', category === 'interest');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeProjectModal() {
    modal.classList.remove('open');
    modal.classList.remove('interest-mode');
    document.body.style.overflow = '';
    // Stop YouTube if playing
    var iframe = modalContent.querySelector('iframe');
    if (iframe) iframe.src = '';
  }

  function navigateProjectModal(dir) {
    var data = getCurrentData();
    if (!data) return;
    currentIndex = (currentIndex + dir + data.length) % data.length;
    if (currentCategory === 'film') renderFilmModal();
    else if (currentCategory === 'album') renderAlbumModal();
  }

  document.getElementById('projectModalClose').addEventListener('click', closeProjectModal);
  prevBtn.addEventListener('click', function() { navigateProjectModal(-1); });
  nextBtn.addEventListener('click', function() { navigateProjectModal(1); });
  modal.addEventListener('click', function(e) { if (e.target === modal) closeProjectModal(); });

  document.addEventListener('keydown', function(e) {
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeProjectModal();
    if (e.key === 'ArrowLeft' && currentCategory !== 'interest') navigateProjectModal(-1);
    if (e.key === 'ArrowRight' && currentCategory !== 'interest') navigateProjectModal(1);
  });

  // Touch drag for project modal — content follows your finger
  (function () {
    var startX = 0, startY = 0, dragging = false, locked = false, dx = 0;
    modal.addEventListener('touchstart', function (e) {
      if (!modal.classList.contains('open') || currentCategory === 'interest') return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragging = false; locked = false; dx = 0;
      modalContent.classList.remove('snapping');
      modalContent.classList.add('dragging');
    }, { passive: true });
    modal.addEventListener('touchmove', function (e) {
      if (locked || currentCategory === 'interest') return;
      var cx = e.touches[0].clientX, cy = e.touches[0].clientY;
      var rawDx = cx - startX, rawDy = cy - startY;
      if (!dragging && (Math.abs(rawDx) > 8 || Math.abs(rawDy) > 8)) {
        if (Math.abs(rawDy) > Math.abs(rawDx)) { locked = true; modalContent.classList.remove('dragging'); return; }
        dragging = true;
      }
      if (!dragging) return;
      e.preventDefault();
      dx = rawDx;
      var progress = Math.min(Math.abs(dx) / window.innerWidth, 1);
      var opacity = 1 - progress * 0.4;
      modalContent.style.transform = 'translateX(' + dx + 'px)';
      modalContent.style.opacity = opacity;
    }, { passive: false });
    modal.addEventListener('touchend', function () {
      modalContent.classList.remove('dragging');
      if (!dragging) return;
      var threshold = window.innerWidth * 0.15;
      if (Math.abs(dx) > threshold) {
        var dir = dx > 0 ? -1 : 1;
        modalContent.classList.add('snapping');
        modalContent.style.transform = 'translateX(' + (dx > 0 ? '100vw' : '-100vw') + ')';
        modalContent.style.opacity = '0';
        setTimeout(function () {
          navigateProjectModal(dir);
          modalContent.classList.remove('snapping');
          modalContent.style.transform = 'translateX(' + (dir > 0 ? '80px' : '-80px') + ')';
          modalContent.style.opacity = '0.5';
          modalContent.offsetHeight;
          modalContent.classList.add('snapping');
          modalContent.style.transform = 'translateX(0)';
          modalContent.style.opacity = '1';
          setTimeout(function () { modalContent.classList.remove('snapping'); modalContent.style.transform = ''; modalContent.style.opacity = ''; }, 300);
        }, 250);
      } else {
        modalContent.classList.add('snapping');
        modalContent.style.transform = 'translateX(0)';
        modalContent.style.opacity = '1';
        setTimeout(function () { modalContent.classList.remove('snapping'); modalContent.style.transform = ''; modalContent.style.opacity = ''; }, 300);
      }
      dragging = false;
    });
  })();

  // Wire interest cards
  var cards = document.querySelectorAll('.interest-card');
  cards.forEach(function(card, i) {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', (card.querySelector('h3') ? card.querySelector('h3').textContent : 'Interest') + ' — click to learn more');
    card.addEventListener('click', function() {
      openProjectModal('interest', i);
    });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); }
    });
  });
})();

/* ─────────────────────────────────────────────────────────── */

(function () {
  var phrases = [
    'AI Generalist',
    'Entrepreneurship',
    'Improv',
    'Analytics',
    'Storytelling',
    'Emerging Tech',
    'Cat Dad',
    '& A Lot More'
  ];
  var pill = document.querySelector('.hero-tag-rotate');
  if (!pill) return;
  var current = pill.querySelector('span');
  var idx = 0;
  var timer;

  function advance() {
    idx = (idx + 1) % phrases.length;
    current.classList.remove('active');
    current.classList.add('exiting');
    var next = document.createElement('span');
    next.textContent = phrases[idx];
    next.classList.add('entering');
    pill.appendChild(next);
    next.offsetHeight;
    next.classList.remove('entering');
    next.classList.add('active');
    var old = current;
    setTimeout(function () { old.remove(); }, 500);
    current = next;
  }

  timer = setInterval(advance, 2400);

  // Pause rotation when hero is offscreen
  var heroEl = document.getElementById('hero');
  if (heroEl && 'IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) {
        if (!timer) timer = setInterval(advance, 2400);
      } else {
        if (timer) { clearInterval(timer); timer = null; }
      }
    }, { threshold: 0 }).observe(heroEl);
  }
})();

/* ─────────────────────────────────────────────────────────── */

(function() {
  function stagger(selector, baseDelay) {
    document.querySelectorAll(selector).forEach(function(el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (baseDelay + i * 0.07) + 's';
    });
  }
  stagger('.interest-card.reveal', 0);
  stagger('.contact-card', 0);
  // Franchise logos: stagger via their own filter transition (no reveal)
  document.querySelectorAll('.franchise-logo').forEach(function(el, i) {
    el.style.transitionDelay = (i * 0.05) + 's';
  });
})();

/* ─────────────────────────────────────────────────────────── */

(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(function (el) { observer.observe(el); });
})();

/* ─────────────────────────────────────────────────────────── */

(function() {
  var hero = document.getElementById('hero');
  var name = document.querySelector('.hero-name');
  if (!hero || !name) return;
  var isMobile = 'ontouchstart' in window;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isMobile || prefersReduced) return;

  var tiltRafPending = false;
  var tiltMouseX = 0, tiltMouseY = 0;
  function updateTilt() {
    tiltRafPending = false;
    var rect = hero.getBoundingClientRect();
    var x = (tiltMouseX - rect.left) / rect.width - 0.5;
    var y = (tiltMouseY - rect.top) / rect.height - 0.5;
    var maxTilt = 3;
    name.style.transform = 'perspective(800px) rotateY(' + (x * maxTilt) + 'deg) rotateX(' + (-y * maxTilt) + 'deg)';
  }
  hero.addEventListener('mousemove', function(e) {
    tiltMouseX = e.clientX;
    tiltMouseY = e.clientY;
    if (!tiltRafPending) {
      tiltRafPending = true;
      requestAnimationFrame(updateTilt);
    }
  });

  hero.addEventListener('mouseleave', function() {
    name.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg)';
  });
})();

/* ─────────────────────────────────────────────────────────── */

(function() {
  var hero = document.getElementById('hero');
  var glow = document.getElementById('heroCursorGlow');
  if (!hero || !glow) return;
  var isMobile = 'ontouchstart' in window;
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isMobile || prefersReduced) return;

  glow.style.left = '0';
  glow.style.top = '0';

  hero.addEventListener('mousemove', function(e) {
    var rect = hero.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    glow.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) translate(-50%, -50%)';
    glow.style.opacity = '1';
  });

  hero.addEventListener('mouseleave', function() {
    glow.style.opacity = '0';
  });
})();

/* ─────────────────────────────────────────────────────────── */

(function() {
  var el = document.getElementById('heroGreeting');
  if (!el) return;
  var h = new Date().getHours();
  var greeting = h < 12 ? 'Good morning — I\'m' : h < 17 ? 'Good afternoon — I\'m' : 'Good evening — I\'m';
  el.textContent = greeting;
})();

/* ─────────────────────────────────────────────────────────── */

(function() {
  var progressBar = document.getElementById('scrollProgress');
  var nav = document.querySelector('nav');
  var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  var darkSections = document.querySelectorAll('#writing, #contact');
  var sections = [];
  navLinks.forEach(function(link) {
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    if (section) sections.push({ el: section, link: link });
  });

  var scrollTicking = false;
  function onScroll() {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var fraction = docHeight > 0 ? scrollTop / docHeight : 0;
    if (progressBar) progressBar.style.transform = 'scaleX(' + fraction + ')';

    // Active nav
    var current = '';
    sections.forEach(function(s) {
      var rect = s.el.getBoundingClientRect();
      if (rect.top <= 100) current = s.link.getAttribute('href').slice(1);
    });
    navLinks.forEach(function(link) {
      link.classList.toggle('nav-active', link.getAttribute('href') === '#' + current);
    });

    // Nav dark/light
    var isDark = false;
    darkSections.forEach(function(section) {
      var rect = section.getBoundingClientRect();
      if (rect.top <= 60 && rect.bottom >= 60) isDark = true;
    });
    if (nav) {
      if (document.documentElement.getAttribute('data-theme') === 'dark') {
        nav.classList.add('nav-dark');
      } else {
        nav.classList.toggle('nav-dark', isDark);
      }
    }

    // Back to top
    var backBtn = document.getElementById('backToTop');
    if (backBtn) backBtn.classList.toggle('visible', scrollTop > window.innerHeight);
    scrollTicking = false;
  }

  window.addEventListener('scroll', function() {
    if (!scrollTicking) {
      scrollTicking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();
})();

/* ─────────────────────────────────────────────────────────── */

(function() {
  var stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Capture the authored final values up-front so we can always restore them
  stats.forEach(function(el) {
    if (!el.dataset.finalText) el.dataset.finalText = el.textContent.trim();
  });

  function parse(text) {
    var suffix = '';
    var target = parseInt(text, 10);
    if (text.indexOf('+') !== -1) suffix = '+';
    else if (text.indexOf('\u00d7') !== -1 || text.indexOf('x') !== -1) suffix = '\u00d7';
    return { target: target, suffix: suffix };
  }

  function setFinal(el) {
    el.textContent = el.dataset.finalText;
  }

  function animateCounter(el) {
    var parsed = parse(el.dataset.finalText);
    if (isNaN(parsed.target)) { setFinal(el); return; }
    if (reduced) { setFinal(el); return; }

    var duration = 1500;
    var start = performance.now();
    el.textContent = '0' + parsed.suffix;

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(eased * parsed.target);
      el.textContent = current + parsed.suffix;
      if (progress < 1) requestAnimationFrame(step);
      else setFinal(el);
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    stats.forEach(setFinal);
    return;
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

  // On bfcache restore, make sure values are settled
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) stats.forEach(setFinal);
  });
})();

/* ─────────────────────────────────────────────────────────── */

(function() {
  var v = document.getElementById('poolVideo');
  if (!v) return;
  v.playbackRate = 0.75;
  var writingSection = document.getElementById('writing');
  if (writingSection && 'IntersectionObserver' in window) {
    new IntersectionObserver(function(entries) {
      if (entries[0].isIntersecting) { v.play().catch(function(){}); }
      else { v.pause(); }
    }, { threshold: 0 }).observe(writingSection);
  } else {
    v.play().catch(function(){});
  }
})();

/* ─────────────────────────────────────────────────────────── */

(function() {
  if ('ontouchstart' in window) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.hero-cta .btn').forEach(function(btn) {
    var magRafPending = false;
    var magMouseX = 0, magMouseY = 0;
    function updateMagnetic() {
      magRafPending = false;
      var rect = btn.getBoundingClientRect();
      var x = magMouseX - rect.left - rect.width / 2;
      var y = magMouseY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
    }
    btn.addEventListener('mousemove', function(e) {
      magMouseX = e.clientX;
      magMouseY = e.clientY;
      if (!magRafPending) {
        magRafPending = true;
        requestAnimationFrame(updateMagnetic);
      }
    });
    btn.addEventListener('mouseleave', function() {
      btn.style.transform = '';
    });
  });
})();

/* ─────────────────────────────────────────────────────────── */

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

  var resizeTimer;
  function resize() {
    canvas.width = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
    // Reinitialize particle positions for new dimensions
    for (var i = 0; i < particles.length; i++) {
      var p = createParticle(i);
      particles[i].baseX = p.baseX;
      particles[i].baseY = p.baseY;
      particles[i].x = p.x;
      particles[i].y = p.y;
    }
  }
  resize();
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  function createParticle(i) {
    var angle = Math.random() * Math.PI * 2;
    var dist = 0.3 + Math.random() * 0.7;
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var x = cx + Math.cos(angle) * dist * cx;
    var y = cy + Math.sin(angle) * dist * cy;
    x = Math.max(10, Math.min(canvas.width - 10, x));
    y = Math.max(10, Math.min(canvas.height - 10, y));
    return {
      x: x, y: y,
      baseX: x, baseY: y,
      size: 0.5 + Math.random() * 1,
      opacity: 0.08 + Math.random() * 0.2,
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

  function centerFade(x, y) {
    var cx = canvas.width / 2;
    var cy = canvas.height / 2;
    var dx = (x - cx) / cx;
    var dy = (y - cy) / cy;
    var dist = Math.sqrt(dx * dx + dy * dy);
    return 0.2 + 0.8 * Math.min(dist / 0.6, 1);
  }

  var isVisible = true;
  var animId;
  var observer = new IntersectionObserver(function(entries) {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !animId) animate();
  }, { threshold: 0 });
  observer.observe(hero);

  var time = 0;
  function animate() {
    if (!isVisible) { animId = null; return; }
    time++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x = p.baseX + Math.sin(time * p.freq + p.phase) * 20;
      p.y = p.baseY + Math.cos(time * p.freq * 0.7 + p.phase) * 15;
      p.baseX += p.speedX;
      p.baseY += p.speedY;
      if (p.baseX < 10 || p.baseX > canvas.width - 10) p.speedX *= -1;
      if (p.baseY < 10 || p.baseY > canvas.height - 10) p.speedY *= -1;

      var dmx = p.x - mouseX;
      var dmy = p.y - mouseY;
      var mouseDist = Math.sqrt(dmx * dmx + dmy * dmy);
      if (mouseDist < REPEL_RADIUS && mouseDist > 0) {
        var force = (REPEL_RADIUS - mouseDist) / REPEL_RADIUS;
        p.x += (dmx / mouseDist) * force * 8;
        p.y += (dmy / mouseDist) * force * 8;
      }
    }

    for (var i = 0; i < particles.length; i++) {
      for (var j = i + 1; j < particles.length; j++) {
        var dx = particles[i].x - particles[j].x;
        var dy = particles[i].y - particles[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECTION_DIST) {
          var midX = (particles[i].x + particles[j].x) / 2;
          var midY = (particles[i].y + particles[j].y) / 2;
          var mouseDistToMid = Math.sqrt((midX - mouseX) * (midX - mouseX) + (midY - mouseY) * (midY - mouseY));
          if (mouseDistToMid < MOUSE_RADIUS) {
            var lineOpacity = (1 - dist / CONNECTION_DIST) * (1 - mouseDistToMid / MOUSE_RADIUS) * 0.15;
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

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var fade = centerFade(p.x, p.y);
      ctx.fillStyle = 'rgba(100, 120, 180, ' + (p.opacity * fade) + ')';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    animId = requestAnimationFrame(animate);
  }
  animate();
})();

/* ─────────────────────────────────────────────────────────── */

(function() {
  if ('ontouchstart' in window) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var cards = document.querySelectorAll('.interest-card');
  if (!cards.length) return;

  var PROXIMITY = 250;
  var cardRects = [];
  var glowRafPending = false;
  var glowMouseX = 0, glowMouseY = 0;

  function cacheCardRects() {
    cardRects = [];
    cards.forEach(function(card) {
      cardRects.push(card.getBoundingClientRect());
    });
  }
  cacheCardRects();
  window.addEventListener('resize', cacheCardRects);

  function updateGlow() {
    glowRafPending = false;
    cards.forEach(function(card, i) {
      var rect = cardRects[i];
      if (!rect) return;
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = glowMouseX - cx;
      var dy = glowMouseY - cy;
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
  }

  document.addEventListener('mousemove', function(e) {
    glowMouseX = e.clientX;
    glowMouseY = e.clientY;
    if (!glowRafPending) {
      glowRafPending = true;
      requestAnimationFrame(updateGlow);
    }
  });

  // Recache rects on scroll (since getBoundingClientRect is viewport-relative)
  window.addEventListener('scroll', cacheCardRects, { passive: true });

  document.addEventListener('mouseleave', function() {
    cards.forEach(function(card) {
      card.style.setProperty('--glow-opacity', '0');
    });
  });
})();

/* ─────────────────────────────────────────────────────────── */

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
    var start = windowH * 0.8;
    var end = windowH * 0.3;

    if (rect.top > start) {
      container.style.transform = 'rotateX(8deg) scale(0.97) translateY(40px)';
      container.style.opacity = '0.4';
    } else if (rect.top < end) {
      container.style.transform = 'rotateX(0deg) scale(1) translateY(0px)';
      container.style.opacity = '1';
      done = true;
      window.removeEventListener('scroll', onScroll);
    } else {
      var progress = 1 - (rect.top - end) / (start - end);
      var rotateX = 8 * (1 - progress);
      var scale = 0.97 + 0.03 * progress;
      var translateY = 40 * (1 - progress);
      var opacity = 0.4 + 0.6 * progress;
      container.style.transform = 'rotateX(' + rotateX + 'deg) scale(' + scale + ') translateY(' + translateY + 'px)';
      container.style.opacity = opacity;
    }
  }

  function finalize() {
    container.style.transform = 'rotateX(0deg) scale(1) translateY(0px)';
    container.style.opacity = '1';
    done = true;
    window.removeEventListener('scroll', onScroll);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Run initial check on load and bfcache restore
  onScroll();
  window.addEventListener('pageshow', onScroll);

  // Safety: if the section was already past the trigger on load (e.g. anchor-link
  // navigation or deep scroll position), force the final state so nothing stays
  // stuck at opacity 0.4.
  setTimeout(function() {
    if (!done) {
      var rect = about.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.3 || rect.bottom < 0) finalize();
    }
  }, 150);
})();

/* ─────────────────────────────────────────────────────────── */

(function() {
  var toggle = document.getElementById('themeToggle');
  if (!toggle) return;

  function getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function setTheme(theme) {
    document.documentElement.classList.add('theme-transitioning');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    setTimeout(function() {
      document.documentElement.classList.remove('theme-transitioning');
    }, 350);
  }

  // Set initial aria-label
  toggle.setAttribute('aria-label', getTheme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');

  toggle.addEventListener('click', function() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  });

  // Listen for OS theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
})();

