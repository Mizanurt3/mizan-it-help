import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ GET — সব ক্যাশিয়ার লিস্ট দেখানো
export async function GET() {
  try {
    const result = await pool.query(
      `SELECT cashier_id, name, phone, email, created_at 
       FROM cashiers 
       ORDER BY created_at DESC`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/cashiers error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ POST — নতুন ক্যাশিয়ার তৈরি
export async function POST(req) {
  try {
    const { name, phone, email, password } = await req.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: "সব ঘর পূরণ করুন" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO cashiers (cashier_id, name, phone, email, password_hash)
       VALUES (gen_random_uuid(), $1, $2, $3, crypt($4, gen_salt('bf')))
       RETURNING cashier_id, name, email, phone`,
      [name, phone, email, password]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("POST /api/cashiers error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ PUT — ক্যাশিয়ার তথ্য আপডেট
export async function PUT(req) {
  try {
    const { cashier_id, name, phone, email, password } = await req.json();

    if (!cashier_id) {
      return NextResponse.json({ error: "cashier_id প্রয়োজন" }, { status: 400 });
    }

    // পাসওয়ার্ড না দিলে পুরনো থাকবে
    if (password && password.trim() !== "") {
      await pool.query(
        `UPDATE cashiers 
         SET name = $1, phone = $2, email = $3, password_hash = crypt($4, gen_salt('bf'))
         WHERE cashier_id = $5`,
        [name, phone, email, password, cashier_id]
      );
    } else {
      await pool.query(
        `UPDATE cashiers 
         SET name = $1, phone = $2, email = $3
         WHERE cashier_id = $4`,
        [name, phone, email, cashier_id]
      );
    }

    return NextResponse.json({ success: true, message: "✅ তথ্য আপডেট হয়েছে" });
  } catch (error) {
    console.error("PUT /api/cashiers error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ DELETE — ক্যাশিয়ার ডিলিট (শর্ত: আয় == ব্যয়)
export async function DELETE(req) {
  try {
    const { searchParams } = new URL(req.url);
    const cashier_id = searchParams.get("cashier_id");

    if (!cashier_id) {
      return NextResponse.json({ error: "cashier_id প্রয়োজন" }, { status: 400 });
    }

    // আয় ও ব্যয়ের হিসাব বের করা
    const incomeResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_income 
       FROM transactions 
       WHERE cashier_id = $1 AND type = 'income'`,
      [cashier_id]
    );

    const expenseResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS total_expense 
       FROM transactions 
       WHERE cashier_id = $1 AND type = 'expense'`,
      [cashier_id]
    );

    const total_income = parseFloat(incomeResult.rows[0].total_income);
    const total_expense = parseFloat(expenseResult.rows[0].total_expense);

    // ✅ শর্ত চেক
    if (total_income !== total_expense) {
      return NextResponse.json(
        {
          error: `❌ ক্যাশিয়ার ডিলিট করা যাবে না। আয় (${total_income}) ও ব্যয় (${total_expense}) সমান নয়।`,
        },
        { status: 400 }
      );
    }

    // ✅ সব ট্রানজেকশন মুছে ফেলা
    await pool.query(`DELETE FROM transactions WHERE cashier_id = $1`, [cashier_id]);

    // ✅ ক্যাশিয়ার ডিলিট করা
    await pool.query(`DELETE FROM cashiers WHERE cashier_id = $1`, [cashier_id]);

    return NextResponse.json({ success: true, message: "✅ ক্যাশিয়ার ডিলিট সম্পন্ন হয়েছে" });
  } catch (error) {
    console.error("DELETE /api/cashiers error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
