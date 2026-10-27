/**
 * ============================================================
 *  LEON RIVERA — MAIN SITE SCRIPT
 *  Handles: cursor, nav bar + menu, section entrances,
 *  the three scroll scenes (hero card, records, tracks),
 *  album colour themes, and the video player.
 *  Loaded after site-builder.js; runs once the page is built.
 * ============================================================
 */

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
const wideScreen = window.matchMedia('(min-width: 900px)');
const clamp01 = v => Math.min(1, Math.max(0, v));

/* Progress (0 → 1) of the page through a tall wrapper whose stage is sticky */
const pinProgress = el => {
  const r = el.getBoundingClientRect();
  const run = r.height - window.innerHeight;
  return run > 0 ? clamp01(-r.top / run) : 0;
};

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initBar();
  initEntrances();
  initScenes();
  initTracks();
  initThemes();
  initVideo();
});

/* ──────────────────────────────────────────────────────────
   CURSOR — a dot that follows, a ring that trails
──────────────────────────────────────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring || !finePointer.matches || reducedMotion.matches) return;
  document.documentElement.classList.add('has-cursor');

  let mx = -100, my = -100, rx = -100, ry = -100;
  document.addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
  });
  (function follow() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(follow);
  })();

  // An open <dialog> sits in the browser's top layer, above every z-index,
  // so the cursor moves inside whichever dialog is open and back out after
  const home = dot.parentElement;
  const follow = () => {
    const open = document.querySelector('dialog[open]');
    const parent = open || home;
    if (ring.parentElement !== parent) parent.append(dot, ring);
  };
  document.querySelectorAll('dialog').forEach(d =>
    new MutationObserver(follow).observe(d, { attributes: true, attributeFilter: ['open'] }));

  const targets = 'a, button, .record, .track-name';
  document.addEventListener('pointerover', e => ring.classList.toggle('is-hover', !!e.target.closest(targets)));
  document.addEventListener('pointerdown', () => ring.classList.add('is-press'));
  document.addEventListener('pointerup', () => ring.classList.remove('is-press'));
}

/* ──────────────────────────────────────────────────────────
   NAV BAR — solid once past the hero, menu drawer on phones
──────────────────────────────────────────────────────────── */
function initBar() {
  const bar = document.getElementById('site-bar');
  const menu = document.getElementById('bar-menu');
  const drawer = document.getElementById('menu-drawer');
  const hero = document.getElementById('hero');

  // Tuck the bar away while reading downwards, bring it back on the way up
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    bar.classList.toggle('is-solid', y > hero.offsetHeight - window.innerHeight * 0.5);
    if (Math.abs(y - lastY) > 6) {
      bar.classList.toggle('is-tucked', y > lastY && y > window.innerHeight && !drawer.classList.contains('is-open'));
      lastY = y;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Highlight the link for the section in view
  const links = [...bar.querySelectorAll('.bar-links a')];
  bar.addEventListener('focusin', () => bar.classList.remove('is-tucked'));
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) links.forEach(a => a.classList.toggle('is-active', a.hash === `#${entry.target.id}`));
  }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = document.querySelector(a.hash); if (s) io.observe(s); });

  const setOpen = open => {
    drawer.classList.toggle('is-open', open);
    drawer.inert = !open;
    menu.setAttribute('aria-expanded', String(open));
    menu.textContent = open ? 'Close' : 'Menu';
    document.body.classList.toggle('is-locked', open);
  };
  menu.addEventListener('click', () => {
    const open = !drawer.classList.contains('is-open');
    setOpen(open);
    if (open) drawer.querySelector('a').focus();
  });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) { setOpen(false); menu.focus(); }
  });
  wideScreen.addEventListener('change', () => setOpen(false));
}

