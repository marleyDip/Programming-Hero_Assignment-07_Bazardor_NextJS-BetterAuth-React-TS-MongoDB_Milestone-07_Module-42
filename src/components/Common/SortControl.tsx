import Link from "next/link";

export const SORT_OPTIONS = [
  { key: "default", label: "ডিফল্ট" },
  { key: "price-asc", label: "দাম: কম থেকে বেশি" },
  { key: "price-desc", label: "দাম: বেশি থেকে কম" },
] as const;

export type SortKey = (typeof SORT_OPTIONS)[number]["key"];

export function parseSort(value: string | string[] | undefined): SortKey {
  const v = Array.isArray(value) ? value[0] : value;
  return SORT_OPTIONS.some((o) => o.key === v) ? (v as SortKey) : "default";
}

/**
 * Server component: each option is a link (?sort=...), so sorting works
 * without client JS and the URL is shareable.
 */
export default function SortControl({
  basePath,
  active,
}: {
  basePath: string;
  active: SortKey;
}) {
  return (
    <div
      role="group"
      aria-label="সাজান"
      className="-mx-4 flex items-center gap-2 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
    >
      <span className="hidden md:inline-block shrink-0 text-sm font-semibold text-slate-500">
        সাজান:
      </span>

      <div className="flex shrink-0 gap-1 rounded-full border border-base-300 bg-white p-1 shadow-sm">
        {SORT_OPTIONS.map((o) => {
          const isActive = o.key === active;

          return (
            <Link
              key={o.key}
              href={
                o.key === "default" ? basePath : `${basePath}?sort=${o.key}`
              }
              replace
              scroll={false}
              aria-current={isActive ? "true" : undefined}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors hover:shadow duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 ${
                isActive
                  ? "bg-primary text-primary-content shadow-sm shadow-primary/30"
                  : "text-neutral/70 hover:bg-primary/10 hover:text-primary"
              }`}
            >
              {o.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
