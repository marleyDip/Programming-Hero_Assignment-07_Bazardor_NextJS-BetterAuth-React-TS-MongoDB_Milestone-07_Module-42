"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const FOOTER_LINKS = [
  { label: "হোম", href: "/" },
  { label: "পণ্যের দাম", href: "/#products" },
  { label: "বাজার সম্পর্কে", href: "/#about" },
];

// TODO: replace with your real details
const DEVELOPER = {
  name: "Md Sofian Hasan",
  role: "Full-Stack Developer",
  bio: "আধুনিক ও দ্রুত ওয়েব অ্যাপ বানাতে ভালোবাসি। এই প্রজেক্টটি আমার হাতে তৈরি।",
  stack: ["Next.js", "betterAuth", "TypeScript", "Tailwind", "MongoDB"],
  portfolio: "https://marleydip.netlify.app/",
  socials: [
    {
      label: "Portfolio",
      href: "https://marleydip.netlify.app/",
      icon: "portfolio",
    },
    {
      label: "GitHub",
      href: "https://github.com/marleyDip",
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sofian-hasan/",
      icon: "linkedin",
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/MarleyDip1/",
      icon: "facebook",
    },
  ],
  contactHref: "mailto:dip.akand9899@gmail.com",
};

function SocialIcon({ name }: { name: string }) {
  const common = {
    className: "size-4",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true,
  } as const;

  switch (name) {
    case "github":
      return (
        <svg {...common}>
          <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.82 1.19 3.08 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
        </svg>
      );

    case "linkedin":
      return (
        <svg {...common}>
          <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
        </svg>
      );

    case "portfolio":
      return (
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" />
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.96.93-1.96 1.88v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z" />
        </svg>
      );
  }
}

