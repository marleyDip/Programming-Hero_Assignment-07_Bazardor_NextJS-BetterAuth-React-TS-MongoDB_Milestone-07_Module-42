import Hero from "@/components/Home/Hero";
import ProductSections from "@/components/Home/ProductSections";
import { fetchProducts } from "@/lib/api";

export default async function Home() {
  // await new Promise((r) => setTimeout(r, 4000));

  const products = await fetchProducts().catch(() => []);

  return (
    <>
      <Hero />
      <ProductSections products={products} />
    </>
  );
}
