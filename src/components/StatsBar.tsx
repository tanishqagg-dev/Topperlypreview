import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Counter-animated stats. Each tile counts up from 0 to its target the
 * first time it enters the viewport. Apple-style: huge numbers, quiet
 * labels. Includes a serif italic kicker on the side.
 */

const STATS = [
  { n: 15,    suffix: "",   label: "study tools, all in one chat" },
  { n: 6,     suffix: "",   label: "artifact types from a single sentence" },
  { n: 2,     suffix: " mo", label: "from idea to live beta" },
  { n: 100,   suffix: "%",  label: "made by students who just finished boards" },
];

export function StatsBar() {
  return (
    <section className="relative border-y border-hairline py-20 md:py-24">
      <div aria-hidden className="page-haze pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto w-full max-w-[var(--container-page)] px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.7 }}
          className="mb-12 flex flex-col items-start gap-3 md:flex-row md:items-end md:justify-between md:gap-8"
        >
          <h2 className="max-w-[20ch] font-medium tracking-display-tight text-[clamp(28px,4vw,50px)] leading-[1.05] text-[var(--color-ink)]">
            A small team.{" "}
            <span className="font-serif italic font-normal text-[var(--color-ink-dim)]">
              A loud product.
            </span>
          </h2>
          <p className="max-w-[36ch] text-[14px] leading-[1.6] text-[var(--color-muted)]">
            Three students, two months, fifteen tools shipped. The numbers we actually care about.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-[var(--color-hairline)] md:grid-cols-4">
          {STATS.map((s, i) => (
            <Stat key={i} {...s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Stat({
  n,
  suffix,
  label,
  index,
}: {
  n: number;
  suffix: string;
  label: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const mv = useMotionValue(0);
  const display = useTransform(mv, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, n, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      delay: 0.06 * index,
    });
    return controls.stop;
  }, [inView, mv, n, index]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15%" }}
      transition={{ duration: 0.6, delay: 0.05 * index }}
      className="flex flex-col gap-2 bg-[var(--color-bg)] p-7 md:p-9"
    >
      <div className="flex items-baseline gap-1 font-medium tracking-display-tight text-[clamp(40px,6vw,84px)] leading-[1] text-[var(--color-ink)]">
        <motion.span>{display}</motion.span>
        <span className="text-[0.45em] text-[var(--color-ink-dim)]">{suffix}</span>
      </div>
      <div className="max-w-[20ch] text-[13px] leading-[1.55] text-[var(--color-ink-dim)]">
        {label}
      </div>
    </motion.div>
  );
}
