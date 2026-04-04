import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const url = req.nextUrl.pathname;

  // Public pages allowed
  if (
    url.startsWith("/products") ||
    url.startsWith("/login") ||
    url.startsWith("/")
  ) {
    return NextResponse.next();
  }

  // Protect dashboard
  if (!token && url.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect admin
  if (!token && url.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}   