# ✨ Good Deeds Tracker — Deployment Guide

## What's in this folder

```
good-deeds-pwa/
├── index.html          ← Main HTML with PWA install prompt
├── vite.config.js      ← Build config
├── package.json        ← Dependencies
├── src/
│   ├── main.jsx        ← React entry point
│   └── App.jsx         ← The full app
└── public/
    ├── manifest.json   ← PWA config (name, icon, colors)
    ├── sw.js           ← Service worker (offline support)
    └── icons/
        ├── icon-192.png
        └── icon-512.png
```

---

## Step-by-Step: Deploy to Vercel (Free)

### Step 1 — Create a GitHub repo
1. Go to github.com → New repository
2. Name it `good-deeds-tracker`
3. Make it **Public** (so Vercel can access it)
4. Click **Create repository**

### Step 2 — Upload the files
1. On your new repo page, click **"uploading an existing file"**
2. Drag the entire contents of this folder into the upload area
3. Keep the folder structure exactly as-is
4. Click **Commit changes**

### Step 3 — Deploy on Vercel
1. Go to vercel.com → Log in with GitHub
2. Click **"Add New Project"**
3. Import your `good-deeds-tracker` repo
4. Vercel auto-detects Vite — just click **Deploy**
5. In ~1 minute you'll get a URL like: `good-deeds-tracker.vercel.app`

### Step 4 — Custom domain (optional)
- In Vercel project settings → Domains
- Add something like `gooddeeds.yourdomain.com`
- Or use the free `.vercel.app` URL

---

## How kids install it on their phone

### iPhone (Safari):
1. Open the link in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button (box with arrow at bottom)
3. Scroll down → tap **"Add to Home Screen"**
4. Tap **Add**
5. ✅ App icon appears on home screen!

### Android (Chrome):
1. Open the link in **Chrome**
2. A banner will appear: **"Add to Home Screen"**
3. Tap it → tap **Install**
4. ✅ App icon appears on home screen!

---

## What the kids get
- App icon on home screen like a real app
- Opens fullscreen (no browser bar)
- Works offline (previously loaded content)
- Data saved on their device

---

## Customising the app
- Edit `src/App.jsx` to change kid names, deeds, points, or rewards
- Change `"name"` in `public/manifest.json` to rename the app
- Replace icons in `public/icons/` with your own images (192x192 and 512x512 PNG)
