/**
 * ============================================================
 *  LEON RIVERA — ALBUM DATA SYSTEM
 *  ============================================================
 *  HOW TO ADD A NEW ALBUM:
 *  1. Copy one of the objects in the ALBUMS array below
 *  2. Paste it at the TOP of the array (newest first)
 *  3. Fill in your details
 *  4. Save — the site updates automatically. That's it!
 *
 *  FIELD GUIDE:
 *  id          → unique slug, no spaces (e.g. "born-again")
 *  title       → album name
 *  year        → release year
 *  cover       → path to album art (put images in /assets/images/)
 *  description → short paragraph shown on the album card

 *  featured    → true = show this album in the hero spotlight
 *  smartLink   → optional all-platform listening URL (e.g. Ditto)
 *  featuredTrack → track number to spotlight when only a single has listening links
 *  tracks      → array of {number, title, lyrics (optional URL)}
 *  streaming   → links to platforms {spotify, apple, youtube, tidal}
 *  videos      → array of {type:"youtube"|"local", id/src, title, thumbnail}
 *  lore        → array of {symbol, meaning} shown in the Lore section
 * ============================================================
 */

const ALBUMS = [
  {
    id: "baby-steps",
    title: "Baby Steps",
    year: "2026",
    cover: "assets/images/web/baby-steps.jpg",
    description: "18 tracks. The next chapter after Born Again.",
    featured: true,
    featuredTrack: 9,
    tracks: [
      { number: 1, title: "Dreaming in the Grass" },
      { number: 2, title: "Interested in You" },
      { number: 3, title: "Not Words, Lies" },
      { number: 4, title: "Touchin the Stars" },
      { number: 5, title: "Wishing Well" },
      { number: 6, title: "Finish My Sentences" },
      { number: 7, title: "Slow Clicks" },
      { number: 8, title: "Listening" },
      {
        number: 9,
        title: "Never Forget a Promise",
        smartLink: "https://ditto.fm/never-forget-a-promise",
        streaming: { spotify: "https://open.spotify.com/track/4iGLH9ptrisN1T2gWSlkBj" },
      },
      { number: 10, title: "The Cowardly Dog" },
      { number: 11, title: "Anthem" },
      { number: 12, title: "Purified Pain" },
      { number: 13, title: "When I Dance Alone" },
      { number: 14, title: "I Feel Stellar" },
      { number: 15, title: "20 veintiséis" },
      { number: 16, title: "Pissing Me Off" },
      { number: 17, title: "The Usual Suspects" },
      { number: 18, title: "Next High" },
    ],
    // Album link — currently the same Spotify link as the single
    streaming: { spotify: "https://open.spotify.com/track/4iGLH9ptrisN1T2gWSlkBj" },
    videos: [],
    lore: [],
  },
  {
    id: "born-again",
    title: "Born Again",
    year: "2026",
    cover: "assets/images/web/born-again.jpg",
    description:
      "A boy was reborn, and he is discovering everything again. This is the beginning of a new story for Leon Rivera.",
    featured: false,

    tracks: [
      { number: 1,  title: "Do it Again" },
      { number: 2,  title: "What did I See" },
      { number: 3,  title: "Venus" },
      { number: 4,  title: "Held my breath" },
      { number: 5,  title: "Two Sides" },
      { number: 6,  title: "Oouu like an owl" },
      { number: 7,  title: "In Reverse" },
      { number: 8,  title: "Pluck my Soul" },
      { number: 9,  title: "and its bittersweet ok" },
      { number: 10, title: "The Ring" },
      { number: 11, title: "Ready for it" },
      { number: 12, title: "Blood Rush" },
      { number: 13, title: "In the Ocean" },
    ],

    streaming: {
      spotify:  "https://open.spotify.com/artist/3KCNJOV8owot6bcBVDiJhW",
      apple:    "https://music.apple.com/us/artist/leon-rivera/6792706068",
      deezer:   "https://www.deezer.com/fr/artist/405775832",
      youtube:  "https://www.youtube.com/@LeonRivera-789",
    },

    videos: [
      {
        type:      "youtube",
        id:        "UtK0NqFMPUE",
        title:     "Leon Rivera — Latest Visual",
        category:  "music-video",
      },
    ],

    lore: [
      {
        symbol:  "🦉 The Owl",
        meaning: "Watcher between worlds. Carrier of unsent messages. The owl sees what daylight conceals and mourns only once.",
      },
      {
        symbol:  "🌊 The Ocean",
        meaning: "Memory in liquid form. The place where old selves dissolve. Every tide a burial, every wave a new lung drawing breath.",
      },
      {
        symbol:  "🕯️ The Flame",
        meaning: "Sacrifice disguised as warmth. The thing you fed until it consumed the hand that fed it.",
      },
      {
        symbol:  "🌆 The Neon City",
        meaning: "Ambition made architecture. Beautiful, cold, indifferent — exactly like the version of yourself you became chasing it.",
      },
      {
        symbol:  "💠 The Crystal",
        meaning: "Clarity born from pressure. What remains after everything soft is stripped away.",
      },
      {
        symbol:  "⧖ Temporal Loop",
        meaning: "Time does not move forward. It orbits. Every ending is a doorway wearing the face of a beginning.",
      },
    ],
  },

  // ─── ADD YOUR NEXT ALBUM HERE ─────────────────────────────
  // {
  //   id: "my-new-album",
  //   title: "My New Album",
  //   year: "2025",
  //   cover: "assets/images/my-new-album-cover.jpg",
  //   description: "Description of the album...",
  //   featured: false,
  //   tracks: [
  //     { number: 1, title: "Track One" },
  //   ],
  //   streaming: {
  //     spotify: "https://open.spotify.com/album/...",
  //     apple:   "https://music.apple.com/...",
  //     youtube: "https://youtube.com/...",
  //     tidal:   "https://tidal.com/...",
  //   },
  //   videos: [],
  //   lore: [],
  // },
];

// ── Artist bio data ──────────────────────────────────────────
const ARTIST = {
  name: "Leon Rivera",
  tagline: "One of the most interesting people you will ever meet.",
  bio: [
    "Hi, I'm Leon. I got a chance to live my life exactly as I wanted, and I'm doing just that. So, enjoy."
  ],
  photo: "assets/images/web/leon-portrait.jpg",
  childPhoto: "assets/images/web/leon-young.jpg",
  albumGoal: 20,       // how many albums Leon plans to release
  social: {
    spotify:   "https://open.spotify.com/artist/3KCNJOV8owot6bcBVDiJhW",
    apple:     "https://music.apple.com/us/artist/leon-rivera/6792706068",
    deezer:    "https://www.deezer.com/fr/artist/405775832",
    instagram: "https://www.instagram.com/leon.by.the.river/",
    facebook:  "https://www.facebook.com/profile.php?id=61590314556473",
    twitter:   "https://x.com/LeonbyaRiver",
    tiktok:    "https://www.tiktok.com/@leon.rivera644",
    youtube:   "https://www.youtube.com/@LeonRivera-789",
  },
  contact: "mr.leon.by.the.river@gmail.com",
};
