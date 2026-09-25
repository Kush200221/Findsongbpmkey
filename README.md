# FindSongKey

<img width="386" height="76" alt="findsongkey-logo-dark" src="https://github.com/user-attachments/assets/93cab355-8980-49f3-a0aa-8a464ca31028" /><svg xmlns="http://www.w3.org/2000/svg" width="386" height="76" viewBox="0 0 386 76" role="img" aria-labelledby="title desc">
  <title id="title">FindSongKey logo</title>
  <g fill="none">
    <rect x="1" y="1" width="74" height="74" rx="17" fill="#1A1A17" stroke="#38372F" stroke-width="1"/>
    <circle cx="38" cy="38" r="25" stroke="#51432D" stroke-width="2.5"/>
    <path d="M38 13 A25 25 0 0 1 62.5 33" stroke="#EF9F27" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M17 38 H25 L29 29 L34 48 L40 25 L45 38 H59" stroke="#EF9F27" stroke-width="3.3" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="59" cy="38" r="2.5" fill="#F0EFE8"/>
  </g>
  <text x="94" y="40" fill="#E8E7DF" font-family="DM Mono, SFMono-Regular, Consolas, monospace" font-size="28" font-weight="500" letter-spacing="-1.35"><tspan fill="#EF9F27">find</tspan><tspan>song</tspan><tspan fill="#EF9F27">key</tspan></text>
  <text x="96" y="59" fill="#888780" font-family="DM Mono, SFMono-Regular, Consolas, monospace" font-size="10" font-weight="500" letter-spacing="2.2"></text>
</svg>



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
