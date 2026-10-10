"use client";

import { useId } from "react";

export const ICONS = {
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  mail: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 1 8 6 8-6",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z",
} as const;

export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export const passwordRules = (pw: string) => [
  { ok: pw.length >= 8, label: "কমপক্ষে ৮ অক্ষর" },
  { ok: /[A-Z]/.test(pw) && /[a-z]/.test(pw), label: "বড় ও ছোট হাতের অক্ষর" },
  { ok: /\d/.test(pw), label: "একটি সংখ্যা" },
  {
    ok: /[^A-Za-z0-9]/.test(pw) || pw.length >= 12,
    label: "একটি চিহ্ন (!@#) বা ১২+ অক্ষর",
  },
];

export const STRENGTH = [
  { label: "খুব দুর্বল", bar: "bg-rose-500" },
  { label: "দুর্বল", bar: "bg-rose-500" },
  { label: "মোটামুটি", bar: "bg-amber-500" },
  { label: "ভালো", bar: "bg-lime-500" },
  { label: "শক্তিশালী", bar: "bg-emerald-500" },
] as const;

/** Better Auth error → friendly Bangla message. */
export function authError(error: {
  code?: string;
  message?: string;
  status?: number;
}) {
  const byCode: Record<string, string> = {
    USER_ALREADY_EXISTS: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
      "এই ইমেইলটি অন্য একটি অ্যাকাউন্টে ব্যবহার হচ্ছে",
    INVALID_EMAIL_OR_PASSWORD: "ইমেইল বা পাসওয়ার্ড সঠিক নয়",
    INVALID_PASSWORD: "বর্তমান পাসওয়ার্ড সঠিক নয়",
    INVALID_EMAIL: "সঠিক ইমেইল দিন",
    PASSWORD_TOO_SHORT: "পাসওয়ার্ড খুব ছোট",
    PASSWORD_TOO_LONG: "পাসওয়ার্ড খুব বড়",
    EMAIL_NOT_VERIFIED: "আগে আপনার ইমেইল যাচাই করুন",
    CREDENTIAL_ACCOUNT_NOT_FOUND: "এই অ্যাকাউন্টে পাসওয়ার্ড সেট করা নেই",
    SESSION_EXPIRED: "সেশনের মেয়াদ শেষ, আবার সাইন ইন করুন",
  };

  if (error.code && byCode[error.code]) return byCode[error.code];
  if (error.status === 401) return "আবার সাইন ইন করুন";
  if (error.status === 429)
    return "অনেকবার চেষ্টা করা হয়েছে, কিছুক্ষণ পরে আবার চেষ্টা করুন";
  if (error.message) return error.message;
  if (error.status && error.status >= 500)
    return `সার্ভার ত্রুটি (${error.status}) — টার্মিনালের লগ দেখুন`;
  return "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন";
}

export function Spinner({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      className={`animate-spin ${className}`}
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
  );
}

export function PasswordToggle({
  show,
  onToggle,
}: {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={show ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
      aria-pressed={show}
      className="grid size-9 cursor-pointer place-items-center rounded-xl text-slate-400 transition hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
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
  );
}

export function Field({
  label,
  icon,
  error,
  hint,
  right,
  ...input
}: {
  label: string;
  icon: keyof typeof ICONS;
  error?: string;
  hint?: string;
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
          aria-describedby={
            error ? `${id}-err` : hint ? `${id}-hint` : undefined
          }
          {...input}
          className={`h-12 w-full rounded-2xl border bg-slate-50/60 pl-11 ${
            right ? "pr-12" : "pr-4"
          } text-sm font-medium text-neutral outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-primary/40 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
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

      {error ? (
        <p
          id={`${id}-err`}
          role="alert"
          className="mt-1.5 text-xs font-semibold text-rose-600"
        >
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
