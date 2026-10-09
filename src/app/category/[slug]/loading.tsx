import ProductSkeletonGrid from "@/components/Skeleton/ProductSkeletonGrid";

export default function CategoryPageLoading() {
  return (
    <main
      role="status"
      aria-busy="true"
      aria-label="লোড হচ্ছে"
      className="mx-auto max-w-6xl px-4 py-6 sm:py-8"
    >
      {/* Breadcrumb */}
      <div className="mb-4 h-4 w-28 animate-pulse rounded bg-slate-200/70" />

      {/* Title + sort */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex animate-pulse items-center gap-3">
          <div className="size-14 rounded-2xl bg-slate-200" />

          <div className="space-y-2">
            <div className="h-7 w-40 rounded bg-slate-200" />
            <div className="h-3.5 w-28 rounded bg-slate-200/70" />
          </div>
        </div>

        <div className="h-10 w-full max-w-md animate-pulse rounded-full bg-slate-200 sm:w-96" />
      </div>

      {/* Cards */}
      <ProductSkeletonGrid count={6} compact />

      {/* <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <ProductCardSkeleton key={i} index={i} />
        ))}
      </div> */}

      <span className="sr-only">লোড হচ্ছে…</span>
    </main>
  );
}
