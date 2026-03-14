"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("🔄 লগইন হচ্ছে...");

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg("✅ লগইন সফল!");
      router.refresh(); // ✅ middleware যেন কুকি দেখতে পায়
      setTimeout(() => {
        if (data.role === "admin") router.push("/admin");
        else router.push("/");
      }, 1000);
    } else {
      setMsg(data.error || "লগইন ব্যর্থ হয়েছে");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">ক্যাশিয়ার লগইন</h2>

        <input
          type="email"
          placeholder="ইমেইল"
          className="border p-2 mb-2 w-full rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="পাসওয়ার্ড"
          className="border p-2 mb-2 w-full rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600">
          লগইন
        </button>

        {msg && <p className="text-center text-sm mt-3">{msg}</p>}
      </form>
    </div>
  );
}