/* ──────────────────────────────────────────────────────────
   ENTRANCES — heading, then text, then picture, once
──────────────────────────────────────────────────────────── */
function initEntrances() {
  // Stagger every revealed element after the first in its section
  document.querySelectorAll('section, footer').forEach(section => {
    section.querySelectorAll('.reveal').forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 4) * 80}ms`));
  });
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    io.unobserve(entry.target);
  }), { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
}

/* ──────────────────────────────────────────────────────────
   SCROLL SCENES
   1. Hero: the card shrinks to a ticket stub in the bottom-left
      and the Born Again photograph brightens behind it.
   2. Records: the cards travel across the held road photo.
──────────────────────────────────────────────────────────── */
function initScenes() {
  const hero = document.getElementById('hero');
  const card = document.getElementById('hero-card');
  const photo = hero.querySelector('.hero-photo');
  const records = document.getElementById('records');
  const track = document.getElementById('records-track');
  const windowEl = records.querySelector('.records-window');

  let cardBox = null, travel = 0, ticking = false;

  const measure = () => {
    card.style.transform = '';
    track.style.transform = '';
    const r = card.getBoundingClientRect();
    const stage = hero.querySelector('.hero-stage').getBoundingClientRect();
    cardBox = { left: r.left - stage.left, bottom: r.bottom - stage.top, height: stage.height };
    travel = Math.max(0, track.scrollWidth - window.innerWidth);
    update();
  };

  const update = () => {
    ticking = false;
    if (reducedMotion.matches) return;

    // Hero card → stub
    const p = pinProgress(hero);
    const margin = wideScreen.matches ? 32 : 16;
    const eased = 1 - Math.pow(1 - p, 2);
    const scale = 1 - eased * (wideScreen.matches ? 0.68 : 0.6);
    const dx = (margin - cardBox.left) * eased;
    const dy = (cardBox.height - margin - cardBox.bottom) * eased;
    card.style.transform = `translate(${dx}px, ${dy}px) scale(${scale})`;
    hero.style.setProperty('--hero-p', p.toFixed(3));

    // Records travel sideways (desktop only — phones get a plain stack)
    if (wideScreen.matches) {
      const q = pinProgress(records);
      track.style.transform = `translateX(${-travel * q}px)`;
      // A card's words only show once the whole card is inside the window
      const edge = windowEl.getBoundingClientRect().right + 1;
      track.querySelectorAll('.record').forEach(rec => {
        const r = rec.getBoundingClientRect();
        rec.classList.toggle('is-whole', r.right <= edge && r.left >= -1);
      });
    }
  };

  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  wideScreen.addEventListener('change', measure);
  reducedMotion.addEventListener('change', measure);
  if (photo.complete) measure(); else photo.addEventListener('load', measure, { once: true });
  measure();
  document.fonts?.ready.then(measure);
}

/* ──────────────────────────────────────────────────────────
   TRACKS — whichever name crosses the middle of the screen
   lights up and the held frame shows its album
──────────────────────────────────────────────────────────── */
function initTracks() {
  const items = [...document.querySelectorAll('#tracks-list .track')];
  const cover = document.getElementById('tracks-cover');
  const left = document.getElementById('tracks-fact-left');
  const right = document.getElementById('tracks-fact-right');
  if (!items.length || !cover) return;

  let current = null;
  const setCurrent = item => {
    if (item === current) return;
    current?.classList.remove('is-current');
    item.classList.add('is-current');
    current = item;
    item.parentElement.dataset.albumRef = item.dataset.albumRef;
    const { album, number, step, cover: src } = item.dataset;
    left.textContent = `${album}, track ${number}`;
    right.textContent = `Step ${step} of ${items.length}`;
    if (!cover.src.endsWith(src)) {
      cover.classList.add('is-swapping');
      setTimeout(() => { cover.src = src; cover.classList.remove('is-swapping'); }, 180);
    }
  };

  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) setCurrent(entry.target);
  }), { rootMargin: '-49% 0px -49% 0px' });
  items.forEach(item => io.observe(item));
  setCurrent(items[0]);

  // Focus or hover also moves the frame, so the keyboard gets the same thing
  items.forEach(item => {
    item.addEventListener('focusin', () => setCurrent(item));
    item.addEventListener('pointerenter', () => setCurrent(item));
  });
}

/* ──────────────────────────────────────────────────────────
   ALBUM THEMES — the page takes the colours of whichever album
   the visitor is on: the record card nearest the middle in
   Records, the current song in Tracks. Everywhere else it is
   the site's own blue. Colours come from `theme` in albums-data.js.
──────────────────────────────────────────────────────────── */
function initThemes() {
  const root = document.documentElement;
  const meta = document.querySelector('meta[name="theme-color"]');
  const records = document.getElementById('records');
  const tracks = document.getElementById('tracks');
  const list = document.getElementById('tracks-list');
  const vars = {
    bg: '--bg', surface: '--surface', stone: '--stone', ink: '--ink', muted: '--muted', dim: '--dim',
    accent: '--accent', accentHover: '--accent-hover', accentInk: '--accent-ink',
    frameFilter: '--frame-filter', photoGray: '--photo-gray',
  };
  const defaultBg = getComputedStyle(root).getPropertyValue('--bg').trim();

  let applied, ticking = false;
  const apply = albumId => {
    if (albumId === applied) return;
    applied = albumId;
    const theme = ALBUMS.find(a => a.id === albumId)?.theme || {};
    Object.entries(vars).forEach(([key, prop]) =>
      theme[key] != null ? root.style.setProperty(prop, String(theme[key])) : root.style.removeProperty(prop));
    root.dataset.album = albumId || '';
    meta?.setAttribute('content', theme.bg || defaultBg);
  };

  const holds = el => { const r = el.getBoundingClientRect(); return r.top <= innerHeight / 2 && r.bottom >= innerHeight / 2; };

  const pick = () => {
    ticking = false;
    if (holds(tracks)) return apply(list.dataset.albumRef);
    if (holds(records)) {
      // The card closest to the middle of the screen (sideways on desktop, downwards on phones)
      let best = null, bestDist = Infinity;
      records.querySelectorAll('.record').forEach(card => {
        const r = card.getBoundingClientRect();
        const dist = wideScreen.matches
          ? Math.abs(r.left + r.width / 2 - innerWidth / 2)
          : Math.abs(r.top + r.height / 2 - innerHeight / 2);
        if (dist < bestDist) { bestDist = dist; best = card; }
      });
      const reach = wideScreen.matches ? innerWidth * 0.4 : innerHeight * 0.6;
      return apply(best && bestDist < reach ? best.dataset.themeAlbum : undefined);
    }
    apply(undefined);
  };

  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(pick); } };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  // Hovering or focusing a song also moves the theme with it
  list.addEventListener('focusin', onScroll);
  list.addEventListener('pointerover', onScroll);
  pick();
}

/* ──────────────────────────────────────────────────────────
   VIDEO PLAYER
──────────────────────────────────────────────────────────── */
function initVideo() {
  const modal = document.getElementById('yt-modal');
  const iframe = document.getElementById('yt-iframe');
  const close = document.getElementById('yt-close');
  if (!modal) return;
  let returnTo = null;

  window.openVideoModal = (videoId, trigger = null) => {
    returnTo = trigger;
    iframe.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1`;
    modal.showModal();
    document.body.classList.add('is-locked');
  };
  const shut = () => {
    if (!modal.open) return;
    modal.close();
    iframe.src = '';
    document.body.classList.remove('is-locked');
    returnTo?.focus({ preventScroll: true });
  };
  close.addEventListener('click', shut);
  modal.addEventListener('click', e => { if (e.target === modal) shut(); });
  modal.addEventListener('cancel', e => { e.preventDefault(); shut(); });
}
