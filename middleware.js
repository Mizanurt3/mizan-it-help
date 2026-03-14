export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 🔹 লগইন ছাড়া পাবলিক রুট
  const publicPaths = ["/", "/login"];

  // পাবলিক পেজে গেলে কোনো চেক লাগবে না
  if (publicPaths.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // ✅ প্রোটেক্টেড রুট: admin বা my-accounting
  if (!token) {
    console.log("⛔ কোনো টোকেন নেই → রিডাইরেক্ট /login");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (pathname.startsWith("/admin") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (pathname.startsWith("/my-accounting") && decoded.role !== "cashier") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.log("⛔ Token Invalid:", err.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/my-accounting/:path*"], // ✅ শুধু এই দুই রুট প্রোটেক্ট হবে
};
