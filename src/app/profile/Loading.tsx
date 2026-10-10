export default function ProfilePageLoading() {
  return (
    <main
      role="status"
      aria-busy="true"
      aria-label="লোড হচ্ছে"
      className="mx-auto max-w-5xl animate-pulse px-4 py-6 sm:py-8"
    >
      <div className="mb-4 h-4 w-40 rounded bg-slate-100" />

      {/* hero */}
      <div className="overflow-hidden rounded-4xl border border-base-300 bg-white">
        <div className="h-32 bg-primary/15 sm:h-40" />

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col gap-3 sm:-mt-14 sm:flex-row sm:items-end sm:gap-5">
            <div className="size-24 rounded-full bg-slate-200 ring-4 ring-white sm:size-28" />

            <div className="space-y-2 sm:pb-1">
              <div className="h-7 w-48 rounded bg-slate-200" />

              <div className="h-4 w-56 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <div className="h-44 rounded-3xl border border-base-300 bg-white" />

          <div className="h-36 rounded-3xl bg-primary/5" />
        </div>

        <div className="space-y-5">
          <div className="h-13 rounded-2xl bg-slate-100" />

          <div className="h-56 rounded-3xl border border-base-300 bg-white" />

          <div className="h-64 rounded-3xl border border-base-300 bg-white" />
        </div>
      </div>

      <span className="sr-only">লোড হচ্ছে…</span>
    </main>
  );
}
