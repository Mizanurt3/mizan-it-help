import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function GET() {
  const r = await pool.query(
    "SELECT * FROM notes ORDER BY created_at DESC"
  );
  return new Response(JSON.stringify(r.rows));
}

export async function POST(req) {
  return await requireAuth(async (reqAuth) => {
    const body = await reqAuth.json();
    const { title, content } = body;

    const slug = title.toLowerCase().replace(/\s+/g, "-");

    const r = await pool.query(
      "INSERT INTO notes(title,slug,content) VALUES($1,$2,$3) RETURNING *",
      [title, slug, content]
    );

    return new Response(JSON.stringify(r.rows[0]));
  })(req);
}