import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  // Core authenticated SaaS routes
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/budgets") ||
    pathname.startsWith("/transactions");

  // Protected REST API routes
  const isProtectedApiRoute =
    pathname.startsWith("/api/expenses") ||
    pathname.startsWith("/api/income") ||
    pathname.startsWith("/api/budgets") ||
    pathname.startsWith("/api/analytics") ||
    pathname.startsWith("/api/savings-goals");

  // Authentication portals
  const isAuthPortal = pathname.startsWith("/login") || pathname.startsWith("/register");

  // 1. Handle protected visual routes
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    const verified = await verifyJWT(token);
    if (!verified) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  // 2. Handle protected backend APIs (graceful JSON errors instead of redirecting)
  if (isProtectedApiRoute) {
    if (!token) {
      return NextResponse.json({ error: "Unauthorized. Please log in." }, { status: 401 });
    }
    const verified = await verifyJWT(token);
    if (!verified) {
      const response = NextResponse.json({ error: "Session expired. Please log in again." }, { status: 401 });
      response.cookies.delete("session");
      return response;
    }
  }

  // 3. Handle logged-in users visiting /login or /register (redirect to /dashboard)
  if (isAuthPortal) {
    if (token) {
      const verified = await verifyJWT(token);
      if (verified) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

// Map the routes that must activate this middleware for maximum performance
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analytics/:path*",
    "/budgets/:path*",
    "/transactions/:path*",
    "/login",
    "/register",
    "/api/expenses/:path*",
    "/api/income/:path*",
    "/api/budgets/:path*",
    "/api/analytics/:path*",
    "/api/savings-goals/:path*",
  ],
};
