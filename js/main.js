/**
 * ============================================================
 *  LEON RIVERA — MAIN SITE SCRIPT
 *  Handles: custom cursor, particle system, nav scroll,
 *  reveal animations, audio visualizer, modal, page builder
 * ============================================================
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

/* ──────────────────────────────────────────────────────────
   CUSTOM CURSOR
──────────────────────────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (!finePointer.matches || reducedMotion.matches) return;

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
  if (!canvas || reducedMotion.matches) return;
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
   LIQUID LIGHT BACKGROUND
──────────────────────────────────────────────────────────── */
(function initLiquidBackground() {
  const root = document.documentElement;
  let phase = 0;

  function animateLiquid() {
    if (reducedMotion.matches) return;
    phase += 0.0025;
    root.style.setProperty('--liquid-x', `${50 + Math.sin(phase) * 10}%`);
    root.style.setProperty('--liquid-y', `${45 + Math.cos(phase * 0.8) * 12}%`);
    root.style.setProperty('--liquid-angle', `${135 + Math.sin(phase * 0.6) * 18}deg`);
    requestAnimationFrame(animateLiquid);
  }
  animateLiquid();
})();

/* ──────────────────────────────────────────────────────────
   NAV — scroll state & mobile hamburger
──────────────────────────────────────────────────────────── */
(function initNav() {
  const nav      = document.getElementById('main-nav');
  const burger   = document.getElementById('nav-hamburger');
  const drawer   = document.getElementById('nav-mobile-drawer');
  function closeMenu(restoreFocus = false) {
    if (!burger || !drawer) return;
    if (restoreFocus) burger.focus();
    burger.classList.remove('open');
    drawer.classList.remove('open');
    drawer.inert = true;
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }

  // Scroll → add glass bg
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Hamburger toggle
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      if (drawer.classList.contains('open')) { closeMenu(); return; }
      burger.classList.add('open');
      drawer.classList.add('open');
      drawer.inert = false;
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
      drawer.querySelector('a')?.focus();
    });
    // Close on link click
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        const target = document.querySelector(a.hash);
        closeMenu();
        if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
      });
    });
    document.addEventListener('keydown', event => {
      if (!drawer.classList.contains('open')) return;
      if (event.key === 'Escape') closeMenu(true);
      if (event.key === 'Tab') {
        const first = drawer.querySelector('a');
        const last = drawer.querySelector('a:last-child');
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); burger.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); burger.focus(); }
        else if (document.activeElement === burger) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      }
    });
    document.addEventListener('click', event => {
      if (drawer.classList.contains('open') && !drawer.contains(event.target) && !burger.contains(event.target)) closeMenu(true);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && drawer.classList.contains('open')) closeMenu();
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
    if (!backdrop.classList.contains('open')) return;
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
// Hero content drifts down and fades as you scroll away. Only the inner
// content moves; the section itself stays put so it never overlaps About.
(function initParallax() {
  const hero = document.getElementById('hero');
  const content = document.getElementById('hero-content');
  if (!hero || !content || reducedMotion.matches) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const p = Math.min(window.scrollY / hero.offsetHeight, 1);
      content.style.transform = `translateY(${p * 140}px) scale(${1 - p * 0.06})`;
      content.style.opacity = Math.max(0, 1 - p * 1.3);
      ticking = false;
    });
  }, { passive: true });
})();
