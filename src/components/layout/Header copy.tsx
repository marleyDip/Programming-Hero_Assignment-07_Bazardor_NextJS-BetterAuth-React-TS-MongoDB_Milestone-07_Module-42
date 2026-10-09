"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-base-300 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4">
        {/* Row 1: logo & auth */}
        <div className="flex items-center justify-between gap-3 py-3">
          {/* Logo */}
          <Logo />

          {/* Auth */}
          <div className="flex items-center gap-2">
            {/* Sign In */}
            <Link
              href="/signin"
              className="group relative inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-semibold text-neutral/75 transition-all duration-300 hover:bg-base-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
            >
              <span className="relative">সাইন ইন</span>
            </Link>

            {/* Sign Up */}
            <Link
              href="/signup"
              className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-xl bg-primary px-5 text-sm font-semibold text-primary-content shadow-sm shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              {/* Hover shine */}
              <span className="shine-base bg-linear-to-r from-transparent via-white/15 to-transparent" />

              <span className="relative z-10">সাইন আপ</span>
            </Link>
          </div>
        </div>

        {/* Row 2: category navigation */}
        <nav
          aria-label="পণ্যের ধরন"
          className="-mx-4 overflow-x-auto px-4 pb-3"
        >
          <ul className="flex min-w-max items-center gap-2">
            <li>
              <Link
                href="/"
                className={`rounded-full px-4 py-2 text-sm font-semibold hover:bg-base-200 ${pathname === "/" ? "" : ""}`}
              >
                সব পণ্য
              </Link>
            </li>

            {categories.map((c) => {
              const active = pathname === `/category/${c.slug}`;

              return (
                <li key={c.slug}>
                  <Link
                    href={`/category/${c.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-base-200 hover:text-primary ${active ? "" : ""}`}
                  >
                    <span aria-hidden>{c.emoji}</span> {c.name}
                  </Link>
                </li>
              );
            })}

            {categories.length === 0 &&
              Array.from({ length: 5 }).map((_, i) => (
                <li key={i}>
                  <div className="skeleton h-8 w-20 rounded-full" />
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

/* <Link
      href="/signup"
      className=" group inline-flex h-10 items-center gap-2 rounded-full border border-primary/20 bg-primary px-4 text-sm font-semibold text-primary-content shadow-sm shadow-primary/15 transition-all duration-300 hover:border-secondary hover:bg-secondary hover:shadow-md hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 "
    >
      <span>সাইন আপ</span>
      <span className=" grid size-5 place-items-center rounded-full bg-white/15 transition-transform duration-300 group-hover:translate-x-0.5 ">
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className="size-3.5"
          aria-hidden="true"
        >
          <path
            d="M3 8h9M8.5 4.5L12 8l-3.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>


  <Link
    href="/signup"
    className=" inline-flex h-10 items-center gap-2 rounded-full border border-primary bg-white px-4 text-sm font-semibold text-primary transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20"
  >
    সাইন আপ
    <ArrowUpRight size={14} />
  </Link>
*/
