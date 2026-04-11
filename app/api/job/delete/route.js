// app/api/job/delete/route.js
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

export async function DELETE(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return Response.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return Response.json({ status: "error", message: "Admin access only" }, { status: 403 });
    }

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
    console.error("Delete error:", error);
    return Response.json({ status: "error", message: "Delete failed" }, { status: 500 });
  }
}