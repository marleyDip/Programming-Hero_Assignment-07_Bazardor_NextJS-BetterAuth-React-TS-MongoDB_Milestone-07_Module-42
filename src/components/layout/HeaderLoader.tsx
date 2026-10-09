import { fetchCategories } from "@/lib/api";
import Header from "./Header";

export default async function HeaderLoader() {
  // await new Promise((r) => setTimeout(r, 4000));

  const categories = await fetchCategories().catch(() => []);

  return <Header categories={categories} />;
}
