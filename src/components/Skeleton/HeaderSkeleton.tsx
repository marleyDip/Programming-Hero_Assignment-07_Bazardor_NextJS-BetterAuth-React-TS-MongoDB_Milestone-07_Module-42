// Server-safe: no hooks, no "use client" needed.

const PILL_WIDTHS = [
  "w-24",
  "w-20",
  "w-16",
  "w-24",
  "w-20",
  "w-16",
  "w-24",
  "w-20",
];

/** Only the category row, reusable inside <Header /> when categories are empty. */
export function NavSkeleton() {
  return (
    <ul aria-hidden className="flex min-w-max items-center gap-1 pb-3">
      {PILL_WIDTHS.map((w, i) => (
        <li key={i}>
          <div className={`skeleton h-9 ${w} rounded-full`} />
        </li>
      ))}
    </ul>
  );
}

/** Full header skeleton: same heights/spacing as <Header /> to avoid layout shift. */
export default function HeaderSkeleton() {
  return (
    <header
      role="status"
      aria-busy="true"
      aria-label="লোড হচ্ছে"
      className="sticky top-0 z-40 border-b border-base-300/70 bg-white/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Row 1: logo & auth */}
        <div className="flex items-center justify-between gap-3 py-3">
          {/* Logo: icon + wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="skeleton size-10 rounded-xl" />
            <div className="hidden space-y-1.5 sm:block">
              <div className="skeleton h-4 w-28 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
            </div>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-2">
            <div className="skeleton h-10 w-20 rounded-xl" />
            <div className="skeleton h-10 w-24 rounded-xl" />
          </div>
        </div>

        {/* Row 2: category pills */}
        <div className="-mx-4 overflow-hidden px-4">
          <NavSkeleton />
        </div>
      </div>
    </header>
  );
}
