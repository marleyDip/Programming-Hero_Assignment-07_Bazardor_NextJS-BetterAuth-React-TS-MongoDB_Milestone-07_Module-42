export default function ProductLoading() {
  return (
    <main
      role="status"
      aria-busy="true"
      aria-label="লোড হচ্ছে"
      className="mx-auto max-w-6xl px-4 py-6 sm:py-8"
    >
      <div className="mb-4 h-4 w-32 animate-pulse rounded bg-slate-100" />

      <div className="mb-6 flex animate-pulse items-center gap-3">
        <div className="size-14 rounded-2xl bg-slate-100" />
        <div className="space-y-2">
          <div className="h-7 w-64 max-w-[60vw] rounded bg-slate-200" />
          <div className="h-3.5 w-48 rounded bg-slate-100" />
        </div>
      </div>

      <div className="mb-4 flex animate-pulse flex-col gap-3 sm:flex-row">
        <div className="h-12 flex-1 rounded-2xl bg-slate-100" />
        <div className="h-12 rounded-2xl bg-slate-100 sm:w-60" />
      </div>

      <div className="mb-5 flex animate-pulse gap-2 overflow-hidden">
        {[28, 24, 20, 24, 20, 28, 24].map((w, i) => (
          <div
            key={i}
            className="h-10 shrink-0 rounded-full bg-slate-100"
            style={{ width: `${w * 4}px` }}
          />
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            aria-hidden
            className="flex animate-pulse items-center gap-4 rounded-2xl border border-base-300 bg-white p-4"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="size-14 shrink-0 rounded-2xl bg-slate-100" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-slate-200" />
              <div className="h-3 w-1/3 rounded bg-slate-100" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="h-5 w-14 rounded bg-slate-200" />
              <div className="h-5 w-16 rounded-full bg-slate-100" />
            </div>
          </div>
        ))}
      </div>

      <span className="sr-only">লোড হচ্ছে…</span>
    </main>
  );
}
