import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname, origin, search } = request.nextUrl;

  if (!session && pathname.startsWith("/foro")) {
    const loginUrl = new URL("/", origin);
    const returnTo = pathname + (search || "");
    loginUrl.searchParams.set("next", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  if (session && pathname === "/") {
      const panelUrl = new URL("/foro", origin);
      return NextResponse.redirect(panelUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/foro/:path*"],
};
