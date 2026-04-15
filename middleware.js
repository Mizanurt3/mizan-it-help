// middleware.js
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // CORS Headers — সব রিকোয়েস্টের জন্য (Extension + localhost + vercel)
  const response = NextResponse.next();

  response.headers.set("Access-Control-Allow-Origin", "*");           // ডেবাগের জন্য *
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // Preflight (OPTIONS) request হ্যান্ডেল
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { 
      status: 200, 
      headers: response.headers 
    });
  }


  // পাবলিক রুট — লগইন ছাড়াই ঢুকতে পারবে
  const publicPaths = [
    "/", 
    "/login", 
    "/api", 
    "/api/login", 
    "/api/login-user", 
    "/api/job/fetch",
    "/api/job/fetch-all",
    "/test",
    "job-applicants-admin"
  ];

  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return response;   // CORS headers সহ রিটার্ন
  }

  // টোকেন না থাকলে → লগইন পেজে পাঠাও
  if (!token) {
    console.log("No token → redirect to /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const isAdminRoute = pathname === "/admin" || pathname.startsWith("/admin/");
    if (isAdminRoute) {
      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    const isCashierRoute = pathname === "/my-accounting" || pathname.startsWith("/my-accounting/");
    if (isCashierRoute) {
      if (decoded.role !== "cashier") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return response;   // CORS headers সহ

  } catch (err) {
    console.log("Invalid token:", err.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};