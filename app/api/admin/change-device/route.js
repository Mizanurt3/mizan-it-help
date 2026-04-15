// app/api/admin/change-device/route.js
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { mobileNumber, newDeviceId } = await request.json();

    if (!mobileNumber || !newDeviceId?.trim()) {
      return Response.json({ 
        status: "error", 
        message: "Mobile number and new Device ID are required" 
      }, { status: 400 });
    }

    // 1. পুরানো device binding মুছে ফেলুন
    await pool.query(
      'DELETE FROM device_bindings WHERE "userMobile" = $1',
      [mobileNumber]
    );

    // 2. নতুন deviceId দিয়ে bind করুন
    await pool.query(
      `INSERT INTO device_bindings ("deviceId", "userMobile") 
       VALUES ($1, $2)`,
      [newDeviceId.trim(), mobileNumber]
    );

    // 3. ইউজারকে ACTIVE করে দিন (যদি চান)
    await pool.query(
      'UPDATE users SET status = \'ACTIVE\', "lastLoginAt" = NOW() WHERE "mobileNumber" = $1',
      [mobileNumber]
    );

    return Response.json({ 
      status: "success", 
      message: `Device ID changed successfully for ${mobileNumber}`
    });

  } catch (error) {
    console.error("Change Device Error:", error);
    return Response.json({ 
      status: "error", 
      message: "Failed to change device. Device ID may already be in use." 
    }, { status: 500 });
  }
}