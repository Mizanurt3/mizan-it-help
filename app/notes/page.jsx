"use client";

import { useEffect, useState } from "react";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    authCheck();
    loadNotes();
  }, []);

  async function authCheck() {
    const res = await fetch("/api/me", {
      method: "GET",
      credentials: "include",
    });

    setIsLogged(res.status === 200);
  }

  // Public: anyone can view
  async function loadNotes() {
    const res = await fetch("/api/notes");
    const data = await res.json();
    setNotes(data);
  }

  function selectNote(n) {
    setSelected(n.note_id);
    setForm({ title: n.title, content: n.content });
  }

  async function save() {
    if (!isLogged) {
      alert("🔐 নোট এডিট করতে লগইন করুন");
      return;
    }

    const url = selected
      ? `/api/notes/${selected}`
      : `/api/notes`;

    const method = selected ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      alert("❌ Save failed");
      return;
    }

    setForm({ title: "", content: "" });
    setSelected(null);
    loadNotes();
  }

  async function remove(id) {
    if (!isLogged) return alert("🔐 লগইন করতে হবে");

    if (!confirm("ডিলিট করতে চান?")) return;

    await fetch(`/api/notes/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    loadNotes();
  }

  return (
    
    <div className="flex h-screen">
      
      {/* Sidebar */}
      <div className="w-72 border-r p-4 bg-gray-50 overflow-y-auto">
        <h2 className="font-bold mb-3">📘 নোটসমূহ</h2>

        {notes.map((n) => (
          <div key={n.note_id} className="flex justify-between items-center mb-2">
            <button
              className="text-blue-600 hover:underline"
              onClick={() => selectNote(n)}
            >
              {n.title}
            </button>

            {isLogged && (
              <button
                className="text-red-500"
                onClick={() => remove(n.note_id)}
              >
                ❌
              </button>
            )}
          </div>
        ))}
      </div>
        
      {/* Editor */}
      <div className="flex-1 p-6">
        {!isLogged && (
          <p className="p-2 mb-3 bg-yellow-200 border rounded">
            🔒 শুধুমাত্র লগইনকৃত ব্যবহারকারীরা এডিট করতে পারবেন
          </p>
        )}

        <input
          value={form.title}
          disabled={!isLogged}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="border p-2 w-full mb-3"
        />

        <textarea
          value={form.content}
          disabled={!isLogged}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="border p-2 w-full"
          rows="18"
        />

        {isLogged && (
          <button
            onClick={save}
            className="bg-blue-600 text-white px-5 py-2 mt-3 rounded hover:bg-blue-700"
          >
            💾 Save
          </button>
        )}
      </div>
    </div>
  );
}