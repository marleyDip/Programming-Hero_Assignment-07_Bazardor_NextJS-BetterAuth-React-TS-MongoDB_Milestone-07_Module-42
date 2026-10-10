"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";

type Mode = "signin" | "signup";

const ICONS = {
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  mail: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 1 8 6 8-6",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z",
} as const;

/** Bangla digits → latin, so "০১৭১২…" works. */
const normalizeDigits = (v: string) =>
  v.replace(/[০-৯]/g, (d) => String("০১২৩৪৫৬৭৮৯".indexOf(d)));

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isBdPhone = (v: string) =>
  /^(?:\+?88)?01[3-9]\d{8}$/.test(normalizeDigits(v).replace(/[\s-]/g, ""));

function strength(pw: string) {
  let score = 0;

  if (pw.length >= 8) score++;

  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;

  if (/\d/.test(pw)) score++;

  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;

  return score; // 0..4
}

const STRENGTH = [
  { label: "খুব দুর্বল", bar: "bg-rose-500" },
  { label: "দুর্বল", bar: "bg-rose-500" },
  { label: "মোটামুটি", bar: "bg-amber-500" },
  { label: "ভালো", bar: "bg-lime-500" },
  { label: "শক্তিশালী", bar: "bg-emerald-500" },
] as const;

function Field({
  label,
  icon,
  error,
  right,
  ...input
}: {
  label: string;
  icon: keyof typeof ICONS;
  error?: string;
  right?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-bold text-neutral/80"
      >
        {label}
      </label>

      <div className="group relative">
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
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
        >
          <path d={ICONS[icon]} />
        </svg>

        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
          {...input}
          className={`h-12 w-full rounded-2xl border bg-slate-50/60 pl-11 ${
            right ? "pr-12" : "pr-4"
          } text-sm font-medium text-neutral outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-primary/40 focus:bg-white focus:ring-4 ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
              : "border-base-300 focus:border-primary/60 focus:ring-primary/10"
          }`}
        />

        {right && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {right}
          </div>
        )}
      </div>

      {error && (
        <p
          id={`${id}-err`}
          role="alert"
          className="mt-1.5 text-xs font-semibold text-rose-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export default function AuthForm({ mode }: { mode: Mode }) {
  const signup = mode === "signup";

  const [name, setName] = useState("");
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [agree, setAgree] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const score = useMemo(() => strength(password), [password]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (signup && name.trim().length < 2) e.name = "আপনার নাম লিখুন";
    if (!identity.trim()) e.identity = "ইমেইল বা মোবাইল নম্বর দিন";
    else if (!isEmail(identity.trim()) && !isBdPhone(identity))
      e.identity = "সঠিক ইমেইল বা মোবাইল নম্বর দিন (যেমন: 01712345678)";
    if (!password) e.password = "পাসওয়ার্ড দিন";
    else if (signup && password.length < 8)
      e.password = "কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন";
    if (signup && !agree) e.agree = "চালিয়ে যেতে শর্তাবলিতে সম্মত হতে হবে";
    return e;
  };

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      // TODO: call your auth API here.
      await new Promise((r) => setTimeout(r, 900));
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div
        role="status"
        className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center"
      >
        <span aria-hidden className="mb-2 block text-4xl">
          🎉
        </span>

        <p className="font-extrabold text-emerald-800">
          {signup ? "অ্যাকাউন্ট তৈরি হয়েছে!" : "সফলভাবে সাইন ইন হয়েছে!"}
        </p>

        <Link
          href="/"
          className="mt-3 inline-block text-sm font-bold text-primary underline-offset-4 hover:underline"
        >
          হোমে যান →
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {/* Social */}
      <div className="grid grid-cols-2 gap-3">
        {/* Google */}
        <button
          type="button"
          className="flex h-12 items-center justify-center gap-2.5 rounded-2xl border border-base-300 bg-white text-sm font-bold text-neutral shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
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
          Google
        </button>

        {/* GitHub */}
        <button
          type="button"
          className="flex h-12 items-center justify-center gap-2.5 rounded-2xl border border-base-300 bg-white text-sm font-bold text-neutral shadow-sm transition hover:-translate-y-0.5 hover:border-neutral/60 hover:bg-neutral hover:text-white hover:shadow-md active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
          GitHub
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
        <span className="h-px flex-1 bg-base-300" />
        অথবা
        <span className="h-px flex-1 bg-base-300" />
      </div>

      {signup && (
        <Field
          label="আপনার নাম"
          icon="user"
          autoComplete="name"
          placeholder="যেমন: রাহিম উদ্দিন"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
      )}

      <Field
        label="ইমেইল বা মোবাইল নম্বর"
        icon="mail"
        autoComplete="username"
        placeholder="you@example.com / 01712345678"
        value={identity}
        onChange={(e) => setIdentity(e.target.value)}
        error={errors.identity}
      />

      <div>
        <Field
          label="পাসওয়ার্ড"
          icon="lock"
          type={show ? "text" : "password"}
          autoComplete={signup ? "new-password" : "current-password"}
          placeholder={signup ? "কমপক্ষে ৮ অক্ষর" : "আপনার পাসওয়ার্ড"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          right={
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
              aria-pressed={show}
              className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
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
                {show ? (
                  <>
                    <path d="M17.9 17.9A10.9 10.9 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5.1-5.9M9.9 4.2A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.2M1 1l22 22" />
                    <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          }
        />

        {signup && password && (
          <div className="mt-2" aria-live="polite">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                    i < score ? STRENGTH[score].bar : "bg-slate-200"
                  }`}
                />
              ))}
            </div>

            <p className="mt-1 text-xs font-semibold text-slate-500">
              পাসওয়ার্ড: {STRENGTH[score].label}
            </p>
          </div>
        )}
      </div>

      {signup ? (
        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-base-300 accent-primary"
            />

            <span>
              আমি{" "}
              <Link
                href="/terms"
                className="font-bold text-primary hover:underline"
              >
                শর্তাবলি
              </Link>{" "}
              ও{" "}
              <Link
                href="/privacy"
                className="font-bold text-primary hover:underline"
              >
                গোপনীয়তা নীতি
              </Link>{" "}
              মেনে নিচ্ছি
            </span>
          </label>

          {errors.agree && (
            <p
              role="alert"
              className="mt-1.5 text-xs font-semibold text-rose-600"
            >
              {errors.agree}
            </p>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-slate-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 cursor-pointer rounded border-base-300 accent-primary"
            />
            মনে রাখুন
          </label>

          <Link
            href="/forgot-password"
            className="font-bold text-primary hover:underline"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="relative inline-flex h-12 w-full items-center justify-center overflow-hidden rounded-2xl bg-primary text-sm font-extrabold text-primary-content shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-xl hover:shadow-primary/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
      >
        <span className="relative z-10 inline-flex items-center gap-2">
          {loading && (
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
          )}
          {loading
            ? "অপেক্ষা করুন…"
            : signup
              ? "অ্যাকাউন্ট তৈরি করুন"
              : "সাইন ইন করুন"}
        </span>
      </button>
    </form>
  );
}
