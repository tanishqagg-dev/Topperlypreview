# Topperly — Design System & Site Architecture

> **Tagline.** Cursor, *for CBSE students.*
> **Promise.** One ask. Topperly builds the whole pack — notes, animations, flashcards, slide deck. Beside the chat. From your phone. Tonight.
> **Audience.** Indian Class 9–12 students. Boards, JEE, NEET. Independent learners. Tutors.
> **Voice.** Student-to-student. YC-style — specific, personal, unvarnished. No corporate hype. No emojis.

---

## 1. The feel

A **cinematic, scroll-locked product story**. Apple's product pages and film.ai's showcase are the closest references. Linear's typography rigor underneath.

The site is dark, warm, and quiet at rest — and *loud* when it moves. Every section is a deliberate scene. Big serif italic accents puncture clean sans bodies. Pastel xenon green appears sparingly, like a director's signature. Nothing glows just to glow.

Three rules that govern every screen:

1. **Show, don't list.** Every claim is animated proof, not a bullet. "AI gives you a paragraph; we give you a pack" is *demonstrated* in a side-by-side scroll-locked panel — not asserted in a hero subheadline.
2. **Scroll is the timeline.** Almost every section uses sticky pinning + scroll-driven motion values. The user holds the remote. The page is a film they're scrubbing.
3. **Restraint with one accent.** Pastel xenon green at ~10–15% chroma. Used for a single dot, a single underline, a single ring. Never two accents in the same frame.

---

## 2. Design tokens

All defined in `src/index.css` via Tailwind v4's `@theme` block. OKLCH so values are perceptually uniform.

### Color

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `oklch(13% 0.006 250)` | Page background — warm-tinted near-black |
| `--color-ink` | `oklch(96% 0.006 80)` | Primary text — cream, not white |
| `--color-ink-dim` | `oklch(72% 0.006 80)` | Body text, sub-headlines |
| `--color-muted` | `oklch(54% 0.006 80)` | Eyebrows, meta, labels |
| `--color-accent` | `oklch(85% 0.09 145)` | **The one accent.** Pastel xenon green |
| `--color-surface` | `oklch(17% 0.006 250)` | Window-frame interior |
| `--color-surface-alt` | `oklch(15% 0.006 250)` | Card surfaces, secondary panels |
| `--color-surface-high` | `oklch(20% 0.008 250)` | Chat bubbles, raised tiles |
| `--color-hairline` | `oklch(28% 0.006 250)` | Default borders |
| `--color-hairline-bright` | `oklch(36% 0.006 250)` | Active/hover borders |

**No glows.** A single soft accent halo lives on the closing CTA and the magnetic primary button — that's it. No glowing text, no glowing borders, no glowing cards.

### Typography

| Stack | When |
|---|---|
| **Inter** | Default. Headlines, body, UI. Tight tracking on display sizes (`tracking-display-tight: -0.02em`, `tracking-display-xl: -0.025em`). |
| **Instrument Serif (italic)** | Accent only. The "*for CBSE students.*" half of every dual-line headline. Pulls a quote, a moment, a signature. Never used for body. |
| **JetBrains Mono** | Code, file names, timestamps, eyebrows ("ENTRY 01"), small chrome labels. Never paragraphs. |

**Sizing.** Display headlines use `clamp(...)` with healthy ranges so they breathe across viewports — e.g. `clamp(44px, 7.5vw, 108px)` for hero, `clamp(40px, 6.5vw, 92px)` for chapter headlines.

**Hierarchy.** Massive hero → large section heads → 22px subheads → 15.5–17.5px body → 11–12.5px eyebrows. Never two competing sizes on one screen.

### Spacing & layout

- Page max-width: `var(--container-page)` ≈ 1240px.
- Hero copy max-width: 920–980px centered.
- Body copy: `max-w-[58ch]` to `max-w-[60ch]` for readability.
- Sections breathe with `py-24` to `py-32` baseline. Cinematic pinned sections use `200vh` to `700vh` outer height with `h-screen` sticky inner.
- 8px spacing rhythm with `gap-2`, `gap-4`, `gap-6` etc. Vertical rhythm matches the type scale.

### Motion grammar

Two easings cover 95% of the site:
- `EASE = [0.22, 1, 0.36, 1]` — Apple's expressive ease. Used for any "intentional" reveal.
- Spring `{ stiffness: 280–320, damping: 18–28 }` — for magnetic buttons, cursor follow, smoothed scroll progress.

Three reveal patterns:
1. **Staggered letter / word.** Hero, chapter titles. Each char fades + rises 22px with a tiny scale pop.
2. **whileInView (once).** Card grids, claim tiles, audience rows. y:14 → 0, opacity 0 → 1, duration 0.7s.
3. **Scroll-driven `useTransform`.** All cinematic pinned sections. Opacity windows like `[0.10, 0.28, 0.78, 0.92] → [0, 1, 1, 0]` for fade in/hold/fade out across a sticky stage.

