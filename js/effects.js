/**
 * ============================================================
 *  LEON RIVERA — UI EFFECTS
 *  Scroll progress, active nav link, stat count-up,
 *  album card tilt + glare, magnetic buttons.
 *  Loaded after site-builder.js so the built content exists.
 * ============================================================
 */

(function initEffects() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initActiveNav();
    initCountUp();
    if (fine && !reduced) {
      initCardTilt();
      initMagnetic();
    }
  });

  /* ── Thin progress bar under the nav ─────────────────────── */
  function initScrollProgress() {
    const nav = document.getElementById('main-nav');
    if (!nav) return;
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      nav.style.setProperty('--progress', max > 0 ? (window.scrollY / max).toFixed(4) : 0);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ── Highlight the nav link for the section in view ──────── */
  function initActiveNav() {
    const links = [...document.querySelectorAll('#main-nav .nav-links a[href^="#"]')];
    const sections = links.map(a => document.querySelector(a.hash)).filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(a => a.classList.toggle('active', a.hash === `#${entry.target.id}`));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));
    // Clear the highlight when back at the top
    const hero = document.getElementById('hero');
    if (hero) new IntersectionObserver(([e]) => {
      if (e.isIntersecting) links.forEach(a => a.classList.remove('active'));
    }, { rootMargin: '-45% 0px -50% 0px' }).observe(hero);
  }

  /* ── Stats count up from 0 when they scroll into view ───── */
  function initCountUp() {
    const stats = document.querySelector('.about-stats');
    if (!stats || reduced) return;
    const targets = [...stats.querySelectorAll('.stat-number')].map(el => {
      const match = el.textContent.match(/^(\d+)(.*)$/);
      return match && { el, end: +match[1], suffix: match[2] };
    }).filter(Boolean);
    targets.forEach(t => { t.el.textContent = `0${t.suffix}`; });

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1400;
      const tick = now => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        targets.forEach(t => { t.el.textContent = `${Math.round(t.end * eased)}${t.suffix}`; });
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    observer.observe(stats);
  }

  /* ── Album cards lean toward the cursor, with a soft glare ─ */
  function initCardTilt() {
    document.querySelectorAll('.album-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.setProperty('--ry', `${(x - 0.5) * 6}deg`);
        card.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
      });
      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }

  /* ── Main buttons pull slightly toward the cursor ────────── */
  function initMagnetic() {
    document.querySelectorAll('.hero-listen-btn, .hero-explore-btn, .nav-cta').forEach(btn => {
      btn.classList.add('magnetic');
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        btn.style.translate = `${dx * 0.25}px ${dy * 0.35}px`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.translate = ''; });
    });
  }
})();
