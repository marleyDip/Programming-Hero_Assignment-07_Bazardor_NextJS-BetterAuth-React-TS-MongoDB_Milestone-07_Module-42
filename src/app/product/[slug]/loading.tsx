export default function ProductPageLoading() {
  return (
    <main
      role="status"
      aria-busy="true"
      aria-label="লোড হচ্ছে"
      className="mx-auto max-w-6xl animate-pulse space-y-10 px-4 py-6 sm:py-8"
    >
      <div className="h-4 w-48 rounded bg-slate-100" />

      {/* Hero */}
      <div className="grid items-center gap-8 rounded-4xl border border-base-300 bg-white p-6 sm:p-10 md:grid-cols-[auto_1fr_auto]">
        <div className="mx-auto size-32 rounded-[2.25rem] bg-slate-200/70 sm:size-36 md:mx-0" />

        <div className="space-y-3">
          <div className="mx-auto h-7 w-24 rounded-full bg-slate-100 md:mx-0" />
          <div className="mx-auto h-10 w-64 max-w-full rounded bg-slate-200 md:mx-0" />
          <div className="mx-auto h-4 w-28 rounded bg-slate-100 md:mx-0" />
        </div>

        <div className="mx-auto h-36 w-full rounded-3xl bg-slate-100 md:mx-0 md:w-60" />
      </div>

      {/* Chart */}
      <div className="space-y-4">
        <div className="h-8 w-48 rounded bg-slate-200" />

        <div className="h-80 rounded-3xl border border-base-300 bg-white" />
      </div>

      {/* Markets */}
      <div className="space-y-4">
        <div className="h-8 w-56 rounded bg-slate-200" />
        <div className="grid gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-slate-100" />
          ))}
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl border border-base-300 bg-white"
          />
        ))}
      </div>

      <span className="sr-only">লোড হচ্ছে…</span>
    </main>
  );
}
