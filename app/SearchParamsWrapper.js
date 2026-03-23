"use client"
import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import remarkBreaks from "remark-breaks"   // নতুন যোগ করা হয়েছে
import rehypeRaw from "rehype-raw"       // নতুন যোগ করা হয়েছে (center div কাজ করার জন্য)

export default function SearchParamsWrapper() {
  const searchParams = useSearchParams()
  const noteId = searchParams.get("note")

  const [notes, setNotes] = useState([])
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ title: "", content: "" })
  const [isLogged, setIsLogged] = useState(false)
  const [isEditing, setIsEditing] = useState(false)     // নতুন: এডিট মোড কন্ট্রোল
  const [showTips, setShowTips] = useState(false)       // নতুন: টিপস পপআপ

  const textareaRef = useRef(null)

  useEffect(() => {
    loadNotes()
    authCheck()
  }, [])

  useEffect(() => {
    if (noteId && notes.length) {
      selectNote(noteId)
      setIsEditing(false) // লোড হওয়ার পর সবসময় প্রিভিউ মোডে থাকবে
    }
  }, [noteId, notes])

  async function authCheck() {
    const res = await fetch("/api/me", { credentials: "include" })
    setIsLogged(res.status === 200)
  }

  async function loadNotes() {
    const res = await fetch("/api/notes")
    const data = await res.json()
    setNotes(data)
  }

  function selectNote(id) {
    const n = notes.find((x) => x.note_id == id)
    if (!n) return
    setSelected(id)
    setForm({
      title: n.title,
      content: n.content,
    })
  }

  async function save() {
    if (!isLogged) return alert("লগইন করুন")
    const url = selected ? `/api/notes/${selected}` : `/api/notes`
    const method = selected ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(form),
    })
    if (!res.ok) return alert("Save failed")
    await loadNotes()
    setIsEditing(false) // সেভ হওয়ার পর আবার প্রিভিউ মোডে চলে যাবে
  }

  function insertAround(before, after = before) {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = form.content
    const selectedText = text.substring(start, end)
    const newText =
      text.substring(0, start) + before + selectedText + after + text.substring(end)
    setForm({ ...form, content: newText })
    // কার্সর পজিশন ঠিক রাখা
    setTimeout(() => {
      textarea.selectionStart = start + before.length
      textarea.selectionEnd = end + before.length
      textarea.focus()
    }, 0)
  }

  function insertLine(prefix) {
    const textarea = textareaRef.current
    if (!textarea) return
    const start = textarea.selectionStart
    const text = form.content
    const before = text.substring(0, start)
    const after = text.substring(start)
    const newText = before + prefix + after
    setForm({ ...form, content: newText })
  }

  function handleShortcut(e) {
    if (!e.ctrlKey) return
    switch (e.key.toLowerCase()) {
      case "b":
        e.preventDefault()
        insertAround("**")
        break
      case "i":
        e.preventDefault()
        insertAround("*")
        break
      case "k":
        e.preventDefault()
        insertAround("[", "](https://)")
        break
      case "]":
        e.preventDefault()
        insertLine("## ")
        break
      case "e":
        e.preventDefault()
        insertAround('<div align="center">', "</div>")
        break
    }
  }

  return (
    <div className="max-w-5xl mx-auto pt-24 p-4">
      {/* লগইন ওয়ার্নিং */}
      {!isLogged && (
        <p className="bg-yellow-200 p-3 mb-6 rounded text-center text-sm">
          🔒 শুধুমাত্র লগইনকৃত ব্যবহারকারীরা এডিট করতে পারবেন
        </p>
      )}

      {/* টাইটেল + এডিট বাটন (উপরে ডানে) */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {form.title || "Untitled Note"}
        </h1>

        {isLogged && (
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm"
          >
            {isEditing ? "✕ Cancel" : "✏️ Edit Note"}
          </button>
        )}
      </div>

      {/* ==================== এডিটর (শুধুমাত্র এডিট মোডে) ==================== */}
      {isEditing && (
        <div className="mb-10 bg-white border border-gray-200 rounded-2xl shadow p-6">
          {/* টাইটেল ইনপুট */}
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border-0 bg-gray-50 focus:bg-white text-2xl font-semibold p-4 rounded-xl outline-none mb-4"
            placeholder="নোটের শিরোনাম লিখুন..."
          />

          {/* টেক্সটএরিয়া + Tips বাটন */}
          <div className="relative">
            <textarea
              ref={textareaRef}
              rows={14}
              value={form.content}
              onKeyDown={handleShortcut}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full border border-gray-300 rounded-2xl p-5 font-mono text-base leading-relaxed resize-y min-h-[320px] focus:outline-none focus:border-blue-500"
              placeholder="এখানে মার্কডাউন লিখুন... (Ctrl + B = Bold)"
            />
            {/* Tips বাটন — টেক্সটএরিয়ার নিচের ডানে */}
            <button
              onClick={() => setShowTips(true)}
              className="absolute bottom-5 right-5 bg-white border border-gray-300 hover:bg-gray-100 px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 shadow"
            >
              📌 Tips
            </button>
          </div>

          {/* Save বাটন */}
          <button
            onClick={save}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-medium flex items-center gap-2 transition"
          >
            💾 Save Changes
          </button>
        </div>
      )}

      {/* ==================== প্রিভিউ (সবসময় দেখাবে + লাইভ আপডেট) ==================== */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="font-bold text-2xl">👀 Preview</h2>
          {isEditing && (
            <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Live update হচ্ছে
            </span>
          )}
        </div>

        <div className="prose max-w-none border border-gray-200 bg-white p-8 rounded-3xl shadow-sm min-h-[400px]">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkBreaks]}  // {/* single Enter = line break */}
            rehypePlugins={[rehypeRaw]}               //  {/* <div align="center"> কাজ করবে */}
            components={{
              a: (props) => (
                <a {...props} target="_blank" className="text-blue-600 underline" />
              ),
            }}
          >
            {form.content || "এখনো কোনো কনটেন্ট নেই। Edit বাটনে ক্লিক করে শুরু করুন।"}
          </ReactMarkdown>
        </div>
      </div>

      {/* ==================== Tips পপআপ ==================== */}
      {showTips && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden">
            {/* হেডার */}
            <div className="bg-gray-50 px-8 py-5 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold">✍️ Editor Tips</h3>
              <button
                onClick={() => setShowTips(false)}
                className="text-4xl text-gray-400 hover:text-gray-600 leading-none"
              >
                ×
              </button>
            </div>

            {/* কনটেন্ট */}
            <div className="p-8 space-y-8 text-sm">
              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                <div><span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl + B</span> → <b>Bold</b></div>
                <div><span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl + I</span> → <i>Italic</i></div>
                <div><span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl + K</span> → Link</div>
                <div><span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl + ]</span> → Heading ##</div>
                <div><span className="font-mono bg-gray-100 px-2 py-1 rounded">Ctrl + E</span> → Center align</div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-5 pt-4 border-t">
                <div>Quote → <span className="font-mono">&gt; text</span></div>
                <div>List → <span className="font-mono">- item</span></div>
                <div>Code block → <span className="font-mono">```code```</span></div>
                <div>Table → <span className="font-mono">| col1 | col2 |</span></div>
              </div>

              <p className="text-xs text-gray-500 bg-blue-50 p-4 rounded-2xl">
                Enter চাপলে নতুন লাইন দেখাবে (single newline = line break)।<br />
                সবকিছু রিয়েল-টাইমে প্রিভিউতে আপডেট হয়।
              </p>
            </div>

            <div className="px-8 py-6 border-t bg-gray-50">
              <button
                onClick={() => setShowTips(false)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-medium hover:bg-black"
              >
                বুঝেছি, বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}