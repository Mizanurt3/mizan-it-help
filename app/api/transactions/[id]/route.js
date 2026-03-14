import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

async function handlePut(req, id){
  return await requireAuth(async (rreq)=>{
    const body = await rreq.json();
    const { amount, description, date_time } = body;
    const check = await pool.query('SELECT cashier_id FROM transactions WHERE transaction_id = $1', [id]);
    if (!check.rows[0]) return new Response(JSON.stringify({ error:'Not found' }), { status:404 });
    if (check.rows[0].cashier_id !== rreq.cashier.cashier_id) return new Response(JSON.stringify({ error:'Forbidden' }), { status:403 });
    const q = `UPDATE transactions SET amount=$1, description=$2, date_time=$3 WHERE transaction_id=$4 RETURNING *`;
    const r = await pool.query(q, [amount, description||null, date_time||new Date().toISOString(), id]);
    return new Response(JSON.stringify(r.rows[0]));
  })(req);
}

async function handleDelete(req, id){
  return await requireAuth(async (rreq)=>{
    const check = await pool.query('SELECT cashier_id FROM transactions WHERE transaction_id = $1', [id]);
    if (!check.rows[0]) return new Response(JSON.stringify({ error:'Not found' }), { status:404 });
    if (check.rows[0].cashier_id !== rreq.cashier.cashier_id) return new Response(JSON.stringify({ error:'Forbidden' }), { status:403 });
    await pool.query('DELETE FROM transactions WHERE transaction_id=$1', [id]);
    return new Response(JSON.stringify({ ok:true }));
  })(req);
}

export async function PUT(req, { params }){ return handlePut(req, params.id); }
export async function DELETE(req, { params }){ return handleDelete(req, params.id); }