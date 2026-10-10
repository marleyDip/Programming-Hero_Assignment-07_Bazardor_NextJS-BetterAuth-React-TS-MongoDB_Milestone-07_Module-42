"use client";

import {
  authError,
  Field,
  isEmail,
  passwordRules,
  PasswordToggle,
  Spinner,
  STRENGTH,
} from "@/components/Auth/Shared";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import toast from "react-hot-toast";

export type ProfileUser = {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: string; // ISO
};

type Tab = "profile" | "security";

// small helpers
function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setOn(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className={`transition-all duration-500 ease-out motion-reduce:transition-none ${
        on ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function Avatar({
  user,
  className,
}: {
  user: Pick<ProfileUser, "name" | "image">;
  className: string;
}) {
  const base = `grid shrink-0 place-items-center overflow-hidden rounded-full font-black ${className}`;
  return user.image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={user.image}
      alt=""
      referrerPolicy="no-referrer"
      className={`${base} object-cover`}
    />
  ) : (
    <span
      aria-hidden
      className={`${base} bg-linear-to-br from-primary to-primary-foreground text-primary-content`}
    >
      {(Array.from(user.name.trim())[0] ?? "ব").toUpperCase()}
    </span>
  );
}

const PROVIDERS: Record<string, { label: string; icon: ReactNode }> = {
  credential: {
    label: "ইমেইল ও পাসওয়ার্ড",
    icon: <span aria-hidden>🔑</span>,
  },
  google: {
    label: "Google",
    icon: (
      <svg width="14" height="14" viewBox="0 0 48 48" aria-hidden>
        <path
          fill="#FFC107"
          d="M43.6 20.1H42V20H24v8h11.3A12 12 0 1 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 44 24c0-1.3-.1-2.6-.4-3.9z"
        />
        <path
          fill="#FF3D00"
          d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
        />
      </svg>
    ),
  },
  github: {
    label: "GitHub",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
};

function Card({
  title,
  desc,
  icon,
  badge,
  children,
}: {
  title: string;
  desc: string;
  icon: string;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="group/card rounded-3xl border border-base-300 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/5 sm:p-7">
      <header className="mb-5 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-xl transition-transform duration-300 group-hover/card:-rotate-6 group-hover/card:scale-105"
          >
            {icon}
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-neutral">{title}</h2>
            <p className="text-sm text-slate-500">{desc}</p>
          </div>
        </div>
        {badge}
      </header>
      {children}
    </section>
  );
}

function SaveBar({
  dirty,
  loading,
  label,
  onReset,
}: {
  dirty: boolean;
  loading: boolean;
  label: string;
  onReset?: () => void;
}) {
  return (
    <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
      <p
        className={`text-xs font-bold transition-opacity ${dirty ? "text-amber-600 opacity-100" : "opacity-0"}`}
        aria-live="polite"
      >
        ● অসংরক্ষিত পরিবর্তন আছে
      </p>

      <div className="ml-auto flex items-center gap-2">
        {dirty && onReset && !loading && (
          <button
            type="button"
            onClick={onReset}
            className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 transition hover:bg-slate-100 hover:text-neutral focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            বাতিল
          </button>
        )}
        <button
          type="submit"
          disabled={!dirty || loading}
          className="inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-extrabold text-primary-content shadow-md shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-foreground hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
        >
          {loading && <Spinner />}
          {loading ? "সংরক্ষণ হচ্ছে…" : label}
        </button>
      </div>
    </div>
  );
}

// Name form
function NameCard({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);

  const dirty = name.trim() !== user.name;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !dirty) return;

    if (name.trim().length < 2) return setError("কমপক্ষে ২ অক্ষরের নাম লিখুন");

    setLoading(true);
    const id = toast.loading("নাম আপডেট হচ্ছে…");

    try {
      const { error } = await authClient.updateUser({ name: name.trim() });
      if (error) {
        toast.error(authError(error), { id });
        return;
      }
      toast.success("নাম আপডেট হয়েছে ✓", { id });
      router.refresh();
    } catch {
      toast.error("নেটওয়ার্কে সমস্যা হয়েছে, আবার চেষ্টা করুন", { id });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="ব্যক্তিগত তথ্য"
      desc="আপনার নাম সবখানে এভাবেই দেখাবে"
      icon="👤"
    >
      <form onSubmit={submit} noValidate>
        <Field
          label="পুরো নাম"
          icon="user"
          autoComplete="name"
          value={name}
          disabled={loading}
          onChange={(e) => {
            setName(e.target.value);
            setError(undefined);
          }}
          error={error}
        />
        <SaveBar
          dirty={dirty}
          loading={loading}
          label="নাম সংরক্ষণ করুন"
          onReset={() => {
            setName(user.name);
            setError(undefined);
          }}
        />
      </form>
    </Card>
  );
}

// Email form
function EmailCard({ user }: { user: ProfileUser }) {
  const router = useRouter();
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const clean = email.trim().toLowerCase();
  const dirty = clean !== user.email.toLowerCase();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || !dirty) return;

    if (!clean) return setError("ইমেইল দিন");
    if (!isEmail(clean))
      return setError("সঠিক ইমেইল দিন (যেমন: you@example.com)");

    setLoading(true);
    const id = toast.loading("ইমেইল পরিবর্তনের অনুরোধ পাঠানো হচ্ছে…");

    try {
      const { error } = await authClient.changeEmail({
        newEmail: clean,
        callbackURL: "/profile",
      });
      if (error) {
        toast.error(authError(error), { id });
        return;
      }
      toast.success("ইমেইল পরিবর্তনের অনুরোধ গ্রহণ করা হয়েছে ✓", { id });
      router.refresh();
    } catch {
      toast.error("নেটওয়ার্কে সমস্যা হয়েছে, আবার চেষ্টা করুন", { id });
    } finally {
      setLoading(false);
    }
  };

  const resend = async () => {
    if (sending) return;
    setSending(true);
    const id = toast.loading("যাচাই লিংক পাঠানো হচ্ছে…");
    try {
      const { error } = await authClient.sendVerificationEmail({
        email: user.email,
        callbackURL: "/profile",
      });
      if (error) toast.error(authError(error), { id });
      else toast.success("যাচাই লিংক পাঠানো হয়েছে, ইনবক্স দেখুন 📬", { id });
    } catch {
      toast.error("নেটওয়ার্কে সমস্যা হয়েছে, আবার চেষ্টা করুন", { id });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card
      title="ইমেইল ঠিকানা"
      desc="সাইন ইন ও নোটিফিকেশনের জন্য ব্যবহৃত হয়"
      icon="✉️"
      badge={
        user.emailVerified ? (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700">
            ✓ যাচাইকৃত
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
            ⚠ যাচাই হয়নি
          </span>
        )
      }
    >
      <form onSubmit={submit} noValidate>
        <Field
          label="ইমেইল"
          icon="mail"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          disabled={loading}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(undefined);
          }}
          error={error}
          hint={
            dirty
              ? "ইমেইল যাচাই চালু থাকলে নতুন ঠিকানায় একটি নিশ্চিতকরণ লিংক যাবে।"
              : undefined
          }
        />

        {!user.emailVerified && !dirty && (
          <button
            type="button"
            onClick={resend}
            disabled={sending}
            className="mt-3 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-50 px-3.5 py-2 text-sm font-bold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/50"
          >
            {sending && <Spinner />}
            📬 যাচাই লিংক আবার পাঠান
          </button>
        )}

        <SaveBar
          dirty={dirty}
          loading={loading}
          label="ইমেইল পরিবর্তন করুন"
          onReset={() => {
            setEmail(user.email);
            setError(undefined);
          }}
        />
      </form>
    </Card>
  );
}

// Password form
function PasswordCard({ hasPassword }: { hasPassword: boolean }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [revoke, setRevoke] = useState(true);
  const [errors, setErrors] = useState<
    Partial<Record<"current" | "next" | "confirm", string>>
  >({});
  const [loading, setLoading] = useState(false);

  const rules = useMemo(() => passwordRules(next), [next]);
  const score = rules.filter((r) => r.ok).length;
  const dirty = !!(current || next || confirm);

  const clear = (k: keyof typeof errors) =>
    setErrors((p) => (p[k] ? { ...p, [k]: undefined } : p));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const er: typeof errors = {};
    if (!current) er.current = "বর্তমান পাসওয়ার্ড দিন";
    if (!next) er.next = "নতুন পাসওয়ার্ড দিন";
    else if (next.length < 8) er.next = "কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন";
    else if (next === current)
      er.next = "নতুন পাসওয়ার্ড আগেরটির মতো হতে পারবে না";
    if (!confirm) er.confirm = "পাসওয়ার্ডটি আবার লিখুন";
    else if (confirm !== next) er.confirm = "পাসওয়ার্ড মিলছে না";

    setErrors(er);
    if (Object.keys(er).length) return;

    setLoading(true);
    const id = toast.loading("পাসওয়ার্ড পরিবর্তন হচ্ছে…");

    try {
      const { error } = await authClient.changePassword({
        currentPassword: current,
        newPassword: next,
        revokeOtherSessions: revoke,
      });

      if (error) {
        if (error.code === "INVALID_PASSWORD")
          setErrors({ current: authError(error) });
        toast.error(authError(error), { id });
        return;
      }

      toast.success("পাসওয়ার্ড পরিবর্তন হয়েছে 🔒", { id });
      setCurrent("");
      setNext("");
      setConfirm("");
      setErrors({});
    } catch {
      toast.error("নেটওয়ার্কে সমস্যা হয়েছে, আবার চেষ্টা করুন", { id });
    } finally {
      setLoading(false);
    }
  };

  if (!hasPassword) {
    return (
      <Card title="পাসওয়ার্ড" desc="আপনার অ্যাকাউন্টের নিরাপত্তা" icon="🔒">
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm leading-6 text-neutral/80">
          <p className="font-bold text-primary">
            আপনি Google বা GitHub দিয়ে সাইন ইন করেছেন
          </p>
          <p className="mt-1">
            এই অ্যাকাউন্টে আলাদা কোনো পাসওয়ার্ড সেট করা নেই, তাই পরিবর্তন করার
            কিছু নেই। আপনার নিরাপত্তা সংশ্লিষ্ট প্রোভাইডারের মাধ্যমেই সুরক্ষিত।
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      title="পাসওয়ার্ড পরিবর্তন"
      desc="নিয়মিত পাসওয়ার্ড বদলালে অ্যাকাউন্ট সুরক্ষিত থাকে"
      icon="🔒"
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <Field
          label="বর্তমান পাসওয়ার্ড"
          icon="lock"
          type={show ? "text" : "password"}
          autoComplete="current-password"
          value={current}
          disabled={loading}
          onChange={(e) => {
            setCurrent(e.target.value);
            clear("current");
          }}
          error={errors.current}
          right={
            <PasswordToggle show={show} onToggle={() => setShow((s) => !s)} />
          }
        />

        <div>
          <Field
            label="নতুন পাসওয়ার্ড"
            icon="lock"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            placeholder="কমপক্ষে ৮ অক্ষর"
            value={next}
            disabled={loading}
            onChange={(e) => {
              setNext(e.target.value);
              clear("next");
            }}
            error={errors.next}
            right={
              <PasswordToggle show={show} onToggle={() => setShow((s) => !s)} />
            }
          />

          {next && (
            <div
              className="mt-3 rounded-2xl bg-slate-50 p-3.5"
              aria-live="polite"
            >
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < score ? STRENGTH[score].bar : "bg-slate-200"}`}
                  />
                ))}
              </div>
              <p className="mt-1.5 text-xs font-bold text-slate-600">
                পাসওয়ার্ড: {STRENGTH[score].label}
              </p>

              <ul className="mt-2 grid gap-1 sm:grid-cols-2">
                {rules.map((r) => (
                  <li
                    key={r.label}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${r.ok ? "text-emerald-600" : "text-slate-400"}`}
                  >
                    <span
                      aria-hidden
                      className={`grid size-4 place-items-center rounded-full text-[10px] transition-colors ${r.ok ? "bg-emerald-100" : "bg-slate-200"}`}
                    >
                      {r.ok ? "✓" : ""}
                    </span>
                    {r.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div>
          <Field
            label="নতুন পাসওয়ার্ড নিশ্চিত করুন"
            icon="lock"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            placeholder="পাসওয়ার্ডটি আবার লিখুন"
            value={confirm}
            disabled={loading}
            onChange={(e) => {
              setConfirm(e.target.value);
              clear("confirm");
            }}
            error={errors.confirm}
            right={
              <PasswordToggle show={show} onToggle={() => setShow((s) => !s)} />
            }
          />
          {confirm && !errors.confirm && confirm === next && (
            <p className="mt-1.5 text-xs font-semibold text-emerald-600">
              ✓ পাসওয়ার্ড মিলেছে
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 rounded-2xl border border-base-300 p-3.5 text-sm text-slate-600 transition hover:border-primary/40 hover:bg-primary/5">
          <input
            type="checkbox"
            checked={revoke}
            disabled={loading}
            onChange={(e) => setRevoke(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer rounded accent-primary"
          />
          <span>
            <strong className="text-neutral">
              অন্য সব ডিভাইস থেকে সাইন আউট করুন
            </strong>
            <span className="block text-xs text-slate-500">
              নিরাপত্তার জন্য এটি চালু রাখা ভালো
            </span>
          </span>
        </label>

        <SaveBar
          dirty={dirty}
          loading={loading}
          label="পাসওয়ার্ড পরিবর্তন করুন"
          onReset={() => {
            setCurrent("");
            setNext("");
            setConfirm("");
            setErrors({});
          }}
        />
      </form>
    </Card>
  );
}

// Sign out
function SignOutButton({ variant }: { variant: "pill" | "full" }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  // the "are you sure?" state resets by itself after 4s
  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  const signOut = async () => {
    if (loading) return;
    setLoading(true);
    const id = toast.loading("সাইন আউট হচ্ছে…");

    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error("সাইন আউট করা যায়নি, আবার চেষ্টা করুন", { id });
        setLoading(false);
        return;
      }

      toast.success("সাইন আউট হয়েছে", { id });
      router.push("/");
      router.refresh(); // keep the spinner on until navigation finishes
    } catch {
      toast.error("নেটওয়ার্কে সমস্যা হয়েছে, আবার চেষ্টা করুন", { id });
      setLoading(false);
    }
  };

  const onClick = () => (confirming ? signOut() : setConfirming(true));

  const icon = loading ? (
    <Spinner />
  ) : (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  );

  const label = loading
    ? "সাইন আউট হচ্ছে…"
    : confirming
      ? "নিশ্চিত? আবার ক্লিক করুন"
      : "সাইন আউট";

  const base =
    "inline-flex cursor-pointer items-center justify-center gap-2 font-bold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2";

  const style =
    variant === "pill"
      ? `${base} h-10 rounded-full px-4 text-sm backdrop-blur focus-visible:ring-white/70 ${
          confirming
            ? "bg-rose-600 text-white shadow-lg shadow-rose-900/30"
            : "bg-white/20 text-white ring-1 ring-white/40 hover:bg-white hover:text-rose-600"
        }`
      : `${base} h-12 w-full rounded-2xl text-sm focus-visible:ring-rose-400/50 ${
          confirming
            ? "bg-rose-600 text-white shadow-lg shadow-rose-600/25"
            : "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white hover:shadow-lg hover:shadow-rose-600/20"
        }`;

  return (
    <button
      type="button"
      onClick={onClick}
      onBlur={() => setConfirming(false)}
      disabled={loading}
      aria-live="polite"
      className={style}
    >
      {icon}
      <span
        className={variant === "pill" && !confirming ? "hidden sm:inline" : ""}
      >
        {label}
      </span>
    </button>
  );
}

// Page view
export default function ProfileView({
  user,
  providers,
  initialTab = "profile",
}: {
  user: ProfileUser;
  /** e.g. ["credential","google"]; null = unknown */
  providers: string[] | null;
  initialTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(initialTab);

  const hasPassword =
    providers === null ? true : providers.includes("credential");
  const joined = new Intl.DateTimeFormat("bn-BD", { dateStyle: "long" }).format(
    new Date(user.createdAt),
  );

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "profile", label: "প্রোফাইল", icon: "👤" },
    { key: "security", label: "নিরাপত্তা", icon: "🔒" },
  ];

  const onTabKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      setTab((t) => (t === "profile" ? "security" : "profile"));
    }
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">
      <nav aria-label="breadcrumb" className="mb-4 text-sm text-slate-500">
        <Link href="/" className="transition-colors hover:text-primary">
          হোম
        </Link>
        <span aria-hidden className="mx-2">
          /
        </span>
        <span className="font-semibold text-neutral">আমার প্রোফাইল</span>
      </nav>

      {/* Hero */}
      <FadeIn>
        <section className="overflow-hidden rounded-4xl border border-base-300 bg-white shadow-sm">
          <div className="relative h-32 bg-linear-to-br from-primary via-primary to-primary-foreground sm:h-40">
            <span
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/20 blur-3xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-24 left-10 size-64 rounded-full bg-black/15 blur-3xl"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)",
                backgroundSize: "22px 22px",
              }}
            />

            <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-5">
              <SignOutButton variant="pill" />
            </div>
          </div>

          <div className="relative px-5 pb-6 sm:px-8">
            <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-5">
                <div className="relative w-fit">
                  <Avatar
                    user={user}
                    className="size-24 text-4xl shadow-xl shadow-primary/20 ring-4 ring-white sm:size-28 sm:text-5xl"
                  />
                  <span
                    aria-hidden
                    className="absolute bottom-1 right-1 size-5 rounded-full border-[3px] border-white bg-emerald-500"
                    title="সক্রিয়"
                  />
                </div>

                <div className="min-w-0 sm:pb-1">
                  <h1 className="truncate text-2xl font-black tracking-tight text-neutral sm:text-3xl">
                    {user.name}
                  </h1>
                  <p className="truncate text-sm text-slate-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:pb-1">
                {user.emailVerified ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                    ✓ ইমেইল যাচাইকৃত
                  </span>
                ) : (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
                    ⚠ ইমেইল যাচাই হয়নি
                  </span>
                )}
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  🛍️ বাজার দর সদস্য
                </span>
              </div>
            </div>
          </div>
        </section>
      </FadeIn>

      <div className="mt-6 grid gap-6 lg:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <FadeIn delay={100}>
          <aside className="space-y-4 lg:sticky lg:top-32 lg:self-start">
            <div className="rounded-3xl border border-base-300 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-sm font-extrabold text-neutral">
                অ্যাকাউন্টের তথ্য
              </h2>

              <dl className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100"
                  >
                    📅
                  </span>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">
                      সদস্য হয়েছেন
                    </dt>
                    <dd className="font-bold text-neutral">{joined}</dd>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100"
                  >
                    🔐
                  </span>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">
                      লগইন পদ্ধতি
                    </dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {(providers ?? ["credential"]).map((p) => {
                        const meta = PROVIDERS[p] ?? {
                          label: p,
                          icon: <span aria-hidden>🔗</span>,
                        };
                        return (
                          <span
                            key={p}
                            className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-white px-2.5 py-1 text-xs font-bold text-neutral"
                          >
                            {meta.icon}
                            {meta.label}
                          </span>
                        );
                      })}
                    </dd>
                  </div>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 to-white p-5">
              <h2 className="text-sm font-extrabold text-neutral">
                🛡️ নিরাপত্তা টিপস
              </h2>
              <ul className="mt-2 space-y-1.5 text-xs leading-5 text-slate-600">
                <li>• অন্য সাইটের পাসওয়ার্ড এখানে ব্যবহার করবেন না</li>
                <li>• ইমেইল যাচাই করে রাখুন, পাসওয়ার্ড ভুলে গেলে কাজে দেবে</li>
                <li>• পাসওয়ার্ড বদলালে অন্য ডিভাইস সাইন আউট করুন</li>
              </ul>
            </div>

            <SignOutButton variant="full" />
          </aside>
        </FadeIn>

        {/* Main */}
        <div className="min-w-0">
          {/* Tabs */}
          <FadeIn delay={150}>
            <div
              role="tablist"
              aria-label="প্রোফাইল সেটিংস"
              onKeyDown={onTabKey}
              className="relative mb-5 grid grid-cols-2 rounded-2xl bg-slate-100 p-1"
            >
              <span
                aria-hidden
                className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-sm transition-transform duration-300 ease-[cubic-bezier(0.34,1.2,0.64,1)] motion-reduce:transition-none"
                style={{
                  transform:
                    tab === "security" ? "translateX(100%)" : "translateX(0)",
                }}
              />
              {tabs.map((t) => (
                <button
                  key={t.key}
                  id={`tab-${t.key}`}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.key}
                  aria-controls={`panel-${t.key}`}
                  tabIndex={tab === t.key ? 0 : -1}
                  onClick={() => setTab(t.key)}
                  className={`relative z-10 inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm font-bold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                    tab === t.key
                      ? "text-primary"
                      : "text-slate-500 hover:text-neutral"
                  }`}
                >
                  <span aria-hidden>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </FadeIn>

          {/* Panels (re-mount on tab change → fade-in) */}
          {tab === "profile" ? (
            <div
              key="profile"
              id="panel-profile"
              role="tabpanel"
              aria-labelledby="tab-profile"
              className="space-y-5"
            >
              <FadeIn>
                <NameCard user={user} />
              </FadeIn>
              <FadeIn delay={90}>
                <EmailCard user={user} />
              </FadeIn>
            </div>
          ) : (
            <div
              key="security"
              id="panel-security"
              role="tabpanel"
              aria-labelledby="tab-security"
              className="space-y-5"
            >
              <FadeIn>
                <PasswordCard hasPassword={hasPassword} />
              </FadeIn>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
