# FindSongKey

A browser-based BPM, musical key, and Camelot code analyzer built with Astro,
React, and Essentia.js. Audio analysis runs locally in the browser.

## Local development

```sh
npm install
npm run dev
```

## Cloudflare Workers

The site is a static Astro build deployed as a Cloudflare Worker with static
assets.

Build and preview with the Workers runtime:

```sh
npm run worker:dev
```

Deploy directly with Wrangler:

```sh
npm run deploy
```

The Wrangler configuration targets the existing `findsongkeybpm` Worker and
publishes the `dist` directory to its static assets service.
