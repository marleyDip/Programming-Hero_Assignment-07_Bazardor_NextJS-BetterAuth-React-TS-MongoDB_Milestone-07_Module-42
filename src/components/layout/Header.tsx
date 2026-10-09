"use client";

import type { Category } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavSkeletonItems } from "../Skeleton/NavSkeleton";
import Logo from "./Logo";

// Types & helpers
type NavItem = { key: string; href: string; label: string; emoji: string };
type Pill = { x: number; w: number };

const ALL_KEY = "__all__";

const measure = (el?: HTMLElement | null): Pill | null =>
  el ? { x: el.offsetLeft, w: el.offsetWidth } : null;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function safeDecode(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// Component
export default function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef(new Map<string, HTMLAnchorElement>());

  const [activePill, setActivePill] = useState<Pill | null>(null);
  const [hoverPill, setHoverPill] = useState<Pill | null>(null);
  const [hoverKey, setHoverKey] = useState<string | null>(null);
  const [ready, setReady] = useState(false); // avoid animating on first paint
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const items = useMemo<NavItem[]>(
    () => [
      { key: ALL_KEY, href: "/", label: "সব পণ্য", emoji: "🛍️" },

      ...categories.map((c) => ({
        key: c.slug,
        href: `/category/${c.slug}`,
        label: c.name,
        emoji: c.emoji,
      })),
    ],
    [categories],
  );

  const activeKey = useMemo(() => {
    if (pathname === "/") return ALL_KEY;

    const match = pathname.match(/^\/category\/([^/]+)/);
    if (!match) return null;

    const slug = safeDecode(match[1]);
    return items.some((i) => i.key === slug) ? slug : null;
  }, [pathname, items]);

  // Sliding active pill
  const syncActive = useCallback(() => {
    setActivePill(activeKey ? measure(itemRefs.current.get(activeKey)) : null);
  }, [activeKey]);

  useLayoutEffect(() => {
    syncActive();

    const id = requestAnimationFrame(() => setReady(true));

    return () => cancelAnimationFrame(id);
  }, [syncActive, items]);

  // Re-measure when fonts load / the list resizes (Bangla fonts shift widths).
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const ro = new ResizeObserver(() => syncActive());
    ro.observe(list);

    return () => ro.disconnect();
  }, [syncActive]);

  // Bring the active item to the center of the scroller.
  useEffect(() => {
    const nav = navRef.current;
    const el = activeKey ? itemRefs.current.get(activeKey) : null;
    if (!nav || !el) return;

    nav.scrollTo({
      left: el.offsetLeft - (nav.clientWidth - el.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, [activeKey]);

  // Scroll affordances
  const updateEdges = useCallback(() => {
    const nav = navRef.current;
    if (!nav) return;

    setCanLeft(nav.scrollLeft > 4);
    setCanRight(nav.scrollLeft + nav.clientWidth < nav.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);

    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges, items]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollByDir = (dir: 1 | -1) =>
    navRef.current?.scrollBy({
      left: dir * Math.max(240, (navRef.current?.clientWidth ?? 0) * 0.6),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });

  // Hover pill
  const hoverOn = (key: string) => {
    setHoverKey(key);
    setHoverPill(measure(itemRefs.current.get(key)));
  };
  const hoverOff = () => setHoverKey(null);

  const pillMotion = ready
    ? "transition-[transform,width,opacity] duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:transition-none"
    : "";

  return (
    <header
      className={`sticky top-0 z-40 border-b border-base-300/70 bg-white/80 backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "shadow-[0_10px_30px_-15px_rgba(0,0,0,0.25)]" : ""
      }`}
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Row 1: logo & auth */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 py-3">
          <Logo />

          <div className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/signin"
              className="group relative inline-flex h-10 items-center justify-center rounded-xl px-2 md:px-4 text-xs sm:text-sm font-semibold text-neutral/75 transition-all duration-300 hover:bg-base-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2"
            >
              <span className="relative">সাইন ইন</span>
            </Link>

            <Link
              href="/signup"
              className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-xl bg-primary px-2.5 md:px-5 text-xs sm:text-sm font-semibold text-primary-content shadow-sm shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
            >
              <span className="shine-base bg-linear-to-r from-transparent via-white/15 to-transparent" />
              <span className="relative z-10">সাইন আপ</span>
            </Link>
          </div>
        </div>

        {/* Row 2: category navigation */}
        <div className="relative -mx-4">
          {/* Left fade + arrow */}
          <div
            aria-hidden={!canLeft}
            className={`pointer-events-none absolute inset-y-0 left-0 z-20 flex w-14 items-center bg-linear-to-r from-white via-white/90 to-transparent pl-3 transition-opacity duration-200 ${
              canLeft ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label="বামে সরান"
              onClick={() => scrollByDir(-1)}
              className="pointer-events-auto hidden size-8 items-center justify-center rounded-full border border-base-300 bg-white text-neutral/70 shadow-sm transition hover:scale-110 hover:text-primary active:scale-95 md:flex"
            >
              <Chevron dir="left" />
            </button>
          </div>

          {/* Right fade + arrow */}
          <div
            aria-hidden={!canRight}
            className={`pointer-events-none absolute inset-y-0 right-0 z-20 flex w-14 items-center justify-end bg-linear-to-l from-white via-white/90 to-transparent pr-3 transition-opacity duration-200 ${
              canRight ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              type="button"
              tabIndex={-1}
              aria-label="ডানে সরান"
              onClick={() => scrollByDir(1)}
              className="pointer-events-auto hidden size-8 items-center justify-center rounded-full border border-base-300 bg-white text-neutral/70 shadow-sm transition hover:scale-110 hover:text-primary active:scale-95 md:flex"
            >
              <Chevron dir="right" />
            </button>
          </div>

          <nav
            ref={navRef}
            aria-label="পণ্যের ধরন"
            onScroll={updateEdges}
            className="relative snap-x snap-proximity overflow-x-auto px-4 pb-3 scrollbar-none [&::-webkit-scrollbar]:hidden"
          >
            <ul
              ref={listRef}
              onPointerLeave={hoverOff}
              onBlur={hoverOff}
              className="relative flex min-w-max items-center gap-1"
            >
              {/* Hover pill (soft, follows the cursor) */}
              <span
                aria-hidden
                className={`pointer-events-none absolute left-0 top-0 h-full rounded-full bg-base-200 ${pillMotion} ${
                  hoverPill && hoverKey && hoverKey !== activeKey
                    ? "opacity-100"
                    : "opacity-0"
                }`}
                style={{
                  width: hoverPill?.w ?? 0,
                  transform: `translateX(${hoverPill?.x ?? 0}px)`,
                }}
              />

              {/* Active pill (slides between pages) */}
              <span
                aria-hidden
                className={`pointer-events-none absolute left-0 top-0 h-full rounded-full bg-linear-to-r from-primary to-primary-foreground shadow-md shadow-primary/30 ${pillMotion} ${
                  activePill ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  width: activePill?.w ?? 0,
                  transform: `translateX(${activePill?.x ?? 0}px)`,
                }}
              />

              {items.map((item) => {
                const active = item.key === activeKey;

                return (
                  <li key={item.key} className="snap-center">
                    <Link
                      ref={(el) => {
                        if (el) itemRefs.current.set(item.key, el);
                        else itemRefs.current.delete(item.key);
                      }}
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onPointerEnter={(e) =>
                        e.pointerType === "mouse" && hoverOn(item.key)
                      }
                      onFocus={() => hoverOn(item.key)}
                      className={`group relative z-10 inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1 ${
                        active
                          ? "text-primary-content"
                          : "text-neutral/70 hover:text-primary"
                      }`}
                    >
                      <span
                        aria-hidden
                        className={`inline-block text-base leading-none transition-transform duration-300 ease-out motion-reduce:transition-none ${
                          active
                            ? "scale-110"
                            : "group-hover:-rotate-6 group-hover:scale-125"
                        }`}
                      >
                        {item.emoji}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}

              {/* Loading skeleton */}
              {categories.length === 0 && <NavSkeletonItems />}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={dir === "left" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6"} />
    </svg>
  );
}
