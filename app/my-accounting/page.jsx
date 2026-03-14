"use client";

import { useEffect, useState } from "react";

export default function MyAccountingPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    type: "income",
    amount: "",
    description: "",
  });

  // 🔹 নিজের ট্রানজেকশন লোড করা
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/my-transactions");
        if (res.status === 401) {
          alert("অনুগ্রহ করে লগইন করুন।");
          window.location.href = "/login";
          return;
        }
        const data = await res.json();
        setTransactions(data);
      } catch (e) {
        console.error("লোডিং সমস্যা:", e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // 🔹 নতুন ট্রানজেকশন যোগ করা
  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.amount || isNaN(form.amount)) {
      alert("পরিমাণ সঠিকভাবে লিখুন");
      return;
    }

    const res = await fetch("/api/my-transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setTransactions([data, ...transactions]);
      setForm({ type: "income", amount: "", description: "" });
    } else {
      alert(data.error || "ত্রুটি ঘটেছে");
    }
  }

  // 🔹 ট্রানজেকশন ডিলিট
  async function handleDelete(id) {
    if (!confirm("আপনি কি সত্যিই ডিলিট করতে চান?")) return;

    const res = await fetch(`/api/my-transactions/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setTransactions(transactions.filter((t) => t.transaction_id !== id));
    } else {
      const data = await res.json();
      alert(data.error || "ডিলিট করতে সমস্যা হয়েছে");
    }
  }

  if (loading)
    return <p className="text-center mt-10">লোড হচ্ছে...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <br /><br />
      <h1 className="text-2xl font-bold mb-6 text-center">
        📘 আমার ট্রানজেকশন
      </h1>

      {/* ✅ ট্রানজেকশন ইনপুট ফর্ম */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 p-4 rounded-lg shadow mb-6"
      >
        <div className="flex flex-wrap gap-2 mb-3">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="border p-2 rounded w-full sm:w-1/4"
          >
            <option value="income">আয়</option>
            <option value="expense">ব্যয়</option>
          </select>

          <input
            type="number"
            placeholder="পরিমাণ"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="border p-2 rounded w-full sm:w-1/4"
            required
          />

          <input
            type="text"
            placeholder="বিবরণ"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border p-2 rounded w-full sm:w-1/2"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
        >
          যোগ করুন
        </button>
      </form>

      {/* ✅ ট্রানজেকশন তালিকা */}
      {transactions.length === 0 ? (
        <p className="text-center text-gray-600">কোন ট্রানজেকশন নেই</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="p-2 border">তারিখ</th>
                <th className="p-2 border">ধরণ</th>
                <th className="p-2 border">পরিমাণ</th>
                <th className="p-2 border">বিবরণ</th>
                <th className="p-2 border">অপশন</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t.transaction_id}>
                  <td className="p-2 border text-center">
                    {new Date(t.date_time).toLocaleString("bn-BD")}
                  </td>
                  <td className="p-2 border text-center">
                    {t.type === "income" ? "আয়" : "ব্যয়"}
                  </td>
                  <td className="p-2 border text-right">
                    {parseFloat(t.amount).toLocaleString("bn-BD")}
                  </td>
                  <td className="p-2 border">{t.description || "-"}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDelete(t.transaction_id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ❌
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
