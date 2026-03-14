import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

function getUserIdFromToken(req) {
  const token = req.cookies.get("token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.cashier_id || decoded.id;
  } catch {
    return null;
  }
}

// 🔹 DELETE: নিজের ট্রানজেকশন ডিলিট
export async function DELETE(req, { params }) {
  const userId = getUserIdFromToken(req);
  const { id } = params; // transaction_id

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // নিশ্চিত করা যেন শুধু নিজের ট্রানজেকশনই ডিলিট হয়
  const { rowCount } = await pool.query(
    `DELETE FROM transactions WHERE transaction_id = $1 AND cashier_id = $2`,
    [id, userId]
  );

  if (rowCount === 0) {
    return NextResponse.json({ error: "Not found or not allowed" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
