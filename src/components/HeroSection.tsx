import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/**
 * Hero. Cinematic. Letter-stagger reveal on the headline, draw-in underline
 * under the italic phrase, a rotating word in the subhead, ghost artifact
 * tiles drifting in the background, and a scroll-driven exit (the whole
 * hero scales down and fades as you scroll into the demo below).
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const ROTATING = [
  "notes",
  "quizzes",
  "flashcards",
  "slide decks",
  "animations",
  "worksheets",
  "code",
];

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Whole hero pulls back as you scroll. Cinematic exit.
  const heroOp = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.9], [1, 0.94]);
  const heroY = useTransform(scrollYProgress, [0, 0.9], [0, -50]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative isolate overflow-hidden border-b border-hairline pt-32 pb-24 md:pt-44 md:pb-28"
    >
      <div aria-hidden className="page-haze pointer-events-none absolute inset-0 -z-20" />
      <Floaters progress={scrollYProgress} />

      <motion.div
        style={{ opacity: heroOp, scale: heroScale, y: heroY }}
        className="mx-auto flex w-full max-w-[980px] flex-col items-center px-6 text-center md:px-8"
      >
        <BetaChip />
        <Headline />
        <Subhead />
        <CTAs />
        <ScrollHint />
      </motion.div>
    </section>
  );
}

/* ============= Beta chip ============== */

function BetaChip() {
  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="relative mb-7 inline-flex items-center gap-2 rounded-full border border-hairline bg-[var(--color-surface-alt)]/40 px-3 py-1 text-[12.5px] text-[var(--color-ink-dim)] backdrop-blur-sm"
    >
      <span className="relative flex h-1.5 w-1.5">
        <motion.span
          animate={{ scale: [1, 1.9, 1], opacity: [0.7, 0, 0.7] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-[var(--color-accent)]"
        />
        <span className="relative h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
      </span>
      Beta is opening in waves
      <span className="ml-1 hidden text-[var(--color-muted)] sm:inline">— join wave 03</span>
    </motion.span>
  );
}

/* ============= Headline with letter stagger + draw underline ============== */

function Headline() {
  const part1 = "Cursor,";
  const part2 = "for CBSE students.";

  return (
    <h1 className="relative text-balance font-medium tracking-display-xl text-[clamp(44px,7.5vw,108px)] leading-[0.98] text-[var(--color-ink)]">
      <StaggeredWord text={part1} delay={0.1} />
      <span> </span>
      <span className="relative inline-block font-serif italic font-normal text-[var(--color-ink-dim)]">
        <StaggeredWord text={part2} delay={0.55} />
        <Underline delay={1.4} />
      </span>
    </h1>
  );
}

function StaggeredWord({ text, delay }: { text: string; delay: number }) {
  // Render each character as its own span. Stagger reveal with a slight
  // upward float and a tiny scale pop. Use a non-breaking space for spaces
  // so layout stays correct.
  const chars = text.split("");
  return (
    <span className="inline-block">
      {chars.map((c, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 22, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.7,
            ease: EASE,
            delay: delay + i * 0.025,
          }}
          className="inline-block"
          style={{ whiteSpace: "pre" }}
        >
          {c === " " ? "\u00A0" : c}
        </motion.span>
      ))}
    </span>
  );
}

function Underline({ delay }: { delay: number }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 380 12"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-1 left-0 h-[10px] w-full md:-bottom-2 md:h-[14px]"
    >
      <motion.path
        d="M2 8 C 70 2, 200 2, 378 7"
        stroke="var(--color-accent)"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE, delay }}
      />
    </svg>
  );
}

/* ============= Subhead with rotating word ============== */

function longest(words: readonly string[]): string {
  return words.reduce((a, b) => (b.length > a.length ? b : a), words[0]);
}

