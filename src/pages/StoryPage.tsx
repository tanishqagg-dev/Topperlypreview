import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Founder's journal. Cinematic. Scroll-locked. Each entry is a dated
 * pinned scene with its own micro-visual. A vertical timeline runs down
 * the left with sticky date markers and a green progress fill that grows
 * as you scroll through the year.
 */

const ENTRIES = [
  {
    id: "01",
    date: "Mar 15, 2026",
    when: "1:47 AM, Tuesday",
    location: "My bedroom · Delhi",
    pre: "It's",
    big: "1:47 AM.",
    body: "Boards in three weeks. Phone glow on the ceiling. Tomorrow's chemistry test, untouched. I've been awake for hours and I haven't actually studied anything.",
    pull: "This was every other night for us.",
    visual: "clock",
  },
  {
    id: "02",
    date: "Mar 16, 2026",
    when: "First period · 8:42 AM",
    location: "Class XII-B",
    pre: "We asked ChatGPT.",
    big: "It answered.",
    body: "Not bad answers. Genuinely. Tidy paragraphs. Worked steps. Friendly tone. The kind of reply that feels like progress at 1am.",
    pull: "The next morning at school, we couldn't reproduce a single one.",
    visual: "chat",
  },
  {
    id: "03",
    date: "Mar 19, 2026",
    when: "After tuition",
    location: "Cyber café, Connaught Place",
    pre: "The problem wasn't the AI.",
    big: "It was the format.",
    body: "We were reading. Not studying. Reading is a passive act. You can't pass boards by reading paragraphs at 1am — you pass them by drilling against something. A quiz. A worksheet. A flashcard you flipped wrong twice last week.",
    pull: "We needed something to drill against.",
    visual: "format",
  },
  {
    id: "04",
    date: "Mar 24, 2026",
    when: "Lunch break · 12:30 PM",
    location: "School canteen",
    pre: "A senior showed us",
    big: "Cursor.",
    body: "It's an AI editor for programmers. The AI doesn't just explain code — it writes the code, beside the conversation. You can run it. You can change it. Watching it felt like watching the future.",
    pull: "It stuck because we could do something with the output.",
    visual: "cursor",
  },
  {
    id: "05",
    date: "Apr 02, 2026",
    when: "Late evening",
    location: "WhatsApp group · 'lmaooo'",
    pre: "What if studying could be",
    big: "like that?",
    body: "What if asking 'help me revise' didn't return paragraphs — it returned a quiz, a worksheet, a flippable deck, an animated explainer? Things we could actually study against. Things we could touch.",
    pull: "That's the whole pitch.",
    visual: "carousel",
  },
  {
    id: "06",
    date: "Apr 14, 2026",
    when: "After last paper",
    location: "School gates",
    pre: "We're three students who",
    big: "just finished boards.",
    body: "We don't have an MBA. We don't have a pitch deck. We have first-hand opinions about what study apps get wrong because we used all of them, and they all let us down at 1am.",
    pull: "We're building Topperly because we needed it last year.",
    visual: "team",
  },
  {
    id: "07",
    date: "Apr 25, 2026",
    when: "Today · 11:14 PM",
    location: "Same bedroom",
    pre: "Beta opens in",
    big: "small waves.",
    body: "Every wave we ship is shaped by feedback from the wave before it. There's no growth team optimizing onboarding funnels. It's three of us reading every message.",
    pull: "If you join, you'll shape what we build.",
    visual: "wave",
  },
];

/* ============= Page ============== */

export function StoryPage() {
  const journalRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: journalProgress } = useScroll({
    target: journalRef,
    offset: ["start start", "end end"],
  });

  const [activeIdx, setActiveIdx] = useState(0);
  useMotionValueEvent(journalProgress, "change", (t) => {
    const idx = Math.min(ENTRIES.length - 1, Math.floor(t * ENTRIES.length));
    setActiveIdx(idx);
  });

  return (
    <>
      <TitleScene />

      <div ref={journalRef} className="relative">
        <Timeline progress={journalProgress} activeIdx={activeIdx} />
        {ENTRIES.map((e, i) => (
          <Entry
            key={e.id}
            entry={e}
            index={i}
            total={ENTRIES.length}
            journalProgress={journalProgress}
          />
        ))}
      </div>

      <ClosingScene />
    </>
  );
}

