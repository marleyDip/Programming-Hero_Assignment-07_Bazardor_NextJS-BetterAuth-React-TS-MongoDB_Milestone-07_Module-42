import NotFoundActions from "@/components/Common/NotFoundActions";
import { fetchCategories } from "@/lib/api";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "পাতাটি খুঁজে পাওয়া যায়নি",
};

// decorative price tags that float around the 404
const TAGS = [
  {
    text: "🍚 ৳০",
    pos: "left-[4%] top-[8%] sm:left-[10%]",
    delay: "0s",
    tone: "bg-emerald-100 text-emerald-700",
  },

  {
    text: "🧅 ▲ ?%",
    pos: "right-[4%] top-[14%] sm:right-[10%]",
    delay: "0.6s",
    tone: "bg-rose-100 text-rose-700",
  },

  {
    text: "🥚 ৳ ???",
    pos: "left-[2%] bottom-[18%] sm:left-[8%]",
    delay: "1.1s",
    tone: "bg-amber-100 text-amber-700",
  },

  {
    text: "🐟 ▼ ?%",
    pos: "right-[2%] bottom-[12%] sm:right-[9%]",
    delay: "1.6s",
    tone: "bg-sky-100 text-sky-700",
  },
] as const;

export default async function NotFound() {
  const categories = (await fetchCategories().catch(() => [])).slice(0, 8);

  return (
    <main className="relative isolate mx-auto flex min-h-[78vh] max-w-6xl items-center justify-center overflow-hidden px-4 py-14">
      {/* background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 size-136 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.35) 1px, transparent 0)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
          }}
        />
      </div>

      {/* floating tags */}
      {TAGS.map((t) => (
        <span
          key={t.text}
          aria-hidden
          className={`pointer-events-none absolute hidden rounded-full px-3.5 py-1.5 text-sm font-extrabold shadow-lg shadow-black/5 ring-1 ring-black/5 animate-bounce [animation-duration:3.5s] motion-reduce:animate-none min-[480px]:block ${t.pos} ${t.tone}`}
          style={{ animationDelay: t.delay }}
        >
          {t.text}
        </span>
      ))}

      <div className="relative w-full max-w-2xl text-center">
        {/* ৪ [bag - Logo] ৪ */}
        <div
          role="img"
          aria-label="৪০৪"
          className="flex select-none items-center justify-center gap-2 sm:gap-4"
        >
          <span
            aria-hidden
            className="bg-linear-to-b from-primary to-primary-foreground bg-clip-text text-[6.5rem] font-black leading-none text-transparent sm:text-[10rem]"
          >
            ৪
          </span>

          {/* Logo */}
          <span
            aria-hidden
            className="relative grid size-24 shrink-0 -rotate-6 place-items-center overflow-hidden rounded-[1.6rem] bg-linear-to-br from-primary to-primary-foreground shadow-2xl shadow-primary/40 ring-1 ring-white/30 transition-transform duration-500 hover:rotate-6 hover:scale-110 sm:size-36 sm:rounded-[2.2rem]"
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-b-[100%] bg-white/15" />
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="relative size-14 sm:size-20"
            >
              <path d="M5 8h14l-1 11a2 2 0 0 1-2 1.8H8A2 2 0 0 1 6 19L5 8z" />
              <path d="M9 8V7a3 3 0 0 1 6 0v1" />
              {/* a sad, flat price line */}
              <path d="M8.5 15.5h7" />
              <circle cx="16" cy="15.5" r="1.1" fill="#fbbf24" stroke="none" />
            </svg>
          </span>

          <span
            aria-hidden
            className="bg-linear-to-b from-primary to-primary-foreground bg-clip-text text-[6.5rem] font-black leading-none text-transparent sm:text-[10rem]"
          >
            ৪
          </span>
        </div>

        <h1 className="mt-6 text-2xl font-black tracking-tight text-neutral sm:text-4xl">
          এই পাতার দাম খুঁজে পাওয়া যাচ্ছে না!
        </h1>

        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600 sm:text-base">
          আপনি যে লিংকটি খুলেছেন সেটি হয়তো ভুল, অথবা পাতাটি সরিয়ে নেওয়া
          হয়েছে। চিন্তা নেই, নিচ থেকে সঠিক জায়গায় চলে যান।
        </p>

        <NotFoundActions />

        {categories.length > 0 && (
          <div className="mt-12">
            <p className="mb-3 text-xs font-extrabold tracking-wide text-slate-400">
              অথবা দেখুন জনপ্রিয় ক্যাটাগরি
            </p>

            <ul className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    className="group inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-white px-3.5 py-2 text-sm font-bold text-neutral/80 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:text-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    <span
                      aria-hidden
                      className="transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-125"
                    >
                      {c.emoji}
                    </span>
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
