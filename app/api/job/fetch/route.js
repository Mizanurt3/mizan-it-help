// app/api/job/fetch/route.js
import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mobileNo = searchParams.get("mobileNo");

  if (!mobileNo) {
    return Response.json({ 
      status: "error", 
      message: "Mobile number is required" 
    }, { status: 400 });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM job_applicants WHERE mobile = $1",
      [mobileNo]
    );

    if (result.rows.length === 0) {
      return Response.json({ 
        status: "error", 
        message: "No data found for this mobile number" 
      }, { status: 404 });
    }

    return Response.json({ 
      status: "success", 
      data: result.rows[0] 
    });

  } catch (error) {
    console.error("Fetch error:", error);
    return Response.json({ 
      status: "error", 
      message: "Server error" 
    }, { status: 500 });
  }
}