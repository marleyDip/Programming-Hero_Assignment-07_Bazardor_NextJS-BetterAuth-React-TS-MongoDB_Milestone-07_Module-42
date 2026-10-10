import ProfileView from "@/components/Profile/ProfileView";
import { getAccountProviders, getSession } from "@/lib/auth-server";

import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "আমার প্রোফাইল" };

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const session = await getSession();
  if (!session?.user) redirect("/signin");

  const [providers, { tab }] = await Promise.all([
    getAccountProviders(),
    searchParams,
  ]);

  const { id, name, email, image, emailVerified, createdAt } = session.user;

  return (
    <ProfileView
      user={{
        id,
        name,
        email,
        image,
        emailVerified,
        createdAt: new Date(createdAt).toISOString(),
      }}
      providers={providers}
      initialTab={tab === "security" ? "security" : "profile"}
    />
  );
}