Motion is **never decorative-only**. If something animates, it either reveals new information or sustains scroll attention.

---

## 3. Site architecture

### Routes (`src/App.tsx`)

| Path | Page | Role |
|---|---|---|
| `/` | `HomePage` | The full pitch. Hero → demo → comparison → tools → close. |
| `/story` | `StoryPage` | Founder's log — 7 dated diary entries with a sticky timeline. |
| `/access` | `AccessPage` | Beta waitlist signup. (Existing — untouched.) |
| `*` | `HomePage` | 404 falls back home. |

### Global chrome

- **`Nav`** — fixed, backdrop-blur, h-14. Logo + "Topperly" + tiny "Beta" tag. Two text links (Story, Access). Cream pill primary CTA on the right.
- **`Footer`** — three columns. Brand block + tagline + datestamp / Pages / Reach us.
- **`InteractiveLayer`** — site-wide overlay with two pieces:
  - **ScrollProgressBar** — 2px accent green bar pinned to top of viewport, scaleX driven by spring-smoothed `scrollYProgress`.
  - **CursorFollower** — accent dot + soft halo following the cursor with spring physics. Auto-grows over interactive elements. Disabled on `(hover: none)` devices.
- **`Logo`** — single-path SVG (the actual Topperly mark). Draws itself on first mount (stroke → fill morph). On hover: scales 6%, rotates -3°, accent dot blinks at corner.

---

## 4. Home page — the 11-section scroll movie

In order:

### 4.1 `HeroSection`
Full-bleed cinematic intro.
- Pulsing beta chip "Beta is opening in waves — join wave 03" with breathing accent dot.
- Letter-stagger headline "Cursor, *for CBSE students.*" with an animated SVG draw-in underline under the italic phrase.
- Subhead with a **rotating word** — "Topperly builds you *notes / quizzes / flashcards / slide decks / animations / worksheets / code*" cycling every 1.7s with blur+slide crossfade.
- Six **floating ghost artifact tiles** drifting in the background (notes / quiz / code / animation / flashcards / deck) with parallax — fade out as you scroll into the demo below.
- **Magnetic primary CTA** — pulsing accent halo behind the pill, button follows cursor on hover, accent fill sweep on hover.
- Bouncing scroll arrow.
- Whole hero scales 6% smaller and fades to 0 on scroll exit.

### 4.2 `BigDemo` (700vh sticky)
The centerpiece. One real student prompt drives a multi-artifact response.
- Stage: a Mac-chrome window centered. Above it: morphing act counter (`ACT 01 / 07`) and headlines that cross-fade through 7 acts as you scroll.
- Inside: chat panel (left) + artifact panel (right, 4 tabs: Notes / Animation / Flashcards / Slides).
- Phases driven by `scrollYProgress`:
  - User message bubble appears: "i have a class 10 bio test tomorrow on cellular respiration. help me revise"
  - Topperly reply: "Got you. Building a 4-piece pack:" with 4 plan items revealing one by one.
  - Tabs row appears.
  - **Notes tab** — concept doc with 3 stages of cellular respiration, key term chips.
  - **Animation tab** — SVG with 3 stage circles + animated dotted arrows pulsing through Glycolysis → Krebs → ETC.
  - **Flashcards tab** — 3D flip card: "What does ATP stand for?" → "Adenosine Triphosphate".
  - **Slides tab** — 8-thumbnail strip + main slide stage.
  - Closing toast: "revision-pack saved · take it offline".
- Bottom: 7 progress dots, the active one expands and turns green.

### 4.3 `HowItWorks` (320vh sticky)
Apple-style 3-step pinned scrolly.
- Left half: pinned Mac window that morphs through three stages — Stage 1 (live caret typing the prompt) → Stage 2 (5 artifacts pop in one by one) → Stage 3 (live quiz card + flashcard + worksheet preview).
- Right half: 3 numbered steps. Each "lights up" (opacity 1, accent line) when its stage is on screen; others dim to 42% opacity.

### 4.4 `ProofSplit` (240vh sticky)
Head-to-head AI comparison. The "we invented this" proof.
- Above: 4 cross-faded act headlines ("The same question" → "The same answer" → "Topperly keeps going" → "Only one lets you study").
- Two AI panels side-by-side, equal weight:
  - **Every other AI** — same prompt, same structured 4-step IBP solution, ends "end of reply".
  - **Topperly** (with green border and `WORKSPACE` badge) — same answer, then below: "Built a homework pack from the same answer · X / 4 ready" + 4 tile cards (Worksheet / Answer key / Quiz / Flashcards) appearing staggered.
