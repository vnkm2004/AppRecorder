# AppRecorder

3D Device Mockup & 4K Video Recording Studio for web applications and mobile prototypes.

## Features

- **Volumetric 3D Device Frames**: iPhone 18 Pro Max, iPhone 16 Pro Max, Pixel 10 Pro, Galaxy S24 Ultra, iPad Pro 13", MacBook Pro 16", and Studio Display 27".
- **Studio Quality Lighting**: Space Black, Natural Titanium, Pure Silver, Ceramic White, and Liquid Glass chassis finishes with realistic specular reflections.
- **Direct & Proxied Embedding**: Embed live web apps directly or through the smart proxy with responsive viewport scaling.
- **Ultra HD & 4K Recording**: Export 60 FPS 4K screen recordings with Region Capture API support and zero UI clutter.
- **Bidirectional Scroll Resolver**: Full mouse wheel and touch-screen finger scrolling across vertical views and horizontal carousels.

## Getting Started

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Deployment

### Vercel
AppRecorder is fully configured for Vercel deployment out of the box via `vercel.json` and `/api/proxy.js`:
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Serverless Functions: `api/proxy.js`

### Netlify
Configured via `netlify.toml` and `netlify/functions/proxy.js`.

