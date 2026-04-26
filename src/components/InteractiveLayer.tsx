import { motion, useScroll, useSpring, useMotionValue, animate } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Site-wide interactive layer:
 *  - Thin scroll progress bar pinned to the top of the viewport
 *  - Cursor-following accent dot (desktop only, hidden on touch)
 * Both are pointer-events-none so they never block interaction.
 */

export function InteractiveLayer() {
  return (
    <>
      <ScrollProgressBar />
      <CursorFollower />
    </>
  );
}

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  // Spring-smoothed for that GSAP-like ease.
  const fill = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.4,
  });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: fill, transformOrigin: "0% 50%" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[2px] bg-[var(--color-accent)]"
    />
  );
}

function CursorFollower() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 280, damping: 26, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 26, mass: 0.4 });

  const [enabled, setEnabled] = useState(false);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    // Skip on touch devices.
    if (typeof window === "undefined") return;
    const isTouch =
      window.matchMedia("(hover: none)").matches ||
      "ontouchstart" in window;
    if (isTouch) return;
    setEnabled(true);

    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
    }
    function onOver(e: MouseEvent) {
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest("a,button,[role='button'],input,textarea,label,summary");
      setHot(interactive);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* Soft halo */}
      <motion.div
        aria-hidden
        style={{
          x: sx,
          y: sy,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: hot ? 1.6 : 1, opacity: hot ? 0.55 : 0.25 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="pointer-events-none fixed left-0 top-0 z-[90] h-7 w-7 rounded-full bg-[var(--color-accent)] mix-blend-screen blur-md"
      />
      {/* Crisp dot */}
      <motion.div
        aria-hidden
        style={{
          x,
          y,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ scale: hot ? 1.6 : 1 }}
        transition={{ type: "spring", stiffness: 380, damping: 20 }}
        className="pointer-events-none fixed left-0 top-0 z-[91] h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
      />
    </>
  );
}

void animate;
