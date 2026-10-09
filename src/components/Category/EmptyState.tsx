import Link from "next/link";

export default function EmptyState({
  code,
  emoji = "🧺",
  title,
  description,
  ctaHref = "/",
  ctaLabel = "হোম পেজে ফিরে যান",
}: {
  code?: string; // e.g. "৪০৪"
  emoji?: string;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16 text-center sm:py-24">
      <div className="relative mb-6 grid size-28 place-items-center rounded-full bg-primary/10 text-6xl">
        <span aria-hidden>{emoji}</span>
        <span
          aria-hidden
          className="absolute -right-1 -top-1 grid size-9 place-items-center rounded-full border-4 border-white bg-white text-xl shadow"
        >
          🔍
        </span>
      </div>

      {code && (
        <p className="mb-1 text-5xl font-extrabold tracking-tight text-primary/80">
          {code}
        </p>
      )}

      <h1 className="text-xl font-bold text-neutral sm:text-2xl">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-slate-500 sm:text-base">
        {description}
      </p>

      <Link
        href={ctaHref}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-content shadow-sm shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
