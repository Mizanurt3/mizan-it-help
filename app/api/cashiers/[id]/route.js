import { NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// ✅ PUT — আপডেট ক্যাশিয়ার
export async function PUT(req, { params }) {
  const { id } = params;
  const { name, phone, email, password } = await req.json();

  try {
    if (password) {
      await pool.query(
        `UPDATE cashiers SET name=$1, phone=$2, email=$3, password_hash=crypt($4, gen_salt('bf')) WHERE cashier_id=$5`,
        [name, phone, email, password, id]
      );
    } else {
      await pool.query(
        `UPDATE cashiers SET name=$1, phone=$2, email=$3 WHERE cashier_id=$4`,
        [name, phone, email, id]
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/cashiers/[id] error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// ✅ DELETE — ডিলেট ক্যাশিয়ার (balance == 0 হলে)
export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    const balanceResult = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE cashier_id=$1`,
      [id]
    );
    const balance = parseFloat(balanceResult.rows[0].balance || 0);

    if (balance !== 0) {
      return NextResponse.json(
        { error: "ব্যালেন্স ০ নয়, তাই ডিলেট করা যাবে না" },
        { status: 400 }
      );
    }

    await pool.query("DELETE FROM transactions WHERE cashier_id=$1", [id]);
    await pool.query("DELETE FROM cashiers WHERE cashier_id=$1", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/cashiers/[id] error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