- Verdict captions appear below each panel near the end. Other-AI panel dims with a verdict overlay.

### 4.5 `TimeMachine`
Emotional storytelling.
- Big italic headline: *"Topperly works at 1am."*
- Sticky clock ring (left) with green progress arc + rotating hour hand driven by scrollYProgress.
- Three timestamped student moments (right): **1:47 AM** boards / **6:30 PM** class test / **8:00 AM** walking into exam. Each fades in/out with x-translate as you scroll past.

### 4.6 `PhonePeek` (320vh sticky)
Phone mockup with cycling artifacts.
- Big italic *"The whole pack fits in your pocket."*
- Sticky phone frame (right) with notch, status bar, and 5 cycling screens: Chat / Quiz / Flashcards / Worksheet / Notes. Active screen swaps every ~22% of scroll.
- Step rail (left) lights up the active screen.
- Three parallaxed ghost labels drift past in the background ("REVISION PACK", "FLASHCARDS · DRILLING", "SAVED OFFLINE").
- Below phone: "offline-ready · 32 MB" chip.

### 4.7 `StatsBar`
Counter-animated tiles. 4-column grid: **15** tools / **6** artifact types / **2 mo** / **100%**. Each animates from 0 to its target in 1.6s on viewport enter, staggered by 60ms.

### 4.8 Tools directory
Three columns: Learning Suite / Visual Lab / Build & Export. 15 tools total. Each tool is a name + one-line note. Stagger reveal on viewport enter (40ms delay per tool).

### 4.9 Audiences
"Built for people who learn by *making.*" Three rows: Students / Independent learners / Educators and tutors. Stagger reveal.

### 4.10 Story tease
Italic serif pull-quote: "We're three students who just finished CBSE Class 12. We had ChatGPT on our phones for boards. It explained things. It didn't help us study." Links to /story.

### 4.11 `ClosingCTA`
Full-bleed cinematic close.
- Soft accent halo grows 0.7 → 1.4 scale and fades 0 → 0.5 → 0.2 with scroll progress.
- Massive "Stop reading answers." (animated arrival) + italic *"Start studying."* (delayed 0.4s).
- "Get on the list" pill + "Read why we're building this →" text link.
- *"— The Topperly team"* signature.

---

## 5. Story page — the founder's log

A scroll-locked dated journal. Different *mode* from the home page: warmer, slower, designed to be read at 1am.

### 5.1 `TitleScene`
- Eyebrow: `BY THE TOPPERLY TEAM · 7 chapters · 4 min read`
- Massive *"Founders' log"* with letter-stagger + draw-in green underline.
- Sub: "Seven entries. From the night that started it all, to the morning the beta opened. In our own words."
- Bouncing "Scroll to read" hint.

### 5.2 Vertical timeline rail
Sticky on the left for the entire journal (`absolute inset-0` inside a relative wrapper with sticky inner).
- Background hairline rail with a green fill that scaleY-grows with `journalProgress`.
- 7 tick dots that turn green as their entry is reached.
- Sticky date card to the left of the rail — live-updates with `ENTRY 01 / Mar 15, 2026 / 1:47 AM, Tuesday` as the active entry changes (AnimatePresence wait-mode swap).

### 5.3 7 dated entries (200vh each)
A single page-wide `useScroll` is shared down so the journal acts as one continuous timeline. Each entry is given a 1/7 slice via `useTransform(journalProgress, [start, start+1/7], [0, 1])` so per-entry reveal timing is local to its slice.

Each entry has:
- Location strip — `01 / 07 ── My bedroom · Delhi`.
- A unique **micro-visual** between location and headline.
- "Pre" lead-in line.
- Massive italic serif big moment.
- Body paragraph.
- Pull quote with green left border, slides in from -12px.

The 7 entries:

| # | Date | Visual | Big moment |
|---|---|---|---|
| 01 | Mar 15, 2026 · 1:47 AM | Phone lock screen with live ticking seconds | *"1:47 AM."* |
| 02 | Mar 16, 2026 · 8:42 AM | Chat bubble with text typing in real time | *"It answered."* |
| 03 | Mar 19, 2026 · cyber café | Paragraph bars morphing into scattered tile shapes | *"It was the format."* |
| 04 | Mar 24, 2026 · school canteen | Mini Cursor IDE split: chat │ syntax-highlighted code | *"Cursor."* |
| 05 | Apr 02, 2026 · WhatsApp group | Rotating artifact carousel (`help me revise → notes → quiz …`) | *"like that?"* |
| 06 | Apr 14, 2026 · school gates | Three monogram avatar circles (T / A / S) with role labels | *"just finished boards."* |
| 07 | Apr 25, 2026 · today, 11:14 PM | Three concentric pulsing rings | *"small waves."* |

