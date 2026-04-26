import { Link } from "react-router-dom";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto grid w-full max-w-[var(--container-page)] grid-cols-1 gap-12 px-6 py-16 md:grid-cols-[1.6fr_1fr_1fr] md:px-8">
        <div className="flex flex-col gap-3">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo size={22} className="text-[var(--color-ink)]" />
            <span className="text-[15px] font-medium text-[var(--color-ink)]">Topperly</span>
          </Link>
          <p className="max-w-[36ch] text-[13.5px] leading-[1.6] text-[var(--color-ink-dim)]">
            A study workspace where every question becomes something you can use. Cursor, but for CBSE students.
          </p>
          <span className="mt-2 text-[12px] text-[var(--color-muted)]">
            Topperly · 2026 · Made in India
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-[13px] font-medium text-[var(--color-ink)]">Pages</div>
          <ul className="flex flex-col gap-2.5 text-[13.5px] text-[var(--color-ink-dim)]">
            <li><Link to="/" className="transition-colors hover:text-[var(--color-ink)]">Home</Link></li>
            <li><Link to="/story" className="transition-colors hover:text-[var(--color-ink)]">Our story</Link></li>
            <li><Link to="/access" className="transition-colors hover:text-[var(--color-ink)]">Get access</Link></li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <div className="text-[13px] font-medium text-[var(--color-ink)]">Reach us</div>
          <ul className="flex flex-col gap-2.5 text-[13.5px] text-[var(--color-ink-dim)]">
            <li>
              <a href="mailto:hi@topperly.app" className="transition-colors hover:text-[var(--color-ink)]">
                hi@topperly.app
              </a>
            </li>
            <li><Link to="/access#waves" className="transition-colors hover:text-[var(--color-ink)]">How invites work</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
