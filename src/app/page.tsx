import Hero from "@/components/Home/Hero";
import ProductSections from "@/components/Home/ProductSections";
import { fetchCategories, fetchProducts } from "@/lib/api";
import { getHeaderUser } from "@/lib/auth-server";
import { getSiteStats } from "@/lib/site-stats";

export default async function Home() {
  // await new Promise((r) => setTimeout(r, 4000));

  // const products = await fetchProducts().catch(() => []);

  // Fetch everything in parallel.
  // Categories are only used for the hero totals, so a failure there shouldn't break the page.
  // Products are essential: if they fail the error boundary (app/error.tsx) takes over.

  const [products, categories, user] = await Promise.all([
    fetchProducts(),
    fetchCategories().catch(() => []),
    getHeaderUser(),
  ]);

  return (
    <>
      {/* <Hero /> */}

      {/* <Hero user={user} stats={getSiteStats(products, categories)} /> */}

      <Hero
        user={user}
        // the totals panel is only shown to signed-in users
        stats={user ? getSiteStats(products, categories) : undefined}
      />

      <ProductSections products={products} />

      {/* target of the hero's "সব পণ্যের দাম দেখুন" button (#সব-পণ্য) */}
      {/* <div id="সব-পণ্য" className="scroll-mt-32">
        <ProductSections products={products} />
      </div> */}
    </>
  );
}

/* 
const user = await getHeaderUser();

const stats = user
  ? getSiteStats(await fetchProducts(), await fetchCategories().catch(() => []))
  : undefined;

<Hero user={user} stats={stats} />

*/
