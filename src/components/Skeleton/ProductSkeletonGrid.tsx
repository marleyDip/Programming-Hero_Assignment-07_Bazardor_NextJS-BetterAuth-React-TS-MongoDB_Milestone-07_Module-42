import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductSkeletonGrid({
  count = 6,
  compact = false,
}: {
  count?: number;
  compact?: boolean;
}) {
  return (
    <div
      aria-label="পণ্য লোড হচ্ছে"
      aria-busy="true"
      role="status"
      aria-live="polite"
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }, (_, index) => (
        <ProductCardSkeleton key={index} compact={compact} />
      ))}
    </div>
  );
}
