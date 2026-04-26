import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Topperly logomark. Single path SVG. On first mount the path "draws"
 * itself with a subtle accent flash. On hover the whole mark scales
 * slightly and a green dot blinks at the corner.
 */

const PATH =
  "M 349.00 468.50 C348.17,468.30 345.81,467.86 343.75,467.52 L 340.00 466.91 L 340.00 303.45 L 340.00 140.00 L 343.25 140.01 C345.04,140.02 348.75,140.62 351.50,141.36 C364.38,144.80 375.17,152.55 381.37,162.81 C388.45,174.54 388.00,163.64 388.00,323.12 C388.00,437.03 387.74,467.05 386.75,467.69 C385.52,468.49 351.92,469.21 349.00,468.50 ZM 304.50 452.74 C301.83,451.90 297.01,449.88 283.50,443.95 C281.30,442.98 272.98,439.39 265.00,435.98 C237.09,424.02 224.64,416.80 210.26,404.26 C183.17,380.63 167.20,351.31 161.93,315.50 C160.22,303.92 160.01,296.49 160.00,247.50 C160.00,198.29 160.20,191.28 161.89,180.91 C166.08,155.24 174.64,135.35 190.45,114.54 C197.41,105.39 201.35,101.36 212.50,92.00 C222.14,83.91 226.05,81.41 239.88,74.52 C255.55,66.72 269.06,62.77 286.00,61.02 C298.74,59.70 427.43,59.71 441.50,61.03 C458.13,62.59 473.21,66.89 488.71,74.50 C529.84,94.68 556.94,130.98 565.98,178.00 C567.86,187.81 567.99,192.46 568.00,248.54 C568.00,305.15 567.88,309.22 565.91,320.03 C563.40,333.76 560.06,344.66 555.24,354.91 C537.64,392.25 509.72,417.17 466.08,434.50 C457.43,437.93 456.04,438.20 449.08,437.79 C437.04,437.07 428.93,431.72 423.70,421.05 L 420.50 414.50 L 420.50 295.00 C420.50,183.52 420.38,175.11 418.73,169.62 C411.84,146.73 398.25,128.87 379.39,117.91 C363.72,108.80 353.89,106.99 320.25,107.02 C288.03,107.05 278.07,108.59 262.26,116.00 C243.62,124.73 228.14,139.93 218.53,158.93 C214.78,166.35 213.24,170.89 210.74,182.00 C208.72,190.94 208.58,194.68 208.24,245.35 C208.01,279.30 208.25,301.47 208.90,305.35 C213.23,331.29 222.04,349.13 238.13,364.56 C247.69,373.73 251.68,376.36 268.15,384.39 C279.01,389.68 283.23,392.36 288.79,397.51 C301.56,409.34 307.76,422.39 308.66,439.36 C308.96,444.94 308.82,450.44 308.35,451.60 C307.62,453.41 307.09,453.56 304.50,452.74 Z";

export function Logo({ size = 22, className = "" }: { size?: number; className?: string }) {
  const [hovered, setHovered] = useState(false);
  const [drew, setDrew] = useState(false);

  useEffect(() => {
    // Mark "drew" once the initial reveal completes so that subsequent
    // re-renders don't re-trigger the draw.
    const t = setTimeout(() => setDrew(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox="0 0 716 564"
        width={size}
        height={size}
        role="img"
        aria-label="Topperly logo"
        animate={{ scale: hovered ? 1.06 : 1, rotate: hovered ? -3 : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 18 }}
      >
        <motion.path
          d={PATH}
          fill="currentColor"
          fillRule="evenodd"
          initial={{ pathLength: 0, opacity: 0, fillOpacity: 0 }}
          animate={{
            pathLength: drew ? 1 : [0, 1],
            opacity: 1,
            fillOpacity: drew ? 1 : [0, 0, 1],
          }}
          transition={{
            pathLength: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
            fillOpacity: { duration: 1.0, ease: [0.22, 1, 0.36, 1], times: [0, 0.6, 1] },
          }}
          stroke="currentColor"
          strokeWidth={drew ? 0 : 8}
        />
      </motion.svg>

      {/* Hover accent dot — blinks in the top-right corner */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{
          opacity: hovered ? 1 : 0,
          scale: hovered ? 1 : 0.4,
        }}
        transition={{ duration: 0.25 }}
        className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]"
      />
    </span>
  );
}

export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <Logo size={size} className="text-[var(--color-ink)]" />
    </span>
  );
}
