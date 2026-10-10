import AuthForm from "@/components/Auth/AuthForm";
import AuthHeader from "@/components/Auth/AuthHeader";
import { UserPlus } from "lucide-react";

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "সাইন ইন" };

export default function SignInPage() {
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  return (
    <AuthHeader
      title="স্বাগতম, ফিরে এসেছেন!"
      subtitle="আপনার অ্যাকাউন্টে সাইন ইন করে প্রিয় পণ্যের দাম ও বাজেট হিসাব দেখুন।"
      footer={
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-sm text-slate-500">
          <span className="font-medium">অ্যাকাউন্ট নেই?</span>
          <Link
            href="/signup"
            className="group inline-flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold text-slate-700 transition-all duration-300 hover:border-primary hover:bg-primary/5 hover:text-primary shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/25"
          >
            <UserPlus
              size={14}
              className="transition-transform group-hover:scale-110 text-slate-400 group-hover:text-primary"
            />
            <span>সাইন আপ করুন</span>
          </Link>
        </div>
      }
    >
      <AuthForm mode="signin" />
    </AuthHeader>
  );
}

/* 
<Link
  href="/signup"
  className="font-extrabold text-primary hover:underline"
>
  সাইন আপ করুন
</Link>
*/
