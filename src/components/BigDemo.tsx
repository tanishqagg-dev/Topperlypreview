import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";

/**
 * Cinematic centrepiece. Film.ai-style: full-bleed sticky stage, single
 * product window in the centre, big morphing headline above. Scroll drives
 * everything — the prompt arrives, the plan writes itself, then four
 * artifacts cut through one after the other.
 */

type Tab = "notes" | "animation" | "flashcards" | "slides";

const TABS: { id: Tab; label: string }[] = [
  { id: "notes", label: "Notes" },
  { id: "animation", label: "Animation" },
  { id: "flashcards", label: "Flashcards" },
  { id: "slides", label: "Slide deck" },
];

const EASE = [0.22, 1, 0.36, 1] as const;

// Each act gets its own morphing headline. Windows must be disjoint,
// with small overlap for cross-fade.
const ACTS = [
  {
    id: "ask",
    range: [0.04, 0.20] as const,
    eyebrow: "Act 01",
    head: <>It starts with <span className="font-serif italic text-[var(--color-ink-dim)]">a sentence.</span></>,
    sub: "Ask Topperly the way you'd ask a friend at 1am.",
  },
  {
    id: "plan",
    range: [0.18, 0.30] as const,
    eyebrow: "Act 02",
    head: <>Topperly plans <span className="font-serif italic text-[var(--color-ink-dim)]">the pack.</span></>,
    sub: "Four artifacts, one prompt. No follow-ups needed.",
  },
  {
    id: "notes",
    range: [0.28, 0.46] as const,
    eyebrow: "Act 03",
    head: <>Notes that <span className="font-serif italic text-[var(--color-ink-dim)]">respect your time.</span></>,
    sub: "Structured. Key terms surfaced. Read in five minutes.",
  },
  {
    id: "animation",
    range: [0.44, 0.62] as const,
    eyebrow: "Act 04",
    head: <>An animation for <span className="font-serif italic text-[var(--color-ink-dim)]">the part you don't get.</span></>,
    sub: "The process moves while you watch.",
  },
  {
    id: "flashcards",
    range: [0.60, 0.78] as const,
    eyebrow: "Act 05",
    head: <>Flashcards <span className="font-serif italic text-[var(--color-ink-dim)]">for tonight.</span></>,
    sub: "Drill on the bus. On the toilet. Wherever.",
  },
  {
    id: "slides",
    range: [0.76, 0.92] as const,
    eyebrow: "Act 06",
    head: <>A deck for <span className="font-serif italic text-[var(--color-ink-dim)]">tomorrow.</span></>,
    sub: "Editable. Exportable. Yours.",
  },
  {
    id: "save",
    range: [0.90, 1.0] as const,
    eyebrow: "Act 07",
    head: <>All of it <span className="font-serif italic text-[var(--color-ink-dim)]">on your phone.</span></>,
    sub: "Saved offline. Ready when the WiFi isn't.",
  },
] as const;

