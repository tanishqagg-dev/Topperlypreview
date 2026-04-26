import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";

/**
 * Final scene. Full-bleed cinematic close. As you scroll into it the
 * headline scales up slightly, then a serif italic answer appears below.
 * The background has a subtle radial pulse from the accent.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

export function ClosingCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const titleScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.96, 1, 1.02]);
  const titleY = useTransform(scrollYProgress, [0, 0.5], [40, 0]);
  const haloScale = useTransform(scrollYProgress, [0, 0.6], [0.7, 1.4]);
  const haloOp = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.6, 0.2]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden border-b border-hairline bg-[var(--color-bg)] py-32 md:py-44"
    >
      {/* Soft accent halo behind the headline */}
      <motion.div
        aria-hidden
        style={{ scale: haloScale, opacity: haloOp }}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--color-accent)] opacity-30 blur-[120px]"
      />

      <div className="relative mx-auto flex w-full max-w-[1100px] flex-col items-center gap-9 px-6 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-2 text-[12px] tracking-[0.2em] text-[var(--color-muted)]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
          ONE LAST THING
        </motion.div>

        <motion.h2
          style={{ scale: titleScale, y: titleY }}
          className="max-w-[18ch] font-medium tracking-display-xl text-[clamp(40px,7vw,108px)] leading-[0.98] text-[var(--color-ink)]"
        >
          Stop reading answers.
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.4 }}
            className="font-serif italic font-normal text-[var(--color-ink-dim)]"
          >
            Start studying.
          </motion.span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-[48ch] text-[16px] leading-[1.65] text-[var(--color-ink-dim)]"
        >
          Beta opens in small waves. Every wave is shaped by the wave before it. Three students reading every message. No growth team optimising your funnel.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5"
        >
          <Link
            to="/access"
            className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-ink)] px-6 py-3 text-[15px] font-medium text-[var(--color-bg)] transition-transform hover:scale-[1.02]"
          >
            Get on the list
            <svg width="12" height="12" viewBox="0 0 11 11" fill="none" className="transition-transform group-hover:translate-x-[3px]">
              <path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link
            to="/story"
            className="text-[14px] text-[var(--color-ink-dim)] underline-offset-[6px] transition-colors hover:text-[var(--color-ink)] hover:underline"
          >
            Read why we're building this →
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-12 font-serif italic text-[15px] text-[var(--color-muted)]"
        >
          — The Topperly team
        </motion.div>
      </div>
    </section>
  );
}