export default function Footer() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-base-300 bg-base-100">
      {/* Decorative glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 size-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
          {/* Brand */}
          <div className="">
            <Link
              href="/"
              className="group inline-flex items-center gap-2"
              aria-label="বাজার দর হোম"
            >
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-black text-primary-content shadow-md shadow-primary/30 transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
                ব
              </span>
              <span className="text-xl font-extrabold tracking-tight text-base-content">
                বাজার দর
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-7 text-base-content/65">
              নিত্যপ্রয়োজনীয় পণ্যের বাজারদর জানুন সহজেই। সঠিক তথ্যের মাধ্যমে
              কেনাকাটার সিদ্ধান্ত নিন সচেতনভাবে।
            </p>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/50 px-3 py-1.5 text-xs text-base-content/70">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              তথ্য যাচাই করে কেনাকাটা করুন
            </div>
          </div>

          {/* Quick Links */}
          <div className="">
            <h3 className="text-sm font-bold text-base-content">দ্রুত লিংক</h3>

            <ul className="mt-4 space-y-3">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-sm text-base-content/65 transition-colors hover:text-primary"
                  >
                    <span className="h-px w-0 bg-primary transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div className="">
            <h3 className="text-sm font-bold text-base-content">
              মূল্য সম্পর্কিত তথ্য
            </h3>
            <p className="mt-4 text-sm leading-7 text-base-content/65">
              প্রদর্শিত দাম বাজার, স্থান, সময় এবং পণ্যের মান অনুযায়ী পরিবর্তিত
              হতে পারে। কেনার আগে স্থানীয় বাজারে দাম যাচাই করুন।
            </p>
          </div>

          {/* Developer */}
          <div className="sm:col-span-2">
            <h3 className="text-sm font-bold text-base-content">ডেভেলপার</h3>

            <div className="group mt-4 rounded-2xl border border-base-300 bg-base-200/40 p-4 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
              <div className="flex items-center gap-3">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-lg font-bold text-primary-content">
                  {DEVELOPER.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-base-content">
                    {DEVELOPER.name}
                  </p>
                  <p className="text-xs text-base-content/60">
                    {DEVELOPER.role}
                  </p>
                </div>
              </div>

              <p className="mt-3 text-xs leading-6 text-base-content/65">
                {DEVELOPER.bio}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {DEVELOPER.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-base-100 px-2 py-0.5 text-[11px] font-medium text-base-content/70 ring-1 ring-base-300 transition-colors hover:text-primary hover:ring-primary/40"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex gap-2">
                  {DEVELOPER.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="flex size-8 items-center justify-center rounded-full border border-base-300 text-base-content/70 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-content"
                    >
                      <SocialIcon name={s.icon} />
                    </a>
                  ))}
                </div>

                <a
                  href={DEVELOPER.contactHref}
                  className="text-xs font-semibold text-primary transition-all hover:translate-x-0.5 hover:underline"
                >
                  যোগাযোগ →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col gap-3 border-t border-base-300 pt-6 text-xs text-base-content/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} বাজার দর। সর্বস্বত্ব সংরক্ষিত।</p>
          <p>
            সচেতন কেনাকাটা, সাশ্রয়ী জীবন। · তৈরি করেছেন{" "}
            <span className="font-semibold text-base-content/80">
              {DEVELOPER.name}
            </span>
          </p>
        </div>
      </div>

      {/* Back to top */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="উপরে যান"
        className={`fixed bottom-6 right-6 z-50 flex size-11 items-center justify-center rounded-full bg-primary text-primary-content shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-1 hover:scale-110 ${
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <svg
          className="size-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m18 15-6-6-6 6" />
        </svg>
      </button>
    </footer>
  );
}

// export default function Footer() {
//   return (
//     <footer className="border-t border-base-300 bg-base-100">
//       <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
//         <p className="font-semibold text-primary">
//           🛒 বাজার দর —{" "}
//           <span className="font-normal text-base-content/70">
//             প্রয়োজনীয় পণ্যের দাম এক নজরে।
//           </span>
//         </p>

//         <p className="text-base-content/60 sm:text-right">
//           সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
//         </p>
//       </div>
//     </footer>
//   );
// }

// export default function Footer() {
//   return (
//     <footer className="mt-20 border-t border-base-300 bg-white">
//       <div className="mx-auto max-w-6xl flex flex-col gap-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <div className="font-extrabold text-base-content">বাজার দর</div>

//           <p className="mt-1">প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
//         </div>

//         <p className="max-w-md sm:text-right">
//           সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
//         </p>
//       </div>
//     </footer>
//   );
// }

// import Link from "next/link";

// const FOOTER_LINKS = [
//   { label: "হোম", href: "/" },
//   { label: "পণ্যের দাম", href: "/#products" },
//   { label: "বাজার সম্পর্কে", href: "/#about" },
// ];

// export default function Footer() {
//   return (
//     <footer className="mt-20 border-t border-base-300 bg-base-100">
//       <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
//           {/* Brand */}
//           <div>
//             <Link
//               href="/"
//               className="inline-flex items-center gap-2"
//               aria-label="বাজার দর হোম"
//             >
//               <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-black text-primary-content">
//                 ব
//               </span>

//               <span className="text-xl font-extrabold tracking-tight text-base-content">
//                 বাজার দর
//               </span>
//             </Link>

//             <p className="mt-4 max-w-xs text-sm leading-7 text-base-content/65">
//               নিত্যপ্রয়োজনীয় পণ্যের বাজারদর জানুন সহজেই। সঠিক তথ্যের মাধ্যমে
//               কেনাকাটার সিদ্ধান্ত নিন সচেতনভাবে।
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-sm font-bold text-base-content">দ্রুত লিংক</h3>

//             <ul className="mt-4 space-y-3">
//               {FOOTER_LINKS.map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     className="text-sm text-base-content/65 transition-colors hover:text-primary"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Price Disclaimer */}
//           <div>
//             <h3 className="text-sm font-bold text-base-content">
//               মূল্য সম্পর্কিত তথ্য
//             </h3>

//             <p className="mt-4 text-sm leading-7 text-base-content/65">
//               প্রদর্শিত দাম বাজার, স্থান, সময় এবং পণ্যের মান অনুযায়ী পরিবর্তিত
//               হতে পারে। কেনার আগে স্থানীয় বাজারে দাম যাচাই করুন।
//             </p>

//             <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-base-300 px-3 py-1.5 text-xs text-base-content/70">
//               <span className="size-2 rounded-full bg-success" />
//               তথ্য যাচাই করে কেনাকাটা করুন
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="mt-10 flex flex-col gap-3 border-t border-base-300 pt-6 text-xs text-base-content/55 sm:flex-row sm:items-center sm:justify-between">
//           <p>© {new Date().getFullYear()} বাজার দর। সর্বস্বত্ব সংরক্ষিত।</p>

//           <p>সচেতন কেনাকাটা, সাশ্রয়ী জীবন।</p>
//         </div>
//       </div>
//     </footer>
//   );
// }