### 5.4 `ClosingScene`
- "END OF LOG" eyebrow.
- *"That's the whole story. Want to be in the next entry?"* with the same green halo as the home closing.
- "Get on the list" CTA.
- Three T/A/S monograms + italic *"— Signed, the Topperly team · Apr 25, 2026"*.

---

## 6. Reusable patterns

These appear across multiple components. If you're adding a new section, reach for these first.

### 6.1 The cinematic pinned scene
```tsx
<section ref={ref} className="relative" style={{ height: "240vh" }}>
  <div className="sticky top-0 flex h-screen items-center overflow-hidden">
    {/* content driven by scrollYProgress useTransform */}
  </div>
</section>
```
Outer height controls how long the scene "lasts". Inner is pinned and stays in viewport for that distance.

### 6.2 The cross-faded headline
Stack N headlines with absolute positioning, each with its own opacity window from `useTransform`. Their input ranges overlap by 2pp for clean cross-fade.

### 6.3 The act counter
A live React state derived from `useMotionValueEvent(progress, "change", ...)`. Drives an eyebrow ("ACT 03"), a counter ("03 / 07"), and the active progress dot at the bottom.

### 6.4 The Mac window frame
`window-frame` utility class wraps any rectangular surface in a mac-chrome look. Three traffic-light dots (red/yellow/green using oklch, NOT raw colors), centered title, hairline border, soft outer outline.

### 6.5 The artifact tile
```tsx
<div className="surface-soft flex items-center gap-2.5 rounded-lg border border-hairline p-2.5">
  <Glyph />
  <div>{name}<br/>{meta}</div>
  <span className="rounded-full border border-[var(--color-accent)] px-1.5 text-[9px] uppercase tracking-[0.14em] text-[var(--color-accent)]">ready</span>
</div>
```
Used in BigDemo, ProofSplit, PhonePeek, HowItWorks Stage 2.

### 6.6 The pull quote
`max-w-[52ch] border-l-2 border-[var(--color-accent)] pl-4 text-[15px] leading-[1.6] text-[var(--color-ink)]` — the kicker on every cinematic chapter.

### 6.7 The serif italic accent
The single most-repeated motif. Every dual-line headline does:
```tsx
"First clause."{" "}
<span className="font-serif italic font-normal text-[var(--color-ink-dim)]">
  Second clause.
</span>
```

---

## 7. Anti-patterns (we explicitly avoid)

- **Glowing green text or buttons.** The accent is a *signal*, not a *spotlight*.
- **Multiple radial gradients stacked.** One subtle `.page-haze` per section, never two.
- **Mono fonts in body copy.** Mono is for chrome only — labels, code, file names, timestamps.
- **Emojis.** Anywhere. Use line SVG glyphs.
- **Generic "AI does everything" bullet lists.** Every claim must be animated, demonstrated, or attributed.
- **Marketing hype voice.** No "revolutionary", no "supercharge", no "unleash". Student-to-student honesty.
- **More than one CTA per scene.** Primary action is always singular.
- **whileInView margins so aggressive content never appears on first paint.** We use `-15%` to `-10%` margins, not `-30%`.

---

## 8. Files & where to look

```
src/
├── App.tsx                 # Routes + global ScrollToTop + InteractiveLayer
├── index.css               # @theme tokens, .page-haze, .window-frame, .surface-* utilities
├── main.tsx                # React root
├── components/
│   ├── Nav.tsx             # Fixed top nav
│   ├── Footer.tsx          # 3-column footer
│   ├── Logo.tsx            # SVG logomark with draw-in animation
│   ├── InteractiveLayer.tsx# Scroll progress + cursor follower
│   ├── HeroSection.tsx     # Animated cinematic intro
│   ├── BigDemo.tsx         # 700vh pinned multi-artifact demo
│   ├── HowItWorks.tsx      # 320vh pinned 3-step
│   ├── ProofSplit.tsx      # 240vh pinned head-to-head AI comparison
│   ├── TimeMachine.tsx     # Sticky clock + 3 timestamped moments
│   ├── PhonePeek.tsx       # 320vh pinned phone with 5 screens
│   ├── StatsBar.tsx        # Counter-animated stats
│   └── ClosingCTA.tsx      # Full-bleed cinematic close
└── pages/
    ├── HomePage.tsx        # Wires all home sections together
    ├── StoryPage.tsx       # Founder's log (TitleScene + Timeline + 7 Entry + ClosingScene)
    └── AccessPage.tsx      # Beta waitlist (existing)
```

---

## 9. The one-line summary

**Topperly's site is a film about studying at 1am, told in cinematic scroll-locked scenes, in dark warm typography with a single pastel green accent — by three students, for three students.**
