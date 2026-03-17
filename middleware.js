// middleware.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // পাবলিক রুট — লগইন ছাড়াই ঢুকতে পারবে
  const publicPaths = ["/", "/login", "/api"];   // /api সাধারণত public রাখা ভালো

  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // টোকেন না থাকলে → লগইন পেজে পাঠাও
  if (!token) {
    console.log("No token → redirect to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // অ্যাডমিন রুট চেক (root + sub-path সব)
    const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");

    if (isAdminRoute) {
      if (decoded.role !== "admin") {
        console.log(`Non-admin trying to access ${pathname} → redirect to /`);
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // cashier রুট চেক (যদি থাকে)
    const isCashierRoute = pathname === "/my-accounting" || pathname.startsWith("/my-accounting/");

    if (isCashierRoute) {
      if (decoded.role !== "cashier") {
        console.log(`Non-cashier trying to access ${pathname} → redirect to /`);
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    // সব ঠিক থাকলে → পেজ দেখাও
    return NextResponse.next();

  } catch (err) {
    console.log("Invalid token:", err.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",          // /admin, /admin/anything
    "/admin",                 // root /admin page
    "/my-accounting/:path*",
    "/my-accounting"
  ]
};