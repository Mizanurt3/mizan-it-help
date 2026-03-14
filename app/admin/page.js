"use client"

import { useEffect, useState } from "react";

export default function AdminPage(){

  const [notes,setNotes]=useState([]);
  const [form,setForm]=useState({title:"",content:""});

  useEffect(()=>{
    loadNotes()
  },[])

  async function loadNotes(){
    const res=await fetch("/api/notes");
    const data=await res.json();
    setNotes(data);
  }

  async function create(){

    await fetch("/api/notes",{
      method:"POST",
      credentials:"include",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify(form)
    })

    loadNotes()
  }

  async function remove(id){

    await fetch(`/api/notes/${id}`,{
      method:"DELETE",
      credentials:"include"
    })

    loadNotes()
  }

  return(

    <div>

      <h1 className="text-xl mb-3">Admin Notes</h1>

      <input
        placeholder="title"
        onChange={(e)=>setForm({...form,title:e.target.value})}
        className="border p-2 w-full"
      />

      <textarea
        placeholder="content"
        onChange={(e)=>setForm({...form,content:e.target.value})}
        className="border p-2 w-full mt-2"
      />

      <button
        onClick={create}
        className="bg-green-600 text-white px-4 py-2 mt-2"
      >
        Create
      </button>

      <hr className="my-4"/>

      {notes.map(n=>(
        <div key={n.note_id} className="flex justify-between">

          {n.title}

          <button
            onClick={()=>remove(n.note_id)}
            className="text-red-600"
          >
            Delete
          </button>

        </div>
      ))}

    </div>

  )
}