"use client";

import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Loader, Lock, Mail, User } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

type Mode = "signin" | "signup";
type Provider = "google" | "github";
type FieldKey = "name" | "email" | "password" | "confirm" | "agree";

const ICONS = {
  user: User,
  mail: Mail,
  lock: Lock,
} as const;

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

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

/** Better Auth error → friendly Bangla message. */
function authError(error: {
  code?: string;
  message?: string;
  status?: number;
  statusText?: string;
}) {
  const byCode: Record<string, string> = {
    USER_ALREADY_EXISTS: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে",
    USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
      "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে",

    INVALID_EMAIL_OR_PASSWORD: "ইমেইল বা পাসওয়ার্ড সঠিক নয়",
    INVALID_PASSWORD: "পাসওয়ার্ড সঠিক নয়",
    INVALID_EMAIL: "সঠিক ইমেইল দিন",

    PASSWORD_TOO_SHORT: "পাসওয়ার্ড খুব ছোট",
    PASSWORD_TOO_LONG: "পাসওয়ার্ড খুব বড়",
    EMAIL_NOT_VERIFIED: "আগে আপনার ইমেইল যাচাই করুন",
  };

  if (error.code && byCode[error.code]) return byCode[error.code];
  if (error.status === 429)
    return "অনেকবার চেষ্টা করা হয়েছে, কিছুক্ষণ পরে আবার চেষ্টা করুন";

  if (error.message) return error.message;

  if (error.status === 404)
    return "অথ রুট পাওয়া যায়নি (404) — /api/auth/[...all] রুট আছে কিনা দেখুন";

  if (error.status && error.status >= 500)
    return `সার্ভার ত্রুটি (${error.status}) — টার্মিনালের লগ দেখুন`;

  return "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন";
}

function Spinner({ className = "size-4" }: { className?: string }) {
  return <Loader strokeWidth="3" className={`animate-spin ${className}`} />;
}

