import ProductCardSkeleton from "./ProductCardSkeleton";

function RailSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="py-7">
      {/* rail header */}
      <div className="mb-4 flex items-center gap-3 sm:mb-5">
        <div className="animate-pulse bg-slate-100 size-10 shrink-0 rounded-xl motion-reduce:animate-none" />

        <div className="space-y-2">
          <div className="animate-pulse bg-slate-100 h-5 w-40 rounded-md motion-reduce:animate-none" />
          <div className="animate-pulse bg-slate-100 h-3 w-52 rounded-md motion-reduce:animate-none" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton
            key={i}
            compact
            // show fewer cards on small screens so the page isn't a wall of boxes
          />
        ))}
      </div>
    </section>
  );
}

export default function ProductSectionsSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-live="polite"
      className="mx-auto max-w-6xl px-4 pb-14 sm:px-0"
    >
      <span className="sr-only">পণ্যের দাম লোড হচ্ছে…</span>

      <RailSkeleton />
      <RailSkeleton />

      {/* all products */}
      <section className="py-8">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <div className="skeleton h-3 w-20 rounded-md motion-reduce:animate-none" />
            <div className="skeleton h-8 w-36 rounded-md motion-reduce:animate-none" />
            <div className="skeleton h-4 w-56 rounded-md motion-reduce:animate-none" />
          </div>
          <div className="skeleton h-8 w-32 rounded-full motion-reduce:animate-none" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </section>
    </div>
  );
}