export function BigDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [activeTab, setActiveTab] = useState<Tab>("notes");
  useMotionValueEvent(scrollYProgress, "change", (t) => {
    if (t < 0.46) setActiveTab("notes");
    else if (t < 0.62) setActiveTab("animation");
    else if (t < 0.78) setActiveTab("flashcards");
    else setActiveTab("slides");
  });

  const [actIdx, setActIdx] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (t) => {
    let idx = 0;
    for (let i = 0; i < ACTS.length; i++) {
      const [a, b] = ACTS[i].range;
      const mid = (a + b) / 2;
      if (t >= mid) idx = i;
    }
    if (t < ACTS[0].range[0]) idx = 0;
    setActIdx(idx);
  });

  // window stage motion — slides up + fades in early, holds, gentle pull-back at end
  const stageOp = useTransform(scrollYProgress, [0, 0.04, 0.92, 1.0], [0, 1, 1, 0.7]);
  const stageY = useTransform(scrollYProgress, [0, 0.04], [40, 0]);
  const stageScale = useTransform(scrollYProgress, [0, 0.04, 0.92, 1.0], [0.97, 1, 1, 0.985]);

  // chat & plan reveals
  const askOp = useTransform(scrollYProgress, [0.05, 0.11], [0, 1]);
  const askY = useTransform(scrollYProgress, [0.05, 0.11], [10, 0]);
  const replyOp = useTransform(scrollYProgress, [0.12, 0.18], [0, 1]);
  const plan1 = useTransform(scrollYProgress, [0.19, 0.215], [0, 1]);
  const plan2 = useTransform(scrollYProgress, [0.215, 0.24], [0, 1]);
  const plan3 = useTransform(scrollYProgress, [0.24, 0.265], [0, 1]);
  const plan4 = useTransform(scrollYProgress, [0.265, 0.29], [0, 1]);
  const tabsRowOp = useTransform(scrollYProgress, [0.25, 0.30], [0, 1]);
  const tabsRowY = useTransform(scrollYProgress, [0.25, 0.30], [10, 0]);
  const toastOp = useTransform(scrollYProgress, [0.92, 0.98], [0, 1]);
  const toastY = useTransform(scrollYProgress, [0.92, 0.98], [10, 0]);

  return (
    <section ref={ref} className="relative" style={{ height: "700vh" }}>
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden pt-14">
        <div aria-hidden className="page-haze pointer-events-none absolute inset-0 -z-10" />

        {/* TOP — Act counter + morphing headline */}
        <div className="relative w-full px-6 md:px-8">
          <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center gap-2.5 text-center md:gap-3">
            {/* Act counter — single live string, smooth */}
            <div className="flex items-center gap-3 text-[11px] tracking-[0.18em] text-[var(--color-muted)] md:text-[11.5px]">
              <span>{ACTS[actIdx].eyebrow}</span>
              <span className="h-px w-8 bg-[var(--color-hairline)]" />
              <span>{String(actIdx + 1).padStart(2, "0")} / {String(ACTS.length).padStart(2, "0")}</span>
            </div>

            {/* Cross-faded headlines stacked. Each has its own opacity from scroll. */}
            <div className="relative h-[44px] w-full sm:h-[58px] md:h-[88px] lg:h-[104px]">
              {ACTS.map((act, i) => (
                <ActHead key={act.id} act={act} progress={scrollYProgress} delayed={i === 0} />
              ))}
            </div>

            {/* Sub caption — same cross-fade pattern, smaller */}
            <div className="relative hidden h-[24px] w-full md:block md:h-[28px]">
              {ACTS.map((act) => (
                <ActSub key={act.id} act={act} progress={scrollYProgress} />
              ))}
            </div>
          </div>
        </div>

        {/* CENTER — the window itself */}
        <motion.div
          style={{ opacity: stageOp, y: stageY, scale: stageScale }}
          className="relative mt-5 w-full px-4 md:mt-8 md:px-8"
        >
          <div className="mx-auto w-full max-w-[1180px]">
            <div className="window-frame">
              <div className="overflow-hidden rounded-[10px] border border-hairline bg-[var(--color-bg)]/40">
                {/* Title bar */}
                <div className="flex items-center justify-between border-b border-hairline px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[oklch(70%_0.16_25)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[oklch(80%_0.13_85)]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[oklch(72%_0.16_140)]" />
                  </div>
                  <span className="text-[12px] text-[var(--color-muted)]">
                    Topperly · Class 10 Biology
                  </span>
                  <div className="h-2.5 w-12" />
                </div>

                <div className="grid h-[min(620px,58vh)] grid-cols-[0.95fr_1.7fr]">
                  {/* CHAT side */}
                  <div className="flex flex-col gap-3 border-r border-hairline p-5">
                    <div className="text-[11.5px] uppercase tracking-[0.16em] text-[var(--color-muted)]">Chat</div>

                    <motion.div
                      style={{ opacity: askOp, y: askY }}
                      className="self-end max-w-[88%] rounded-2xl rounded-tr-md bg-[var(--color-surface-high)] px-3.5 py-2.5 text-[13.5px] leading-[1.5] text-[var(--color-ink)]"
                    >
                      i have a class 10 bio test tomorrow on cellular respiration. help me revise
                    </motion.div>

                    <motion.div
                      style={{ opacity: replyOp }}
                      className="self-start max-w-[94%] rounded-2xl rounded-tl-md bg-[var(--color-surface)] px-3.5 py-3"
                    >
                      <div className="flex items-center gap-2 text-[12px] text-[var(--color-ink-dim)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                        Got you. Building a 4-piece pack:
                      </div>
                      <ul className="mt-2.5 flex flex-col gap-1 text-[13px] leading-[1.5] text-[var(--color-ink-dim)]">
                        <PlanItem op={plan1} text="Concept notes — 3 stages, key terms" />
                        <PlanItem op={plan2} text="Process animation — glycolysis → ETC" />
                        <PlanItem op={plan3} text="Flashcards — 15 cards, drill tonight" />
                        <PlanItem op={plan4} text="Slide deck — for tomorrow's class" />
                      </ul>
                    </motion.div>

                    <div className="flex-1" />

                    <div className="flex items-center gap-2 rounded-xl border border-hairline bg-[var(--color-surface)]/40 px-3 py-2.5 text-[13px] text-[var(--color-muted)]">
                      <span>Reply…</span>
                      <span className="ml-auto rounded-md border border-hairline px-1.5 py-0.5 text-[10px]">↵</span>
                    </div>
                  </div>

                  {/* ARTIFACT side */}
                  <div className="relative flex flex-col">
                    <motion.div
                      style={{ opacity: tabsRowOp, y: tabsRowY }}
                      className="flex items-center gap-1 border-b border-hairline px-4 pt-4"
                    >
                      {TABS.map((t) => {
                        const active = t.id === activeTab;
                        return (
                          <div
                            key={t.id}
                            className="relative px-3 pb-3 pt-1 text-[12.5px]"
                            style={{ color: active ? "var(--color-ink)" : "var(--color-muted)" }}
                          >
                            {t.label}
                            {active ? (
                              <motion.span
                                layoutId="tab-underline"
                                className="absolute inset-x-0 bottom-0 h-[1.5px] bg-[var(--color-accent)]"
                                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                              />
                            ) : null}
                          </div>
                        );
                      })}
                      <div className="ml-auto pr-1 text-[11.5px] text-[var(--color-muted)]">
                        4 artifacts
                      </div>
                    </motion.div>

                    <div className="relative flex-1">
                      <ArtifactNotes p={scrollYProgress} active={activeTab === "notes"} />
                      <ArtifactAnimation p={scrollYProgress} active={activeTab === "animation"} />
                      <ArtifactFlashcards p={scrollYProgress} active={activeTab === "flashcards"} />
                      <ArtifactSlides p={scrollYProgress} active={activeTab === "slides"} />
                    </div>

                    <div className="flex items-center justify-between border-t border-hairline px-5 py-2.5 text-[11.5px] text-[var(--color-muted)]">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md border border-hairline px-1.5 py-0.5 text-[10.5px]">⌘E</span>
                        Export pack
                      </div>
                      <span>4 of 4 artifacts ready</span>
                    </div>

                    <motion.div
                      style={{ opacity: toastOp, y: toastY }}
                      className="pointer-events-none absolute bottom-16 right-5 flex items-center gap-2 rounded-full border border-hairline bg-[var(--color-surface-high)] px-3 py-1.5 text-[12px] text-[var(--color-ink)]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
                      revision-pack saved · take it offline
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* BOTTOM — progress dots */}
        <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
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

