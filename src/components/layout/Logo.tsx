import { todayBanglaDate } from "@/lib/formatters";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" aria-label="বাজার দর - হোম পেজ" className="group shrink-0">
      <div className="flex items-center gap-2.5">
        {/* Logo mark */}
        <div className="relative">
          {/* Soft hover glow */}
          <div className="absolute inset-0 rounded-xl bg-primary/20 opacity-0 blur-md transition-all duration-300 group-hover:opacity-100" />

          <div className="relative grid size-10 place-items-center overflow-hidden rounded-xl bg-primary text-primary-content shadow-sm shadow-primary/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:rounded-[13px] group-hover:shadow-lg group-hover:shadow-primary/25">
            {/* Shine effect */}
            <span className="shine-base bg-linear-to-r from-transparent via-white/20 to-transparent" />

            <ShoppingCart
              size={19}
              strokeWidth={2.2}
              className="relative z-10 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
            />
          </div>
        </div>

        {/* Brand information */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-lg/[1.4] font-bold tracking-tight text-neutral transition-colors duration-200 md:text-xl/[1.4] group-hover:text-primary">
            বাজার দর
            {/* Brand accent */}
            <span className="size-1.5 rounded-full bg-accent opacity-70 transition-all duration-300 group-hover:scale-125 group-hover:opacity-100" />
          </div>

          <div className="text-xs/[1.33] text-neutral/55 transition-colors duration-200 group-hover:text-neutral/70">
            {todayBanglaDate()}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* import { todayBanglaDate } from "@/lib/formatters";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="shrink-0">
      <div className="flex items-center gap-2">
        <span className="grid size-10 place-items-center rounded-xl bg-primary text-white">
          <ShoppingCart size={19} />
        </span>

        <div>
          <div className="text-lg/[1.4] md:text-xl/[1.4] font-bold tracking-tight">
            বাজার দর
          </div>

          <div className="text-xs/[1.33]  ">{todayBanglaDate()}</div>
        </div>
      </div>
    </Link>
  );
} */
