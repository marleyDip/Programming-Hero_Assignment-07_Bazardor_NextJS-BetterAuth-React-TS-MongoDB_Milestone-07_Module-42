import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";

export async function proxy(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    const pathname = request.nextUrl.pathname;

    const redirectTo = pathname.startsWith("/product") ? "/signup" : "/signin";

    // return NextResponse.redirect(new URL(redirectTo, request.url));

    const url = new URL(redirectTo, request.url);

    url.searchParams.set(
      "message",
      "এই পেজটি দেখতে প্রথমে আপনাকে লগইন করতে হবে।",
    );

    return NextResponse.redirect(url);
  }

  return NextResponse.next(); // allows authenticated users to continue.
}

export const config = {
  matcher: ["/profile/:path*", "/product/:path*"],
};

/* import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "./lib/auth";
import { headers } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  // const session = await getSession();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // console.log(session)

  const user = session?.user;

  if (!user) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

export const config = {
  matcher: ["/profile", "/product/:path"],
};

*/
