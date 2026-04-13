// app/api/admin/approve/route.js
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { mobileNumber } = await request.json();

    if (!mobileNumber) {
      return Response.json({ 
        status: "error", 
        message: "Mobile number is required" 
      }, { status: 400 });
    }

    const result = await pool.query(
      'UPDATE users SET status = \'ACTIVE\' WHERE "mobileNumber" = $1 RETURNING *',
      [mobileNumber]
    );

    if (result.rows.length === 0) {
      return Response.json({ 
        status: "error", 
        message: "User not found" 
      }, { status: 404 });
    }

    return Response.json({ 
      status: "success", 
      message: "User approved successfully",
      user: result.rows[0]
    });

  } catch (error) {
    console.error("Approve Error:", error);
    return Response.json({ 
      status: "error", 
      message: "Failed to approve user" 
    }, { status: 500 });
  }
}