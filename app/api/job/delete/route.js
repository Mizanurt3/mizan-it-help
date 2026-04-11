// app/api/job/delete/route.js
import pool from "@/lib/db";

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const mobile = searchParams.get("mobile");

    if (!mobile) {
      return Response.json({ status: "error", message: "Mobile number required" }, { status: 400 });
    }

    const result = await pool.query(
      "DELETE FROM job_applicants WHERE mobile = $1 RETURNING id, mobile, name",
      [mobile]
    );

    if (result.rows.length === 0) {
      return Response.json({ status: "error", message: "Record not found" }, { status: 404 });
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