// app/api/admin/remove-device/route.js
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
      'DELETE FROM device_bindings WHERE "userMobile" = $1 RETURNING *',
      [mobileNumber]
    );

    if (result.rows.length === 0) {
      return Response.json({ 
        status: "error", 
        message: "No device binding found for this user" 
      }, { status: 404 });
    }

    return Response.json({ 
      status: "success", 
      message: "Device binding removed successfully. User can now login from a new device.",
      deleted: result.rows[0]
    });

  } catch (error) {
    console.error("Remove Device Error:", error);
    return Response.json({ 
      status: "error", 
      message: "Failed to remove device binding" 
    }, { status: 500 });
  }
}