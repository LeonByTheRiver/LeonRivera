/**
 * ============================================================
 *  LEON RIVERA — SITE BUILDER
 *  Reads ALBUMS and ARTIST from albums-data.js
 *  and dynamically generates all page sections.
 *  ✦ Non-technical users should NEVER need to touch this file.
 * ============================================================
 */

/* ── Helper: sanitize text for HTML ────────────────────────*/
const esc = (s) => String(s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

const platformName = platform => ({
  spotify: 'Spotify', apple: 'Apple Music', deezer: 'Deezer',
  youtube: 'YouTube', tidal: 'Tidal',
})[platform] || platform;

const listeningRelease = album => (album.smartLink || Object.values(album.streaming || {}).some(Boolean))
  ? album : album.tracks?.find(track => track.number === album.featuredTrack);
const listeningUrl = album => {
  const release = listeningRelease(album);
  return release?.smartLink || Object.values(release?.streaming || {}).find(Boolean);
};
const listeningLabel = album => listeningRelease(album) === album ? 'Listen' : 'Listen to the single';

function albumStreamingLinks(album) {
  const release = listeningRelease(album);
  if (!release) return '';
  const links = Object.entries(release.streaming || {}).filter(([, url]) => url)
    .map(([platform, url]) => `<a href="${esc(url)}" class="stream-btn" data-platform="${esc(platform)}" target="_blank" rel="noopener noreferrer"
      aria-label="Listen to ${esc(release.title)} on ${esc(platformName(platform))}">
      ${streamIcon(platform)}<span>${esc(platformName(platform))}</span></a>`);
  if (release.smartLink) links.push(`<a href="${esc(release.smartLink)}" class="stream-btn" target="_blank" rel="noopener noreferrer"
    aria-label="${esc(release.title)} listening links">${release === album ? '' : 'Single · '}All platforms <span aria-hidden="true">↗</span></a>`);
  return links.join('');
}

/* ── Helper: streaming platform icons ──────────────────────*/
const streamIcon = (platform) => ({
  spotify: `<svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
  apple:   `<svg viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>`,
  deezer:  `<svg viewBox="0 0 24 24"><path d="M18.81 4.41v2.47h4.84V4.41h-4.84zm-6.27 0v2.47h4.84V4.41h-4.84zm12.54 3.71v2.47h-4.84V8.12h4.84zm-6.27 0v2.47h-4.84V8.12h4.84zm-6.27 0v2.47h-4.84V8.12h4.84zm12.54 3.71v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm18.81 3.71v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47H0v-2.47h4.84zm18.81 3.71v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47H0v-2.47h4.84z"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>`,
  tidal:   `<svg viewBox="0 0 24 24"><path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996l4.004 4.004L8.008 7.996l4.004 4.004 4.004-4.004zM8.008 16.004l4.004-4.004 4.004 4.004L12.012 20l4.004 4.004L20.02 20l-4.004-4.004L12.012 12l-4.004 4.004-4.004-4.004L0 16.004l4.004 4.004z"/></svg>`,
})[platform] || '';

/* ── Helper: cover image or placeholder ────────────────────*/
function coverEl(album, extraClass = '') {
  if (album.cover) {
    return `<img class="album-cover-img ${extraClass}" src="${esc(album.cover)}" alt="${esc(album.title)} cover" loading="lazy" decoding="async" width="1440" height="1440"
      onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div class="album-cover-placeholder" style="display:none; background:${esc(album.coverFallbackGradient || '#0a0a1a')}">${esc(album.title[0])}</div>`;
  }
  return `<div class="album-cover-placeholder" style="background:${esc(album.coverFallbackGradient || '#0a0a1a')}">${esc(album.title[0])}</div>`;
}

/* ══════════════════════════════════════════════════════════
   BUILD HERO SECTION
══════════════════════════════════════════════════════════ */
function buildHero() {
  const featured = ALBUMS.find(a => a.featured) || ALBUMS[0];
  if (!featured) return;

  document.getElementById('hero-badge-cover').innerHTML = coverEl(featured, 'badge-cover');
  document.getElementById('hero-badge-title').textContent = featured.title;
  const badge = document.getElementById('hero-album-badge');
  badge.setAttribute('aria-label', `View ${featured.title} album details`);
  badge.addEventListener('click', event => {
    event.preventDefault();
    openAlbumModal(featured.id, badge);
  });
  const heroActions = document.getElementById('hero-actions');
  const url = listeningUrl(featured);
  if (heroActions) heroActions.innerHTML = `${url ? `<a class="hero-listen-btn" href="${esc(url)}" target="_blank" rel="noopener noreferrer">${listeningLabel(featured)} <span aria-hidden="true">↗</span></a>` : ''}
    <a class="hero-explore-btn" href="#albums">Explore the albums <span aria-hidden="true">↓</span></a>`;
  document.querySelector('.hero-tagline').textContent = ARTIST.tagline;
}

/* ══════════════════════════════════════════════════════════
   BUILD ABOUT SECTION
══════════════════════════════════════════════════════════ */
function buildAbout() {
  const bioContainer = document.getElementById('about-bio');
  if (!bioContainer) return;
  bioContainer.innerHTML = ARTIST.bio.map(p => `<p>${esc(p)}</p>`).join('');

  // Handle portrait photo
  const portraitArt = document.querySelector('.portrait-art');
  if (portraitArt && ARTIST.photo) {
    portraitArt.innerHTML = `<img src="${esc(ARTIST.photo)}" alt="${esc(ARTIST.name)}" class="about-portrait-img" loading="lazy" decoding="async">`;
  }

  const albumCount = document.getElementById('album-count');
  if (albumCount) albumCount.textContent = `${ALBUMS.length}/20`;
  const trackCount = document.getElementById('track-count');
  if (trackCount) trackCount.textContent = ALBUMS.reduce((total, album) => total + (album.tracks?.length || 0), 0);
}

/* ══════════════════════════════════════════════════════════
   BUILD ALBUMS GRID
══════════════════════════════════════════════════════════ */
function buildAlbums() {
  const grid = document.getElementById('albums-grid');
  if (!grid) return;

  grid.innerHTML = ALBUMS.map(album => {
    const primaryUrl = listeningUrl(album);
    const streamLinks = albumStreamingLinks(album);

    return `
    <article class="album-card reveal${album.featured ? ' is-featured' : ''}" role="listitem" id="album-${esc(album.id)}" data-album-id="${esc(album.id)}" style="--album-accent:${esc(album.color || 'var(--neon-cyan)')};--album-secondary:${esc(album.secondaryColor || 'var(--neon-purple)')}">
      <div class="album-art">
      <div class="album-vinyl" aria-hidden="true"><div class="vinyl-disc"${album.cover ? ` style="--vinyl-label:url('${esc(new URL(album.cover, document.baseURI).href)}')"` : ''}></div></div>
      <div class="album-cover-wrap">
        ${coverEl(album)}
        <div class="album-hover-tracklist">
          <div class="hover-tracklist-title">Tracklist</div>
          <ul class="hover-tracklist-items">
            ${(album.tracks || []).map(t => `<li><span>${String(t.number).padStart(2,'0')}</span> ${esc(t.title)}</li>`).join('')}
          </ul>
        </div>
      </div>
      </div>
      <div class="album-body">
      <div class="album-info">
        <div class="album-year">${album.featured ? 'Featured · ' : ''}${album.year ? `${esc(album.year)} · ` : ''}${album.tracks?.length || 0} tracks</div>
        <h3 class="album-title">${esc(album.title)}</h3>
        <p class="album-desc">${esc(album.description || '')}</p>
      </div>
      <div class="album-actions">
        <button class="album-details-btn" type="button" data-album-id="${esc(album.id)}" aria-label="View ${esc(album.title)} album details">View album</button>
        ${primaryUrl ? `<a class="album-listen-btn" href="${esc(primaryUrl)}" target="_blank" rel="noopener noreferrer" aria-label="Listen to ${esc(listeningRelease(album).title)}">${listeningLabel(album)}<span aria-hidden="true">↗</span></a>` : ''}
      </div>
      ${streamLinks ? `<div class="album-streaming">${streamLinks}</div>` : ''}
      </div>
    </article>`;
  }).join('');

  grid.querySelectorAll('[data-album-id]').forEach(button => {
    if (button.tagName !== 'BUTTON') return;
    button.addEventListener('click', () => openAlbumModal(button.dataset.albumId, button));
  });
}

function openAlbumModal(albumId, trigger = null) {
  const album = ALBUMS.find(item => item.id === albumId);
  const modal = document.getElementById('album-modal');
  const content = document.getElementById('album-modal-content');
  if (!album || !modal || !content) return;
  if (modal.open) return;
  if (trigger) trigger.focus();

  const tracks = (album.tracks || []).map((track, i) => `
    <li class="album-modal-track" style="--i:${i}">
      <span class="track-number">${String(track.number).padStart(2, '0')}</span>
      <span class="track-name">${esc(track.title)}</span>
      ${track.smartLink || Object.values(track.streaming || {}).some(Boolean) ? `<span class="track-listening-links">
        ${Object.entries(track.streaming || {}).filter(([, url]) => url).map(([platform, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="Listen to ${esc(track.title)} on ${esc(platformName(platform))}">${esc(platformName(platform))} <span aria-hidden="true">↗</span></a>`).join('')}
        ${track.smartLink ? `<a href="${esc(track.smartLink)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(track.title)} listening links">All platforms <span aria-hidden="true">↗</span></a>` : ''}
      </span>` : ''}
      ${track.lyrics ? `<a class="lyrics-link" href="${esc(track.lyrics)}" target="_blank" rel="noopener">Lyrics</a>` : ''}
    </li>`).join('');
  const primaryUrl = listeningUrl(album);
  content.style.setProperty('--album-accent', album.color || 'var(--neon-cyan)');

  content.innerHTML = `
    <div class="album-modal-grid" style="--album-accent:${esc(album.color || 'var(--neon-cyan)')};--album-secondary:${esc(album.secondaryColor || 'var(--neon-purple)')}">
      <div class="album-modal-art">${coverEl(album)}</div>
      <div class="album-modal-copy">
        <p class="section-label">${album.year ? `${esc(album.year)} / ` : ''}Album</p>
        <h2 id="album-modal-title">${esc(album.title)}</h2>
        <p class="album-modal-description">${esc(album.description || '')}</p>
        ${listeningRelease(album) && listeningRelease(album) !== album ? `<p class="album-single-label">Single: ${esc(listeningRelease(album).title)}</p>` : ''}
        ${primaryUrl ? `<a class="album-listen-btn modal-listen-btn" href="${esc(primaryUrl)}" target="_blank" rel="noopener noreferrer">${listeningLabel(album)}<span aria-hidden="true">↗</span></a>` : ''}
        <div class="album-modal-streaming">${albumStreamingLinks(album)}</div>
      </div>
    </div>
    <div class="album-modal-tracklist">
      <div class="album-modal-heading"><span>Tracklist</span><span>${album.tracks?.length || 0} tracks</span></div>
      <ol>${tracks}</ol>
    </div>`;

  modal.showModal();
  modal.classList.add('open');
  modal.querySelector('.album-modal-inner').scrollTop = 0;
  document.body.style.overflow = 'hidden';
  document.getElementById('album-modal-close')?.focus();
}

function closeAlbumModal() {
  const modal = document.getElementById('album-modal');
  if (!modal?.open) return;
  modal.classList.remove('open');
  modal.close();
  document.body.style.overflow = '';
}

function buildContact() {
  const email = document.getElementById('footer-email');
  if (!email || !ARTIST.contact) return;
  email.href = `mailto:${esc(ARTIST.contact)}`;
  email.textContent = ARTIST.contact;
}

/* ══════════════════════════════════════════════════════════
   BUILD TRACKLIST
══════════════════════════════════════════════════════════ */


/* ══════════════════════════════════════════════════════════
   BUILD VIDEOS GALLERY
══════════════════════════════════════════════════════════ */
function buildVideos() {
  const grid = document.getElementById('videos-grid');
  if (!grid) return;

  // Collect all videos across all albums
  const allVideos = [];
  ALBUMS.forEach(album => {
    (album.videos || []).forEach(v => {
      allVideos.push({ ...v, albumTitle: album.title, albumId: album.id });
    });
  });

  if (!allVideos.length) {
    grid.innerHTML = `<p style="color:var(--text-muted);font-family:var(--font-mono);font-size:0.75rem;letter-spacing:0.2em">
      No videos yet — add them in <code>albums-data.js</code>
    </p>`;
    return;
  }

  grid.innerHTML = allVideos.map(v => {
    const thumb = v.type === 'youtube'
      ? `<img class="video-thumb" src="https://img.youtube.com/vi/${esc(v.id)}/maxresdefault.jpg"
             alt="${esc(v.title)}" loading="lazy"
             onerror="this.src='https://img.youtube.com/vi/${esc(v.id)}/hqdefault.jpg'">`
      : `<div class="video-thumb-placeholder"><svg width="48" height="48" viewBox="0 0 24 24" fill="rgba(0,212,255,0.3)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg></div>`;

    const clickHandler = v.type === 'youtube'
      ? `openVideoModal('${esc(v.id)}')`
      : `window.open('${esc(v.src || '#')}','_blank')`;

    const catLabel = {
      'music-video': 'Music Video',
      'lyric-video': 'Lyric Video',
      'visualizer':  'Visualizer',
    }[v.category] || v.category || 'Video';

    return `
    <article class="video-card reveal" data-cat="${esc(v.category || 'all')}" onclick="${clickHandler}">
      <div class="video-thumb-wrap">
        ${thumb}
        <div class="play-btn-overlay">
          <div class="play-icon">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <div class="video-info">
        <div class="video-cat">${esc(catLabel)}</div>
        <div class="video-title">${esc(v.title)}</div>
      </div>
    </article>`;
  }).join('');
}

/* ══════════════════════════════════════════════════════════
   BUILD LORE SECTION
══════════════════════════════════════════════════════════ */
function buildLore() {
  const grid = document.getElementById('lore-grid');
  if (!grid) return;

  const featured = ALBUMS.find(a => a.featured) || ALBUMS[0];
  const lore = featured ? (featured.lore || []) : [];

  if (!lore.length) {
    grid.style.display = 'none';
    return;
  }

  grid.innerHTML = lore.map((item, i) =>
    `<div class="lore-card reveal reveal-delay-${(i % 4) + 1}">
      <span class="lore-symbol">${esc(item.symbol.split(' ')[0])}</span>
      <div class="lore-title">${esc(item.symbol)}</div>
      <p class="lore-meaning">${esc(item.meaning)}</p>
    </div>`
  ).join('');
}

/* ══════════════════════════════════════════════════════════
   BUILD SOCIAL LINKS
══════════════════════════════════════════════════════════ */
function buildSocial() {
  const container = document.getElementById('social-links');
  if (!container) return;

  const socialIcons = {
    spotify:   `<svg viewBox="0 0 24 24"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/></svg>`,
    apple:     `<svg viewBox="0 0 24 24"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>`,
    deezer:    `<svg viewBox="0 0 24 24"><path d="M18.81 4.41v2.47h4.84V4.41h-4.84zm-6.27 0v2.47h4.84V4.41h-4.84zm12.54 3.71v2.47h-4.84V8.12h4.84zm-6.27 0v2.47h-4.84V8.12h4.84zm-6.27 0v2.47h-4.84V8.12h4.84zm12.54 3.71v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm18.81 3.71v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47H0v-2.47h4.84zm18.81 3.71v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47h-4.84v-2.47h4.84zm-6.27 0v2.47H0v-2.47h4.84z"/></svg>`,
    instagram: `<svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
    facebook:  `<svg viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>`,
    twitter:   `<svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    tiktok:    `<svg viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.78a4.85 4.85 0 0 1-1.01-.09z"/></svg>`,
    youtube:   `<svg viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>`,
    discord:   `<svg viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01a10.143 10.143 0 0 0 .372.292a.077.077 0 0 1-.006.128c-.595.342-1.22.641-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.956 2.419-2.157 2.419zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/></svg>`,
    soundcloud: `<svg viewBox="0 0 24 24"><path d="M11.536 10.45l.128 4.246-.128 3.197-.087.05h-.114l-.089-.093V10.45l.102-.132h.089l.099.132zm-2.15 1.354l.08.069.07 1.226v2.964l-.048.918-.08.07h-.08l-.13-.19V11.85h.063l.125-.046zm-2.146.993l.08.069.068 1.157v.14l-.068 1.488-.04 1.176-.08.07h-.069l-.151-.237V12.85h.08l.18-.053zm-2.146 1.761l.08.069.043.46v1.309l-.043 1.156-.08.07h-.05l-.11-.18V15.01l.05-.11h.03l.08.019zm-2.147 1.458h.083l.04.423v.35l-.04 1.383-.11.23h-.033l-.06-.525L2.8 19l.05-.42h.117v-.553l.029-.001zm15.421-5.187c.2.008.318.017.318.017a4.019 4.019 0 0 1 3.518 4.673c-.15 1.095-.884 2.15-2.228 2.378-.291.045-1.921.05-1.921.05h-6.275v-7.118h.112c.504 0 1.3.178 1.83.424l.112.051a2.805 2.805 0 0 1 .533.34V10.5h.001c0-1.127.601-2.181 1.7-2.463l.366-.083a2.441 2.441 0 0 1 .632-.093l.044.004c.834.025 1.554.542 1.851 1.261l.169.418.45-.067c.361-.05.586-.041.769-.033l.038.001zm-4.293 4.887l.127.12v2.544l-.127.348h-.114v-3.08l.06-.058h.054zm-2.147-1.408l.125.105v.393l-.061 2.383-.064.207h-.08v-3.088h.08zm1.074.8l.061.057v3l-.061.124h-.056v-3.181h.056z"/></svg>`,
    bandcamp:  `<svg viewBox="0 0 24 24"><path d="M0 18.75l7.437-13.5H24L16.563 18.75H0z"/></svg>`,
    threads:   `<svg viewBox="0 0 24 24"><path d="M14.07 10.363l3.666-4.246h-1.071l-3.183 3.687-2.542-3.687H7.312l3.883 5.632-4.07 4.717h1.071l3.587-4.156 2.913 4.156h3.629l-4.255-6.103zm-1.467 1.696l-.48-.686-3.791-5.419h1.643l3.058 4.37.48.686 3.985 5.696h-1.643l-3.252-4.647z"/></svg>`,
    twitch:    `<svg viewBox="0 0 24 24"><path d="M2.149 0l-1.612 4.119v16.836h5.631V24h4.032l4.031-3.045h3.629l6.139-6.139V0H2.149zm16.931 13.914l-3.629 3.629h-3.629l-4.032 3.045v-3.045H4.165V2.02h14.915v11.894zM15.012 5.05h-2.016v5.631h2.016V5.05zm-4.839 0H8.157v5.631h2.016V5.05z"/></svg>`,
  };

  const displayNames = {
    spotify:   'Spotify',
    apple:     'Apple Music',
    deezer:    'Deezer',
    instagram: 'Instagram',
    facebook:  'Facebook',
    twitter:   'X / Twitter',
    tiktok:    'TikTok',
    youtube:   'YouTube',
  };

  container.innerHTML = Object.entries(ARTIST.social || {})
    .filter(([, url]) => url)
    .map(([platform, url]) =>
      `<a href="${esc(url)}" class="social-link" data-platform="${esc(platform)}" target="_blank" rel="noopener">
        ${socialIcons[platform] || ''}
        <span>${esc(displayNames[platform] || platform)}</span>
      </a>`
    ).join('');
}

/* ══════════════════════════════════════════════════════════
   BUILD TRACK MARQUEE — featured album's tracks scroll past
══════════════════════════════════════════════════════════ */
function buildMarquee() {
  const marquee = document.getElementById('track-marquee');
  const featured = ALBUMS.find(a => a.featured) || ALBUMS[0];
  if (!marquee || !featured?.tracks?.length) { marquee?.remove(); return; }

  const items = featured.tracks.map(t => `<span class="marquee-item">
      <span class="marquee-num">${String(t.number).padStart(2, '0')}</span>${esc(t.title)}<span class="marquee-sep">✦</span>
    </span>`).join('');
  // Two copies so the loop is seamless
  marquee.innerHTML = `<div class="marquee-track">${items}${items}</div>`;
}

/* ══════════════════════════════════════════════════════════
   BOOT — build everything when DOM is ready
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildHero();
  buildAbout();
  buildAlbums();
  buildSocial();
  buildContact();
  buildMarquee();

  document.getElementById('album-modal-close')?.addEventListener('click', closeAlbumModal);
  document.getElementById('album-modal')?.addEventListener('click', event => {
    if (event.target.id === 'album-modal') closeAlbumModal();
  });
  document.getElementById('album-modal')?.addEventListener('cancel', event => {
    event.preventDefault();
    closeAlbumModal();
  });
  document.getElementById('album-modal')?.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...event.currentTarget.querySelectorAll('button, a[href]')];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  // After building, re-run scroll observer on new elements
  setTimeout(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
      }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
  }, 100);
});