function Subhead() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % ROTATING.length), 1700);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: 1.0 }}
      className="mt-7 max-w-[60ch] text-pretty text-[17.5px] leading-[1.6] text-[var(--color-ink-dim)] md:text-[19px]"
    >
      One ask. Topperly builds you{" "}
      <span className="relative inline-flex items-baseline align-baseline">
        <span className="invisible select-none font-serif italic" aria-hidden>
          {longest(ROTATING)}
        </span>
        <span className="absolute inset-0 flex items-baseline">
          <AnimatePresence mode="wait">
            <motion.span
              key={ROTATING[idx]}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
              transition={{ duration: 0.45, ease: EASE }}
              className="font-serif italic text-[var(--color-ink)]"
            >
              {ROTATING[idx]}
            </motion.span>
          </AnimatePresence>
        </span>
      </span>
      , beside the chat. From your phone. Tonight.
    </motion.p>
  );
}

/* ============= CTAs ============== */

function CTAs() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: EASE, delay: 1.15 }}
      className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
    >
      <PrimaryCTA />
      <Link
        to="/story"
        className="group relative text-[14px] text-[var(--color-ink-dim)] underline-offset-[6px] transition-colors hover:text-[var(--color-ink)]"
      >
        <span className="relative">
          Read why we're building this
          <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-[3px]">→</span>
          <span
            aria-hidden
            className="absolute -bottom-1 left-0 h-px w-0 bg-[var(--color-ink-dim)] transition-[width] duration-300 group-hover:w-full"
          />
        </span>
      </Link>
    </motion.div>
  );
}

function PrimaryCTA() {
  // Magnetic-feeling button — translates slightly toward the cursor when
  // hovered and shows a subtle accent ring that pulses on idle.
  const ref = useRef<HTMLAnchorElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    setPos({ x: x * 0.18, y: y * 0.18 });
  }

  function onLeave() {
    setPos({ x: 0, y: 0 });
  }

  return (
    <motion.div
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 280, damping: 18 }}
      className="relative"
    >
      <motion.span
        aria-hidden
        animate={{ scale: [1, 1.08, 1], opacity: [0.0, 0.35, 0.0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
        className="absolute inset-0 -z-10 rounded-full bg-[var(--color-accent)] blur-md"
      />
      <Link
        ref={ref}
        to="/access"
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--color-ink)] px-5 py-2.5 text-[14px] font-medium text-[var(--color-bg)]"
      >
        <span className="relative z-10 flex items-center gap-2">
          Get beta access
          <svg
            width="11"
            height="11"
            viewBox="0 0 11 11"
            fill="none"
            className="transition-transform group-hover:translate-x-[3px]"
          >
            <path
              d="M2 5.5h7M6 2.5l3 3-3 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 rounded-full bg-[var(--color-accent)] transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
      </Link>
    </motion.div>
  );
}

/* ============= Scroll hint ============== */

function ScrollHint() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 1.5 }}
      className="mt-14 flex items-center gap-2 text-[12.5px] text-[var(--color-muted)]"
    >
      <motion.span
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        className="inline-block"
      >
        ↓
      </motion.span>
      Scroll. Watch a real session play.
    </motion.div>
  );
}

/* ============= Background floaters ==============
 * Six artifact ghost tiles drift slowly behind the hero, parallaxed against
 * the scroll. They're very low-opacity so they don't fight the headline.
 */

const FLOATERS = [
  { kind: "notes",      x: "8%",  y: "18%", w: 168, rotate: -8,  speed: 0.35 },
  { kind: "quiz",       x: "82%", y: "22%", w: 140, rotate: 6,   speed: 0.55 },
  { kind: "flashcards", x: "12%", y: "70%", w: 160, rotate: 10,  speed: 0.25 },
  { kind: "deck",       x: "78%", y: "68%", w: 180, rotate: -5,  speed: 0.45 },
  { kind: "animation",  x: "92%", y: "48%", w: 124, rotate: 4,   speed: 0.30 },
  { kind: "code",       x: "3%",  y: "44%", w: 132, rotate: -3,  speed: 0.40 },
] as const;

function Floaters({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {FLOATERS.map((f, i) => (
        <Floater key={f.kind} {...f} progress={progress} index={i} />
      ))}
    </div>
  );
}

