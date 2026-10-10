"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import toast from "react-hot-toast";

const MENU = [
  {
    href: "/profile",
    label: "আমার প্রোফাইল",
    hint: "তথ্য ও অ্যাকাউন্ট সেটিংস",
    icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
] as const;

type Person = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

/** The only user fields the header needs (serialisable, safe to send to the client). */
export type HeaderUser = Person & {
  id: string;
  emailVerified?: boolean;
};

const displayName = (u: Person) =>
  u.name?.trim() || u.email?.split("@")[0] || "ব্যবহারকারী";
const initialOf = (u: Person) =>
  (Array.from(displayName(u))[0] ?? "ব").toUpperCase();

function Avatar({
  user,
  className = "size-8 text-sm",
}: {
  user: Person;
  className?: string;
}) {
  const base = `grid shrink-0 place-items-center overflow-hidden rounded-full font-extrabold ${className}`;

  return user.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.image}
      alt=""
      referrerPolicy="no-referrer"
      className={`${base} object-cover ring-2 ring-white`}
    />
  ) : (
    <span
      aria-hidden
      className={`${base} bg-linear-to-br from-primary to-primary-foreground text-primary-content ring-2 ring-white`}
    >
      {initialOf(user)}
    </span>
  );
}

export default function UserMenu1({
  user: serverUser,
}: {
  user: HeaderUser | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const menuId = useId();

  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const focusFirst = useRef(false);

  const [openPathname, setOpenPathname] = useState<string | null>(null);
  const open = openPathname === pathname;
  const setOpen = useCallback(
    (next: boolean | ((open: boolean) => boolean)) => {
      setOpenPathname((currentPathname) => {
        const currentlyOpen = currentPathname === pathname;
        const shouldOpen =
          typeof next === "function" ? next(currentlyOpen) : next;
        return shouldOpen ? pathname : null;
      });
    },
    [pathname],
  );

  const [signingOut, setSigningOut] = useState(false);
  // flips the UI to "signed out" immediately, before the server refresh lands
  const [goneForServerId, setGoneForServerId] = useState<string | null>(null);

  // The signed-out override applies only to the session that was signed out.
  const serverId = serverUser?.id ?? null;
  const user = goneForServerId === serverId ? null : serverUser;

  // outside click & Escape
  useEffect(() => {
    if (!open) return;

    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  // keyboard-open → focus first item
  useEffect(() => {
    if (open && focusFirst.current) {
      focusFirst.current = false;
      requestAnimationFrame(() =>
        panelRef.current
          ?.querySelector<HTMLElement>('[role="menuitem"]')
          ?.focus(),
      );
    }
  }, [open]);

  const moveFocus = (e: React.KeyboardEvent) => {
    const items = [
      ...(panelRef.current?.querySelectorAll<HTMLElement>(
        '[role="menuitem"]',
      ) ?? []),
    ];
    if (!items.length) return;

    const i = items.indexOf(document.activeElement as HTMLElement);
    const go = (n: number) => {
      e.preventDefault();
      items[(n + items.length) % items.length].focus();
    };

    if (e.key === "ArrowDown") go(i + 1);
    else if (e.key === "ArrowUp") go(i - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(items.length - 1);
  };

  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    const id = toast.loading("সাইন আউট হচ্ছে…");

    try {
      const { error } = await authClient.signOut();

      if (error) {
        toast.error("সাইন আউট করা যায়নি, আবার চেষ্টা করুন", { id });
        return;
      }

      toast.success("সাইন আউট হয়েছে", { id });
      setGoneForServerId(serverId);
      setOpen(false);
      router.push("/");
      router.refresh();
    } catch {
      toast.error("নেটওয়ার্কে সমস্যা হয়েছে, আবার চেষ্টা করুন", { id });
    } finally {
      setSigningOut(false);
    }
  };

  // Signed out
  if (!user) {
    return (
      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/signin"
          className="group relative inline-flex h-10 items-center justify-center rounded-xl px-2 text-xs font-semibold text-neutral/75 transition-all duration-300 hover:bg-base-200 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 sm:text-sm md:px-4"
        >
          <span className="relative">সাইন ইন</span>
        </Link>

        <Link
          href="/signup"
          className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-xl bg-primary px-2.5 text-xs font-semibold text-primary-content shadow-sm shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground hover:shadow-lg hover:shadow-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 sm:text-sm md:px-5"
        >
          <span className="shine-base bg-linear-to-r from-transparent via-white/15 to-transparent" />
          <span className="relative z-10">সাইন আপ</span>
        </Link>
      </div>
    );
  }

  // Signed in
  const name = displayName(user);

  return (
    <div
      ref={rootRef}
      className="relative"
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null))
          setOpen(false);
      }}
    >
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            focusFirst.current = true;
            setOpen(true);
          }
        }}
        className={`group inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border bg-white py-1 pl-1 pr-1 shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:pr-3 ${
          open ? "border-primary/50 shadow-md" : "border-base-300"
        }`}
      >
        <Avatar user={user} className="size-8 text-sm" />

        <span className="hidden max-w-32 truncate text-sm font-bold text-neutral sm:block">
          {name}
        </span>

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
          className={`hidden text-slate-400 transition-transform duration-300 group-hover:text-primary sm:block ${
            open ? "rotate-180 text-primary" : ""
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        ref={panelRef}
        id={menuId}
        role="menu"
        aria-label="ব্যবহারকারী মেনু"
        tabIndex={-1}
        onKeyDown={moveFocus}
        className={`absolute right-0 top-full z-50 mt-2 w-72 max-w-[calc(100vw-2rem)] origin-top-right overflow-hidden rounded-2xl border border-base-300 bg-white shadow-2xl shadow-black/10 outline-none transition-[opacity,transform,visibility] duration-200 ease-out motion-reduce:transition-none ${
          open
            ? "visible translate-y-0 scale-100 opacity-100"
            : "invisible -translate-y-1 scale-95 opacity-0"
        }`}
      >
        {/* User card */}
        <div className="relative overflow-hidden border-b border-base-300/70 bg-linear-to-br from-primary/15 via-white to-white p-4">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/15 blur-2xl"
          />

          <div className="relative flex items-center gap-3">
            <Avatar user={user} className="size-12 text-lg" />
            <div className="min-w-0">
              <p className="truncate font-extrabold text-neutral">{name}</p>
              {user.email && (
                <p className="truncate text-xs text-slate-500">{user.email}</p>
              )}
              {user.emailVerified && (
                <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                  ✓ যাচাইকৃত
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Links */}
        <div className="p-2">
          {MENU.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-primary/10 focus-visible:bg-primary/10 focus-visible:outline-none"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500 transition-all duration-200 group-hover/item:bg-primary group-hover/item:text-primary-content">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d={item.icon} />
                </svg>
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-neutral">
                  {item.label}
                </span>
                <span className="block truncate text-xs text-slate-500">
                  {item.hint}
                </span>
              </span>
              <span
                aria-hidden
                className="text-slate-300 transition-all group-hover/item:translate-x-0.5 group-hover/item:text-primary"
              >
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Sign out */}
        <div className="border-t border-base-300/70 p-2">
          <button
            type="button"
            role="menuitem"
            tabIndex={open ? 0 : -1}
            disabled={signingOut}
            onClick={handleSignOut}
            className="group/out flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-rose-50 focus-visible:bg-rose-50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-600 transition-all duration-200 group-hover/out:bg-rose-600 group-hover/out:text-white">
              {signingOut ? (
                <svg
                  className="size-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                    opacity=".25"
                  />
                  <path
                    d="M22 12a10 10 0 0 0-10-10"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
              )}
            </span>
            <span className="text-sm font-bold text-rose-600">
              {signingOut ? "সাইন আউট হচ্ছে…" : "সাইন আউট"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
