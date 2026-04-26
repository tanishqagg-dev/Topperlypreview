import { NavLink, Link } from "react-router-dom";
import { Logo } from "./Logo";

const LINKS = [
  { to: "/story", label: "Story" },
  { to: "/access", label: "Access" },
];

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-hairline bg-[var(--color-bg)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[var(--container-page)] items-center justify-between px-6 md:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <Logo size={22} className="text-[var(--color-ink)]" />
          <span className="text-[15px] font-medium tracking-[-0.012em] text-[var(--color-ink)]">
            Topperly
          </span>
          <span className="ml-1 text-[11.5px] text-[var(--color-muted)]">Beta</span>
        </Link>

        <nav className="hidden items-center gap-8 text-[14px] md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `transition-colors ${
                  isActive
                    ? "text-[var(--color-ink)]"
                    : "text-[var(--color-ink-dim)] hover:text-[var(--color-ink)]"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <Link
          to="/access"
          className="inline-flex items-center gap-2 rounded-full bg-[var(--color-ink)] px-4 py-1.5 text-[13px] font-medium text-[var(--color-bg)] transition-transform hover:scale-[1.015]"
        >
          Get access
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 5.5h7M6 2.5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
