/**
 * ============================================================
 *  LEON RIVERA — SITE BUILDER
 *  Reads ALBUMS and ARTIST from albums-data.js
 *  and fills every section of the page from them.
 *  ✦ Non-technical users should NEVER need to touch this file.
 * ============================================================
 */

/* ── Helpers ───────────────────────────────────────────────*/
const esc = (s) => String(s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;')
  .replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

const NUMBER_WORDS = ['Zero','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten',
  'Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty'];
const TENS = ['', '', 'Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
const inWords = n => n <= 20 ? NUMBER_WORDS[n]
  : n < 100 ? TENS[Math.floor(n / 10)] + (n % 10 ? '-' + NUMBER_WORDS[n % 10].toLowerCase() : '')
  : String(n);

const platformName = platform => ({
  spotify: 'Spotify', apple: 'Apple Music', deezer: 'Deezer', youtube: 'YouTube', tidal: 'Tidal',
  instagram: 'Instagram', facebook: 'Facebook', twitter: 'X', tiktok: 'TikTok',
})[platform] || platform;

const hasLinks = release => !!(release && (release.smartLink || Object.values(release.streaming || {}).some(Boolean)));
const linkOf = release => release?.smartLink || Object.values(release?.streaming || {}).find(Boolean);
const featuredTrackOf = album => album.tracks?.find(track => track.number === album.featuredTrack);
// The single gets the main button when one is picked; otherwise the album itself.
const listeningRelease = album => (featuredTrackOf(album) && hasLinks(featuredTrackOf(album)))
  ? featuredTrackOf(album) : (hasLinks(album) ? album : null);

const featuredAlbum = () => ALBUMS.find(a => a.featured) || ALBUMS[0];
const albumGoal = () => ARTIST.albumGoal || 20;
const totalTracks = () => ALBUMS.reduce((sum, a) => sum + (a.tracks?.length || 0), 0);
const albumNumber = album => ALBUMS.length - ALBUMS.indexOf(album);   // newest first in the data

const outLink = (url, label, extra = '') =>
  `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer"${extra}>${label} <span aria-hidden="true">↗</span></a>`;

/* ══════════════════════════════════════════════════════════
   HERO CARD
══════════════════════════════════════════════════════════ */
function buildHero() {
  const album = featuredAlbum();
  if (!album) return;
  const release = listeningRelease(album);
  document.getElementById('hero-album').textContent = album.title;
  document.getElementById('hero-album-meta').textContent = `New album, ${album.tracks?.length || 0} tracks`;
  document.getElementById('hero-album-year').textContent = album.year || '';
  document.getElementById('hero-line').textContent = ARTIST.tagline || ARTIST.bio?.[0] || '';
  document.getElementById('hero-what').textContent =
    `Independent musician, writing ${inWords(albumGoal()).toLowerCase()} albums one step at a time.`;
  document.getElementById('hero-credit').textContent = `Album ${albumNumber(album)} of ${albumGoal()}`;

  const listen = document.getElementById('hero-listen');
  if (release) {
    listen.href = linkOf(release);
    listen.firstChild.textContent = release === album ? `Listen to ${album.title} ` : `Listen to the single `;
    listen.setAttribute('aria-label', `Listen to ${release.title}`);
  } else listen.remove();

  const bar = document.getElementById('bar-listen');
  if (bar && release) { bar.href = linkOf(release); bar.target = '_blank'; bar.rel = 'noopener noreferrer'; }
}

/* ══════════════════════════════════════════════════════════
   RECORDS — one card per album, its single, and the next step
══════════════════════════════════════════════════════════ */
function buildRecords() {
  const track = document.getElementById('records-track');
  if (!track) return;
  const tones = ['accent', 'bone', 'stone', 'night'];
  const cards = [];

  ALBUMS.forEach(album => {
    const desc = album.description || '';
    cards.push({
      title: album.title,
      text: [album.year && `${album.year}.`, /\btracks?\b/i.test(desc) ? '' : `${album.tracks?.length || 0} tracks.`, desc]
        .filter(Boolean).join(' '),
      cover: album.cover, alt: `${album.title} cover`, albumId: album.id,
    });
    const single = featuredTrackOf(album);
    if (single && hasLinks(single)) cards.push({
      title: single.title,
      text: `The single from ${album.title}, track ${single.number}. Out now on every platform.`,
      cover: album.cover, alt: `${album.title} cover`, url: linkOf(single), crop: true,
    });
  });

  const next = ALBUMS.length + 1;
  if (next <= albumGoal()) cards.push({
    title: `Album ${next} of ${albumGoal()}`,
    text: 'Being written now. Follow along to hear it first.',
    cover: ARTIST.photo, alt: 'Leon Rivera in white sunglasses', href: '#follow',
  });

  // The whole card is clickable through the title's control (stretched over the card in CSS)
  const hit = card => card.albumId
    ? `<button class="record-hit" type="button" data-album-id="${esc(card.albumId)}" aria-label="${esc(card.title)}: open album and tracklist">${esc(card.title)}</button>`
    : card.url
      ? `<a class="record-hit" href="${esc(card.url)}" target="_blank" rel="noopener noreferrer" aria-label="Listen to ${esc(card.title)}">${esc(card.title)}</a>`
      : `<a class="record-hit" href="${esc(card.href)}">${esc(card.title)}</a>`;

  track.insertAdjacentHTML('beforeend', cards.map((card, i) => `
    <article class="record tone-${tones[i % tones.length]}">
      <div class="record-art${card.crop ? ' is-crop' : ''}"><img src="${esc(card.cover)}" alt="${esc(card.alt)}" loading="lazy" decoding="async" width="1200" height="1200"></div>
      <div class="record-panel">
        <h3 class="record-name">${hit(card)}</h3>
        <p class="record-text">${esc(card.text)}</p>
      </div>
    </article>`).join(''));

  document.getElementById('records-sub').textContent =
    `${inWords(ALBUMS.length)} albums out of ${albumGoal()}. Open one for its full tracklist.`;

  track.querySelectorAll('button[data-album-id]').forEach(button =>
    button.addEventListener('click', () => openAlbumModal(button.dataset.albumId, button)));
}

/* ══════════════════════════════════════════════════════════
   TRACKS — every song, oldest album first, as one long walk
══════════════════════════════════════════════════════════ */
function buildTracks() {
  const list = document.getElementById('tracks-list');
  if (!list) return;
  const all = [...ALBUMS].reverse().flatMap(album =>
    (album.tracks || []).map(track => ({ album, track })));

  list.innerHTML = all.map(({ album, track }, i) => {
    const data = `data-step="${i + 1}" data-album="${esc(album.title)}" data-cover="${esc(album.cover)}" data-number="${track.number}" data-year="${esc(album.year || '')}"`;
    const name = hasLinks(track)
      ? outLink(linkOf(track), esc(track.title), ` class="track-name is-live" aria-label="Listen to ${esc(track.title)}"`)
      : `<button class="track-name" type="button" data-album-id="${esc(album.id)}" aria-label="${esc(track.title)}, from ${esc(album.title)}">${esc(track.title)}</button>`;
    return `<li class="track" ${data}>${name}</li>`;
  }).join('');

  list.querySelectorAll('button[data-album-id]').forEach(button =>
    button.addEventListener('click', () => openAlbumModal(button.dataset.albumId, button)));
  document.getElementById('tracks-fact-right').textContent = `Step 1 of ${all.length}`;
}

/* ══════════════════════════════════════════════════════════
   ABOUT — bio, photos and the ruler of twenty
══════════════════════════════════════════════════════════ */
function buildAbout() {
  const lede = document.getElementById('about-lede');
  if (lede && ARTIST.bio?.length) lede.textContent = ARTIST.bio.join(' ');
  const left = albumGoal() - ALBUMS.length;
  const bio = document.getElementById('about-bio');
  if (bio) bio.textContent = `${inWords(ALBUMS.length)} ${ALBUMS.length === 1 ? 'album' : 'albums'} out${left > 0 ? `, ${inWords(left).toLowerCase()} still to make` : ''}.`;
  const photo = document.getElementById('about-photo');
  if (photo && ARTIST.photo) photo.src = ARTIST.photo;
  const young = document.getElementById('about-young');
  if (young && ARTIST.childPhoto) young.src = ARTIST.childPhoto;

  const n = ALBUMS.length, goal = albumGoal(), tracks = totalTracks();
  document.getElementById('goal-line').textContent =
    `${inWords(n)} ${n === 1 ? 'album' : 'albums'} out of ${goal}. ${inWords(tracks)} songs so far.`;

  const ruler = document.getElementById('goal-ruler');
  const released = [...ALBUMS].reverse();
  ruler.innerHTML = Array.from({ length: goal }, (_, i) => released[i]
    ? `<li class="is-out" style="--i:${i}"><span>${esc(released[i].title)}</span></li>`
    : `<li style="--i:${i}"><span class="sr-only">Album ${i + 1}, not out yet</span></li>`).join('');
}

/* ══════════════════════════════════════════════════════════
   FOLLOW CARD + FOOTER LINKS
══════════════════════════════════════════════════════════ */
function buildFollow() {
  const social = ARTIST.social || {};
  const listenKeys = ['spotify', 'apple', 'deezer', 'youtube', 'tidal'];
  const row = ([key, url]) => `<li>${outLink(url, esc(platformName(key)))}</li>`;
  const entries = Object.entries(social).filter(([, url]) => url);

  document.getElementById('follow-listen').innerHTML = entries.filter(([k]) => listenKeys.includes(k)).map(row).join('');
  document.getElementById('follow-social').innerHTML = entries.filter(([k]) => !listenKeys.includes(k)).map(row).join('');

  const email = document.getElementById('follow-email');
  if (ARTIST.contact) email.href = `mailto:${ARTIST.contact}?subject=${encodeURIComponent('Hello Leon')}`;

  const foot = ['instagram', 'tiktok', 'youtube'].filter(k => social[k]).map(k => row([k, social[k]]));
  if (ARTIST.contact) foot.push(`<li><a href="mailto:${esc(ARTIST.contact)}">${esc(ARTIST.contact)}</a></li>`);
  document.getElementById('foot-links').innerHTML = foot.join('');
  if (social.spotify) document.getElementById('foot-follow').href = social.spotify;
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}

/* ══════════════════════════════════════════════════════════
   ALBUM MODAL
══════════════════════════════════════════════════════════ */
function openAlbumModal(albumId, trigger = null) {
  const album = ALBUMS.find(item => item.id === albumId);
  const modal = document.getElementById('album-modal');
  const content = document.getElementById('album-modal-content');
  if (!album || !modal || !content || modal.open) return;
  modal.returnFocusTo = trigger;

  const streams = release => [
    ...Object.entries(release.streaming || {}).filter(([, url]) => url)
      .map(([platform, url]) => outLink(url, esc(platformName(platform)), ` aria-label="${esc(release.title)} on ${esc(platformName(platform))}"`)),
    ...(release.smartLink ? [outLink(release.smartLink, 'All platforms', ` aria-label="${esc(release.title)} on all platforms"`)] : []),
  ].join('');

  const tracks = (album.tracks || []).map(track => `
    <li${hasLinks(track) ? ' class="is-live"' : ''}>
      <span class="modal-track-name">${esc(track.title)}</span>
      ${hasLinks(track) ? `<span class="modal-track-links">${streams(track)}</span>` : ''}
    </li>`).join('');

  const release = listeningRelease(album);
  const video = (album.videos || []).find(v => v.type === 'youtube');

  content.innerHTML = `
    <div class="album-modal-grid">
      <img class="album-modal-art" src="${esc(album.cover)}" alt="${esc(album.title)} cover" width="1200" height="1200">
      <div class="album-modal-copy">
        <h2 id="album-modal-title">${esc(album.title)}</h2>
        <p class="album-modal-meta">Album ${albumNumber(album)} of ${albumGoal()}${album.year ? `, ${esc(album.year)}` : ''}. ${album.tracks?.length || 0} tracks.</p>
        <p>${esc(album.description || '')}</p>
        <div class="album-modal-actions">
          ${release ? outLink(linkOf(release), release === album ? 'Listen' : `Listen to ${esc(release.title)}`, ' class="btn btn-accent"') : ''}
          ${video ? `<button class="btn btn-quiet" type="button" data-video="${esc(video.id)}">Watch the visual</button>` : ''}
        </div>
        ${hasLinks(album) ? `<p class="album-modal-streams">${streams(album)}</p>` : ''}
      </div>
    </div>
    <h3 class="album-modal-heading">Tracklist</h3>
    <ol class="album-modal-tracks">${tracks}</ol>`;

  content.querySelector('[data-video]')?.addEventListener('click', e => {
    closeAlbumModal(false);
    window.openVideoModal?.(e.currentTarget.dataset.video, trigger);
  });

  modal.showModal();
  modal.querySelector('.album-modal-inner').scrollTop = 0;
  document.body.classList.add('is-locked');
}

function closeAlbumModal(restore = true) {
  const modal = document.getElementById('album-modal');
  if (!modal?.open) return;
  modal.close();
  document.body.classList.remove('is-locked');
  if (restore) modal.returnFocusTo?.focus({ preventScroll: true });
}

/* ══════════════════════════════════════════════════════════
   BOOT
══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  buildHero();
  buildRecords();
  buildTracks();
  buildAbout();
  buildFollow();

  const modal = document.getElementById('album-modal');
  document.getElementById('album-modal-close')?.addEventListener('click', () => closeAlbumModal());
  modal?.addEventListener('click', e => { if (e.target === modal) closeAlbumModal(); });
  modal?.addEventListener('cancel', e => { e.preventDefault(); closeAlbumModal(); });
});
