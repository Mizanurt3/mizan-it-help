import pool from '@/lib/db';
import { requireAuth } from '@/lib/auth';

async function handlerGET(req){
  const url = new URL(req.url);
  const cashier_id = url.searchParams.get('cashier_id');
  const type = url.searchParams.get('type');
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const clauses = [];
  const vals = [];
  let idx = 1;
  if (cashier_id) { clauses.push(`cashier_id = $${idx++}`); vals.push(cashier_id); }
  if (type) { clauses.push(`type = $${idx++}`); vals.push(type); }
  if (from) { clauses.push(`date_time >= $${idx++}`); vals.push(from); }
  if (to) { clauses.push(`date_time <= $${idx++}`); vals.push(to); }
  const where = clauses.length ? 'WHERE ' + clauses.join(' AND ') : '';
  const q = `SELECT t.*, c.name as cashier_name FROM transactions t LEFT JOIN cashiers c ON t.cashier_id = c.cashier_id ${where} ORDER BY date_time DESC LIMIT 1000`;
  const r = await pool.query(q, vals);
  return new Response(JSON.stringify(r.rows), { status:200 });
}

async function handlerPOST(req){
  // protected
  return await requireAuth(async (reqWithAuth) => {
    const body = await reqWithAuth.json();
    const { type, amount, description, date_time } = body;
    if (!['income','expense'].includes(type)) return new Response(JSON.stringify({ error:'invalid type' }), { status:400 });
    if (!amount) return new Response(JSON.stringify({ error:'amount required' }), { status:400 });
    const cashier_id = reqWithAuth.cashier.cashier_id;
    const q = `INSERT INTO transactions(cashier_id,type,amount,description,date_time) VALUES($1,$2,$3,$4,$5) RETURNING *`;
    try{
      const r = await pool.query(q,[cashier_id,type,amount,description||null,date_time||new Date().toISOString()]);
      return new Response(JSON.stringify(r.rows[0]));
    }catch(e){
      return new Response(JSON.stringify({ error:e.message }), { status:500 });
    }
  })(req);
}

export async function GET(req){ return handlerGET(req); }
export async function POST(req){ return handlerPOST(req); }