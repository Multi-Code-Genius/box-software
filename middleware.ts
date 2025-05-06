import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/login", "/register", "/forgot-password"]; // Auth pages only

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    return accessToken
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.next();
  }

  if (!accessToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
