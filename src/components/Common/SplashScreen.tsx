"use client";

import { useEffect, useState } from "react";
import BrandLoader from "./BrandLoader";

const STORAGE_KEY = "bazardor:splash-seen";
const MIN_MS = 1400; // shortest time the splash stays up
const MAX_MS = 6000; // never block longer than this
const FADE_MS = 600;

const MESSAGES = [
  "আজকের দাম আনা হচ্ছে…",
  "বাজার থেকে তথ্য সংগ্রহ হচ্ছে…",
  "সবচেয়ে সস্তা বাজার খোঁজা হচ্ছে…",
] as const;

const EMOJIS = ["🍚", "🧅", "🥚", "🐟", "🥔"] as const;

/**
 * Full-screen welcome screen shown once per browser session
 * while the site loads. Put <SplashScreen /> first inside <body>.
 */
export default function SplashScreen() {
  const [progress, setProgress] = useState(0);
  const [msg, setMsg] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    // already seen in this session → skip instantly
    try {
      if (sessionStorage.getItem(STORAGE_KEY)) {
        timers.push(
          setTimeout(() => {
            if (!cancelled) setDone(true);
          }, 0),
        );

        return () => {
          cancelled = true;
          timers.forEach(clearTimeout);
        };
      }
    } catch {
      /* private mode etc. – just show it */
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const minMs = reduced ? 500 : MIN_MS;

    // lock scroll while visible
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    // progress eases up to 90% over the minimum time
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      if (cancelled) return;

      const t = Math.min((now - start) / minMs, 1);
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 90));

      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // rotating message
    const msgTimer = setInterval(
      () => setMsg((m) => (m + 1) % MESSAGES.length),
      1000,
    );

    const pageReady = new Promise<void>((resolve) => {
      if (document.readyState === "complete") resolve();
      else window.addEventListener("load", () => resolve(), { once: true });

      timers.push(setTimeout(resolve, MAX_MS));
    });

    const minWait = new Promise<void>((resolve) =>
      timers.push(setTimeout(resolve, minMs)),
    );

    Promise.all([pageReady, minWait]).then(() => {
      if (cancelled) return;
      setProgress(100);

      timers.push(
        setTimeout(() => setLeaving(true), 250),
        setTimeout(() => {
          setDone(true);
          try {
            sessionStorage.setItem(STORAGE_KEY, "1");
          } catch {
            /* ignore */
          }
        }, 250 + FADE_MS),
      );
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearInterval(msgTimer);
      timers.forEach(clearTimeout);
      document.documentElement.style.overflow = prevOverflow;
    };
  }, []);

  // restore scroll as soon as the splash is gone
  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  if (done) return null;

  return (
    <>
      {/* if JS is off, never trap the visitor behind the splash */}
      <noscript>
        <style>{"#app-splash{display:none!important}"}</style>
      </noscript>

      <div
        id="app-splash"
        role="status"
        aria-live="polite"
        aria-label="লোড হচ্ছে"
        className={`fixed inset-0 z-100 flex flex-col items-center justify-center overflow-hidden bg-white px-6 transition-all ease-out motion-reduce:transition-none ${
          leaving ? "scale-105 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ transitionDuration: `${FADE_MS}ms` }}
      >
        {/* background */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 size-144 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />

          <div className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/10 blur-3xl" />

          <div className="absolute -bottom-32 -left-24 size-96 rounded-full bg-primary-foreground/10 blur-3xl" />

          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.35) 1px, transparent 0)",
              backgroundSize: "26px 26px",
              maskImage:
                "radial-gradient(ellipse at center, #000 25%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, #000 25%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative flex flex-col items-center text-center">
          <BrandLoader size="lg" />

          <h1 className="mt-8 text-4xl font-black tracking-tight text-neutral sm:text-5xl">
            বাজার <span className="text-primary">দর</span>
          </h1>

          <p className="mt-2 text-sm font-semibold text-slate-500 sm:text-base">
            আজকের বাজারদর, এক নজরে
          </p>

          {/* progress */}
          <div className="mt-10 w-64 max-w-[70vw]">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              className="h-1.5 overflow-hidden rounded-full bg-slate-100"
            >
              <div
                className="h-full rounded-full bg-linear-to-r from-primary/60 via-primary to-primary-foreground transition-[width] duration-300 ease-out motion-reduce:transition-none"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p key={msg} className="mt-3 h-5 text-xs font-bold text-slate-400">
              {MESSAGES[msg]}
            </p>
          </div>
        </div>

        {/* bottom emoji row */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-8 flex items-center justify-center gap-3 text-2xl"
        >
          {EMOJIS.map((e, i) => (
            <span
              key={e}
              className="animate-pulse opacity-70 motion-reduce:animate-none"
              style={{
                animationDelay: `${i * 220}ms`,
                animationDuration: "1.8s",
              }}
            >
              {e}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
