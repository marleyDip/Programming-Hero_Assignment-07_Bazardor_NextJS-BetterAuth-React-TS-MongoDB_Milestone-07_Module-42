import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";

/** Current Better Auth session on the server (deduped per request). */
export const getSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

/**
 * Login methods linked to the current user, e.g. ["credential", "google"].
 * Returns null if it couldn't be determined.
 */
export async function getAccountProviders(): Promise<string[] | null> {
  try {
    const accounts = await auth.api.listUserAccounts({
      headers: await headers(),
    });
    return accounts.map((a) => a.providerId);
  } catch {
    return null;
  }
}

/** Session → the small, serialisable user object the header needs. */
/* export async function getHeaderUser(): Promise<HeaderUser | null> {
  const session = await getSession().catch(() => null);
  if (!session?.user) return null;

  const { id, name, email, image, emailVerified } = session.user;
  return { id, name, email, image, emailVerified };
} */