function ActHead({
  act,
  progress,
  delayed,
}: {
  act: (typeof ACTS)[number];
  progress: MotionValue<number>;
  delayed: boolean;
}) {
  const [a, b] = act.range;
  const mid = (a + b) / 2;
  const op = useTransform(
    progress,
    delayed ? [a, mid - 0.01, b - 0.02, b] : [a, mid - 0.01, b - 0.02, b],
    [0, 1, 1, 0]
  );
  const y = useTransform(progress, [a, mid - 0.01], [12, 0]);
  return (
    <motion.h2
      style={{ opacity: op, y }}
      className="absolute inset-x-0 top-0 font-medium tracking-display-tight text-[clamp(28px,5.5vw,82px)] leading-[1.02] text-[var(--color-ink)]"
    >
      {act.head}
    </motion.h2>
  );
}

function ActSub({ act, progress }: { act: (typeof ACTS)[number]; progress: MotionValue<number> }) {
  const [a, b] = act.range;
  const mid = (a + b) / 2;
  const op = useTransform(progress, [a + 0.01, mid, b - 0.02, b], [0, 1, 1, 0]);
  return (
    <motion.p
      style={{ opacity: op }}
      className="absolute inset-x-0 top-0 text-[14px] text-[var(--color-ink-dim)]"
    >
      {act.sub}
    </motion.p>
  );
}

