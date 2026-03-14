import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

function getUserIdFromToken(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.cashier_id || decoded.id; // 🔹 ক্যাশিয়ার আইডি টোকেনে যেভাবে ছিল
  } catch {
    return null;
  }
}

// 🔹 নিজের ট্রানজেকশন দেখা
export async function GET(req) {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { rows } = await pool.query(
    `SELECT transaction_id, type, amount, description, date_time
     FROM transactions
     WHERE cashier_id = $1
     ORDER BY date_time DESC`,
    [userId]
  );

  return NextResponse.json(rows);
}

// 🔹 নতুন ট্রানজেকশন যোগ করা
export async function POST(req) {
  const userId = getUserIdFromToken(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { type, amount, description } = await req.json();

  // ইনপুট ভ্যালিডেশন
  if (!type || !amount || isNaN(amount)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { rows } = await pool.query(
    `INSERT INTO transactions (cashier_id, type, amount, description)
     VALUES ($1, $2, $3, $4)
     RETURNING transaction_id, type, amount, description, date_time`,
    [userId, type, amount, description]
  );

  return NextResponse.json(rows[0]);
}
