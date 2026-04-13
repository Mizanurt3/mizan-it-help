// app/api/job/fetch/route.js
import pool from "@/lib/db";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const customerMobile = searchParams.get("mobileNo");
  const userMobile = searchParams.get("userMobile");     // Extension থেকে পাঠাবে
  const deviceId = searchParams.get("deviceId");

  if (!customerMobile || !userMobile || !deviceId) {
    return Response.json({ 
      status: "error", 
      message: "MobileNo, userMobile and deviceId required" 
    }, { status: 400 });
  }

  try {
    // 1. Check device binding
    const bindingResult = await pool.query(
      'SELECT * FROM device_bindings WHERE "deviceId" = $1',
      [deviceId]
    );

    if (bindingResult.rows.length === 0 || bindingResult.rows[0].userMobile !== userMobile) {
      return Response.json({ 
        status: "error", 
        message: "অনুমোদিত ডিভাইস নয়" 
      });
    }

    // 2. Check user status
    const userResult = await pool.query(
      'SELECT status FROM users WHERE "mobileNumber" = $1',
      [userMobile]
    );

    if (userResult.rows.length === 0 || userResult.rows[0].status !== 'ACTIVE') {
      return Response.json({ 
        status: "error", 
        message: "অ্যাকাউন্ট অনুমোদিত নয়" 
      });
    }

    // 3. Fetch Job Data
    const jobResult = await pool.query(
      'SELECT * FROM job_data WHERE "userMobile" = $1 AND "customerMobile" = $2',
      [userMobile, customerMobile]
    );

    if (jobResult.rows.length === 0) {
      return Response.json({ 
        status: "error", 
        message: "No data found for this mobile number" 
      }, { status: 404 });
    }

    return Response.json({ 
      status: "success", 
      data: jobResult.rows[0] 
    });

  } catch (error) {
    console.error("Fetch Error:", error);
    return Response.json({ 
      status: "error", 
      message: "Server error" 
    }, { status: 500 });
  }
}