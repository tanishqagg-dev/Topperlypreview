# Topperly — beta invite landing page

Cinematic, dark-themed beta invite page for Topperly (the "Cursor for CBSE students" study-and-creation workspace).

Stack: **Vite + React + TypeScript**, Tailwind v4 with OKLCH tokens, GSAP ScrollTrigger, Framer Motion, React Three Fiber, Lenis smooth scroll.

## Local dev

```bash
npm install
npm run dev
```

Dev server boots at `http://localhost:5173/`. A Vite middleware plugin handles `/api/waitlist` in dev (GET returns count, POST accepts `{ email }`). Submissions persist to `data/waitlist.json` (gitignored).

## Production build

```bash
npm run build
```

Hero WebGL scene is lazy-loaded and replaced by a static SVG poster on mobile (<768px) or when the user has `prefers-reduced-motion`.

## Deploying the waitlist API

`api/waitlist.ts` exports a Vercel-compatible default handler. On Vercel set:

- `RESEND_API_KEY` — optional. When present, each new signup gets a confirmation email via Resend.
- `RESEND_FROM` — optional, defaults to `Topperly <onboarding@resend.dev>`.

Without `RESEND_API_KEY`, signups are still recorded and the page still advances the counter.

Note: the default handler uses filesystem persistence (`data/waitlist.json`), which does not survive between serverless invocations on Vercel. For a production deploy, swap `loadStore`/`saveStore` in `api/waitlist.ts` to a persistent store (KV / Neon / Supabase).

## Structure

- `src/components/Hero.tsx` — hero with R3F scene + static poster fallback
- `src/components/HeroScene.tsx` — glass shards, dust field, camera rig
- `src/components/HeroPoster.tsx` — SVG fallback for mobile / reduced-motion
- `src/components/Preview.tsx` — pinned split-pane demo (GSAP scrubbed)
- `src/components/Suites.tsx` — three tool suites with unique visuals
- `src/components/Waitlist.tsx` — email capture, live counter
- `api/waitlist.ts` — dev + serverless handler
- `PRODUCT.md`, `DESIGN.md` — product and design context (impeccable skill)

## Design tokens

See `DESIGN.md`. One saturated accent (Xenon lime `oklch(93% 0.24 130)`), tinted neutrals toward hue 250, no `#000` or pure `#fff`, no gradient text, no default glassmorphism.
