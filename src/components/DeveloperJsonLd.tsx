const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sofian-bazardor.vercel.app/";

export default function DeveloperJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "বাজার দর",
        inLanguage: "bn-BD",
        description: "নিত্যপ্রয়োজনীয় পণ্যের বাজারদর জানুন সহজেই।",
      },

      {
        "@type": "Person",
        "@id": `${SITE_URL}/#developer`,
        name: "Md Sofian Hasan",
        jobTitle: "Full-Stack Developer",
        url: "https://marleydip.netlify.app/",
        sameAs: [
          "https://github.com/marleyDip",
          "https://www.linkedin.com/in/sofian-hasan/",
          "https://www.facebook.com/MarleyDip1/",
        ],

        knowsAbout: [
          "Next.js",
          "betterAuth",
          "TypeScript",
          "Tailwind CSS",
          "MongoDB",
          "HeroUI",
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // escape "<" so the JSON can never close the script tag
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
