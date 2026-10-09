export default function ProductCardSkeleton({
  compact = false,
}: {
  compact?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={`
        flex h-full flex-col rounded-2xl border border-base-300/80
        bg-base-100 p-4 shadow-sm sm:p-5
        ${compact ? "min-h-40" : "min-h-48"}
      `}
    >
      {/* Product information */}
      {/* top: emoji chip + name/unit + price badge */}
      <div className="flex items-start gap-3.5">
        <div className="size-14 shrink-0 animate-pulse rounded-2xl bg-slate-100 sm:size-16 motion-reduce:animate-none" />

        <div className="min-w-0 flex-1 space-y-2 pt-1">
          <div className="h-4 w-3/4 animate-pulse rounded-md bg-slate-100 motion-reduce:animate-none" />

          <div className="h-3 w-1/3 animate-pulse rounded-md bg-slate-100 motion-reduce:animate-none" />

          {/* category badge */}
          <div className="mt-3 h-6 w-24 rounded-full animate-pulse bg-slate-100 motion-reduce:animate-none" />

          {/* <div className="h-2.5 w-2/5 animate-pulse rounded-md bg-slate-50 motion-reduce:animate-none" /> */}
        </div>

        <div className="size-7 shrink-0 animate-pulse rounded-full bg-slate-50 motion-reduce:animate-none" />
      </div>

      {/* divider */}
      <div className="my-4 border-t border-dashed border-slate-200" />

      {/* bottom: price + arrow */}
      <div className="mt-auto flex items-end justify-between gap-3">
        <div className="space-y-2 text-left">
          <div className="h-3 w-16 animate-pulse rounded bg-slate-100 motion-reduce:animate-none" />

          <div className="h-6 w-28 animate-pulse rounded-md bg-slate-100 motion-reduce:animate-none" />
        </div>

        <div className="h-7 w-16 animate-pulse rounded-full bg-slate-100 motion-reduce:animate-none" />
      </div>
    </div>
  );
}