function Floater({
  kind,
  x,
  y,
  w,
  rotate,
  speed,
  index,
  progress,
}: {
  kind: string;
  x: string;
  y: string;
  w: number;
  rotate: number;
  speed: number;
  index: number;
  progress: MotionValue<number>;
}) {
  // Parallax: each floater moves up at its own speed as the user scrolls
  // past the hero. Multiplied by speed and a base distance.
  const yShift = useTransform(progress, [0, 1], [0, -180 * speed]);
  const op = useTransform(progress, [0, 0.6], [0.55, 0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: rotate - 4 }}
      animate={{ opacity: 0.55, y: 0, rotate }}
      transition={{ duration: 1.2, ease: EASE, delay: 0.2 + index * 0.1 }}
      style={{
        left: x,
        top: y,
        width: w,
        y: yShift,
        opacity: op,
        rotate,
      }}
      className="absolute"
    >
      {/* Idle drift loop independent of scroll */}
      <motion.div
        animate={{ y: [0, -6, 0, 4, 0] }}
        transition={{
          duration: 8 + index * 0.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <FloaterCard kind={kind} />
      </motion.div>
    </motion.div>
  );
}

function FloaterCard({ kind }: { kind: string }) {
  // Generic ghost card — header strip + 3 lines + corner badge. Specific
  // variants tweak the inside to hint at quiz / flashcards / deck / etc.
  return (
    <div className="rounded-xl border border-hairline bg-[var(--color-surface-alt)]/60 p-3 backdrop-blur-[2px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          <span className="text-[9px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
            {kind}
          </span>
        </div>
        <span className="text-[8px] text-[var(--color-muted)]">.{ext(kind)}</span>
      </div>
      <FloaterBody kind={kind} />
    </div>
  );
}

function ext(kind: string) {
  switch (kind) {
    case "notes":      return "pdf";
    case "quiz":       return "json";
    case "flashcards": return "json";
    case "deck":       return "pptx";
    case "animation":  return "mp4";
    case "code":       return "py";
    default:           return "txt";
  }
}

function FloaterBody({ kind }: { kind: string }) {
  if (kind === "quiz") {
    return (
      <div className="mt-2 space-y-1.5">
        <div className="h-1.5 w-3/4 rounded bg-[var(--color-hairline)]" />
        <div className="flex gap-1">
          <span className="h-3 w-3 rounded-sm border border-[var(--color-accent)]" />
          <span className="h-1.5 flex-1 self-center rounded bg-[var(--color-hairline)]" />
        </div>
        <div className="flex gap-1">
          <span className="h-3 w-3 rounded-sm border border-hairline" />
          <span className="h-1.5 flex-1 self-center rounded bg-[var(--color-hairline)]" />
        </div>
      </div>
    );
  }
  if (kind === "flashcards") {
    return (
      <div className="mt-2 grid h-12 place-items-center rounded-md border border-hairline">
        <span className="text-[10px] text-[var(--color-ink-dim)]">Q · A</span>
      </div>
    );
  }
  if (kind === "deck") {
    return (
      <div className="mt-2 flex gap-1">
        <div className="aspect-[16/10] flex-1 rounded-sm bg-[var(--color-hairline)]" />
        <div className="aspect-[16/10] flex-1 rounded-sm bg-[var(--color-hairline)]/60" />
      </div>
    );
  }
  if (kind === "animation") {
    return (
      <div className="mt-2 flex h-10 items-center justify-center rounded-md border border-hairline">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M5 3.5l5 3.5-5 3.5z" fill="var(--color-accent)" />
        </svg>
      </div>
    );
  }
  if (kind === "code") {
    return (
      <div className="mt-2 space-y-1 font-mono text-[8px] text-[var(--color-ink-dim)]">
        <div>def solve(x):</div>
        <div className="pl-3 text-[var(--color-muted)]">return x*2</div>
        <div>print(solve(7))</div>
      </div>
    );
  }
  // notes (default)
  return (
    <div className="mt-2 space-y-1">
      <div className="h-1.5 w-full rounded bg-[var(--color-hairline)]" />
      <div className="h-1.5 w-5/6 rounded bg-[var(--color-hairline)]" />
      <div className="h-1.5 w-4/6 rounded bg-[var(--color-hairline)]" />
    </div>
  );
}
