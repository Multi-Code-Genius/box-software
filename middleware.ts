import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/dashboard", "/profile", "/home"];
const authRoutes = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (authRoutes.includes(pathname)) {
    return accessToken
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    return accessToken
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", request.url));
  }

  return accessToken
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/",
    "/dashboard",
    "/profile",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