/* ============= Title scene ============== */

function TitleScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const op = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.9], [1, 0.94]);
  const y = useTransform(scrollYProgress, [0, 0.9], [0, -50]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden border-b border-hairline pt-32 pb-24 md:pt-44 md:pb-32"
    >
      <div aria-hidden className="page-haze pointer-events-none absolute inset-0 -z-10" />

      <motion.div
        style={{ opacity: op, scale, y }}
        className="mx-auto flex w-full max-w-[920px] flex-col items-center px-6 text-center md:px-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-7 flex items-center gap-3 text-[12px] tracking-[0.18em] text-[var(--color-muted)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          PERSONAL LOG · 2026
          <span className="h-px w-8 bg-[var(--color-hairline)]" />
          <span className="font-mono text-[11px]">7 entries · 4 min read</span>
        </motion.div>

        <h1 className="relative font-medium tracking-display-xl text-[clamp(56px,10vw,140px)] leading-[0.96] text-[var(--color-ink)]">
          <Stagger text="Founders' log" delay={0.2} />
          <Underline delay={1.3} />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 1.0 }}
          className="mt-9 max-w-[44ch] text-[17px] leading-[1.65] text-[var(--color-ink-dim)] md:text-[18.5px]"
        >
          Seven entries. From the night that started it all, to the morning the beta opened. In our own words.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-14 flex items-center gap-2 text-[12.5px] text-[var(--color-muted)]"
        >
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            ↓
          </motion.span>
          Scroll to read
        </motion.div>
      </motion.div>
    </section>
  );
}

