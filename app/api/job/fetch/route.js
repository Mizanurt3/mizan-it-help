import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mobileNo = searchParams.get("mobileNo");
  const deviceId = searchParams.get("deviceId");   // ভবিষ্যতে চেক করতে পারবেন

  if (!mobileNo) {
    return new Response(
      JSON.stringify({ status: "error", message: "Mobile number is required" }),
      { status: 400 }
    );
  }

  try {
    const result = await pool.query(
      "SELECT * FROM job_applicants WHERE mobile = $1",
      [mobileNo]
    );

    if (result.rows.length === 0) {
      return new Response(
        JSON.stringify({ status: "error", message: "No data found for this mobile number" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        status: "success",
        data: result.rows[0]
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ status: "error", message: "Server error" }),
      { status: 500 }
    );
  }
}