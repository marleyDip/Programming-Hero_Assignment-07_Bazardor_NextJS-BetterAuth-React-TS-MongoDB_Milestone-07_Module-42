import SplashScreen from "@/components/Common/SplashScreen";
import PriceTicker from "@/components/Home/PriceTicker";
import Footer from "@/components/layout/Footer";
import HeaderLoader from "@/components/layout/HeaderLoader";
import { fetchProducts } from "@/lib/api";
import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import React from "react";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["400", "500", "600", "700"],
  // variable: "--font-hind",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // default: "বাজার দর — নিত্যপণ্যের দাম এক নজরে",
    default: "বাজার দর | প্রয়োজনীয় নিত্যপণ্যের দাম এক নজরে",
    template: "%s | বাজার দর",
  },
  description:
    "বাংলাদেশের বাজারে চাল, ডাল, তেল, সবজি, মাছ ও মাংসের নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম এক নজরে দেখুন।",

  // description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের আজকের বাজারদর এক নজরে দেখুন।",

  keywords: ["বাজার দর", "বাংলাদেশ", "পণ্যের দাম", "BazarDor"],

  openGraph: {
    title: "বাজার দর — নিত্যপণ্যের দাম এক নজরে",
    description: "চাল, ডাল, তেল, সবজি, মাছ, মাংস ও মসলার দাম এক জায়গায়।",
    type: "website",
    locale: "bn_BD",
    url: SITE_URL,
    siteName: "বাজার দর",
  },

  twitter: {
    card: "summary_large_image",
    title: "বাজার দর",
    description: "বাংলাদেশের নিত্যপণ্যের বাজারদর এক নজরে।",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#05893e",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await fetchProducts().catch(() => []);

  return (
    <html lang="bn" className={hind.className}>
      <body className="min-h-screen flex flex-col bg-base-200 text-base-content">
        <SplashScreen />

        <HeaderLoader />

        <PriceTicker products={products} />

        <main className="w-full min-w-0 flex-1">{children}</main>

        <Footer />

        <Toaster
          position="top-center"
          reverseOrder={false}
          gutter={12}
          toastOptions={{
            duration: 3500,

            style: {
              background: "#111827",
              color: "#f9fafb",
              border: "1px solid rgba(148, 163, 184, 0.2)",
              borderRadius: "14px",
              padding: "14px 18px",
              fontSize: "14px",
              fontWeight: 500,
              boxShadow: "0 12px 35px rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(16px)",
              maxWidth: "420px",
            },

            success: {
              duration: 3000,

              iconTheme: {
                primary: "#1a9951",
                secondary: "#ffffff",
              },
            },

            error: {
              duration: 3000,

              iconTheme: {
                primary: "#dc2626",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
