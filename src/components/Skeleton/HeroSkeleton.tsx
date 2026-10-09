export default function HeroSkeleton() {
  return (
    <section
      aria-label="হোমপেজ লোড হচ্ছে"
      aria-busy="true"
      className="relative isolate mx-auto w-full overflow-hidden px-4 py-10 sm:px-6 sm:py-14 lg:py-16"
    >
      <div className="relative overflow-hidden rounded-3xl border border-base-300/80 bg-base-100 p-6 shadow-[0_8px_40px_rgba(20,41,28,0.04)] sm:p-10 lg:p-12">
        {/* Decorative background */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 animate-pulse rounded-full bg-green-100/60 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-20 -left-16 size-56 animate-pulse rounded-full bg-amber-100/40 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          {/* Left: Hero content */}
          <div className="space-y-6">
            {/* Date badge */}
            <div className="flex h-8 w-fit items-center gap-2 rounded-full border border-base-300 bg-base-200 px-3">
              <div className="size-2 animate-pulse rounded-full bg-slate-300" />

              <div className="h-3 w-32 animate-pulse rounded bg-slate-200" />
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <div className="h-9 w-4/5 max-w-md animate-pulse rounded-lg bg-slate-200 sm:h-12 lg:h-14" />

              <div className="h-9 w-3/5 max-w-sm animate-pulse rounded-lg bg-slate-100 sm:h-12 lg:h-14" />
            </div>

            {/* Description */}
            <div className="max-w-lg space-y-2.5">
              <div className="h-4 w-full animate-pulse rounded bg-slate-100" />

              <div className="h-4 w-11/12 animate-pulse rounded bg-slate-100" />

              <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 pt-1">
              <div className="h-12 w-36 animate-pulse rounded-xl bg-green-100" />

              <div className="h-12 w-32 animate-pulse rounded-xl border border-base-300 bg-slate-50" />
            </div>

            {/* Small trust indicators */}
            <div className="flex flex-wrap gap-5 pt-2">
              <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />

              <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
            </div>
          </div>

          {/* Right: Decorative market illustration placeholder */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-green-100/80 bg-linear-to-br from-green-50 to-slate-50 p-5 sm:p-7">
              {/* Floating price cards */}
              <div className="absolute left-4 top-5 w-32 rounded-2xl border border-white bg-white/90 p-3 shadow-sm sm:left-6 sm:top-7">
                <div className="mb-2 size-8 animate-pulse rounded-xl bg-green-100" />

                <div className="mb-2 h-3 w-16 animate-pulse rounded bg-slate-200" />

                <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
              </div>

              <div className="absolute right-4 top-1/3 w-36 rounded-2xl border border-white bg-white/90 p-3 shadow-sm sm:right-6">
                <div className="mb-2 h-3 w-20 animate-pulse rounded bg-slate-100" />

                <div className="mb-2 h-5 w-24 animate-pulse rounded bg-slate-200" />

                <div className="h-3 w-16 animate-pulse rounded bg-green-100" />
              </div>

              {/* Market basket / produce placeholder */}
              <div className="absolute bottom-5 left-1/2 grid size-28 -translate-x-1/2 place-items-center rounded-full bg-white/70 shadow-sm sm:bottom-7 sm:size-36">
                <div className="grid size-20 animate-pulse place-items-center rounded-full bg-green-100/80 text-4xl sm:size-28 sm:text-5xl">
                  <span aria-hidden="true"> </span>
                </div>
              </div>

              {/* Bottom floating card */}
              <div className="absolute bottom-4 right-4 rounded-xl border border-white bg-white/90 px-3 py-2 shadow-sm sm:bottom-6 sm:right-6">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
