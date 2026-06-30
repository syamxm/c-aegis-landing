# C-Aegis Landing

Static landing page for **C-Aegis**, a consent-based parental location and digital-wellbeing app for Android. The page presents features, how it works, trust points, and screenshots, and links to the APK on GitHub Releases.

No framework, no build step, no dependencies — plain HTML, CSS, and vanilla JS served as static files.

## File layout

```
index.html              semantic markup, class names only
css/
  base.css              :root design tokens, reset, typography, focus, keyframes
  components.css        buttons, badges, cards, phone frame, carousel
  sections.css          hero, features, how-it-works, trust, footer layout
js/
  config.js             DOWNLOAD_URL + SHOTS (caption-to-file mapping)
  main.js               download-link wiring + carousel render
assets/screenshots/     ceagis1.jpeg … ceagis5.jpeg
CNAME                   custom domain for GitHub Pages
```

`config.js` loads before `main.js`; `main.js` reads its globals.

## Run locally

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. Serve over HTTP (not `file://`) so the JS picks up the screenshots and download links.

## Deploy on GitHub Pages

1. Push this directory to a GitHub repo.
2. **Settings → Pages** → Source: *Deploy from a branch* → branch `main`, folder `/ (root)`.
3. The `CNAME` file sets the custom domain `c-aegis.syamxm.com`. Add a DNS `CNAME` record for `c-aegis` pointing to `<username>.github.io`.
4. Enable **Enforce HTTPS** once the certificate is issued.

## Download URL

The APK lives on GitHub Releases, not in this repo. Set the release asset URL in `js/config.js`:

```js
const DOWNLOAD_URL = "./c-aegis.apk";
```

Replace `./c-aegis.apk` with the GitHub Releases download URL.
