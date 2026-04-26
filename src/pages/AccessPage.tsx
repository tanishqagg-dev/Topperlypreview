import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;
type Status = "idle" | "loading" | "success" | "error";

const WAVES = [
  { n: "Wave 01", date: "Now", who: "Founders' circle · 50 students", state: "Live" },
  { n: "Wave 02", date: "April 2026", who: "Boards revision · 200 students", state: "Next" },
  { n: "Wave 03", date: "May 2026", who: "JEE + NEET cohorts · 500 students", state: "Soon" },
  { n: "Wave 04", date: "Late May", who: "Open beta · everyone in line", state: "Planned" },
];

const FAQ = [
  { q: "Is there a fee?", a: "Beta is free. We'll announce pricing before opening to general availability, and beta users get a discount." },
  { q: "What classes does it cover?", a: "CBSE Class 9 to 12 with deeper coverage for boards (X and XII), JEE Main + Advanced, and NEET. Olympiad foundations roll in across waves." },
  { q: "Do I need an Indian phone number?", a: "No. Just an email." },
  { q: "Will my data be used to train AI?", a: "No. Topperly chats are private to your account. We do not train any model on student conversations." },
  { q: "Can I attach my own notes?", a: "Yes. The chat composer accepts up to four image or PDF attachments per message." },
  { q: "Does it work offline?", a: "No, but PDFs, worksheets, decks, and code can be downloaded once generated." },
  { q: "How is this different from ChatGPT?", a: "Topperly is built around the artifact panel. A normal chat hands you a paragraph; Topperly produces a quiz, worksheet, simulation, or runnable code in a side panel that you can edit, export, or print." },
];

const BOUNDARIES = [
  "File ingestion is for images and PDFs, max 4 attachments per message.",
  "Web search is an optional toggle, not always-on research.",
  "Thinking blocks are a surfaced UI trace, not the model's hidden reasoning.",
  "Flashcards are a flippable navigable deck — full spaced-repetition is on the roadmap.",
  "Web App produces a single self-contained HTML artifact, not a multi-file production scaffold.",
  "Python IDE runs browser-compatible Python in an in-browser runtime.",
  "Google Doc Draft previews and copies content, opens a new Google Doc — not a fully embedded Docs editor.",
  "Google Sheet pre-fill depends on Google client configuration in the environment.",
  "Canva Design Spec produces a creative brief, not a native Canva file.",
  "Not yet built: live team collaboration, multi-user editing, enterprise admin, voice mode, native mobile app.",
];

