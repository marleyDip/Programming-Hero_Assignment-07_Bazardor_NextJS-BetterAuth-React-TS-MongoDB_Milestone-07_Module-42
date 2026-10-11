import { LogoMark } from "../Auth/Logo";

/**
 * Brand loader: logo mark inside a soft halo, a pulsing ring and a
 * spinning gradient arc. Pure Tailwind, server-safe, motion-reduce aware.
 */
export default function BrandLoader({
  size = "lg",
  className = "",
}: {
  size?: "md" | "lg";
  className?: string;
}) {
  const box = size === "lg" ? "size-28" : "size-[4.5rem]";

  return (
    <div
      aria-hidden
      className={`relative grid shrink-0 place-items-center text-primary ${box} ${className}`}
    >
      {/* soft halo */}
      <span className="absolute inset-3 rounded-full bg-primary/25 blur-xl animate-pulse motion-reduce:animate-none" />

      {/* expanding ring */}
      <span className="absolute inset-3 rounded-full border-2 border-primary/30 animate-ping [animation-duration:2.4s] motion-reduce:animate-none" />

      {/* track */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full">
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.12"
          strokeWidth="3"
        />
      </svg>

      {/* spinning gradient arc */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full animate-spin [animation-duration:1.6s] motion-reduce:animate-none"
      >
        <defs>
          <linearGradient id="brand-loader-arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset="1" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke="url(#brand-loader-arc)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="120 170"
        />
      </svg>

      <LogoMark size={size === "lg" ? "lg" : "md"} />
    </div>
  );
}
