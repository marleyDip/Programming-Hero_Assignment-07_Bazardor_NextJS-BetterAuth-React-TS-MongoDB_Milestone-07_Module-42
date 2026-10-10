import Link from "next/link";

const SIZES = {
  sm: {
    box: "size-9 rounded-xl",
    glyph: 20,
    text: "text-lg",
    tag: "text-[10px]",
  },
  md: {
    box: "size-11 rounded-2xl",
    glyph: 24,
    text: "text-xl",
    tag: "text-[11px]",
  },
  lg: {
    box: "size-14 rounded-[1.1rem]",
    glyph: 30,
    text: "text-3xl",
    tag: "text-xs",
  },
} as const;

/** The icon only (gradient squircle + shopping bag with a rising price line). */
export function LogoMark({
  size = "md",
  className = "",
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];

  return (
    <span
      aria-hidden
      className={`relative grid shrink-0 place-items-center overflow-hidden bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/30 ring-1 ring-white/20 ${s.box} ${className}`}
    >
      {/* gloss */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-b-[100%] bg-white/15" />

      <svg
        width={s.glyph}
        height={s.glyph}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="relative"
      >
        <path d="M5 8h14l-1 11a2 2 0 0 1-2 1.8H8A2 2 0 0 1 6 19L5 8z" />

        <path d="M9 8V7a3 3 0 0 1 6 0v1" />

        <path d="M8.5 16.2l2.4-2.6 2 1.4 3.1-3.8" />

        <circle cx="16" cy="11.2" r="1.1" fill="#fbbf24" stroke="none" />
      </svg>
    </span>
  );
}

/** Mark + wordmark. `tone="light"` is for dark / gradient backgrounds. */
export default function Logo({
  size = "md",
  tone = "default",
  showText = true,
  tagline = false,
  href = "/",
  className = "",
}: {
  size?: keyof typeof SIZES;
  tone?: "default" | "light";
  showText?: boolean;
  tagline?: boolean;
  href?: string | null;
  className?: string;
}) {
  const s = SIZES[size];
  const light = tone === "light";

  const content = (
    <>
      <LogoMark
        size={size}
        className={`transition-transform duration-300 group-hover/logo:-rotate-6 group-hover/logo:scale-105 ${
          light ? "ring-white/40" : ""
        }`}
      />

      {showText && (
        <span className="flex flex-col leading-none">
          <span
            className={`font-black tracking-tight ${s.text} ${
              light ? "text-white" : "text-neutral"
            }`}
          >
            বাজার{" "}
            <span className={light ? "text-amber-300" : "text-primary"}>
              দর
            </span>
          </span>

          {tagline && (
            <span
              className={`mt-1 font-semibold ${s.tag} ${
                light ? "text-white/70" : "text-slate-500"
              }`}
            >
              আজকের বাজারদর, এক নজরে
            </span>
          )}
        </span>
      )}
    </>
  );

  const base = `group/logo inline-flex items-center gap-2.5 ${className}`;

  return href ? (
    <Link
      href={href}
      aria-label="বাজার দর – হোম"
      className={`${base} rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2`}
    >
      {content}
    </Link>
  ) : (
    <span className={base}>{content}</span>
  );
}
