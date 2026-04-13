// app/api/login/route.js
import pool from "@/lib/db";

export async function POST(request) {
  try {
    const { mobileNumber, deviceId } = await request.json();

    if (!mobileNumber?.trim() || !deviceId) {
      return Response.json({ 
        status: "error", 
        message: "মোবাইল নাম্বার ও Device ID দরকার" 
      }, { status: 400 });
    }

    // Check if user exists
    let userResult = await pool.query(
      "SELECT * FROM users WHERE \"mobileNumber\" = $1",
      [mobileNumber]
    );

    let user = userResult.rows[0];

    if (!user) {
      // Create new user with PENDING status
      await pool.query(
        "INSERT INTO users (\"mobileNumber\", status) VALUES ($1, 'PENDING')",
        [mobileNumber]
      );

      // Create device binding
      await pool.query(
        "INSERT INTO device_bindings (\"deviceId\", \"userMobile\") VALUES ($1, $2)",
        [deviceId, mobileNumber]
      );

      return Response.json({ 
        status: "pending", 
        message: "আপনার অ্যাকাউন্ট এখনো অ্যাডমিন অ্যাপ্রুভ করেনি।" 
      });
    }

    // User exists → check device binding
    const bindingResult = await pool.query(
      "SELECT * FROM device_bindings WHERE \"deviceId\" = $1",
      [deviceId]
    );

    const existingBinding = bindingResult.rows[0];

    if (existingBinding && existingBinding.userMobile === mobileNumber) {
      // Same device → OK
    } else {
      // Check if this user already has another device
      const currentBinding = await pool.query(
        "SELECT * FROM device_bindings WHERE \"userMobile\" = $1",
        [mobileNumber]
      );

      if (currentBinding.rows.length > 0) {
        return Response.json({
          status: "error",
          message: "এই নাম্বারটি ইতিমধ্যে অন্য ডিভাইসে বাইন্ড করা আছে। অ্যাডমিনের সাথে যোগাযোগ করুন।"
        });
      }

      // Bind new device
      await pool.query(
        "INSERT INTO device_bindings (\"deviceId\", \"userMobile\") VALUES ($1, $2)",
        [deviceId, mobileNumber]
      );
    }

    // Check user status
    if (user.status === "PENDING") {
      return Response.json({ 
        status: "pending", 
        message: "আপনার অ্যাকাউন্ট এখনো অ্যাডমিন অ্যাপ্রুভ করেনি।" 
      });
    }

    if (user.status === "BLOCKED") {
      return Response.json({ 
        status: "error", 
        message: "আপনার অ্যাকাউন্ট ব্লক করা হয়েছে।" 
      });
    }

    // Update last login
    await pool.query(
      "UPDATE users SET \"lastLoginAt\" = NOW() WHERE \"mobileNumber\" = $1",
      [mobileNumber]
    );

    return Response.json({ 
      status: "success", 
      message: "লগইন সফল!", 
      mobileNumber 
    });

  } catch (error) {
    console.error("Login Error:", error);
    return Response.json({ 
      status: "error", 
      message: "সার্ভার এরর" 
    }, { status: 500 });
  }
}