import { todayBanglaDate } from "@/lib/formatters";
import type { SiteStats } from "@/lib/site-stats";
import { ArrowDown, TrendingUp, UserPlus, UserRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HeroStats from "./HeroStats";

type HeroUser = { name?: string | null } | null;

export default function Hero({
  user = null,
  stats,
  productsHref = "#সব-পণ্য",
}: {
  /** Signed-in user (or null). Pass it from getHeaderUser(). */
  user?: HeroUser;
  /** Totals shown to signed-in users. Signed-out visitors see the image instead. */
  stats?: SiteStats;
  /** Where the main button goes. Default scrolls to the products list. */
  productsHref?: string;
}) {
  const firstName = user?.name?.trim().split(/\s+/)[0][1];

  return (
    <section className="mx-auto my-6 w-full max-w-6xl px-4 sm:my-8 lg:my-10">
      <div className="relative isolate overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-sm">
        {/* Decorative background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-20 -z-10 size-72 rounded-full bg-primary/10 blur-3xl sm:size-96"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-16 -z-10 size-64 rounded-full bg-secondary/10 blur-3xl"
        />

        <div className="grid items-center gap-8 p-5 sm:p-8 md:grid-cols-2 md:gap-8 lg:gap-12 lg:p-10">
          {/* Hero content */}
          <div className="flex flex-col items-start">
            {/* Date badge */}
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary sm:text-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />

                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              {todayBanglaDate()}
            </span>

            {/* Greeting (signed in) or eyebrow */}
            {firstName ? (
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
                <span aria-hidden>👋</span>
                স্বাগতম, {firstName}
              </p>
            ) : (
              <p className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <TrendingUp size={17} strokeWidth={2.2} />
                প্রতিদিনের বাজার, সহজ হিসাব
              </p>
            )}

            {/* Heading */}
            <h1 className="mt-3 text-3xl font-extrabold leading-[1.3] tracking-tight text-base-content sm:text-4xl lg:text-[2.75rem]">
              আজকের বাজারের দাম,
              <br className="hidden sm:block" />
              <span className="text-primary"> এক নজরে</span>
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-lg text-sm leading-7 text-base-content/70 sm:text-base">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
              বিস্তারিত, গড়, সর্বনিম্ন-সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            {/* CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={productsHref}
                className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-content shadow-md shadow-primary/15 transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                সব পণ্যের দাম দেখুন
                <ArrowDown
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-y-0.5"
                />
              </Link>

              {user ? (
                <Link
                  href="/profile"
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 px-5 py-2.5 text-sm font-semibold text-base-content/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  <UserRound size={17} />
                  আমার প্রোফাইল
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-100 px-5 py-2.5 text-sm font-semibold text-base-content/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                >
                  <UserPlus size={17} />
                  বিনামূল্যে সাইন আপ
                </Link>
              )}
            </div>

            {/* Supporting text */}
            <p className="mt-4 text-xs text-base-content/50">
              সহজে দেখুন • তুলনা করুন • সচেতন সিদ্ধান্ত নিন
            </p>
          </div>

          {/* Signed in → live totals · signed out → hero image */}
          {user && stats ? (
            <HeroStats stats={stats} />
          ) : (
            <div className="relative flex min-h-52 items-center justify-center md:min-h-72">
              <div
                aria-hidden="true"
                className="absolute size-48 rounded-full bg-primary/10 blur-2xl sm:size-64"
              />

              <Image
                src="/bazar-hero.png"
                alt="তাজা ফল ও সবজির ঝুড়ি"
                width={500}
                height={420}
                priority
                sizes="(max-width: 767px) 80vw, (max-width: 1023px) 40vw, 420px"
                className="relative z-10 h-auto w-56 object-contain drop-shadow-xl transition-transform duration-500 hover:scale-105 sm:w-72 lg:w-full lg:max-w-100"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
