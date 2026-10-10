export default function AuthSkeleton({ fields = 2 }: { fields?: number }) {
  const bar = "rounded bg-slate-200";

  return (
    <section
      role="status"
      aria-busy="true"
      aria-label="লোড হচ্ছে"
      className="relative isolate mx-auto flex min-h-[78vh] max-w-6xl items-center justify-center px-4 py-8 sm:py-12"
    >
      <div className="grid w-full max-w-5xl overflow-hidden rounded-4xl border border-base-300 bg-white shadow-2xl shadow-primary/10 lg:grid-cols-[1.05fr_1fr]">
        {/* Brand panel (desktop) */}
        <aside className="relative hidden overflow-hidden bg-linear-to-br from-primary/30 via-primary/20 to-secondary/30 p-10 lg:flex lg:flex-col">
          <div className="flex animate-pulse items-center gap-2.5">
            <div className="size-11 rounded-2xl bg-white/60" />
            <div className="space-y-2">
              <div className="h-5 w-28 rounded bg-white/60" />
              <div className="h-3 w-36 rounded bg-white/40" />
            </div>
          </div>

          <div className="mt-12 animate-pulse space-y-3">
            <div className="h-9 w-4/5 rounded bg-white/60" />
            <div className="h-9 w-2/5 rounded bg-white/60" />
          </div>

          <ul className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="flex animate-pulse items-start gap-3"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="size-10 shrink-0 rounded-xl bg-white/50" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 w-1/2 rounded bg-white/60" />
                  <div className="h-3 w-4/5 rounded bg-white/40" />
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-auto flex animate-pulse gap-2 pt-10">
            <div className="h-10 w-44 rounded-full bg-white/60" />
            <div className="h-10 w-36 rounded-full bg-white/60" />
          </div>
        </aside>

        {/* Form side */}
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <div className="mx-auto w-full max-w-sm animate-pulse">
            {/* top row: logo (mobile) & back pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 lg:hidden">
                <div className="size-9 rounded-xl bg-slate-200" />
                <div className={`h-5 w-20 ${bar}`} />
              </div>
              <div className="ml-auto h-8 w-28 rounded-full bg-slate-100 lg:ml-0" />
            </div>

            {/* title & subtitle */}
            <div className={`mt-8 h-8 w-3/4 ${bar}`} />
            <div className="mt-3 space-y-2">
              <div className="h-3.5 w-full rounded bg-slate-100" />
              <div className="h-3.5 w-2/3 rounded bg-slate-100" />
            </div>

            {/* form */}
            <div className="mt-7 space-y-4">
              <div className="h-12 w-full rounded-2xl border border-base-300 bg-white" />

              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-base-300" />
                <span className="h-3 w-8 rounded bg-slate-100" />
                <span className="h-px flex-1 bg-base-300" />
              </div>

              {Array.from({ length: fields }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3.5 w-24 rounded bg-slate-200" />
                  <div className="h-12 w-full rounded-2xl bg-slate-100" />
                </div>
              ))}

              <div className="flex items-center justify-between">
                <div className="h-4 w-20 rounded bg-slate-100" />
                <div className="h-4 w-32 rounded bg-slate-100" />
              </div>

              <div className="h-12 w-full rounded-2xl bg-primary/25" />
            </div>

            {/* footer */}
            <div className="mt-7 flex justify-center border-t border-base-300/70 pt-5">
              <div className="h-4 w-48 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      </div>

      <span className="sr-only">লোড হচ্ছে…</span>
    </section>
  );
}
