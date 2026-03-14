// lib/auth.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(pass) {
  return bcrypt.hash(pass, 10);
}

export async function verifyPassword(pass, hash) {
  return bcrypt.compare(pass, hash);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

// 🔐 Cookie ভিত্তিক Authentication
export function requireAuth(handler) {
  return async (req) => {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const payload = verifyToken(token);

    if (!payload) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
      });
    }

    req.cashier = payload;

    return handler(req);
  };
}