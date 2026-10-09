import HeroSkeleton from "@/components/Skeleton/HeroSkeleton";
import ProductSkeletonGrid from "@/components/Skeleton/ProductSkeletonGrid";

export default function Loading() {
  return (
    <main className="w-full min-w-0 flex-1">
      <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-0">
        <HeroSkeleton />

        {/* <section className="py-7">
          <div className="mb-5 h-7 w-48 animate-pulse rounded-lg bg-slate-200" />
          <ProductSkeletonGrid count={6} compact />
        </section> */}

        <section className="py-7">
          {/* rail header */}
          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <div className="animate-pulse bg-slate-200 size-10 shrink-0 rounded-xl motion-reduce:animate-none" />

            <div className="space-y-2">
              <div className="animate-pulse bg-slate-200 h-5 w-40 rounded-md motion-reduce:animate-none" />
              <div className="animate-pulse bg-slate-200 h-3 w-52 rounded-md motion-reduce:animate-none" />
            </div>
          </div>

          <ProductSkeletonGrid count={6} compact />
        </section>

        {/* <section className="py-7">
          <div className="mb-5 h-7 w-48 animate-pulse rounded-lg bg-slate-200" />
          <ProductSkeletonGrid count={6} compact />
        </section> */}

        <section className="py-7">
          {/* rail header */}
          <div className="mb-4 flex items-center gap-3 sm:mb-5">
            <div className="animate-pulse bg-slate-200 size-10 shrink-0 rounded-xl motion-reduce:animate-none" />

            <div className="space-y-2">
              <div className="animate-pulse bg-slate-200 h-5 w-40 rounded-md motion-reduce:animate-none" />
              <div className="animate-pulse bg-slate-200 h-3 w-52 rounded-md motion-reduce:animate-none" />
            </div>
          </div>

          <ProductSkeletonGrid count={6} compact />
        </section>

        {/* <section className="py-7">
          <div className="mb-5 h-8 w-36 animate-pulse rounded-lg bg-slate-200" />
          <ProductSkeletonGrid count={9} />
        </section> */}

        {/* all products */}
        <section className="py-8">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <div className="animate-pulse bg-slate-200 h-3 w-20 rounded-md motion-reduce:animate-none" />
              <div className="animate-pulse bg-slate-200 h-8 w-36 rounded-md motion-reduce:animate-none" />
              <div className="animate-pulse bg-slate-200 h-4 w-56 rounded-md motion-reduce:animate-none" />
            </div>
            <div className="animate-pulse bg-slate-200 h-8 w-32 rounded-full motion-reduce:animate-none" />
          </div>

          <ProductSkeletonGrid count={9} />
        </section>
      </div>
    </main>
  );
}