function PlanItem({ op, text }: { op: MotionValue<number>; text: string }) {
  return (
    <motion.li style={{ opacity: op }} className="flex items-start gap-2">
      <span className="mt-[3px] h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
      {text}
    </motion.li>
  );
}

/* ============= NOTES tab ============== */
function ArtifactNotes({ p, active }: { p: MotionValue<number>; active: boolean }) {
  const op = useTransform(p, [0.30, 0.34, 0.44, 0.48], [0, 1, 1, 0]);
  const y = useTransform(p, [0.30, 0.34], [16, 0]);
  return (
    <motion.div
      style={{ opacity: op, y, pointerEvents: active ? "auto" : "none" }}
      className="absolute inset-5 overflow-hidden rounded-xl border border-hairline bg-[var(--color-surface-alt)] p-6"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-muted)]">Concept notes</span>
        <span className="text-[11px] text-[var(--color-muted)]">notes.pdf</span>
      </div>
      <h3 className="mt-3 font-medium tracking-display-tight text-[26px] text-[var(--color-ink)]">
        Cellular Respiration
      </h3>
      <p className="mt-1.5 max-w-[58ch] text-[13.5px] leading-[1.65] text-[var(--color-ink-dim)]">
        How a cell releases energy from glucose. Three stages, each in a different part of the cell.
      </p>

      <div className="mt-5 space-y-3.5 text-[13px] leading-[1.6]">
        <Row label="Stage 1" title="Glycolysis" loc="Cytoplasm" body="Glucose (6C) splits into two pyruvate (3C). Net gain: 2 ATP." />
        <Row label="Stage 2" title="Krebs Cycle" loc="Mitochondrial matrix" body="Pyruvate broken down, releasing CO₂. Produces NADH and FADH₂." />
        <Row label="Stage 3" title="Electron Transport Chain" loc="Inner mitochondrial membrane" body="NADH and FADH₂ donate electrons. Net gain: 32–34 ATP." />
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-hairline pt-4">
        {["ATP", "NADH", "FADH₂", "Glycolysis", "Mitochondria", "Pyruvate"].map((t) => (
          <span
            key={t}
            className="rounded-md border border-hairline bg-[var(--color-surface)]/40 px-2 py-0.5 text-[11.5px] text-[var(--color-ink-dim)]"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function Row({ label, title, loc, body }: { label: string; title: string; loc: string; body: string }) {
  return (
    <div className="grid grid-cols-[80px_1fr] gap-4">
      <span className="text-[11.5px] text-[var(--color-muted)]">{label}</span>
      <div>
        <div className="text-[var(--color-ink)]">
          {title}{" "}
          <span className="text-[var(--color-muted)]">· {loc}</span>
        </div>
        <div className="mt-0.5 text-[var(--color-ink-dim)]">{body}</div>
      </div>
    </div>
  );
}

/* ============= ANIMATION tab ============== */
function ArtifactAnimation({ p, active }: { p: MotionValue<number>; active: boolean }) {
  const op = useTransform(p, [0.46, 0.50, 0.60, 0.64], [0, 1, 1, 0]);
  const y = useTransform(p, [0.46, 0.50], [16, 0]);
  const s0 = useTransform(p, [0.50, 0.53, 0.56], [0.4, 1, 0.4]);
  const s1 = useTransform(p, [0.54, 0.57, 0.60], [0.4, 1, 0.4]);
  const s2 = useTransform(p, [0.58, 0.61, 0.64], [0.4, 1, 0.4]);
  const arrow1 = useTransform(p, [0.50, 0.56], [0, 1]);
  const arrow2 = useTransform(p, [0.56, 0.62], [0, 1]);

  return (
    <motion.div
      style={{ opacity: op, y, pointerEvents: active ? "auto" : "none" }}
      className="absolute inset-5 overflow-hidden rounded-xl border border-hairline bg-[var(--color-surface-alt)] p-6"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-muted)]">Process animation</span>
        <span className="text-[11px] text-[var(--color-muted)]">cellular-respiration.mp4</span>
      </div>
      <h3 className="mt-3 text-[18px] font-medium tracking-[-0.012em] text-[var(--color-ink)]">
        How energy flows through the cell
      </h3>

      <svg viewBox="0 0 480 220" className="mt-5 w-full">
        <defs>
          <linearGradient id="bg-grad" x1="0" x2="1">
            <stop offset="0" stopColor="oklch(20% 0.009 250)" />
            <stop offset="1" stopColor="oklch(16% 0.008 250)" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="480" height="220" rx="8" fill="url(#bg-grad)" />

        <motion.g style={{ opacity: s0 }}>
          <circle cx="80" cy="110" r="44" fill="none" stroke="var(--color-hairline-bright)" strokeWidth="1.2" />
          <circle cx="80" cy="110" r="6" fill="var(--color-accent)" />
          <text x="80" y="170" textAnchor="middle" fill="var(--color-ink)" fontSize="11" fontFamily="Inter">Glycolysis</text>
          <text x="80" y="186" textAnchor="middle" fill="var(--color-muted)" fontSize="10" fontFamily="Inter">Cytoplasm</text>
        </motion.g>

        <motion.path d="M 130 110 L 200 110" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" style={{ pathLength: arrow1 }} />

        <motion.g style={{ opacity: s1 }}>
          <circle cx="240" cy="110" r="44" fill="none" stroke="var(--color-hairline-bright)" strokeWidth="1.2" />
          <circle cx="240" cy="110" r="6" fill="var(--color-accent)" />
          <text x="240" y="170" textAnchor="middle" fill="var(--color-ink)" fontSize="11" fontFamily="Inter">Krebs cycle</text>
          <text x="240" y="186" textAnchor="middle" fill="var(--color-muted)" fontSize="10" fontFamily="Inter">Matrix</text>
        </motion.g>

        <motion.path d="M 290 110 L 360 110" stroke="var(--color-accent)" strokeWidth="1.5" fill="none" strokeDasharray="4 4" style={{ pathLength: arrow2 }} />

        <motion.g style={{ opacity: s2 }}>
          <circle cx="400" cy="110" r="44" fill="none" stroke="var(--color-hairline-bright)" strokeWidth="1.2" />
          <circle cx="400" cy="110" r="6" fill="var(--color-accent)" />
          <text x="400" y="170" textAnchor="middle" fill="var(--color-ink)" fontSize="11" fontFamily="Inter">ETC</text>
          <text x="400" y="186" textAnchor="middle" fill="var(--color-muted)" fontSize="10" fontFamily="Inter">Inner membrane</text>
        </motion.g>
      </svg>

      <div className="mt-4 flex items-center justify-between text-[12px] text-[var(--color-muted)]">
        <div className="flex items-center gap-3">
          <span>▶</span>
          <span>0:08 / 0:24</span>
        </div>
        <span>Net ATP: 36 per glucose</span>
      </div>
    </motion.div>
  );
}

/* ============= FLASHCARDS tab ============== */
function ArtifactFlashcards({ p, active }: { p: MotionValue<number>; active: boolean }) {
  const op = useTransform(p, [0.62, 0.66, 0.76, 0.80], [0, 1, 1, 0]);
  const y = useTransform(p, [0.62, 0.66], [16, 0]);
  const flip = useTransform(p, [0.66, 0.72, 0.78], [0, 0, 1]);
  const frontOp = useTransform(flip, [0, 0.5, 1], [1, 0, 0]);
  const backOp = useTransform(flip, [0, 0.5, 1], [0, 0, 1]);
  const cardRotate = useTransform(flip, [0, 1], [0, 180]);

  return (
    <motion.div
      style={{ opacity: op, y, pointerEvents: active ? "auto" : "none" }}
      className="absolute inset-5 flex flex-col overflow-hidden rounded-xl border border-hairline bg-[var(--color-surface-alt)] p-6"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-muted)]">Flashcards · 15 cards</span>
        <span className="text-[11px] text-[var(--color-muted)]">deck.json</span>
      </div>

      <div className="relative mt-6 flex flex-1 items-center justify-center" style={{ perspective: 800 }}>
        <motion.div
          style={{ rotateY: cardRotate, transformStyle: "preserve-3d" }}
          className="relative h-[200px] w-full max-w-[440px]"
        >
          <motion.div
            style={{ opacity: frontOp, backfaceVisibility: "hidden" }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border border-hairline-bright bg-[var(--color-surface)] p-6 text-center"
          >
            <span className="text-[11px] text-[var(--color-muted)]">Question</span>
            <span className="text-[20px] font-medium text-[var(--color-ink)]">
              What does ATP stand for?
            </span>
            <span className="mt-2 text-[12px] text-[var(--color-muted)]">tap to flip</span>
          </motion.div>
          <motion.div
            style={{
              opacity: backOp,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-xl border border-[var(--color-accent)] bg-[oklch(85%_0.09_145/0.06)] p-6 text-center"
          >
            <span className="text-[11px] text-[var(--color-muted)]">Answer</span>
            <span className="text-[20px] font-medium text-[var(--color-ink)]">
              Adenosine Triphosphate
            </span>
            <span className="mt-2 max-w-[40ch] text-[12.5px] leading-[1.55] text-[var(--color-ink-dim)]">
              The energy currency of the cell — stores and transfers chemical energy.
            </span>
          </motion.div>
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px] text-[var(--color-muted)]">
        <div className="flex items-center gap-2">
          <span className="rounded-md border border-hairline px-1.5 py-0.5 text-[10.5px]">←</span>
          <span className="rounded-md border border-hairline px-1.5 py-0.5 text-[10.5px]">→</span>
        </div>
        <div className="flex gap-1">
          {[...Array(15)].map((_, i) => (
            <span
              key={i}
              className="h-1 w-3 rounded-full"
              style={{ background: i < 4 ? "var(--color-accent)" : "var(--color-hairline)" }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ============= SLIDES tab ============== */
function ArtifactSlides({ p, active }: { p: MotionValue<number>; active: boolean }) {
  const op = useTransform(p, [0.78, 0.82, 0.92, 0.96], [0, 1, 1, 0]);
  const y = useTransform(p, [0.78, 0.82], [16, 0]);
  const t1 = useTransform(p, [0.82, 0.85], [0, 1]);
  const t2 = useTransform(p, [0.85, 0.88], [0, 1]);
  const t3 = useTransform(p, [0.88, 0.91], [0, 1]);

  return (
    <motion.div
      style={{ opacity: op, y, pointerEvents: active ? "auto" : "none" }}
      className="absolute inset-5 overflow-hidden rounded-xl border border-hairline bg-[var(--color-surface-alt)] p-6"
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[11.5px] uppercase tracking-[0.14em] text-[var(--color-muted)]">Slide deck · 8 slides</span>
        <span className="text-[11px] text-[var(--color-muted)]">cellular-respiration.pptx</span>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_2.4fr] gap-4">
        <div className="flex flex-col gap-2">
          {["Title", "Overview", "Stage 1", "Stage 2", "Stage 3", "Summary", "Key terms", "Q&A"].map((s, i) => (
            <motion.div
              key={s}
              style={{
                opacity: i < 3 ? t1 : i < 6 ? t2 : t3,
                borderColor: i === 0 ? "var(--color-accent)" : "var(--color-hairline)",
              }}
              className="rounded-md border bg-[var(--color-surface)]/40 px-2 py-1.5 text-[10.5px] text-[var(--color-ink-dim)]"
            >
              <span className="text-[var(--color-muted)]">{i + 1}.</span> {s}
            </motion.div>
          ))}
        </div>

        <motion.div
          style={{ opacity: t1 }}
          className="flex aspect-[16/10] flex-col items-center justify-center rounded-xl border border-hairline-bright bg-[var(--color-surface)] p-6 text-center"
        >
          <span className="text-[11px] text-[var(--color-muted)]">Class 10 Biology</span>
          <h4 className="mt-3 font-medium tracking-display-tight text-[28px] text-[var(--color-ink)]">
            Cellular Respiration
          </h4>
          <span className="mt-2 font-serif italic text-[14px] text-[var(--color-ink-dim)]">
            How a cell turns glucose into energy
          </span>
          <div className="mt-6 flex items-center gap-2 text-[10.5px] text-[var(--color-muted)]">
            <span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" />
            Slide 1 of 8 · Topperly
          </div>
        </motion.div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[12px] text-[var(--color-muted)]">
        <span>Editable in PowerPoint</span>
        <span>Download .pptx</span>
      </div>
    </motion.div>
  );
}

// EASE used by inner act helpers (kept for symmetry; some helpers omit explicit ease to use default).
void EASE;
