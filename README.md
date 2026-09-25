# FindSongKey

A fast, privacy-friendly web app for detecting the BPM and musical key of audio files directly in the browser.

[Live site](https://findsongkeybpm.com)

## Features

- Analyze MP3, WAV, FLAC, and M4A files in seconds
- Detect tempo (BPM) and musical key
- Client-side audio analysis powered by Essentia.js
- Responsive interface with light and dark themes
- Optional AI-powered result enrichment

## Tech Stack

Astro 6, React 19, TypeScript, Essentia.js, and Cloudflare Workers.

## Local Development

Requires Node.js 22.12 or later.

```bash
npm install
cp .dev.vars.example .dev.vars
npm run dev
```

Add your AI Gateway key to `.dev.vars` if you want to use enrichment features.

## Commands

- `npm run dev` — start the development server
- `npm run build` — create a production build
- `npm run preview` — preview the production build
- `npm run check` — run TypeScript checks
- `npm run deploy` — deploy with Wrangler

## Privacy

Audio analysis runs locally in the browser; uploaded files are not stored.
