# 55coffee — "Beyond Coffee"

A pitch demo built for **55coffee** (Oman), applying the scroll-driven product-marketing
layout of `more-nutrition.webflow.io` to 55coffee's brand.

Same stack as the `more-matcha-clone` reference build:

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 (`@theme` tokens, no config file) |
| Motion | GSAP 3.13 + `@gsap/react` (`ScrollTrigger`, `SplitText`) |
| Fonts | Bricolage Grotesque + Inter via `next/font` |

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build + type check
```

## Structure

```
app/
  layout.tsx      fonts, metadata
  page.tsx        section order
  globals.css     Tailwind v4 @theme tokens + component classes
components/       one file per section
lib/
  content.ts      every string on the page — edit copy here, not in JSX
  motion.ts       shared GSAP helpers (reveal, split-line, count-up, parallax, drift)
public/assets/    imagery
```

## Section order

Loader → ticker → nav → hero (+ counters) → review drift rows → benefits →
signature rail → comparison table → syrup picker → roastery → origins →
branches → order → footer.

## Motion notes

- All GSAP runs through `useGSAP()` scoped to each section, so timelines clean
  themselves up on unmount.
- `lib/motion.ts` is the only place that touches GSAP directly.
- The loader is **time-boxed**, not tied to a fetch — a slow asset can't trap the page.
- Every helper short-circuits under `prefers-reduced-motion`, and `.gs-hide`
  elements are forced visible in that mode so nothing stays hidden.

## Before this goes live

- **Imagery** in `public/assets/` was pulled from 55coffee's own live site (their
  CDN) so the pitch reads as real. Fine for showing the client their own brand —
  replace with licensed, generated, or newly shot assets before any public deploy.
- **The logo** (`logo-lockup.png` / `-light.png`, `logo-mark.png` / `-light.png`,
  `app/icon.png`) was extracted from the final frame of the brand's animated GIF
  wordmark, snapped to two-tone and trimmed. The `-light` files are luminance-
  inverted for dark sections. These are raster — **ask the client for the official
  vector (SVG/AI) before launch** so the mark stays crisp at every size.
- **Testimonials and the 4.8 / 2,410 rating are placeholders** (`lib/content.ts`)
  written for the demo. Swap in real reviews or remove the section.
- The roastery **video is a placeholder panel** — drop in the client's film.
- All CTAs are `#` anchors; wire to the real ordering/delivery flow.
- Brand facts used (29 branches, Salalah origin, Volcano Roastery in Khazaen,
  "beyond coffee") come from 55coffee's public site — worth confirming they're current.
