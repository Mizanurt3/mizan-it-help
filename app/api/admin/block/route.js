// app/api/admin/block/route.js
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { mobileNumber } = await request.json();

    if (!mobileNumber) {
      return Response.json({ status: "error", message: "Mobile number is required" }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE users SET status = \'BLOCKED\' WHERE "mobileNumber" = $1 RETURNING *',
      [mobileNumber]
    );

    if (result.rows.length === 0) {
      return Response.json({ status: "error", message: "User not found" }, { status: 404 });
    }

    return Response.json({ 
      status: "success", 
      message: "User blocked successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Block Error:", error);
    return Response.json({ status: "error", message: "Failed to block user" }, { status: 500 });
  }
}