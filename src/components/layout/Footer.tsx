export default function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-primary">
          🛒 বাজার দর —{" "}
          <span className="font-normal text-base-content/70">
            প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </span>
        </p>

        <p className="text-base-content/60 sm:text-right">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}

// export default function Footer() {
//   return (
//     <footer className="mt-20 border-t border-base-300 bg-white">
//       <div className="mx-auto max-w-6xl flex flex-col gap-4 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
//         <div>
//           <div className="font-extrabold text-base-content">বাজার দর</div>

//           <p className="mt-1">প্রয়োজনীয় পণ্যের দাম এক নজরে।</p>
//         </div>

//         <p className="max-w-md sm:text-right">
//           সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
//         </p>
//       </div>
//     </footer>
//   );
// }

// import Link from "next/link";

// const FOOTER_LINKS = [
//   { label: "হোম", href: "/" },
//   { label: "পণ্যের দাম", href: "/#products" },
//   { label: "বাজার সম্পর্কে", href: "/#about" },
// ];

// export default function Footer() {
//   return (
//     <footer className="mt-20 border-t border-base-300 bg-base-100">
//       <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
//           {/* Brand */}
//           <div>
//             <Link
//               href="/"
//               className="inline-flex items-center gap-2"
//               aria-label="বাজার দর হোম"
//             >
//               <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-lg font-black text-primary-content">
//                 ব
//               </span>

//               <span className="text-xl font-extrabold tracking-tight text-base-content">
//                 বাজার দর
//               </span>
//             </Link>

//             <p className="mt-4 max-w-xs text-sm leading-7 text-base-content/65">
//               নিত্যপ্রয়োজনীয় পণ্যের বাজারদর জানুন সহজেই। সঠিক তথ্যের মাধ্যমে
//               কেনাকাটার সিদ্ধান্ত নিন সচেতনভাবে।
//             </p>
//           </div>

//           {/* Quick Links */}
//           <div>
//             <h3 className="text-sm font-bold text-base-content">দ্রুত লিংক</h3>

//             <ul className="mt-4 space-y-3">
//               {FOOTER_LINKS.map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     className="text-sm text-base-content/65 transition-colors hover:text-primary"
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Price Disclaimer */}
//           <div>
//             <h3 className="text-sm font-bold text-base-content">
//               মূল্য সম্পর্কিত তথ্য
//             </h3>

//             <p className="mt-4 text-sm leading-7 text-base-content/65">
//               প্রদর্শিত দাম বাজার, স্থান, সময় এবং পণ্যের মান অনুযায়ী পরিবর্তিত
//               হতে পারে। কেনার আগে স্থানীয় বাজারে দাম যাচাই করুন।
//             </p>

//             <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-base-300 px-3 py-1.5 text-xs text-base-content/70">
//               <span className="size-2 rounded-full bg-success" />
//               তথ্য যাচাই করে কেনাকাটা করুন
//             </div>
//           </div>
//         </div>

//         {/* Bottom Bar */}
//         <div className="mt-10 flex flex-col gap-3 border-t border-base-300 pt-6 text-xs text-base-content/55 sm:flex-row sm:items-center sm:justify-between">
//           <p>© {new Date().getFullYear()} বাজার দর। সর্বস্বত্ব সংরক্ষিত।</p>

//           <p>সচেতন কেনাকাটা, সাশ্রয়ী জীবন।</p>
//         </div>
//       </div>
//     </footer>
//   );
// }