function Stagger({ text, delay }: { text: string; delay: number }) {
  return (
    <span className="inline-block">
      {text.split("").map((c, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: EASE, delay: delay + i * 0.035 }}
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
      viewBox="0 0 380 14"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -bottom-1 left-1/2 h-[14px] w-[78%] -translate-x-1/2 md:-bottom-2 md:h-[18px]"
    >
      <motion.path
        d="M2 9 C 70 2, 220 2, 378 8"
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

/* ============= Timeline (sticky, full-page) ============== */

function Timeline({
  progress,
  activeIdx,
}: {
  progress: MotionValue<number>;
  activeIdx: number;
}) {
  const fill = useTransform(progress, [0, 1], [0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 hidden md:block">
      <div className="sticky top-0 h-screen">
        {/* Vertical line */}
        <div className="absolute left-[10vw] top-0 h-full w-px lg:left-[12vw]">
          <span className="block h-full w-full bg-[var(--color-hairline)]" />
          <motion.span
            style={{ scaleY: fill }}
            className="absolute inset-0 origin-top w-full bg-[var(--color-accent)]"
          />
        </div>

        {/* Date label — sits to the LEFT of the rail */}
        <div className="absolute left-[10vw] top-1/2 -translate-x-[calc(100%+22px)] -translate-y-1/2 lg:left-[12vw]">
          <AnimatePresence mode="wait">
            <motion.div
              key={ENTRIES[activeIdx].id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-end gap-1.5 text-right"
            >
              <span className="font-mono text-[10.5px] tracking-[0.14em] text-[var(--color-muted)]">
                ENTRY {ENTRIES[activeIdx].id}
              </span>
              <span className="font-medium text-[17px] tracking-[-0.012em] text-[var(--color-ink)]">
                {ENTRIES[activeIdx].date}
              </span>
              <span className="font-serif italic text-[12.5px] text-[var(--color-ink-dim)]">
                {ENTRIES[activeIdx].when}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Tick dots */}
        <div className="absolute left-[10vw] top-0 h-full lg:left-[12vw]">
          {ENTRIES.map((_, i) => {
            const top = ((i + 0.5) / ENTRIES.length) * 100;
            return (
              <div
                key={i}
                className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors"
                style={{
                  top: `${top}%`,
                  background: i <= activeIdx ? "var(--color-accent)" : "var(--color-hairline-bright)",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ============= Entry — pinned scrolly journal page ============== */

function Entry({
  entry,
  index,
  total,
  journalProgress,
}: {
  entry: (typeof ENTRIES)[number];
  index: number;
  total: number;
  journalProgress: MotionValue<number>;
}) {
  // Each entry gets a 1/total slice of the journal's scroll. Map that
  // slice back to a local 0..1 progress for the per-entry reveal timing.
  const slice = 1 / total;
  const start = index * slice;
  const local = useTransform(journalProgress, [start, start + slice], [0, 1]);

  const dateOp = useTransform(local, [0.04, 0.16, 0.78, 0.92], [0, 1, 1, 0]);
  const visualOp = useTransform(local, [0.08, 0.22, 0.78, 0.92], [0, 1, 1, 0]);
  const visualY = useTransform(local, [0.08, 0.22], [16, 0]);
  const preOp = useTransform(local, [0.10, 0.24, 0.78, 0.92], [0, 1, 1, 0]);
  const bigOp = useTransform(local, [0.18, 0.34, 0.78, 0.92], [0, 1, 1, 0]);
  const bigY = useTransform(local, [0.18, 0.34], [28, 0]);
  const bodyOp = useTransform(local, [0.32, 0.48, 0.78, 0.92], [0, 1, 1, 0]);
  const pullOp = useTransform(local, [0.46, 0.62, 0.78, 0.92], [0, 1, 1, 0]);
  const pullX = useTransform(local, [0.46, 0.62], [-12, 0]);

  return (
    <section className="relative" style={{ height: "200vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-[var(--container-page)] px-6 md:pl-[20vw] md:pr-8 lg:pl-[22vw]">
          <div className="grid grid-cols-1 gap-6 md:max-w-[760px]">
            {/* Mobile-only date stamp (timeline is hidden on mobile) */}
            <motion.div
              style={{ opacity: dateOp }}
              className="flex items-center gap-2 text-[11.5px] tracking-[0.18em] text-[var(--color-muted)] md:hidden"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              ENTRY {entry.id} · {entry.date}
            </motion.div>

            {/* Location strip — desktop too */}
            <motion.div
              style={{ opacity: dateOp }}
              className="flex items-center gap-3 text-[11px] tracking-[0.16em] text-[var(--color-muted)]"
            >
              <span className="font-mono">{String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
              <span className="h-px w-8 bg-[var(--color-hairline)]" />
              <span className="font-mono">{entry.location}</span>
            </motion.div>

            {entry.visual ? (
              <motion.div style={{ opacity: visualOp, y: visualY }} className="flex">
                <Visual kind={entry.visual} />
              </motion.div>
            ) : null}

            <motion.span
              style={{ opacity: preOp }}
              className="text-[20px] leading-[1.4] text-[var(--color-ink-dim)] md:text-[24px]"
            >
              {entry.pre}
            </motion.span>

            <motion.h2
              style={{ opacity: bigOp, y: bigY }}
              className="font-serif italic font-normal tracking-display-tight text-[clamp(44px,7.2vw,108px)] leading-[1.0] text-[var(--color-ink)]"
            >
              {entry.big}
            </motion.h2>

            <motion.p
              style={{ opacity: bodyOp }}
              className="max-w-[58ch] text-[clamp(15.5px,1.6vw,18.5px)] leading-[1.65] text-[var(--color-ink-dim)]"
            >
              {entry.body}
            </motion.p>

            <motion.p
              style={{ opacity: pullOp, x: pullX }}
              className="mt-3 max-w-[52ch] border-l-2 border-[var(--color-accent)] pl-4 text-[15px] leading-[1.6] text-[var(--color-ink)]"
            >
              {entry.pull}
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============= Visuals (kept from previous iteration) ============== */

function Visual({ kind }: { kind: string }) {
  if (kind === "clock") return <ClockVisual />;
  if (kind === "chat") return <ChatVisual />;
  if (kind === "format") return <FormatVisual />;
  if (kind === "cursor") return <CursorVisual />;
  if (kind === "carousel") return <ArtifactCarousel />;
  if (kind === "team") return <TeamVisual />;
  if (kind === "wave") return <WaveVisual />;
  return null;
}

function ClockVisual() {
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s + 1) % 60), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-hairline bg-[var(--color-surface-alt)]/60 px-5 py-3 backdrop-blur-sm">
      <div className="font-mono text-[10.5px] tracking-[0.16em] text-[var(--color-muted)]">
        PHONE · LOCK SCREEN
      </div>
      <div className="flex items-baseline gap-1 font-medium tracking-[-0.02em] text-[28px] text-[var(--color-ink)]">
        <span>1:47</span>
        <span className="text-[15px] text-[var(--color-ink-dim)]">AM</span>
        <span className="ml-2 font-mono text-[11px] text-[var(--color-muted)]">
          :{String(secs).padStart(2, "0")}
        </span>
      </div>
      <div className="text-[11px] text-[var(--color-muted)]">
        Tuesday · Chemistry test in 7 hours
      </div>
    </div>
  );
}

function ChatVisual() {
  const text =
    "Cellular respiration is the process by which cells release energy from glucose. The first stage, glycolysis…";
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const id = setTimeout(() => setN((x) => x + 1), 24);
    return () => clearTimeout(id);
  }, [n, text.length]);
  return (
    <div className="w-full max-w-[420px] rounded-2xl rounded-tl-md border border-hairline bg-[var(--color-surface-alt)]/60 p-3.5 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-[11px] text-[var(--color-muted)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        ChatGPT · 1:48 AM
      </div>
      <p className="mt-2 font-mono text-[12px] leading-[1.55] text-[var(--color-ink-dim)]">
        {text.slice(0, n)}
        <span className="ml-px inline-block h-[1em] w-[1px] translate-y-[2px] bg-[var(--color-accent)] align-middle" />
      </p>
    </div>
  );
}

function FormatVisual() {
  return (
    <div className="grid w-full max-w-[420px] grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="flex flex-col gap-1.5">
        {[1, 0.85, 0.8, 0.75, 1, 0.85].map((w, i) => (
          <div
            key={i}
            className="h-1.5 rounded bg-[var(--color-hairline)]"
            style={{ width: `${w * 100}%` }}
          />
        ))}
      </div>
      <span className="font-mono text-[12px] text-[var(--color-muted)]">→</span>
      <div className="grid grid-cols-2 gap-1.5">
        <span className="h-7 rounded-md border border-hairline bg-[var(--color-surface-alt)]/60" />
        <span className="h-7 rounded-md border border-hairline bg-[var(--color-surface-alt)]/60" />
        <span className="h-7 rounded-md border border-[var(--color-accent)] bg-[oklch(85%_0.09_145/0.06)]" />
        <span className="h-7 rounded-md border border-hairline bg-[var(--color-surface-alt)]/60" />
      </div>
    </div>
  );
}

function CursorVisual() {
  return (
    <div className="w-full max-w-[440px] overflow-hidden rounded-xl border border-hairline bg-[var(--color-surface-alt)]/60 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-hairline px-3 py-1.5">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(70%_0.16_25)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(80%_0.13_85)]" />
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(72%_0.16_140)]" />
        </div>
        <span className="font-mono text-[10px] text-[var(--color-muted)]">cursor · main.py</span>
      </div>
      <div className="grid grid-cols-2">
        <div className="border-r border-hairline p-2.5 text-[10.5px] leading-[1.4] text-[var(--color-ink-dim)]">
          <div className="text-[var(--color-muted)]">you</div>
          <div className="mt-0.5">refactor this to use list comprehension</div>
          <div className="mt-2 text-[var(--color-muted)]">cursor</div>
          <div className="mt-0.5">done. see right →</div>
        </div>
        <div className="p-2.5 font-mono text-[10px] leading-[1.5]">
          <div className="text-[var(--color-muted)]">def main():</div>
          <div className="pl-3 text-[var(--color-ink-dim)]">
            <span className="text-[var(--color-accent)]">items</span> = [x*2 for x in{" "}
            <span className="text-[var(--color-accent)]">data</span>]
          </div>
          <div className="pl-3 text-[var(--color-ink-dim)]">return items</div>
        </div>
      </div>
    </div>
  );
}

function ArtifactCarousel() {
  const items = ["notes", "quiz", "deck", "animation", "worksheet", "flashcards", "code"];
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 1500);
    return () => clearInterval(id);
  }, [items.length]);
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[13px] text-[var(--color-muted)]">help me revise →</span>
      <div className="relative h-9 w-[170px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={items[idx]}
            initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -14, filter: "blur(6px)" }}
            transition={{ duration: 0.4, ease: EASE }}
            className="absolute inset-0 flex items-center justify-center rounded-full border border-[var(--color-accent)] bg-[oklch(85%_0.09_145/0.06)] px-4 text-[14px] font-medium text-[var(--color-ink)]"
          >
            {items[idx]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function TeamVisual() {
  const team = [
    { mono: "T", role: "design + product" },
    { mono: "A", role: "engineering" },
    { mono: "S", role: "research + writing" },
  ];
  return (
    <div className="flex items-center gap-5">
      {team.map((m) => (
        <div key={m.mono} className="flex flex-col items-center gap-1.5">
          <div className="grid h-12 w-12 place-items-center rounded-full border border-hairline-bright bg-[var(--color-surface-alt)] text-[16px] font-medium text-[var(--color-ink)]">
            {m.mono}
          </div>
          <span className="font-mono text-[10px] text-[var(--color-muted)]">{m.role}</span>
        </div>
      ))}
    </div>
  );
}

function WaveVisual() {
  return (
    <div className="relative grid h-20 w-20 place-items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          aria-hidden
          animate={{ scale: [0.6, 2.2], opacity: [0.55, 0] }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            ease: "easeOut",
            delay: i * 0.6,
          }}
          className="absolute h-12 w-12 rounded-full border border-[var(--color-accent)]"
        />
      ))}
      <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
    </div>
  );
}

/* ============= Closing scene ============== */

function ClosingScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const haloOp = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.5, 0.2]);
  const haloScale = useTransform(scrollYProgress, [0, 0.6], [0.7, 1.4]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-t border-hairline py-32 md:py-40"
    >
      <motion.div
        aria-hidden
        style={{ opacity: haloOp, scale: haloScale }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-25 blur-[120px]"
      />
      <div className="relative mx-auto flex w-full max-w-[840px] flex-col items-center gap-8 px-6 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-2 text-[12px] tracking-[0.2em] text-[var(--color-muted)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          END OF LOG
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="font-medium tracking-display-tight text-[clamp(36px,5.5vw,72px)] leading-[1.04] text-[var(--color-ink)]"
        >
          That's the whole story.
          <br />
          <span className="font-serif italic font-normal text-[var(--color-ink-dim)]">
            Want to be in the next entry?
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 }}
        >
          <Link
            to="/access"
            className="group inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-[15px] font-medium text-[var(--color-bg)] transition-transform hover:scale-[1.02]"
          >
            Get on the list
            <svg
              width="12"
              height="12"
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
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <div className="flex items-center gap-3">
            {["T", "A", "S"].map((m) => (
              <div
                key={m}
                className="grid h-9 w-9 place-items-center rounded-full border border-hairline-bright bg-[var(--color-surface-alt)] text-[13px] font-medium text-[var(--color-ink)]"
              >
                {m}
              </div>
            ))}
          </div>
          <p className="font-serif italic text-[14px] text-[var(--color-muted)]">
            — Signed, the Topperly team · Apr 25, 2026
          </p>
        </motion.div>
      </div>
    </section>
  );
}
