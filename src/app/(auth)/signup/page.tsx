import AuthForm from "@/components/Auth/AuthForm";
import AuthHeader from "@/components/Auth/AuthHeader";
import { UserKey } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "সাইন আপ" };

export default function SignUpPage() {
  return (
    <AuthHeader
      title="নতুন অ্যাকাউন্ট খুলুন"
      subtitle="বিনামূল্যে যোগ দিন এবং সবচেয়ে সস্তা বাজারের খবর সবার আগে পান।"
      footer={
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center text-sm text-slate-500">
          <span className="font-medium">আগে থেকেই অ্যাকাউন্ট আছে?</span>
          <Link
            href="/signin"
            className="group inline-flex h-9 items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 text-xs font-bold text-primary transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
          >
            <UserKey
              size={14}
              className="transition-transform group-hover:scale-110 text-text-primary group-hover:text-white/90"
            />
            <span>সাইন ইন করুন</span>
          </Link>
        </div>
      }
    >
      <AuthForm mode="signup" />
    </AuthHeader>
  );
}

/* 
<Link
href="/signin"
className="font-extrabold text-primary hover:underline"
>
সাইন ইন করুন
</Link>

আগে থেকেই অ্যাকাউন্ট আছে?{" "}
<Link
  href="/signin"
  className="group inline-flex items-center gap-1.5 font-bold text-sm text-primary transition-colors duration-300 hover:text-secondary focus-visible:outline-none"
>
  <span className="relative py-0.5 after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-0 after:-translate-x-1/2 after:bg-secondary after:transition-all after:duration-300 group-hover:after:w-full">
    সাইন ইন করুন
  </span>

  <UserKey
    size={15}
    className="transition-transform duration-300 group-hover:translate-x-0.5 text-primary group-hover:text-secondary"
  />
</Link>

*/