export function AccessPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/waitlist")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && typeof d.count === "number" && setCount(d.count))
      .catch(() => setCount(247));
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      setStatus("success");
      setMessage(data.message || "You're on the list. Check your inbox.");
      if (typeof data.count === "number") setCount(data.count);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  return (
    <>
      {/* Header + form */}
      <section className="relative isolate overflow-hidden border-b border-hairline pt-32 pb-28 md:pt-44 md:pb-36">
        <div aria-hidden className="page-haze pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-[640px] px-6 text-center md:px-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-7 inline-flex items-center gap-2 text-[13px] text-[var(--color-muted)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
            Beta access
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.06 }}
            className="text-balance font-medium tracking-display-tight text-[clamp(40px,6.5vw,88px)] leading-[1.04] text-[var(--color-ink)]"
          >
            Be first in.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.12 }}
            className="mx-auto mt-6 max-w-[52ch] text-[16.5px] leading-[1.6] text-[var(--color-ink-dim)]"
          >
            Drop your email. We invite in small waves so every early user gets real attention, not a form letter.
          </motion.p>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.18 }}
            className="mx-auto mt-9 flex w-full max-w-[480px] flex-col gap-2 sm:flex-row"
            noValidate
          >
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@gmail.com"
              className="flex-1 rounded-xl border border-hairline-bright bg-[var(--color-surface)]/80 px-4 py-3 text-[14.5px] text-[var(--color-ink)] placeholder:text-[var(--color-muted)] outline-none transition-colors focus:border-[var(--color-ink-dim)]"
              disabled={status === "loading" || status === "success"}
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-ink)] px-5 py-3 text-[14px] font-medium text-[var(--color-bg)] transition-transform hover:scale-[1.015] disabled:opacity-70"
            >
              {status === "loading" ? "Sending..." : status === "success" ? "Invited" : "Join waitlist"}
            </button>
          </motion.form>

          {message ? (
            <p
              role="status"
              className={`mt-4 text-[13.5px] ${
                status === "error" ? "text-[oklch(72%_0.15_30)]" : "text-[var(--color-accent-hi)]"
              }`}
            >
              {message}
            </p>
          ) : null}

          {count !== null ? (
            <div className="mt-8 text-[13px] text-[var(--color-muted)]">
              <span className="text-[var(--color-ink)]">{count.toLocaleString("en-IN")}</span> already in line
            </div>
          ) : null}
        </div>
      </section>

      {/* Waves */}
      <section id="waves" className="border-b border-hairline bg-[var(--color-surface-alt)] py-24 md:py-32">
        <div className="mx-auto w-full max-w-[920px] px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-12"
          >
            <h2 className="max-w-[26ch] font-medium tracking-display text-[clamp(28px,4vw,48px)] leading-[1.1] text-[var(--color-ink)]">
              Four waves. Then the door opens.
            </h2>
            <p className="mt-5 max-w-[58ch] text-[15.5px] leading-[1.65] text-[var(--color-ink-dim)]">
              Each wave is small enough that we can read every message and act on real feedback before the next group lands.
            </p>
          </motion.div>

          <ol>
            {WAVES.map((w, i) => (
              <motion.li
                key={w.n}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.04 + i * 0.05 }}
                className="grid grid-cols-[80px_1fr_70px] items-baseline gap-4 border-t border-hairline py-5 md:grid-cols-[100px_140px_1fr_90px] md:gap-6"
              >
                <span className="text-[13.5px] text-[var(--color-ink)]">{w.n}</span>
                <span className="hidden text-[13px] text-[var(--color-muted)] md:block">{w.date}</span>
                <span className="text-[14px] text-[var(--color-ink-dim)]">{w.who}</span>
                <span className="text-right text-[12.5px] text-[var(--color-muted)]">{w.state}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-hairline py-24 md:py-32">
        <div className="mx-auto w-full max-w-[760px] px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-10"
          >
            <h2 className="max-w-[24ch] font-medium tracking-display text-[clamp(28px,4vw,48px)] leading-[1.1] text-[var(--color-ink)]">
              Things students keep asking.
            </h2>
          </motion.div>

          <dl className="divide-y divide-[var(--color-hairline)]">
            {FAQ.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.55, ease: EASE, delay: 0.04 + i * 0.04 }}
                className="grid grid-cols-1 gap-3 py-7 md:grid-cols-[260px_1fr] md:gap-12"
              >
                <dt className="text-[15.5px] font-medium tracking-[-0.012em] text-[var(--color-ink)]">
                  {row.q}
                </dt>
                <dd className="text-[14.5px] leading-[1.65] text-[var(--color-ink-dim)]">{row.a}</dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </section>

      {/* Boundaries */}
      <section className="border-b border-hairline bg-[var(--color-surface-alt)] py-24 md:py-32">
        <div className="mx-auto w-full max-w-[760px] px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-10"
          >
            <h2 className="max-w-[24ch] font-medium tracking-display text-[clamp(28px,4vw,44px)] leading-[1.1] text-[var(--color-ink)]">
              The boundaries, in writing.
            </h2>
            <p className="mt-5 text-[15.5px] leading-[1.65] text-[var(--color-ink-dim)]">
              We'd rather under-promise than blur the truth. If a feature isn't here, you'll find it in this list before you find it in the marketing.
            </p>
          </motion.div>

          <ul className="divide-y divide-[var(--color-hairline)]">
            {BOUNDARIES.map((row, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.03 + i * 0.03 }}
                className="py-5 text-[14px] leading-[1.6] text-[var(--color-ink-dim)]"
              >
                {row}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
