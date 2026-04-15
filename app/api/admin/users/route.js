// app/api/admin/users/route.js
import pool from "@/lib/db";

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

export async function GET(request) {
  try {
    const result = await pool.query(`
      SELECT 
        u."mobileNumber",
        u.status,
        u."createdAt",
        u."lastLoginAt",
        db."deviceId"
      FROM users u
      LEFT JOIN device_bindings db 
        ON u."mobileNumber" = db."userMobile"
      ORDER BY u."createdAt" DESC
    `);

    return Response.json(result.rows, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      }
    });

  } catch (error) {
    console.error("Admin Users Fetch Error:", error);
    return Response.json(
      { 
        status: "error", 
        message: "Failed to fetch users" 
      }, 
      { 
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" }
      }
    );
  }
}