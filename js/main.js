/**
 * ============================================================
 *  LEON RIVERA — MAIN SITE SCRIPT
 *  Handles: custom cursor, particle system, nav scroll,
 *  reveal animations, audio visualizer, modal, page builder
 * ============================================================
 */

/* ──────────────────────────────────────────────────────────
   CUSTOM CURSOR
──────────────────────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = -100, my = -100; // mouse position
  let rx = -100, ry = -100; // ring position (lags behind)

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Smooth ring lag
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, .album-card, .video-card, .lore-card, .track-item';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) ring.classList.add('hovering');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) ring.classList.remove('hovering');
  });
})();

/* ──────────────────────────────────────────────────────────
   AMBIENT PARTICLE SYSTEM
──────────────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [];
  const COUNT = window.innerWidth < 768 ? 50 : 120;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Mouse position for reactive particles
  let mouseX = W / 2, mouseY = H / 2;
  document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  class Particle {
    constructor() { this.reset(true); }
    reset(randomY = false) {
      this.x   = Math.random() * W;
      this.y   = randomY ? Math.random() * H : H + 10;
      this.vy  = -(0.2 + Math.random() * 0.6);
      this.vx  = (Math.random() - 0.5) * 0.2;
      this.r   = 0.5 + Math.random() * 1.5;
      this.alpha = 0.2 + Math.random() * 0.5;
      // Colour mix: cyan or purple
      this.hue = Math.random() > 0.6 ? 190 : 270;
      this.life = 0;
      this.maxLife = 200 + Math.random() * 300;
    }
    update() {
      this.life++;
      if (this.life > this.maxLife) { this.reset(); return; }

      // Gentle drift toward mouse (very subtle)
      const dx = (mouseX - this.x) / W;
      const dy = (mouseY - this.y) / H;
      this.vx += dx * 0.0003;
      this.vy += dy * 0.0003;

      this.x += this.vx;
      this.y += this.vy;

      // Fade in/out
      const progress = this.life / this.maxLife;
      this.currentAlpha = this.alpha *
        (progress < 0.1 ? progress / 0.1 :
         progress > 0.8 ? (1 - progress) / 0.2 : 1);

      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.currentAlpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < COUNT; i++) particles.push(new Particle());

  // Draw faint connection lines between close particles
  function drawConnections() {
    const threshold = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < threshold) {
          const opacity = (1 - dist / threshold) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 212, 255, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
})();

/* ──────────────────────────────────────────────────────────
   NAV — scroll state & mobile hamburger
──────────────────────────────────────────────────────────── */
(function initNav() {
  const nav      = document.getElementById('main-nav');
  const burger   = document.getElementById('nav-hamburger');
  const drawer   = document.getElementById('nav-mobile-drawer');

  // Scroll → add glass bg
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Hamburger toggle
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      drawer.classList.toggle('open');
      document.body.style.overflow = drawer.classList.contains('open') ? 'hidden' : '';
    });
    // Close on link click
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* ──────────────────────────────────────────────────────────
   SCROLL REVEAL ANIMATION
──────────────────────────────────────────────────────────── */
(function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target); // fire once
      }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();



/* ──────────────────────────────────────────────────────────
   YOUTUBE MODAL
──────────────────────────────────────────────────────────── */
(function initModal() {
  const backdrop = document.getElementById('yt-modal');
  const iframe   = document.getElementById('yt-iframe');
  const closeBtn = document.getElementById('yt-close');

  window.openVideoModal = function(videoId) {
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeModal() {
    backdrop.classList.remove('open');
    iframe.src = '';
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', e => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
})();



/* ──────────────────────────────────────────────────────────
   VIDEO TAB FILTER
──────────────────────────────────────────────────────────── */
window.filterVideos = function(category) {
  document.querySelectorAll('.video-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === category);
  });
  document.querySelectorAll('.video-card').forEach(card => {
    const show = category === 'all' || card.dataset.cat === category;
    card.style.display = show ? 'block' : 'none';
  });
};

/* ──────────────────────────────────────────────────────────
   SMOOTH PARALLAX HERO
──────────────────────────────────────────────────────────── */
(function initParallax() {
  const hero = document.getElementById('hero');
  if (!hero) return;
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      hero.style.transform = `translateY(${y * 0.3}px)`;
    }
  }, { passive: true });
})();
