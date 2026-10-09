import ProductSkeletonGrid from "../Skeleton/ProductSkeletonGrid";

export default function CategoryLoading() {
  return (
    <main
      aria-label="ক্যাটাগরি লোড হচ্ছে"
      aria-busy="true"
      className="mx-auto min-h-screen w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pt-10"
    >
      {/* Breadcrumb skeleton */}
      <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />

      {/* Category banner skeleton */}
      <section className="mt-6 rounded-3xl border border-base-300/80 bg-base-100 p-5 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="size-20 shrink-0 animate-pulse rounded-2xl bg-green-50 sm:size-24" />

          <div className="flex-1 space-y-3">
            <div className="h-3 w-32 animate-pulse rounded bg-slate-100" />
            <div className="h-9 w-48 max-w-full animate-pulse rounded-lg bg-slate-200 sm:w-64" />
            <div className="h-4 w-full max-w-md animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-3/4 max-w-sm animate-pulse rounded bg-slate-100" />
            <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
          </div>
        </div>
      </section>

      {/* Section heading and sort skeleton */}
      <section className="pt-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="h-8 w-36 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-4 w-64 max-w-full animate-pulse rounded bg-slate-100" />
          </div>

          <div className="h-11 w-56 max-w-full animate-pulse rounded-xl bg-slate-100" />
        </div>

        <ProductSkeletonGrid count={9} />
      </section>
    </main>
  );
}
