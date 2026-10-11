"use client";

import { House, MoveLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

/** Shows the missing path & the "go back / go home" buttons. */
export default function NotFoundActions() {
  const router = useRouter();
  const pathname = usePathname();

  const goBack = () => {
    // no history (opened in a new tab)? fall back to home
    if (window.history.length > 1) router.back();
    else router.push("/");
  };

  return (
    <>
      {pathname && pathname !== "/" && (
        <p className="mx-auto mt-5 flex max-w-full items-center justify-center gap-2 text-sm text-slate-500">
          <span className="shrink-0">খোঁজা হয়েছিল:</span>

          <code
            dir="ltr"
            className="max-w-[60vw] truncate rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-rose-600 sm:max-w-md"
            title={pathname}
          >
            {pathname}
          </code>
        </p>
      )}

      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link
          href="/"
          className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl bg-primary px-7 text-sm font-extrabold text-primary-content shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground hover:shadow-xl hover:shadow-primary/30 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 sm:w-auto"
        >
          <House size={18} strokeWidth={2.2} />
          হোম পেজে ফিরে যান
        </Link>

        <button
          type="button"
          onClick={goBack}
          className="group inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-base-300 bg-white px-7 text-sm font-bold text-neutral shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:w-auto"
        >
          <span
            aria-hidden
            className="transition-transform group-hover:-translate-x-0.5"
          >
            <MoveLeft size={16} />
          </span>
          আগের পাতায় ফিরুন
        </button>
      </div>
    </>
  );
}
