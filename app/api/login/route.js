import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    // 🔹 ইউজার খোঁজা
    const result = await pool.query(
      "SELECT cashier_id, name, role, password_hash = crypt($1, password_hash) AS valid FROM cashiers WHERE email = $2",
      [password, email]
    );

    const user = result.rows[0];
    if (!user) {
      return NextResponse.json({ error: "❌ ইউজার পাওয়া যায়নি" }, { status: 404 });
    }

    if (!user.valid) {
      return NextResponse.json({ error: "❌ পাসওয়ার্ড সঠিক নয়" }, { status: 401 });
    }

    // 🔹 JWT টোকেন তৈরি
    const token = jwt.sign(
      { id: user.cashier_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 🔹 কুকিতে JWT সেট করা
    const response = NextResponse.json({
      message: "✅ লগইন সফল হয়েছে",
      role: user.role,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // ৭ দিন
    });

    return response;
  } catch (error) {
    console.error("POST /api/login error:", error);
    return NextResponse.json(
      { error: "⚠️ সার্ভার সমস্যা, পরে চেষ্টা করুন" },
      { status: 500 }
    );
  }
}
