// app/api/job/delete/route.js
import pool from "@/lib/db";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const customerMobile = searchParams.get("customerMobile");
    const userMobile = searchParams.get("userMobile");

    if (!customerMobile || !userMobile) {
      return Response.json({ status: "error", message: "customerMobile and userMobile required" }, { status: 400 });
    }

    const result = await pool.query(
      `DELETE FROM job_data 
       WHERE "customerMobile" = $1 AND "userMobile" = $2 
       RETURNING id, "customerMobile", name`,
      [customerMobile, userMobile]
    );

    if (result.rows.length === 0) {
      return Response.json({ status: "error", message: "Record not found or not authorized" }, { status: 404 });
    }

    return Response.json({ 
      status: "success", 
      message: "Record deleted successfully" 
    });

  } catch (error) {
    console.error("Delete Error:", error);
    return Response.json({ status: "error", message: "Delete failed" }, { status: 500 });
  }
}