function PasswordToggle({
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
      className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      {show ? (
        <EyeOff
          size={16}
          strokeWidth={2.2}
          className="transition-transform active:scale-95"
        />
      ) : (
        <Eye
          size={18}
          strokeWidth={2.2}
          className="transition-transform active:scale-95"
        />
      )}
    </button>
  );
}

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

  // Fix: Extract and capitalize the component reference so JSX can evaluate it properly
  const IconComponent = ICONS[icon];

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-bold text-neutral/80"
      >
        {label}
      </label>

      <div className="group relative">
        {/* Rendered cleanly using the capitalized variable name */}
        <IconComponent
          size={18} /* Standardized sizing */
          strokeWidth={2}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
        />

        <input
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-err` : undefined}
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

export default function AuthForm({
  mode,
  redirectTo = "/",
}: {
  mode: Mode;
  /** Where to go after a successful sign in / sign up. */
  redirectTo?: string;
}) {
  const signup = mode === "signup";
  const router = useRouter();

  const searchParams = useSearchParams();
  const toastShown = useRef(false);

  useEffect(() => {
    const message = searchParams.get("message");

    if (message && !toastShown.current) {
      toastShown.current = true;
      toast.error(message);

      router.replace(window.location.pathname);
    }
  }, [searchParams, router]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [conformShow, setConformShow] = useState(false);

  const [agree, setAgree] = useState(false);
  const [remember, setRemember] = useState(true);

  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [loading, setLoading] = useState(false);

  const [social, setSocial] = useState<Provider | null>(null);

  const busy = loading || social !== null;
  const score = useMemo(() => strength(password), [password]);

  /** Clear a field's error as soon as the user edits it. */
  const clear = (key: FieldKey) =>
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

  const validate = () => {
    const e: Partial<Record<FieldKey, string>> = {};

    if (signup && name.trim().length < 2) e.name = "আপনার নাম লিখুন";

    if (!email.trim()) e.email = "ইমেইল দিন";
    else if (!isEmail(email.trim()))
      e.email = "সঠিক ইমেইল দিন (যেমন: you@example.com)";

    if (!password) e.password = "পাসওয়ার্ড দিন";
    else if (signup && password.length < 8)
      e.password = "কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন";

    if (signup) {
      if (!confirm) e.confirm = "পাসওয়ার্ডটি আবার লিখুন";
      else if (confirm !== password) e.confirm = "পাসওয়ার্ড মিলছে না";
      if (!agree) e.agree = "চালিয়ে যেতে শর্তাবলিতে সম্মত হতে হবে";
    }

    return e;
  };

  // Email & password submit
  const onSubmit = async (event: React.SubmitEvent<HTMLElement>) => {
    event.preventDefault();
    if (busy) return;

    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    const toastId = toast.loading(
      signup ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "সাইন ইন হচ্ছে…",
      {
        className: "toast-custom toast-info",
      },
    );

    try {
      const cleanEmail = email.trim().toLowerCase();

      const { error } = signup
        ? await authClient.signUp.email({
            name: name.trim(),
            email: cleanEmail,
            password,
            callbackURL: redirectTo,
          })
        : await authClient.signIn.email({
            email: cleanEmail,
            password,
            rememberMe: remember,
            callbackURL: redirectTo,
          });

      if (error) {
        // Dev only: shows the real Better Auth status / code / message.
        if (process.env.NODE_ENV !== "production")
          console.error("[auth]", error);

        toast.error(authError(error), { id: toastId });

        setLoading(false);
        return;
      }

      toast.success(
        signup
          ? "অ্যাকাউন্ট তৈরি হয়েছে! স্বাগতম 🎉"
          : "সফলভাবে সাইন ইন হয়েছে!",
        { id: toastId },
      );

      // keep the spinner on until the navigation finishes
      router.push(redirectTo);
      router.refresh();
    } catch {
      toast.error("নেটওয়ার্কে সমস্যা হয়েছে, আবার চেষ্টা করুন", {
        id: toastId,
      });
      setLoading(false);
    }
  };

  // Social sign in (redirects the browser to the provider)
  const onSocial = async (provider: Provider) => {
    if (busy) return;
    setSocial(provider);

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: redirectTo,
      });

      if (error) {
        toast.error(authError(error));
        setSocial(null);
      }
    } catch {
      toast.error("নেটওয়ার্কে সমস্যা হয়েছে, আবার চেষ্টা করুন");
      setSocial(null);
    }
  };

  const socialBtn =
    "flex h-12 items-center justify-center gap-2.5 rounded-2xl border border-base-300 bg-white text-sm font-bold text-neutral shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer";

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {/* Social */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => onSocial("google")}
          className={`${socialBtn} hover:border-primary/40`}
        >
          {social === "google" ? (
            <Spinner className="size-4.5" />
          ) : (
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
          )}
          Google
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => onSocial("github")}
          className={`${socialBtn} hover:border-neutral/60 hover:bg-neutral hover:text-white`}
        >
          {social === "github" ? (
            <Spinner className="size-4.5" />
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          )}
          GitHub
        </button>
      </div>

      <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
        <span className="h-px flex-1 bg-base-300" />
        অথবা ইমেইল দিয়ে
        <span className="h-px flex-1 bg-base-300" />
      </div>

      {signup && (
        <Field
          label="আপনার নাম"
          icon="user"
          autoComplete="name"
          placeholder="যেমন: রাহিম উদ্দিন"
          value={name}
          disabled={busy}
          onChange={(e) => {
            setName(e.target.value);
            clear("name");
          }}
          error={errors.name}
        />
      )}

      <Field
        label="ইমেইল"
        icon="mail"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        disabled={busy}
        onChange={(e) => {
          setEmail(e.target.value);
          clear("email");
        }}
        error={errors.email}
      />

      <div>
        <Field
          label="পাসওয়ার্ড"
          icon="lock"
          type={show ? "text" : "password"}
          autoComplete={signup ? "new-password" : "current-password"}
          placeholder={signup ? "কমপক্ষে ৮ অক্ষর" : "আপনার পাসওয়ার্ড"}
          value={password}
          disabled={busy}
          onChange={(e) => {
            setPassword(e.target.value);
            clear("password");
          }}
          error={errors.password}
          right={
            <PasswordToggle show={show} onToggle={() => setShow((s) => !s)} />
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

      {signup && (
        <div>
          <Field
            label="পাসওয়ার্ড নিশ্চিত করুন"
            icon="lock"
            type={conformShow ? "text" : "password"}
            autoComplete="new-password"
            placeholder="পাসওয়ার্ডটি আবার লিখুন"
            value={confirm}
            disabled={busy}
            onChange={(e) => {
              setConfirm(e.target.value);
              clear("confirm");
            }}
            error={errors.confirm}
            right={
              <PasswordToggle
                show={conformShow}
                onToggle={() => setConformShow((s) => !s)}
              />
            }
          />

          {confirm && !errors.confirm && confirm === password && (
            <p className="mt-1.5 text-xs font-semibold text-emerald-600">
              ✓ পাসওয়ার্ড মিলেছে
            </p>
          )}
        </div>
      )}

      {signup ? (
        <div>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={agree}
              disabled={busy}
              onChange={(e) => {
                setAgree(e.target.checked);
                clear("agree");
              }}
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
              disabled={busy}
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
        disabled={busy}
        className="relative inline-flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-primary text-sm font-extrabold text-primary-content shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-xl hover:shadow-primary/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
      >
        <span className="relative z-10 inline-flex items-center gap-2">
          {loading && <Spinner />}
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

// "use client";

// import { authClient } from "@/lib/auth-client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useId, useMemo, useState } from "react";
// import toast from "react-hot-toast";

// type Mode = "signin" | "signup";
// type Provider = "google" | "github";
// type FieldKey = "name" | "email" | "password" | "confirm" | "agree";

// const ICONS = {
//   user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
//   mail: "M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1zm0 1 8 6 8-6",
//   lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z",
// } as const;

// const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// function strength(pw: string) {
//   let score = 0;
//   if (pw.length >= 8) score++;
//   if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
//   if (/\d/.test(pw)) score++;
//   if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) score++;
//   return score; // 0..4
// }

// const STRENGTH = [
//   { label: "খুব দুর্বল", bar: "bg-rose-500" },
//   { label: "দুর্বল", bar: "bg-rose-500" },
//   { label: "মোটামুটি", bar: "bg-amber-500" },
//   { label: "ভালো", bar: "bg-lime-500" },
//   { label: "শক্তিশালী", bar: "bg-emerald-500" },
// ] as const;

// /** Better Auth error → friendly Bangla message. */
// function authError(error: {
//   code?: string;
//   message?: string;
//   status?: number;
// }) {
//   const byCode: Record<string, string> = {
//     USER_ALREADY_EXISTS: "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে",
//     USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
//       "এই ইমেইল দিয়ে আগেই অ্যাকাউন্ট খোলা হয়েছে",
//     INVALID_EMAIL_OR_PASSWORD: "ইমেইল বা পাসওয়ার্ড সঠিক নয়",
//     INVALID_PASSWORD: "পাসওয়ার্ড সঠিক নয়",
//     INVALID_EMAIL: "সঠিক ইমেইল দিন",
//     PASSWORD_TOO_SHORT: "পাসওয়ার্ড খুব ছোট",
//     PASSWORD_TOO_LONG: "পাসওয়ার্ড খুব বড়",
//     EMAIL_NOT_VERIFIED: "আগে আপনার ইমেইল যাচাই করুন",
//   };

//   if (error.code && byCode[error.code]) return byCode[error.code];
//   if (error.status === 429)
//     return "অনেকবার চেষ্টা করা হয়েছে, কিছুক্ষণ পরে আবার চেষ্টা করুন";
//   return error.message || "কিছু একটা ভুল হয়েছে, আবার চেষ্টা করুন";
// }

// function Spinner({ className = "size-4" }: { className?: string }) {
//   return (
//     <svg
//       className={`animate-spin ${className}`}
//       viewBox="0 0 24 24"
//       fill="none"
//       aria-hidden
//     >
//       <circle
//         cx="12"
//         cy="12"
//         r="10"
//         stroke="currentColor"
//         strokeWidth="3"
//         opacity=".25"
//       />
//       <path
//         d="M22 12a10 10 0 0 0-10-10"
//         stroke="currentColor"
//         strokeWidth="3"
//         strokeLinecap="round"
//       />
//     </svg>
//   );
// }

// function PasswordToggle({
//   show,
//   onToggle,
// }: {
//   show: boolean;
//   onToggle: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onToggle}
//       aria-label={show ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
//       aria-pressed={show}
//       className="grid size-9 place-items-center rounded-xl text-slate-400 transition hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
//     >
//       <svg
//         width="18"
//         height="18"
//         viewBox="0 0 24 24"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         aria-hidden
//       >
//         {show ? (
//           <>
//             <path d="M17.9 17.9A10.9 10.9 0 0 1 12 20C5 20 1 12 1 12a18.5 18.5 0 0 1 5.1-5.9M9.9 4.2A10.9 10.9 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.2 3.2M1 1l22 22" />
//             <path d="M14.1 14.1a3 3 0 1 1-4.2-4.2" />
//           </>
//         ) : (
//           <>
//             <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
//             <circle cx="12" cy="12" r="3" />
//           </>
//         )}
//       </svg>
//     </button>
//   );
// }

// function Field({
//   label,
//   icon,
//   error,
//   right,
//   ...input
// }: {
//   label: string;
//   icon: keyof typeof ICONS;
//   error?: string;
//   right?: React.ReactNode;
// } & React.InputHTMLAttributes<HTMLInputElement>) {
//   const id = useId();

//   return (
//     <div>
//       <label
//         htmlFor={id}
//         className="mb-1.5 block text-sm font-bold text-neutral/80"
//       >
//         {label}
//       </label>

//       <div className="group relative">
//         <svg
//           width="18"
//           height="18"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           aria-hidden
//           className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary"
//         >
//           <path d={ICONS[icon]} />
//         </svg>

//         <input
//           id={id}
//           aria-invalid={!!error}
//           aria-describedby={error ? `${id}-err` : undefined}
//           {...input}
//           className={`h-12 w-full rounded-2xl border bg-slate-50/60 pl-11 ${
//             right ? "pr-12" : "pr-4"
//           } text-sm font-medium text-neutral outline-none transition placeholder:font-normal placeholder:text-slate-400 hover:border-primary/40 focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
//             error
//               ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/10"
//               : "border-base-300 focus:border-primary/60 focus:ring-primary/10"
//           }`}
//         />

//         {right && (
//           <div className="absolute right-2 top-1/2 -translate-y-1/2">
//             {right}
//           </div>
//         )}
//       </div>

//       {error && (
//         <p
//           id={`${id}-err`}
//           role="alert"
//           className="mt-1.5 text-xs font-semibold text-rose-600"
//         >
//           {error}
//         </p>
//       )}
//     </div>
//   );
// }

// export default function AuthForm({
//   mode,
//   redirectTo = "/",
// }: {
//   mode: Mode;
//   /** Where to go after a successful sign in / sign up. */
//   redirectTo?: string;
// }) {
//   const signup = mode === "signup";
//   const router = useRouter();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [show, setShow] = useState(false);
//   const [agree, setAgree] = useState(false);
//   const [remember, setRemember] = useState(true);
//   const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
//   const [loading, setLoading] = useState(false);
//   const [social, setSocial] = useState<Provider | null>(null);

//   const busy = loading || social !== null;
//   const score = useMemo(() => strength(password), [password]);

//   /** Clear a field's error as soon as the user edits it. */
//   const clear = (key: FieldKey) =>
//     setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));

//   const validate = () => {
//     const e: Partial<Record<FieldKey, string>> = {};

//     if (signup && name.trim().length < 2) e.name = "আপনার নাম লিখুন";

//     if (!email.trim()) e.email = "ইমেইল দিন";
//     else if (!isEmail(email.trim()))
//       e.email = "সঠিক ইমেইল দিন (যেমন: you@example.com)";

//     if (!password) e.password = "পাসওয়ার্ড দিন";
//     else if (signup && password.length < 8)
//       e.password = "কমপক্ষে ৮ অক্ষরের পাসওয়ার্ড দিন";

//     if (signup) {
//       if (!confirm) e.confirm = "পাসওয়ার্ডটি আবার লিখুন";
//       else if (confirm !== password) e.confirm = "পাসওয়ার্ড মিলছে না";
//       if (!agree) e.agree = "চালিয়ে যেতে শর্তাবলিতে সম্মত হতে হবে";
//     }

//     return e;
//   };

//   // Email & password submit
//   const onSubmit = async (event: React.SubmitEvent<HTMLElement>) => {
//     event.preventDefault();
//     if (busy) return;

//     const e = validate();
//     setErrors(e);
//     if (Object.keys(e).length) return;

//     setLoading(true);
//     const toastId = toast.loading(
//       signup ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "সাইন ইন হচ্ছে…",
//     );

//     try {
//       const cleanEmail = email.trim().toLowerCase();

//       const { error } = signup
//         ? await authClient.signUp.email({
//             name: name.trim(),
//             email: cleanEmail,
//             password,
//             callbackURL: redirectTo,
//           })
//         : await authClient.signIn.email({
//             email: cleanEmail,
//             password,
//             rememberMe: remember,
//             callbackURL: redirectTo,
//           });

//       if (error) {
//         toast.error(authError(error), { id: toastId });
//         setLoading(false);
//         return;
//       }

//       toast.success(
//         signup
//           ? "অ্যাকাউন্ট তৈরি হয়েছে! স্বাগতম 🎉"
//           : "সফলভাবে সাইন ইন হয়েছে!",
//         { id: toastId },
//       );

//       // keep the spinner on until the navigation finishes
//       router.push(redirectTo);
//       router.refresh();
//     } catch {
//       toast.error("নেটওয়ার্কে সমস্যা হয়েছে, আবার চেষ্টা করুন", {
//         id: toastId,
//       });
//       setLoading(false);
//     }
//   };

//   // Social sign in (redirects the browser to the provider)
//   const onSocial = async (provider: Provider) => {
//     if (busy) return;
//     setSocial(provider);

//     try {
//       const { error } = await authClient.signIn.social({
//         provider,
//         callbackURL: redirectTo,
//       });

//       if (error) {
//         toast.error(authError(error));
//         setSocial(null);
//       }
//     } catch {
//       toast.error("নেটওয়ার্কে সমস্যা হয়েছে, আবার চেষ্টা করুন");
//       setSocial(null);
//     }
//   };

//   const socialBtn =
//     "flex h-12 items-center justify-center gap-2.5 rounded-2xl border border-base-300 bg-white text-sm font-bold text-neutral shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer";

//   return (
//     <form onSubmit={onSubmit} noValidate className="space-y-4">
//       {/* Social */}
//       <div className="grid grid-cols-2 gap-3">
//         <button
//           type="button"
//           disabled={busy}
//           onClick={() => onSocial("google")}
//           className={`${socialBtn} hover:border-primary/40`}
//         >
//           {social === "google" ? (
//             <Spinner className="size-4.5" />
//           ) : (
//             <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
//               <path
//                 fill="#FFC107"
//                 d="M43.6 20.1H42V20H24v8h11.3A12 12 0 1 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 1 0 44 24c0-1.3-.1-2.6-.4-3.9z"
//               />
//               <path
//                 fill="#FF3D00"
//                 d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7A20 20 0 0 0 6.3 14.7z"
//               />
//               <path
//                 fill="#4CAF50"
//                 d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A12 12 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"
//               />
//               <path
//                 fill="#1976D2"
//                 d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"
//               />
//             </svg>
//           )}
//           Google
//         </button>

//         <button
//           type="button"
//           disabled={busy}
//           onClick={() => onSocial("github")}
//           className={`${socialBtn} hover:border-neutral/60 hover:bg-neutral hover:text-white`}
//         >
//           {social === "github" ? (
//             <Spinner className="size-4.5" />
//           ) : (
//             <svg
//               width="18"
//               height="18"
//               viewBox="0 0 24 24"
//               fill="currentColor"
//               aria-hidden
//             >
//               <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
//             </svg>
//           )}
//           GitHub
//         </button>
//       </div>

//       <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
//         <span className="h-px flex-1 bg-base-300" />
//         অথবা ইমেইল দিয়ে
//         <span className="h-px flex-1 bg-base-300" />
//       </div>

//       {signup && (
//         <Field
//           label="আপনার নাম"
//           icon="user"
//           autoComplete="name"
//           placeholder="যেমন: সুফিয়ান হাসান"
//           value={name}
//           disabled={busy}
//           onChange={(e) => {
//             setName(e.target.value);
//             clear("name");
//           }}
//           error={errors.name}
//         />
//       )}

//       <Field
//         label="ইমেইল"
//         icon="mail"
//         type="email"
//         inputMode="email"
//         autoComplete="email"
//         placeholder="you@example.com"
//         value={email}
//         disabled={busy}
//         onChange={(e) => {
//           setEmail(e.target.value);
//           clear("email");
//         }}
//         error={errors.email}
//       />

//       <div>
//         <Field
//           label="পাসওয়ার্ড"
//           icon="lock"
//           type={show ? "text" : "password"}
//           autoComplete={signup ? "new-password" : "current-password"}
//           placeholder={signup ? "কমপক্ষে ৮ অক্ষর" : "আপনার পাসওয়ার্ড"}
//           value={password}
//           disabled={busy}
//           onChange={(e) => {
//             setPassword(e.target.value);
//             clear("password");
//           }}
//           error={errors.password}
//           right={
//             <PasswordToggle show={show} onToggle={() => setShow((s) => !s)} />
//           }
//         />

//         {signup && password && (
//           <div className="mt-2" aria-live="polite">
//             <div className="flex gap-1">
//               {[0, 1, 2, 3].map((i) => (
//                 <span
//                   key={i}
//                   className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
//                     i < score ? STRENGTH[score].bar : "bg-slate-200"
//                   }`}
//                 />
//               ))}
//             </div>
//             <p className="mt-1 text-xs font-semibold text-slate-500">
//               পাসওয়ার্ড: {STRENGTH[score].label}
//             </p>
//           </div>
//         )}
//       </div>

//       {signup && (
//         <div>
//           <Field
//             label="পাসওয়ার্ড নিশ্চিত করুন"
//             icon="lock"
//             type={show ? "text" : "password"}
//             autoComplete="new-password"
//             placeholder="পাসওয়ার্ডটি আবার লিখুন"
//             value={confirm}
//             disabled={busy}
//             onChange={(e) => {
//               setConfirm(e.target.value);
//               clear("confirm");
//             }}
//             error={errors.confirm}
//             right={
//               <PasswordToggle show={show} onToggle={() => setShow((s) => !s)} />
//             }
//           />
//           {confirm && !errors.confirm && confirm === password && (
//             <p className="mt-1.5 text-xs font-semibold text-emerald-600">
//               ✓ পাসওয়ার্ড মিলেছে
//             </p>
//           )}
//         </div>
//       )}

//       {signup ? (
//         <div>
//           <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-600">
//             <input
//               type="checkbox"
//               checked={agree}
//               disabled={busy}
//               onChange={(e) => {
//                 setAgree(e.target.checked);
//                 clear("agree");
//               }}
//               className="mt-0.5 size-4 shrink-0 cursor-pointer rounded border-base-300 accent-primary"
//             />
//             <span>
//               আমি{" "}
//               <Link
//                 href="/terms"
//                 className="font-bold text-primary hover:underline"
//               >
//                 শর্তাবলি
//               </Link>{" "}
//               ও{" "}
//               <Link
//                 href="/privacy"
//                 className="font-bold text-primary hover:underline"
//               >
//                 গোপনীয়তা নীতি
//               </Link>{" "}
//               মেনে নিচ্ছি
//             </span>
//           </label>

//           {errors.agree && (
//             <p
//               role="alert"
//               className="mt-1.5 text-xs font-semibold text-rose-600"
//             >
//               {errors.agree}
//             </p>
//           )}
//         </div>
//       ) : (
//         <div className="flex items-center justify-between text-sm">
//           <label className="flex cursor-pointer items-center gap-2 text-slate-600">
//             <input
//               type="checkbox"
//               checked={remember}
//               disabled={busy}
//               onChange={(e) => setRemember(e.target.checked)}
//               className="size-4 cursor-pointer rounded border-base-300 accent-primary"
//             />
//             মনে রাখুন
//           </label>

//           <Link
//             href="/forgot-password"
//             className="font-bold text-primary hover:underline"
//           >
//             পাসওয়ার্ড ভুলে গেছেন?
//           </Link>
//         </div>
//       )}

//       <button
//         type="submit"
//         disabled={busy}
//         className="relative inline-flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-primary text-sm font-extrabold text-primary-content shadow-lg shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-secondary hover:shadow-xl hover:shadow-primary/30 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
//       >
//         <span className="relative z-10 inline-flex items-center gap-2">
//           {loading && <Spinner />}
//           {loading
//             ? "অপেক্ষা করুন…"
//             : signup
//               ? "অ্যাকাউন্ট তৈরি করুন"
//               : "সাইন ইন করুন"}
//         </span>
//       </button>
//     </form>
//   );
// }
