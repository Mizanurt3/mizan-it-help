import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";

export async function PUT(req, { params }) {

  return await requireAuth(async (reqAuth) => {

    const body = await reqAuth.json();
    const { title, content } = body;

    const r = await pool.query(
      "UPDATE notes SET title=$1, content=$2, updated_at=NOW() WHERE note_id=$3 RETURNING *",
      [title, content, params.id]
    );

    return new Response(JSON.stringify(r.rows[0]));

  })(req);
}

export async function DELETE(req, { params }) {

  return await requireAuth(async () => {

    await pool.query(
      "DELETE FROM notes WHERE note_id=$1",
      [params.id]
    );

    return new Response(JSON.stringify({ success:true }));

  })(req);
}