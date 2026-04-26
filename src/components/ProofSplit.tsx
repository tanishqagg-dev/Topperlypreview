import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";

/**
 * Scroll-locked head-to-head: same homework question, two AIs.
 * Both give a structured, accurate reply. Only Topperly compiles the
 * reply into artifacts you can study with. Sticky stage, ~240vh tall.
 *
 * No emojis anywhere — line glyphs only.
 */

const ACTS = [
  {
    range: [0.0, 0.18] as const,
    eyebrow: "ACT 01",
    title: "The same question",
    italic: false,
    sub: "A real CBSE Class 10 problem. Due tomorrow morning.",
  },
  {
    range: [0.18, 0.44] as const,
    eyebrow: "ACT 02",
    title: "The same answer",
    italic: false,
    sub: "Both AIs reply. Both give the right method, neatly written.",
  },
  {
    range: [0.44, 0.8] as const,
    eyebrow: "ACT 03",
    title: "Topperly keeps going",
    italic: true,
    sub: "While the other AI stops at words, Topperly compiles a homework pack from the same answer.",
  },
  {
    range: [0.8, 1.0] as const,
    eyebrow: "ACT 04",
    title: "Only one lets you study",
    italic: true,
    sub: "Read versus drill. That's the whole product.",
  },
];

const VERDICT_AT = 0.82;

const ARTIFACTS: { name: string; meta: string; icon: "worksheet" | "key" | "quiz" | "cards" }[] = [
  { name: "Worksheet", meta: "5 similar Qs · printable", icon: "worksheet" },
  { name: "Answer key", meta: "worked solutions", icon: "key" },
  { name: "Quiz", meta: "8 Qs · scored", icon: "quiz" },
  { name: "Flashcards", meta: "12 cards · IBP", icon: "cards" },
];

