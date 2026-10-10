import { MoveLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "./Logo";

const FEATURES = [
  {
    icon: "📊",
    title: "সব বাজারের দাম",
    text: "বিভাগ ধরে তুলনা করুন, সস্তা বাজার খুঁজে নিন",
  },
  {
    icon: "🔔",
    title: "দামের খবর",
    text: "পছন্দের পণ্যের দাম বাড়লে-কমলে জানুন",
  },
  {
    icon: "🧮",
    title: "বাজেট হিসাব",
    text: "কোথায় কিনলে কত সাশ্রয়, এক ক্লিকে দেখুন",
  },
] as const;

const CHIPS = [
  {
    emoji: "🍚",
    name: "স্বর্ণমাছি চাল",
    price: "৳১৪৮",
    change: "▲ ২.১%",
    up: true,
  },
  { emoji: "🧅", name: "পেঁয়াজ", price: "৳৭২", change: "▼ ১.৪%", up: false },
] as const;

export default function AuthHeader({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <section className="relative isolate mx-auto flex min-h-[78vh] max-w-6xl items-center justify-center px-4 py-8 sm:py-12">
      {/* page background glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-128 w-lg -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="grid w-full max-w-5xl overflow-hidden rounded-4xl border border-base-300 bg-white shadow-2xl shadow-primary/10 md:grid-cols-[1.05fr_1fr]">
        {/* Brand panel (desktop) */}
        <aside className="relative hidden overflow-hidden bg-linear-to-br from-primary via-primary to-secondary p-10 text-primary-content md:flex md:flex-col">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-white/15 blur-3xl"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-32 -left-20 size-80 rounded-full bg-black/15 blur-3xl"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative">
            <Logo size="md" tone="light" tagline />
          </div>

          <div className="relative mt-12">
            <h2 className="text-3xl font-black leading-tight xl:text-4xl">
              প্রতিদিনের বাজারদর,
              <br />
              <span className="text-amber-300">এক জায়গায়।</span>
            </h2>

            <ul className="mt-8 space-y-4">
              {FEATURES.map((f) => (
                <li key={f.title} className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/15 text-lg ring-1 ring-white/20 backdrop-blur"
                  >
                    {f.icon}
                  </span>

                  <div>
                    <p className="font-bold">{f.title}</p>

                    <p className="text-sm text-white/75">{f.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* decorative price chips */}
          <div
            aria-hidden
            className="relative mt-auto flex flex-wrap gap-2 pt-10"
          >
            {CHIPS.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-2.5 rounded-full bg-white/95 py-1.5 pl-1.5 pr-3.5 text-sm text-neutral shadow-lg shadow-black/10"
              >
                <span className="grid size-7 place-items-center rounded-full bg-primary/10">
                  {c.emoji}
                </span>

                <span className="font-bold">{c.name}</span>

                <span className="font-extrabold text-primary">{c.price}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    c.up
                      ? "bg-rose-100 text-rose-700"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {c.change}
                </span>
              </div>
            ))}
          </div>
        </aside>

        {/* Form side */}
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <div className="mx-auto w-full max-w-sm">
            <div className="flex items-center justify-between">
              {/* logo on mobile only (desktop has the panel) */}
              <div className="md:hidden">
                <Logo size="sm" />
              </div>

              <Link
                href="/"
                className="group ml-auto inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white/60 px-4 text-xs font-bold text-slate-600 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:text-primary hover:shadow-md hover:shadow-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25 md:ml-0"
              >
                <MoveLeft
                  size={14}
                  className="transition-transform duration-300 cubic-bezier(0.34, 1.56, 0.64, 1) group-hover:-translate-x-1"
                />
                <span>হোমে ফিরুন</span>
              </Link>
            </div>

            <h1 className="mt-8 text-3xl font-black tracking-tight text-neutral">
              {title}
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p>

            <div className="mt-7">{children}</div>

            <div className="mt-7 border-t border-base-300/70 pt-5 text-center text-sm text-slate-600">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 

<Link
  href="/"
  className="group ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold text-slate-500 transition hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:ml-0"
>
  <MoveLeft
    size={16}
    className="transition-transform group-hover:-translate-x-0.5 group-hover:rotate-180 duration-500"
  />
  হোমে ফিরুন
</Link>


<Link
  href="/"
  className="group ml-auto inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-600 transition-all duration-300 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 md:ml-0"
>
  <ArrowLeft
    size={16}
    className="transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) group-hover:-translate-x-1 text-slate-400 group-hover:text-primary"
  />
  <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 after:bg-primary after:transition-all after:duration-300 group-hover:after:w-full">
    হোমে ফিরুন
  </span>
</Link>

*/
