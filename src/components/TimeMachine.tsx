import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

/**
 * Emotional storytelling section. A clock-like ring on the left ticks
 * through "1:47 AM" to "8:00 AM" as you scroll. On the right, three
 * student moments fade in — the kind of micro-stories Topperly was built
 * to fix. Shorter than HowItWorks, designed to land a punch.
 */

const MOMENTS = [
  {
    time: "1:47 AM",
    title: "The night before boards.",
    body: "Three weeks out. Phone glow on the ceiling. ChatGPT explaining cellular respiration. The next morning at school, you can't reproduce a single answer. We've all been here.",
    span: [0.0, 0.42] as const,
  },
  {
    time: "6:30 PM",
    title: "Tomorrow's class test.",
    body: "An hour to revise integration. You don't need a paragraph. You need ten worked problems, a quick quiz, and the formulas on a card you can flip.",
    span: [0.36, 0.74] as const,
  },
  {
    time: "8:00 AM",
    title: "Walking into the exam.",
    body: "Headphones in, deck open on your phone, drilling the last twelve flashcards on the auto. The kind of last-minute that actually helps.",
    span: [0.68, 1.0] as const,
  },
];

export function TimeMachine() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Clock ring fills 0 → 1 across the section
  const ringFill = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);
  const ringRotate = useTransform(scrollYProgress, [0, 1], [-90, 270]);

  return (
    <section
      ref={ref}
      className="relative border-y border-hairline bg-[var(--color-surface-alt)] py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-[var(--container-page)] px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex items-center gap-2 text-[12px] tracking-[0.18em] text-[var(--color-muted)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          BUILT FOR THE NIGHT BEFORE
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9 }}
          className="mb-16 max-w-[18ch] font-medium tracking-display-tight text-[clamp(34px,5vw,72px)] leading-[1.02] text-[var(--color-ink)]"
        >
          Study apps work in daylight.{" "}
          <span className="font-serif italic font-normal text-[var(--color-ink-dim)]">
            Topperly works at 1am.
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-[300px_1fr] md:gap-16">
          <div className="md:sticky md:top-24 md:self-start">
            <ClockRing fill={ringFill} rotate={ringRotate} />
          </div>

          <div className="flex flex-col gap-10 md:gap-14">
            {MOMENTS.map((m, i) => (
              <Moment key={m.time} moment={m} index={i} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ClockRing({
  fill,
  rotate,
}: {
  fill: MotionValue<number>;
  rotate: MotionValue<number>;
}) {
  // Stroke-dashoffset trick: a circle's stroke-dasharray = circumference,
  // and dashoffset goes from circumference (empty) to 0 (full).
  const C = 2 * Math.PI * 96; // radius 96
  const dashOffset = useTransform(fill, (v) => C * (1 - v));

  return (
    <div className="relative aspect-square w-full max-w-[260px]">
      <svg viewBox="0 0 220 220" className="h-full w-full">
        <circle cx="110" cy="110" r="96" stroke="var(--color-hairline)" strokeWidth="1.5" fill="none" />
        <motion.circle
          cx="110"
          cy="110"
          r="96"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          style={{
            strokeDasharray: C,
            strokeDashoffset: dashOffset,
            transform: "rotate(-90deg)",
            transformOrigin: "center",
          }}
        />
        {/* Hour ticks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2 - Math.PI / 2;
          const x1 = 110 + Math.cos(angle) * 88;
          const y1 = 110 + Math.sin(angle) * 88;
          const x2 = 110 + Math.cos(angle) * 96;
          const y2 = 110 + Math.sin(angle) * 96;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--color-hairline-bright)"
              strokeWidth="1"
            />
          );
        })}
        {/* Center hand */}
        <motion.line
          x1="110"
          y1="110"
          x2="110"
          y2="40"
          stroke="var(--color-ink)"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={{ rotate, originX: "110px", originY: "110px" }}
        />
        <circle cx="110" cy="110" r="3" fill="var(--color-accent)" />
      </svg>
      <div className="mt-5 text-center">
        <div className="text-[11px] tracking-[0.18em] text-[var(--color-muted)]">SCROLL</div>
        <div className="mt-1 font-mono text-[12px] text-[var(--color-ink-dim)]">
          one night, three moments
        </div>
      </div>
    </div>
  );
}

function Moment({
  moment,
  index,
  progress,
}: {
  moment: (typeof MOMENTS)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  const [a, b] = moment.span;
  const op = useTransform(progress, [a, a + 0.06, b - 0.04, b], [0.25, 1, 1, 0.4]);
  const x = useTransform(progress, [a, a + 0.08], [40, 0]);

  return (
    <motion.div style={{ opacity: op, x }} className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[13px] text-[var(--color-accent)]">{moment.time}</span>
        <span className="h-px flex-1 bg-[var(--color-hairline)]" />
        <span className="text-[10.5px] tracking-[0.16em] text-[var(--color-muted)]">
          MOMENT {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <h3 className="font-medium tracking-display-tight text-[clamp(22px,3vw,34px)] leading-[1.15] text-[var(--color-ink)]">
        {moment.title}
      </h3>
      <p className="max-w-[58ch] text-[15px] leading-[1.65] text-[var(--color-ink-dim)]">
        {moment.body}
      </p>
    </motion.div>
  );
}
