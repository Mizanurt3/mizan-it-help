// app/api/login-user/route.js
import pool from "@/lib/db";

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

export async function POST(request) {
  try {
    const { mobileNumber, deviceId } = await request.json();

    if (!mobileNumber?.trim() || !deviceId?.trim()) {
      return Response.json({ status: "error", message: "মোবাইল নাম্বার ও Device ID দরকার" }, 
        { status: 400, headers: { "Access-Control-Allow-Origin": "*" } });
    }

    // 1. ইউজার খুঁজুন
    let userResult = await pool.query(
      'SELECT * FROM users WHERE "mobileNumber" = $1',
      [mobileNumber]
    );
    let user = userResult.rows[0];

    if (!user) {
      await pool.query('INSERT INTO users ("mobileNumber", status) VALUES ($1, $2)', 
        [mobileNumber, 'PENDING']);
      
      await pool.query(`INSERT INTO device_bindings ("deviceId", "userMobile") VALUES ($1, $2)`, 
        [deviceId, mobileNumber]);

      return Response.json({ 
        status: "pending", 
        message: "আপনার অ্যাকাউন্ট এখনো অ্যাডমিন অ্যাপ্রুভ করেনি।" 
      }, { headers: { "Access-Control-Allow-Origin": "*" } });
    }

    // 2. এই ডিভাইসটি সঠিক কিনা চেক করুন
    const bindingResult = await pool.query(
      `SELECT * FROM device_bindings WHERE "deviceId" = $1 AND "userMobile" = $2`,
      [deviceId, mobileNumber]
    );

    if (bindingResult.rows.length > 0) {
      // সঠিক ডিভাইস
      if (user.status === "ACTIVE") {
        await pool.query('UPDATE users SET "lastLoginAt" = NOW() WHERE "mobileNumber" = $1', [mobileNumber]);
        return Response.json({ status: "success", message: "লগইন সফল!", mobileNumber }, 
          { headers: { "Access-Control-Allow-Origin": "*" } });
      } 
      else if (user.status === "PENDING") {
        return Response.json({ status: "pending", message: "আপনার অ্যাকাউন্ট এখনো অ্যাডমিন অ্যাপ্রুভ করেনি।" }, 
          { headers: { "Access-Control-Allow-Origin": "*" } });
      } 
      else if (user.status === "BLOCKED") {
        return Response.json({ status: "error", message: "আপনার অ্যাকাউন্ট ব্লক করা হয়েছে।" }, 
          { headers: { "Access-Control-Allow-Origin": "*" } });
      }
    }

    // 3. ভুল ডিভাইস → দেখুন এই ইউজারের আগে থেকে device আছে কিনা
    const existingBinding = await pool.query(
      'SELECT * FROM device_bindings WHERE "userMobile" = $1',
      [mobileNumber]
    );

    if (existingBinding.rows.length > 0) {
      return Response.json({
        status: "error",
        message: "আপনি ইতোমধ্যে একটি ক্রমে এই এক্সটেনশন ব্যবহার করছেন তাই আপনাকে ২য় ক্রমে এক্সেস দেওয়া হবে না। অথবা কোনো সমস্যা হলে এডমিনের সাথে যোগাযোগ করুন: 01742734391"
      }, { headers: { "Access-Control-Allow-Origin": "*" } });
    }

    // 4. নতুন ডিভাইস → bind করুন এবং PENDING করুন
    await pool.query(`INSERT INTO device_bindings ("deviceId", "userMobile") VALUES ($1, $2)`, 
      [deviceId, mobileNumber]);

    if (user.status === "ACTIVE") {
      await pool.query('UPDATE users SET status = $1 WHERE "mobileNumber" = $2', ['PENDING', mobileNumber]);
    }

    return Response.json({ 
      status: "pending", 
      message: "নতুন ডিভাইস থেকে লগইনের অনুরোধ পাঠানো হয়েছে। অ্যাডমিন অ্যাপ্রুভ করলে লগইন করতে পারবেন।" 
    }, { headers: { "Access-Control-Allow-Origin": "*" } });

  } catch (error) {
    console.error("Login Error:", error);
    return Response.json({ status: "error", message: "সার্ভার এরর" }, 
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
}