import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

/** Current Better Auth session on the server (deduped per request). */
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

/** Session → the small, serialisable user object the header needs. */
/* export async function getHeaderUser(): Promise<HeaderUser | null> {
  const session = await getSession().catch(() => null);
  if (!session?.user) return null;

  const { id, name, email, image, emailVerified } = session.user;
  return { id, name, email, image, emailVerified };
} */
