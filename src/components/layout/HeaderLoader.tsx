import { fetchCategories } from "@/lib/api";
import Header from "./Header";

export default async function HeaderLoader() {
  // await new Promise((r) => setTimeout(r, 4000));

  const categories = await fetchCategories().catch(() => []);

  return <Header categories={categories} />;
}

/* 
import { getHeaderUser } from "@/lib/auth-server";

export default async function HeaderLoader() {
  // fetch in parallel so the session doesn't slow the categories down
  const [categories, user] = await Promise.all([
    fetchCategories().catch(() => []),
    getHeaderUser(),
  ]);

  return <Header categories={categories} user={user} />;
} */
