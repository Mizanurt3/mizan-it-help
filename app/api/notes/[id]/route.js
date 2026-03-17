// app/api/notes/[id]/route.js
import pool from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { NextResponse } from "next/server";   // ← Response এর বদলে NextResponse ব্যবহার করা ভালো

export async function PUT(req, context) {
  // context.params একটা Promise → await করতে হবে
  const params = await context.params;
  const id = params.id;   // এখন id নিরাপদে পাওয়া যাবে

  return await requireAuth(async (reqAuth) => {
    const body = await reqAuth.json();
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 });
    }

    const r = await pool.query(
      "UPDATE notes SET title=$1, content=$2, updated_at=NOW() WHERE note_id=$3 RETURNING *",
      [title, content, id]   // ← params.id এর বদলে id
    );

    if (r.rowCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(r.rows[0]);
  })(req);
}

export async function DELETE(req, context) {
  const params = await context.params;
  const id = params.id;

  return await requireAuth(async () => {
    const result = await pool.query(
      "DELETE FROM notes WHERE note_id=$1 RETURNING note_id",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  })(req);
}