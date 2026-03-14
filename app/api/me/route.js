import { requireAuth } from "@/lib/auth";

export async function GET(req) {
  return await requireAuth(async (reqAuth) => {
    return new Response(JSON.stringify({ user: reqAuth.cashier }), {
      status: 200,
    });
  })(req);
}