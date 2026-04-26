import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, useState } from "react";

/**
 * Pinned phone mockup. Big iPhone-style frame in the centre. Inside,
 * artifact screens cycle as you scroll: chat → quiz → flashcards →
 * worksheet → notes. Around the phone, ghost tiles drift past in parallax.
 * The whole stage is sticky so it feels like the artifacts are flowing
 * through your phone while you scroll.
 */

const SCREENS = [
  { id: "chat",       label: "Chat",       span: [0.0, 0.22] as const },
  { id: "quiz",       label: "Quiz",       span: [0.22, 0.44] as const },
  { id: "flashcards", label: "Flashcards", span: [0.44, 0.66] as const },
  { id: "worksheet",  label: "Worksheet",  span: [0.66, 0.84] as const },
  { id: "notes",      label: "Notes",      span: [0.84, 1.0] as const },
];

export function PhonePeek() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const [idx, setIdx] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (t) => {
    let n = 0;
    for (let i = 0; i < SCREENS.length; i++) {
      if (t >= SCREENS[i].span[0]) n = i;
    }
    setIdx(n);
  });

  const titleOp = useTransform(scrollYProgress, [0, 0.06, 0.94, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative" style={{ height: "320vh" }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div aria-hidden className="page-haze pointer-events-none absolute inset-0 -z-10" />
        <BgDrift progress={scrollYProgress} />

        <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 px-6 md:grid-cols-[1fr_440px] md:gap-16 md:px-8">
          <motion.div style={{ opacity: titleOp }} className="order-2 md:order-1">
            <div className="flex items-center gap-2 text-[12px] tracking-[0.18em] text-[var(--color-muted)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
              FROM YOUR PHONE
            </div>
            <h2 className="mt-4 font-medium tracking-display-tight text-[clamp(34px,5vw,68px)] leading-[1.02] text-[var(--color-ink)]">
              The whole pack{" "}
              <span className="font-serif italic font-normal text-[var(--color-ink-dim)]">
                fits in your pocket.
              </span>
            </h2>
            <p className="mt-5 max-w-[44ch] text-[16px] leading-[1.65] text-[var(--color-ink-dim)]">
              Drill the quiz on the metro. Flip cards before assembly. Print the worksheet at the cyber café. Topperly was built for the way Indian students actually study — between everything else.
            </p>

            <div className="mt-8 flex flex-col gap-2">
              {SCREENS.map((s, i) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 transition-opacity duration-300"
                  style={{ opacity: i === idx ? 1 : 0.32 }}
                >
                  <span
                    className="h-px transition-all duration-500"
                    style={{
                      width: i === idx ? 26 : 12,
                      background: i === idx ? "var(--color-accent)" : "var(--color-hairline)",
                    }}
                  />
                  <span className="font-mono text-[12px] text-[var(--color-ink-dim)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-[14px] text-[var(--color-ink)]">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="order-1 flex justify-center md:order-2">
            <Phone activeIdx={idx} progress={scrollYProgress} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Phone({ activeIdx, progress }: { activeIdx: number; progress: MotionValue<number> }) {
  void progress;
  return (
    <div className="relative">
      <div
        className="relative h-[640px] w-[320px] rounded-[44px] border border-hairline-bright bg-[var(--color-bg)] p-3 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.6)]"
        style={{ outline: "1px solid var(--color-hairline)" }}
      >
        {/* Notch */}
        <div className="absolute left-1/2 top-3 z-10 h-6 w-28 -translate-x-1/2 rounded-full bg-[var(--color-bg)]" />

        <div className="relative h-full w-full overflow-hidden rounded-[34px] border border-hairline bg-[var(--color-surface-alt)]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-5 pt-3 pb-2 text-[10.5px] text-[var(--color-ink-dim)]">
            <span className="font-mono">9:41</span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-3 rounded-sm border border-[var(--color-ink-dim)]" />
              <span>87%</span>
            </span>
          </div>

          <div className="relative h-[calc(100%-30px)] px-4 pb-4">
            {SCREENS.map((s, i) => (
              <div
                key={s.id}
                className="absolute inset-x-4 inset-y-0 transition-opacity duration-500"
                style={{
                  opacity: i === activeIdx ? 1 : 0,
                  pointerEvents: i === activeIdx ? "auto" : "none",
                }}
              >
                <Screen id={s.id} />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Floating chip below the phone */}
      <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-[var(--color-muted)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
        offline-ready · 32 MB
      </div>
    </div>
  );
}

function Screen({ id }: { id: string }) {
  if (id === "chat") {
    return (
      <div className="flex h-full flex-col gap-2 pt-2">
        <div className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">Chat</div>
        <div className="ml-auto max-w-[88%] rounded-2xl rounded-tr-md bg-[var(--color-surface-high)] px-3 py-2 text-[12px] leading-[1.5] text-[var(--color-ink)]">
          help me understand projectile motion
        </div>
        <div className="max-w-[94%] rounded-2xl rounded-tl-md bg-[var(--color-surface)] px-3 py-2 text-[11.5px] leading-[1.5] text-[var(--color-ink-dim)]">
          Building you a 5-piece pack: notes, animation, quiz, worksheet, deck.
        </div>
        <div className="mt-auto rounded-xl border border-hairline bg-[var(--color-surface)]/50 p-2.5 text-[11px] text-[var(--color-muted)]">
          Reply…
        </div>
      </div>
    );
  }
  if (id === "quiz") {
    return (
      <div className="flex h-full flex-col gap-2.5 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">Quiz</span>
          <span className="text-[10px] text-[var(--color-muted)]">Q 4 / 8</span>
        </div>
        <div className="text-[13px] font-medium text-[var(--color-ink)]">
          For maximum range, the angle of projection should be:
        </div>
        <div className="flex flex-col gap-1.5">
          <Option text="30°" />
          <Option text="45°" active />
          <Option text="60°" />
          <Option text="90°" />
        </div>
        <div className="mt-auto flex justify-between text-[10.5px] text-[var(--color-muted)]">
          <span>Score: 3 / 3 so far</span>
          <span>↵ submit</span>
        </div>
      </div>
    );
  }
  if (id === "flashcards") {
    return (
      <div className="flex h-full flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">Flashcards</span>
          <span className="text-[10px] text-[var(--color-muted)]">7 / 12</span>
        </div>
        <div className="grid flex-1 place-items-center rounded-2xl border border-hairline bg-[var(--color-surface)]">
          <div className="text-center">
            <div className="text-[10px] text-[var(--color-muted)]">Question</div>
            <div className="mt-2 text-[14px] font-medium text-[var(--color-ink)]">
              Range formula?
            </div>
            <div className="mt-3 font-mono text-[12px] text-[var(--color-ink-dim)]">
              R = u² sin(2θ) / g
            </div>
          </div>
        </div>
        <div className="flex justify-between text-[10.5px] text-[var(--color-muted)]">
          <span>← prev</span>
          <span>tap to flip</span>
          <span>next →</span>
        </div>
      </div>
    );
  }
  if (id === "worksheet") {
    return (
      <div className="flex h-full flex-col gap-2 pt-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">Worksheet</span>
          <span className="text-[10px] text-[var(--color-muted)]">5 problems</span>
        </div>
        <div className="flex-1 overflow-hidden rounded-xl border border-hairline bg-[var(--color-bg)] p-3">
          <div className="text-[12px] font-medium text-[var(--color-ink)]">Class 11 · Projectile</div>
          <ol className="mt-2 space-y-1.5 text-[10.5px] leading-[1.45] text-[var(--color-ink-dim)]">
            <li>1. A ball thrown at 20 m/s, 30°. Find R.</li>
            <li>2. Time of flight for u = 25 m/s, θ = 60°.</li>
            <li>3. Max height when u = 30 m/s, θ = 45°.</li>
            <li>4. Range when u = 18 m/s, θ = 50°.</li>
            <li>5. Velocity at h = 10 m if u = 22 m/s, 40°.</li>
          </ol>
        </div>
        <div className="flex justify-between text-[10.5px] text-[var(--color-muted)]">
          <span>print · export</span>
          <span>answer key →</span>
        </div>
      </div>
    );
  }
  // notes
  return (
    <div className="flex h-full flex-col gap-2 pt-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">Notes</span>
        <span className="text-[10px] text-[var(--color-muted)]">3 pages</span>
      </div>
      <div className="flex-1 overflow-hidden rounded-xl border border-hairline bg-[var(--color-bg)] p-3">
        <div className="text-[13px] font-medium text-[var(--color-ink)]">Projectile Motion</div>
        <div className="mt-1 text-[10.5px] text-[var(--color-muted)]">Class 11 · Mechanics</div>
        <div className="mt-3 space-y-1.5 text-[10.5px] leading-[1.5] text-[var(--color-ink-dim)]">
          <p>An object launched into the air follows a curved path under gravity alone…</p>
          <p>Two-component motion: horizontal (constant velocity) and vertical (uniform acceleration).</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {["range", "trajectory", "T = 2u sinθ / g", "g = 9.8"].map((t) => (
            <span key={t} className="rounded-md border border-hairline px-1.5 py-0.5 text-[9.5px] text-[var(--color-ink-dim)]">
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex justify-between text-[10.5px] text-[var(--color-muted)]">
        <span>save offline</span>
        <span>highlight</span>
      </div>
    </div>
  );
}

function Option({ text, active }: { text: string; active?: boolean }) {
  return (
    <div
      className={`rounded-lg border px-3 py-2 text-[11.5px] transition-colors ${
        active
          ? "border-[var(--color-accent)] bg-[oklch(85%_0.09_145/0.08)] text-[var(--color-ink)]"
          : "border-hairline text-[var(--color-ink-dim)]"
      }`}
    >
      {text}
    </div>
  );
}

function BgDrift({ progress }: { progress: MotionValue<number> }) {
  const y1 = useTransform(progress, [0, 1], [0, -200]);
  const y2 = useTransform(progress, [0, 1], [0, -120]);
  const y3 = useTransform(progress, [0, 1], [0, -160]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ y: y1 }}
        className="absolute left-[6%] top-[14%] rounded-xl border border-hairline bg-[var(--color-surface-alt)]/40 px-3 py-2 text-[10px] tracking-[0.16em] text-[var(--color-muted)]"
      >
        REVISION PACK
      </motion.div>
      <motion.div
        style={{ y: y2 }}
        className="absolute right-[8%] top-[24%] rounded-xl border border-hairline bg-[var(--color-surface-alt)]/40 px-3 py-2 text-[10px] tracking-[0.16em] text-[var(--color-muted)]"
      >
        FLASHCARDS · DRILLING
      </motion.div>
      <motion.div
        style={{ y: y3 }}
        className="absolute left-[10%] bottom-[18%] rounded-xl border border-hairline bg-[var(--color-surface-alt)]/40 px-3 py-2 text-[10px] tracking-[0.16em] text-[var(--color-muted)]"
      >
        SAVED OFFLINE
      </motion.div>
    </div>
  );
}
