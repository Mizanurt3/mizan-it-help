"use client";
import { useState } from "react";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", password: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/cashiers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (res.ok) {
      setMsg("✅ রেজিস্ট্রেশন সফল!");
      setForm({ name: "", phone: "", email: "", password: "" });
    } else setMsg(data.error || "ত্রুটি ঘটেছে");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">নতুন ক্যাশিয়ার রেজিস্টার</h2>

        <input
          placeholder="নাম"
          className="border p-2 mb-2 w-full rounded"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <input
          placeholder="ফোন (ঐচ্ছিক)"
          className="border p-2 mb-2 w-full rounded"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />

        <input
          placeholder="ইমেইল (ঐচ্ছিক)"
          className="border p-2 mb-2 w-full rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="পাসওয়ার্ড"
          className="border p-2 mb-2 w-full rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
          রেজিস্টার
        </button>

        {msg && <p className="text-center text-sm mt-3">{msg}</p>}
      </form>
    </div>
  );
}
