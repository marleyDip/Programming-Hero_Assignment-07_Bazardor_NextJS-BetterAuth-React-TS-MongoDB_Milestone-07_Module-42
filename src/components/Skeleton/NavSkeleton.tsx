// Pure Tailwind (no DaisyUI). Server-safe: no hooks, no "use client".

const PILLS = [
  { w: "w-28", label: "w-12" }, // "সব পণ্য"
  { w: "w-24", label: "w-9" },
  { w: "w-24", label: "w-10" },
  { w: "w-20", label: "w-7" },
  { w: "w-28", label: "w-12" },
  { w: "w-24", label: "w-9" },
  { w: "w-20", label: "w-8" },
  { w: "w-28", label: "w-12" },
] as const;

/**
 * <li> placeholders. Use inside the existing <ul> in Header
 * (same h-9 / rounded-full / gap as the real nav items).
 */
export function NavSkeletonItems({ count = PILLS.length }: { count?: number }) {
  return (
    <>
      {PILLS.slice(0, count).map((p, i) => (
        <li key={i} aria-hidden>
          <div
            className={`flex h-9 ${p.w} animate-pulse items-center gap-2 rounded-full bg-slate-100 px-3.5`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="size-4 shrink-0 rounded-full bg-slate-200" />
            <span className={`h-3 ${p.label} rounded bg-slate-200`} />
          </div>
        </li>
      ))}
    </>
  );
}

/**
 * Full nav-row skeleton with the same wrapper spacing as the real nav.
 * Use as a <Suspense fallback> or loading state.
 */
export default function NavSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="ক্যাটাগরি লোড হচ্ছে"
      className="relative -mx-4"
    >
      <div className="overflow-hidden px-4 pb-3">
        <ul className="flex min-w-max items-center gap-1">
          <NavSkeletonItems />
        </ul>
      </div>

      {/* Right fade, like the real nav */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-linear-to-l from-white to-transparent" />
    </div>
  );
}