export function ProofSplit() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [actIdx, setActIdx] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (t) => {
    let idx = 0;
    for (let i = 0; i < ACTS.length; i++) {
      if (t >= ACTS[i].range[0]) idx = i;
    }
    setActIdx(idx);
  });

  const promptOp = useTransform(scrollYProgress, [0.05, 0.18], [0, 1]);
  const promptY = useTransform(scrollYProgress, [0.05, 0.18], [10, 0]);

  const dimOp = useTransform(scrollYProgress, [VERDICT_AT - 0.04, VERDICT_AT + 0.02], [0, 0.55]);
  const ringOp = useTransform(scrollYProgress, [0.44, 0.48], [0, 1]);

  return (
    <section ref={ref} className="relative" style={{ height: "240vh" }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden pt-14">
        <div aria-hidden className="page-haze pointer-events-none absolute inset-0 -z-10" />

        {/* TOP — counter + cross-faded act headlines */}
        <div className="relative w-full px-6 md:px-8">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center gap-2 text-center md:gap-3">
            <div className="flex items-center gap-3 text-[11px] tracking-[0.18em] text-[var(--color-muted)] md:text-[11.5px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              <span>{ACTS[actIdx].eyebrow}</span>
              <span className="h-px w-8 bg-[var(--color-hairline)]" />
              <span>{String(actIdx + 1).padStart(2, "0")} / 04</span>
            </div>

            <div className="relative h-[40px] w-full sm:h-[52px] md:h-[68px]">
              {ACTS.map((act) => (
                <ActLine key={act.eyebrow} act={act} progress={scrollYProgress} />
              ))}
            </div>

            <div className="relative hidden h-[22px] w-full md:block">
              {ACTS.map((act) => (
                <ActSub key={"s" + act.eyebrow} act={act} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>

        {/* STAGE — two AI panels */}
        <div className="relative mt-5 w-full px-4 md:mt-7 md:px-8">
          <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-3 md:grid-cols-2 md:gap-5">
            {/* LEFT — every other AI */}
            <div className="relative">
              <PanelHeader label="Every other AI" accent={false} />
              <PanelBody
                isTopperly={false}
                progress={scrollYProgress}
                promptOp={promptOp}
                promptY={promptY}
              />
              <motion.div
                style={{ opacity: dimOp }}
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-2xl bg-[var(--color-bg)]"
              />
              <VerdictCaption progress={scrollYProgress} text="Read it. Re-read it. Hope it sticks." muted />
            </div>

            {/* RIGHT — Topperly */}
            <div className="relative">
              <motion.div
                style={{ opacity: ringOp }}
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-2xl border border-[var(--color-accent)]"
              />
              <PanelHeader label="Topperly" accent />
              <PanelBody
                isTopperly={true}
                progress={scrollYProgress}
                promptOp={promptOp}
                promptY={promptY}
              />
              <VerdictCaption progress={scrollYProgress} text="Drill the quiz. Print the worksheet. Walk in ready." />
            </div>
          </div>
        </div>

        {/* BOTTOM — phase dots */}
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
          {ACTS.map((_, i) => (
            <span
              key={i}
              className="h-[3px] rounded-full transition-all duration-500"
              style={{
                width: i === actIdx ? 22 : 8,
                background: i === actIdx ? "var(--color-accent)" : "var(--color-hairline-bright)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function ActLine({
  act,
  progress,
}: {
  act: (typeof ACTS)[number];
  progress: MotionValue<number>;
}) {
  const [a, b] = act.range;
  const mid = (a + b) / 2;
  const op = useTransform(progress, [a, mid - 0.01, b - 0.02, b], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, mid - 0.01], [10, 0]);
  return (
    <motion.h2
      style={{ opacity: op, y }}
      className="absolute inset-x-0 top-0 font-medium tracking-display-tight text-[clamp(22px,4vw,48px)] leading-[1.05] text-[var(--color-ink)]"
    >
      {act.italic ? (
        <span className="font-serif italic font-normal text-[var(--color-ink-dim)]">{act.title}</span>
      ) : (
        act.title
      )}
    </motion.h2>
  );
}

function ActSub({
  act,
  progress,
}: {
  act: (typeof ACTS)[number];
  progress: MotionValue<number>;
}) {
  const [a, b] = act.range;
  const mid = (a + b) / 2;
  const op = useTransform(progress, [a + 0.02, mid, b - 0.02, b], [0, 1, 1, 0]);
  return (
    <motion.p
      style={{ opacity: op }}
      className="absolute inset-x-0 top-0 text-[13px] text-[var(--color-ink-dim)]"
    >
      {act.sub}
    </motion.p>
  );
}

function PanelHeader({ label, accent }: { label: string; accent: boolean }) {
  return (
    <div
      className={`flex items-center justify-between rounded-t-2xl border border-b-0 px-4 py-2.5 ${
        accent
          ? "border-hairline-bright bg-[var(--color-surface)]"
          : "border-hairline bg-[var(--color-surface-alt)]"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-[oklch(70%_0.16_25)]" />
          <span className="h-2 w-2 rounded-full bg-[oklch(80%_0.13_85)]" />
          <span className="h-2 w-2 rounded-full bg-[oklch(72%_0.16_140)]" />
        </span>
        <span
          className={`ml-2 text-[12px] ${
            accent ? "text-[var(--color-ink)]" : "text-[var(--color-ink-dim)]"
          }`}
        >
          {label}
        </span>
        {accent ? (
          <span className="ml-1 rounded-full border border-[var(--color-accent)] px-1.5 py-[1px] text-[9.5px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
            workspace
          </span>
        ) : null}
      </div>
      <span className="text-[11px] text-[var(--color-muted)]">chat</span>
    </div>
  );
}

function PanelBody({
  isTopperly,
  progress,
  promptOp,
  promptY,
}: {
  isTopperly: boolean;
  progress: MotionValue<number>;
  promptOp: MotionValue<number>;
  promptY: MotionValue<number>;
}) {
  const replyHeadOp = useTransform(progress, [0.2, 0.26], [0, 1]);
  const r1 = useTransform(progress, [0.24, 0.28], [0, 1]);
  const r2 = useTransform(progress, [0.28, 0.32], [0, 1]);
  const r3 = useTransform(progress, [0.32, 0.36], [0, 1]);
  const r4 = useTransform(progress, [0.36, 0.4], [0, 1]);
  const artHeadOp = useTransform(progress, [0.43, 0.47], [0, 1]);

  return (
    <div
      className={`relative h-[440px] overflow-hidden rounded-b-2xl border border-t-0 p-4 md:h-[500px] md:p-5 ${
        isTopperly
          ? "border-hairline-bright bg-[var(--color-surface)]"
          : "surface-soft border-hairline"
      }`}
    >
      <motion.div
        style={{ opacity: promptOp, y: promptY }}
        className="ml-auto mb-3 max-w-[88%] rounded-2xl rounded-tr-md bg-[var(--color-surface-high)] px-3.5 py-2.5 text-[13px] leading-[1.5] text-[var(--color-ink)]"
      >
        help me with q3 of my class 10 integration by parts assignment, due tomorrow
      </motion.div>

      <motion.div
        style={{ opacity: replyHeadOp }}
        className="rounded-2xl rounded-tl-md bg-[var(--color-surface-alt)]/40 p-3.5"
      >
        <div className="flex items-center gap-2 text-[11.5px] text-[var(--color-ink-dim)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          {isTopperly ? "Topperly" : "AI assistant"}
        </div>
        <div className="mt-2 text-[12.5px] font-medium text-[var(--color-ink)]">
          Question 3 — Integration by parts
        </div>
        <div className="mt-1 font-mono text-[11.5px] text-[var(--color-ink-dim)]">
          Evaluate ∫ x · sin(x) dx
        </div>

        <ol className="mt-3 space-y-2 text-[12.5px] leading-[1.5]">
          <ReplyStep op={r1} n="1" head="Pick u and dv" body="Let u = x, dv = sin(x) dx." />
          <ReplyStep op={r2} n="2" head="Differentiate / integrate" body="du = dx, v = −cos(x)." />
          <ReplyStep op={r3} n="3" head="Apply the formula" body="∫ u dv = uv − ∫ v du = −x·cos(x) + ∫ cos(x) dx" />
          <ReplyStep op={r4} n="4" head="Simplify" body="Result: −x·cos(x) + sin(x) + C" />
        </ol>
      </motion.div>

      {isTopperly ? (
        <ArtifactSection progress={progress} artHeadOp={artHeadOp} />
      ) : (
        <div className="mt-3 text-[11.5px] text-[var(--color-muted)]">end of reply</div>
      )}
    </div>
  );
}

function ArtifactSection({
  progress,
  artHeadOp,
}: {
  progress: MotionValue<number>;
  artHeadOp: MotionValue<number>;
}) {
  return (
    <>
      <motion.div
        style={{ opacity: artHeadOp }}
        className="mt-3 flex items-center justify-between text-[11px] text-[var(--color-ink-dim)]"
      >
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" />
          Built a homework pack from the same answer
        </span>
        <ArtifactCounter progress={progress} />
      </motion.div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {ARTIFACTS.map((a, i) => (
          <ArtifactTile
            key={a.name}
            index={i}
            progress={progress}
            name={a.name}
            meta={a.meta}
            icon={a.icon}
          />
        ))}
      </div>
    </>
  );
}

function ReplyStep({
  op,
  n,
  head,
  body,
}: {
  op: MotionValue<number>;
  n: string;
  head: string;
  body: string;
}) {
  return (
    <motion.li style={{ opacity: op }} className="grid grid-cols-[18px_1fr] gap-2">
      <span className="mt-[2px] text-[11px] text-[var(--color-muted)]">{n}.</span>
      <div>
        <div className="text-[var(--color-ink)]">{head}</div>
        <div className="mt-0.5 font-mono text-[var(--color-ink-dim)]">{body}</div>
      </div>
    </motion.li>
  );
}

function ArtifactTile({
  index,
  progress,
  name,
  meta,
  icon,
}: {
  index: number;
  progress: MotionValue<number>;
  name: string;
  meta: string;
  icon: "worksheet" | "key" | "quiz" | "cards";
}) {
  const start = 0.48 + index * 0.06;
  const end = start + 0.05;
  const op = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [10, 0]);

  return (
    <motion.div
      style={{ opacity: op, y }}
      className="flex items-center gap-2.5 rounded-lg border border-hairline bg-[var(--color-surface-alt)]/60 p-2.5"
    >
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-hairline bg-[var(--color-bg)] text-[var(--color-ink-dim)]">
        <Glyph kind={icon} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-medium text-[var(--color-ink)]">{name}</div>
        <div className="truncate text-[10.5px] text-[var(--color-muted)]">{meta}</div>
      </div>
      <span className="rounded-full border border-[var(--color-accent)] px-1.5 py-[1px] text-[9px] uppercase tracking-[0.14em] text-[var(--color-accent)]">
        ready
      </span>
    </motion.div>
  );
}

function ArtifactCounter({ progress }: { progress: MotionValue<number> }) {
  const [n, setN] = useState(0);
  useMotionValueEvent(progress, "change", (t) => {
    let count = 0;
    for (let i = 0; i < ARTIFACTS.length; i++) {
      const start = 0.48 + i * 0.06;
      const end = start + 0.05;
      if (t >= end) count = i + 1;
    }
    setN(count);
  });
  return (
    <span className="text-[10.5px] text-[var(--color-muted)]">
      {n} / {ARTIFACTS.length} ready
    </span>
  );
}

function VerdictCaption({
  progress,
  text,
  muted,
}: {
  progress: MotionValue<number>;
  text: string;
  muted?: boolean;
}) {
  const op = useTransform(progress, [VERDICT_AT, VERDICT_AT + 0.04], [0, 1]);
  const y = useTransform(progress, [VERDICT_AT, VERDICT_AT + 0.04], [8, 0]);
  return (
    <motion.div
      style={{ opacity: op, y }}
      className={`pointer-events-none absolute inset-x-0 -bottom-7 z-10 text-center text-[12.5px] ${
        muted ? "text-[var(--color-muted)]" : "text-[var(--color-ink)]"
      }`}
    >
      {text}
    </motion.div>
  );
}

function Glyph({ kind }: { kind: "worksheet" | "key" | "quiz" | "cards" }) {
  if (kind === "worksheet") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2.5" y="1.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1" />
        <path d="M5 4.5h4M5 7h4M5 9.5h2.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "key") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <rect x="2.5" y="1.5" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1" />
        <path
          d="M4.5 7l1.6 1.5L9.5 5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (kind === "quiz") {
    return (
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1" />
        <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1" />
        <circle cx="7" cy="7" r="0.6" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="3.5" y="3.5" width="7" height="8" rx="1" stroke="currentColor" strokeWidth="1" />
      <path d="M5 1.8h6.5a1 1 0 0 1 1 1V10" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}
