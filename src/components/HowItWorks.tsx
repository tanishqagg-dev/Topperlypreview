import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";

/**
 * Apple-style scroll-pinned 3-step: type your problem → Topperly compiles
 * the pack → drill, print, present. The visual on the left is pinned and
 * morphs through three states. Right column lists the steps, each step
 * "lights up" as the corresponding visual is on screen.
 */

const STEPS = [
  {
    eyebrow: "Step 01",
    title: "Type the way you'd type to a friend.",
    body: "No prompt engineering. No /commands to memorise. Topperly understands NCERT chapter names, JEE topics, and what 'help me revise' means at 1am.",
    span: [0.05, 0.34] as const,
  },
  {
    eyebrow: "Step 02",
    title: "We compile the answer into a pack.",
    body: "While most AIs reply with words, Topperly opens a workspace beside the chat and starts building artifacts in parallel. Notes, quizzes, decks, animations — whichever the question needs.",
    span: [0.34, 0.66] as const,
  },
  {
    eyebrow: "Step 03",
    title: "Drill it. Print it. Present it. Tonight.",
    body: "Every artifact is interactive. Flip the flashcards. Score the quiz. Edit the slide. Print the worksheet. Walk into class tomorrow ready, not just informed.",
    span: [0.66, 1.0] as const,
  },
];

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [stepIdx, setStepIdx] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (t) => {
    if (t < STEPS[1].span[0]) setStepIdx(0);
    else if (t < STEPS[2].span[0]) setStepIdx(1);
    else setStepIdx(2);
  });

  return (
    <section ref={ref} className="relative" style={{ height: "320vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div aria-hidden className="page-haze pointer-events-none absolute inset-0 -z-10" />

        <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1.1fr_1fr] md:gap-16 md:px-8">
          {/* LEFT — pinned visual */}
          <div className="order-2 md:order-1">
            <Visual progress={scrollYProgress} />
          </div>

          {/* RIGHT — steps */}
          <div className="order-1 flex flex-col gap-6 md:order-2 md:gap-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.7 }}
              className="flex items-center gap-2 text-[12px] tracking-[0.18em] text-[var(--color-muted)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              HOW IT WORKS
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.8 }}
              className="font-medium tracking-display-tight text-[clamp(30px,4.4vw,56px)] leading-[1.05] text-[var(--color-ink)]"
            >
              Three steps.{" "}
              <span className="font-serif italic font-normal text-[var(--color-ink-dim)]">
                Same conversation.
              </span>
            </motion.h2>

            <div className="flex flex-col gap-1">
              {STEPS.map((s, i) => (
                <Step key={s.eyebrow} step={s} active={i === stepIdx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  step,
  active,
}: {
  step: (typeof STEPS)[number];
  active: boolean;
}) {
  return (
    <motion.div
      animate={{
        opacity: active ? 1 : 0.42,
      }}
      transition={{ duration: 0.4 }}
      className="border-t border-hairline py-5"
    >
      <div className="flex items-center gap-3 text-[11.5px] tracking-[0.16em] text-[var(--color-muted)]">
        <span
          className="h-px w-6 transition-colors"
          style={{
            background: active ? "var(--color-accent)" : "var(--color-hairline)",
          }}
        />
        {step.eyebrow}
      </div>
      <h3 className="mt-2 text-[18px] font-medium tracking-[-0.012em] text-[var(--color-ink)] md:text-[20px]">
        {step.title}
      </h3>
      <motion.p
        animate={{ height: active ? "auto" : 0, opacity: active ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden text-[14.5px] leading-[1.65] text-[var(--color-ink-dim)]"
      >
        <span className="block pt-2">{step.body}</span>
      </motion.p>
    </motion.div>
  );
}

/* ============= LEFT pinned visual ============== */

function Visual({ progress }: { progress: MotionValue<number> }) {
  // Three layered cards, only the active one is fully visible.
  // Each card has its own opacity window driven by scroll progress.
  const op0 = useTransform(progress, [0, 0.04, 0.30, 0.36], [0, 1, 1, 0]);
  const op1 = useTransform(progress, [0.30, 0.36, 0.62, 0.68], [0, 1, 1, 0]);
  const op2 = useTransform(progress, [0.62, 0.68, 0.96, 1.0], [0, 1, 1, 0]);

  return (
    <div className="relative aspect-[5/4] w-full max-w-[640px]">
      <div className="window-frame absolute inset-0">
        <div className="relative h-full overflow-hidden rounded-[10px] border border-hairline bg-[var(--color-bg)]/40">
          <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(70%_0.16_25)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(80%_0.13_85)]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[oklch(72%_0.16_140)]" />
            </div>
            <span className="text-[12px] text-[var(--color-muted)]">Topperly · Class 11 Physics</span>
            <div className="h-2.5 w-12" />
          </div>

          <div className="relative h-[calc(100%-44px)]">
            <motion.div style={{ opacity: op0 }} className="absolute inset-0">
              <Stage1 progress={progress} />
            </motion.div>
            <motion.div style={{ opacity: op1 }} className="absolute inset-0">
              <Stage2 progress={progress} />
            </motion.div>
            <motion.div style={{ opacity: op2 }} className="absolute inset-0">
              <Stage3 progress={progress} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stage1({ progress }: { progress: MotionValue<number> }) {
  // Caret blinks while scroll is in step 1 range.
  const typedLen = useTransform(progress, [0.05, 0.28], [0, 1]);
  const text = "explain projectile motion using a real example. i have a test on monday.";
  const visibleText = useTransform(typedLen, (t) =>
    text.slice(0, Math.floor(t * text.length))
  );

  return (
    <div className="flex h-full flex-col p-6">
      <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">Chat</div>
      <div className="mt-6 flex flex-1 items-end justify-end">
        <div className="max-w-[88%] rounded-2xl rounded-tr-md bg-[var(--color-surface-high)] px-4 py-3 text-[15px] leading-[1.5] text-[var(--color-ink)]">
          <motion.span>{visibleText}</motion.span>
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
            className="ml-[2px] inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-[var(--color-accent)]"
          />
        </div>
      </div>
      <div className="mt-4 rounded-xl border border-hairline bg-[var(--color-surface)]/40 px-3 py-2.5 text-[13px] text-[var(--color-muted)]">
        Reply…
      </div>
    </div>
  );
}

function Stage2({ progress }: { progress: MotionValue<number> }) {
  // Five artifact pills materialise one by one.
  const items = [
    { name: "Concept notes", file: "notes.pdf" },
    { name: "Animation",     file: "projectile.mp4" },
    { name: "Quiz",          file: "8 Qs · scored" },
    { name: "Worksheet",     file: "5 problems" },
    { name: "Slide deck",    file: "6 slides" },
  ];
  return (
    <div className="flex h-full flex-col p-6">
      <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
        Compiling pack
      </div>
      <div className="mt-4 grid flex-1 grid-cols-1 gap-2">
        {items.map((it, i) => (
          <Stage2Item key={it.name} progress={progress} index={i} {...it} />
        ))}
      </div>
    </div>
  );
}

function Stage2Item({
  progress,
  index,
  name,
  file,
}: {
  progress: MotionValue<number>;
  index: number;
  name: string;
  file: string;
}) {
  const start = 0.36 + index * 0.045;
  const end = start + 0.04;
  const op = useTransform(progress, [start, end], [0, 1]);
  const x = useTransform(progress, [start, end], [-12, 0]);
  return (
    <motion.div
      style={{ opacity: op, x }}
      className="flex items-center justify-between rounded-xl border border-hairline bg-[var(--color-surface)]/50 px-3.5 py-2.5"
    >
      <div className="flex items-center gap-2.5">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        <span className="text-[13.5px] font-medium text-[var(--color-ink)]">{name}</span>
      </div>
      <div className="flex items-center gap-3 text-[11px] text-[var(--color-muted)]">
        <span>{file}</span>
        <span className="rounded-full border border-[var(--color-accent)] px-1.5 py-[1px] text-[9px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
          ready
        </span>
      </div>
    </motion.div>
  );
}

function Stage3({ progress }: { progress: MotionValue<number> }) {
  const cardOp = useTransform(progress, [0.68, 0.74], [0, 1]);
  return (
    <div className="flex h-full flex-col p-6">
      <div className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
        Tonight's session
      </div>
      <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
        <motion.div
          style={{ opacity: cardOp }}
          className="flex flex-col gap-2 rounded-xl border border-hairline-bright bg-[var(--color-surface)] p-3.5"
        >
          <div className="flex items-center justify-between text-[10.5px] text-[var(--color-muted)]">
            <span>Quiz · live</span>
            <span>Q 4 / 8</span>
          </div>
          <div className="text-[13.5px] font-medium text-[var(--color-ink)]">
            What is the angle of projection for max range?
          </div>
          <div className="mt-1 grid grid-cols-2 gap-1.5">
            <span className="rounded-md border border-hairline px-2 py-1 text-[11px] text-[var(--color-ink-dim)]">30°</span>
            <span className="rounded-md border border-[var(--color-accent)] bg-[oklch(85%_0.09_145/0.08)] px-2 py-1 text-[11px] text-[var(--color-ink)]">45°</span>
            <span className="rounded-md border border-hairline px-2 py-1 text-[11px] text-[var(--color-ink-dim)]">60°</span>
            <span className="rounded-md border border-hairline px-2 py-1 text-[11px] text-[var(--color-ink-dim)]">90°</span>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: cardOp }}
          transition={{ delay: 0.05 }}
          className="flex flex-col gap-2 rounded-xl border border-hairline bg-[var(--color-surface-alt)] p-3.5"
        >
          <div className="flex items-center justify-between text-[10.5px] text-[var(--color-muted)]">
            <span>Flashcards · drilling</span>
            <span>3 / 12</span>
          </div>
          <div className="grid h-[88px] place-items-center rounded-md border border-hairline">
            <div className="text-center">
              <div className="text-[10px] text-[var(--color-muted)]">Front</div>
              <div className="mt-1 text-[13px] text-[var(--color-ink)]">Range formula</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-[10px] text-[var(--color-muted)]">
            <span>tap to flip</span>
            <span>← / →</span>
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: cardOp }}
          className="col-span-2 flex items-center justify-between rounded-xl border border-hairline bg-[var(--color-surface-alt)] p-3.5"
        >
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md border border-hairline text-[var(--color-ink-dim)]">
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
                <rect x="2.5" y="1.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1" />
                <path d="M5 4.5h4M5 7h4M5 9.5h2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </span>
            <div>
              <div className="text-[12.5px] font-medium text-[var(--color-ink)]">worksheet.pdf</div>
              <div className="text-[10.5px] text-[var(--color-muted)]">printed · in your bag</div>
            </div>
          </div>
          <span className="rounded-full border border-[var(--color-accent)] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
            done
          </span>
        </motion.div>
      </div>
    </div>
  );
}
