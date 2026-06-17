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
 *  color       → dominant accent color for this album (hex or css)
 *  featured    → true = show this album in the hero spotlight
 *  tracks      → array of {number, title, duration, lyrics (optional URL)}
 *  streaming   → links to platforms {spotify, apple, youtube, tidal}
 *  videos      → array of {type:"youtube"|"local", id/src, title, thumbnail}
 *  lore        → array of {symbol, meaning} shown in the Lore section
 * ============================================================
 */

const ALBUMS = [
  {
    id: "born-again",
    title: "Born Again",
    year: "2024",
    cover: "assets/images/born-again-cover.png",  // Replace with your image
    coverFallbackGradient: "linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 40%, #0d1b2a 100%)",
    description:
      "A cinematic odyssey through rebirth and ruin. Twelve movements charting the collapse of ego and the violent beauty of becoming. Oceans, owls, neon cities — witness the dissolution.",
    color: "#00d4ff",
    secondaryColor: "#7c3aed",
    featured: true,

    tracks: [
      { number: 1,  title: "Genesis Protocol",   duration: "4:12" },
      { number: 2,  title: "Neon Baptism",        duration: "3:58" },
      { number: 3,  title: "The Owl Speaks",      duration: "5:21" },
      { number: 4,  title: "Currency of Souls",   duration: "4:44" },
      { number: 5,  title: "Ocean Memoria",        duration: "6:02" },
      { number: 6,  title: "Violent Love",         duration: "3:37" },
      { number: 7,  title: "Temporal Drift",       duration: "4:55" },
      { number: 8,  title: "Crimson Liturgy",     duration: "5:10" },
      { number: 9,  title: "The Materialism Rite", duration: "4:28" },
      { number: 10, title: "Nocturnal Gospel",    duration: "5:44" },
      { number: 11, title: "Dissolution",         duration: "3:19" },
      { number: 12, title: "Born Again",          duration: "7:33" },
    ],

    streaming: {
      spotify:  "https://open.spotify.com",
      apple:    "https://music.apple.com",
      youtube:  "https://youtube.com",
      tidal:    "https://tidal.com",
    },

    videos: [
      {
        type:      "youtube",
        id:        "dQw4w9WgXcQ",   // Replace with real YouTube video ID
        title:     "Neon Baptism — Official Music Video",
        category:  "music-video",
      },
      {
        type:      "youtube",
        id:        "dQw4w9WgXcQ",   // Replace with real YouTube video ID
        title:     "The Owl Speaks — Official Lyric Video",
        category:  "lyric-video",
      },
      {
        type:      "youtube",
        id:        "dQw4w9WgXcQ",   // Replace with real YouTube video ID
        title:     "Ocean Memoria — Visualizer",
        category:  "visualizer",
      },
      {
        type:      "youtube",
        id:        "dQw4w9WgXcQ",
        title:     "Violent Love — Official Music Video",
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
  //   coverFallbackGradient: "linear-gradient(135deg, #1a0000, #2a0a10)",
  //   description: "Description of the album...",
  //   color: "#ff3366",
  //   secondaryColor: "#ff9900",
  //   featured: false,
  //   tracks: [
  //     { number: 1, title: "Track One", duration: "3:45" },
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
  tagline: "Sound. Vision. Resurrection.",
  bio: [
    "Leon Rivera doesn't make music — he assembles evidence. Each album is a crime scene investigation into the human condition: the motive of desire, the weapon of time, the victim always being whoever you were before you listened.",
    "Raised between coastal silences and city static, Rivera trained his ear on the space between frequencies — the frequencies that carry grief, ecstasy, and the quiet violence of becoming. His sound defies genre because existence defies genre.",
    "Born Again is the third chapter of an ongoing cycle. It will not be the last.",
  ],
  social: {
    instagram: "https://www.instagram.com/leon.by.the.river/",
    facebook:  "https://www.facebook.com/profile.php?id=61590314556473",
    twitter:   "https://x.com/LeonbyaRiver",
    tiktok:    "https://www.tiktok.com/@leon.rivera644",
  },
  contact: "contact@leonrivera.com",
};
