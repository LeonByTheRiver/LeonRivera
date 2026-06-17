# Leon Rivera — Official Website
## Setup, Customization & Deployment Guide

---

## 📁 File Structure

```
leon-rivera/
├── index.html              ← The page (don't edit unless you know HTML)
├── css/
│   └── style.css           ← All visual design
├── js/
│   ├── albums-data.js      ← ✦ YOUR MAIN EDITING FILE
│   ├── site-builder.js     ← Generates the site from your data
│   └── main.js             ← Animations, cursor, visualizer
└── assets/
    └── images/             ← Put your album covers & photos here
```

---

## ✦ How to Add a New Album

Open `js/albums-data.js` — this is the ONLY file you need to touch.

Find the `ALBUMS` array and copy this template to the top:

```js
{
  id: "your-album-slug",          // no spaces, e.g. "dark-skies-vol-2"
  title: "Your Album Title",
  year: "2025",
  cover: "assets/images/your-cover.jpg",  // drop the image in assets/images/
  coverFallbackGradient: "linear-gradient(135deg, #0a0a1a, #1a0a2e)",
  description: "A short description of the album...",
  color: "#00d4ff",               // main accent color
  secondaryColor: "#7c3aed",
  featured: false,                // set true to show in hero (only one at a time)

  tracks: [
    { number: 1, title: "Track Name", duration: "3:45" },
    { number: 2, title: "Track Name", duration: "4:12" },
  ],

  streaming: {
    spotify: "https://open.spotify.com/album/YOUR_ID",
    apple:   "https://music.apple.com/...",
    youtube: "https://youtube.com/...",
    tidal:   "https://tidal.com/...",
  },

  videos: [
    {
      type:     "youtube",           // "youtube" or "local"
      id:       "YOUR_YT_VIDEO_ID", // the part after ?v= in YouTube URL
      title:    "Track Name — Official Music Video",
      category: "music-video",       // "music-video" | "lyric-video" | "visualizer"
    },
  ],

  lore: [
    {
      symbol:  "🔥 The Fire",
      meaning: "Your symbolic meaning here...",
    },
  ],
},
```

Save the file. Refresh your browser. Done.

---

## 🖼 Adding Album Art

1. Drop your image (JPG or PNG, ideally 1000×1000px) into `assets/images/`
2. Update the `cover` field in `albums-data.js`:
   ```js
   cover: "assets/images/your-filename.jpg",
   ```

---

## 📝 Editing the Artist Bio

In `js/albums-data.js`, find the `ARTIST` object near the bottom.
Edit the `bio` array — each string is a separate paragraph:

```js
bio: [
  "First paragraph...",
  "Second paragraph...",
],
```

---

## 🔗 Updating Social Links

In the `ARTIST.social` object:
```js
social: {
  instagram: "https://instagram.com/YOUR_HANDLE",
  twitter:   "https://twitter.com/YOUR_HANDLE",
  youtube:   "https://youtube.com/@YOUR_CHANNEL",
  spotify:   "https://open.spotify.com/artist/YOUR_ID",
  tiktok:    "https://tiktok.com/@YOUR_HANDLE",
},
```

---

## 🚀 Deployment

### GitHub Pages (Recommended)
1. **Prepare**: Make sure you have [Git installed](https://git-scm.com/).
2. **Connect & Sync**: Run the `github-sync.ps1` script (Right-click → Run with PowerShell).
   - This script will link your folder to `https://github.com/LeonByTheRiver/LeonRivera` and push all your files.
3. **Go Live**: 
   - Go to your GitHub repository: `https://github.com/LeonByTheRiver/LeonRivera`
   - Go to **Settings** → **Pages**
   - Under **Build and deployment**, set **Branch** to `main` and folder to `/ (root)`.
   - Click **Save**. 
   - Your site will be live at: `https://leonbytheriver.github.io/LeonRivera/`

---

## 🔄 Automatic Syncing
Whenever you make changes to your site (adding albums, updating bio, etc.):
1. Double-click `github-sync.ps1`.
2. It will automatically bundle your changes and push them to GitHub.
3. Your live website will update in about 60 seconds!


### Netlify (drag & drop — easiest)
1. Go to netlify.com → New site
2. Drag the entire `leon-rivera` folder onto the deploy zone
3. Done — you get a live URL instantly

### Vercel
1. `npm i -g vercel` then run `vercel` in the project folder
2. Or connect your GitHub repo in the Vercel dashboard

### Cloudflare Pages
1. Connect your GitHub repo in the Cloudflare Pages dashboard
2. Build command: (leave empty)
3. Output directory: `/`

---

## 🎨 Changing Colors

Open `css/style.css` and find the `:root` block at the top.
Change these variables:

```css
--neon-cyan:    #00d4ff;   /* main accent */
--neon-purple:  #7c3aed;   /* secondary */
--neon-crimson: #dc143c;   /* highlights */
```

---

## 📱 The site is fully responsive
- Desktop: grid layouts, custom cursor, parallax
- Mobile: single-column, no custom cursor, hamburger menu

---

Made with HTML, CSS & Vanilla JS. No frameworks. No databases.
Deployable anywhere, for free.
