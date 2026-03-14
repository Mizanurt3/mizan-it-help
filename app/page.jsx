"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

export default function HomePage(){

  const searchParams = useSearchParams()
  const noteId = searchParams.get("note")

  const [notes,setNotes]=useState([])
  const [selected,setSelected]=useState(null)
  const [form,setForm]=useState({title:"",content:""})
  const [isLogged,setIsLogged]=useState(false)

  const textareaRef = useRef(null)

  useEffect(()=>{
    loadNotes()
    authCheck()
  },[])

  // 🔥 FIX
  useEffect(()=>{
    if(noteId && notes.length){
      selectNote(noteId)
    }
  },[noteId,notes])

  async function authCheck(){
    const res=await fetch("/api/me",{credentials:"include"})
    setIsLogged(res.status===200)
  }

  async function loadNotes(){
    const res=await fetch("/api/notes")
    const data=await res.json()
    setNotes(data)
  }

  function selectNote(id){

    const n = notes.find(x=>x.note_id==id)

    if(!n) return

    setSelected(id)
    setForm({
      title:n.title,
      content:n.content
    })
  }

  async function save(){

    if(!isLogged) return alert("লগইন করুন")

    const url = selected
      ? `/api/notes/${selected}`
      : `/api/notes`

    const method = selected ? "PUT":"POST"

    const res = await fetch(url,{
      method,
      headers:{ "Content-Type":"application/json"},
      credentials:"include",
      body:JSON.stringify(form)
    })

    if(!res.ok) return alert("Save failed")

    loadNotes()
  }

  function insertAround(before,after=before){

    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd

    const text = form.content
    const selectedText = text.substring(start,end)

    const newText =
      text.substring(0,start) +
      before +
      selectedText +
      after +
      text.substring(end)

    setForm({...form,content:newText})
  }

  function insertLine(prefix){

    const textarea = textareaRef.current
    const start = textarea.selectionStart

    const text = form.content

    const before = text.substring(0,start)
    const after = text.substring(start)

    const newText = before + prefix + after

    setForm({...form,content:newText})
  }

  function handleShortcut(e){

    if(!e.ctrlKey) return

    switch(e.key.toLowerCase()){

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
        insertAround("[","](https://)")
      break

      case "]":
        e.preventDefault()
        insertLine("## ")
      break

      case "e":
        e.preventDefault()
        insertAround('<div align="center">',"</div>")
      break

    }

  }

  return(

    <div className="max-w-5xl mx-auto pt-24 p-4">

      {!isLogged && (
        <p className="bg-yellow-200 p-2 mb-3">
          🔒 শুধুমাত্র লগইনকৃত ব্যবহারকারীরা এডিট করতে পারবেন
        </p>
      )}

      {/* Editor Tips */}

      {isLogged && (

        <div className="bg-blue-50 border p-3 mb-4 rounded text-sm">

          <b>✍️ Editor Tips</b>

          <div className="grid grid-cols-2 gap-2 mt-2">

            <div>Ctrl + B → **Bold**</div>
            <div>Ctrl + I → *Italic*</div>
            <div>Ctrl + K → Link</div>
            <div>Ctrl + ] → Heading</div>
            <div>Ctrl + E → Center</div>

          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">

            <div>Quote → {"> text"}</div>
            <div>List → - item</div>
            <div>Code → ```code```</div>
            <div>Table → | a | b |</div>

          </div>

        </div>

      )}

      <input
        value={form.title}
        disabled={!isLogged}
        onChange={(e)=>setForm({...form,title:e.target.value})}
        className="border p-2 w-full mb-3"
      />

      <textarea
        ref={textareaRef}
        rows="16"
        value={form.content}
        disabled={!isLogged}
        onKeyDown={handleShortcut}
        onChange={(e)=>setForm({...form,content:e.target.value})}
        className="border p-2 w-full"
      />

      {isLogged && (
        <button
          onClick={save}
          className="bg-blue-600 text-white px-4 py-2 mt-3"
        >
          Save
        </button>
      )}

      {/* Preview */}

      <h2 className="mt-6 font-bold">
        👀 Preview
      </h2>

      <div className="prose max-w-none border p-4 mt-2 bg-gray-50">

        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a:(props)=>(
              <a
                {...props}
                target="_blank"
                className="text-blue-600 underline"
              />
            )
          }}
        >
          {form.content}
        </ReactMarkdown>

      </div>

    </div>

  )

}