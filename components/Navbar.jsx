"use client"
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [notes,setNotes]=useState([]);
  const [search,setSearch]=useState("");
  const [isLogged,setIsLogged]=useState(false);
  const [showDropdown,setShowDropdown]=useState(false);

  useEffect(()=>{loadNotes(); authCheck()},[])

  async function loadNotes(){
    const res=await fetch("/api/notes",{credentials:"include"});
    if(!res.ok) return;
    const data=await res.json();
    setNotes(data);
  }

  async function authCheck(){
    const res=await fetch("/api/me",{credentials:"include"});
    setIsLogged(res.status===200);
  }

  async function logout(){
    await fetch("/api/logout",{method:"POST", credentials:"include"});
    location.reload();
  }

  const firstNotes = notes.slice(0,6);
  const moreNotes = notes.slice(6);
  const filtered = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <nav className="fixed top-0 w-full bg-white shadow z-50">
      <div className="max-w-6xl mx-auto flex items-center gap-4 p-3">
        <Link href="/" className="font-bold text-lg">Mizan Cyber Master</Link>
        {firstNotes.map(n=><Link key={n.note_id} href={`/?note=${n.note_id}`} className="text-blue-600 hover:underline">{n.title}</Link>)}
        {moreNotes.length>0 && (
          <div className="relative">
            <button onClick={()=>setShowDropdown(!showDropdown)} className="px-2">More ▼</button>
            {showDropdown && (
              <div className="absolute bg-white shadow p-3 w-60">
                {moreNotes.map(n=><Link key={n.note_id} href={`/?note=${n.note_id}`} className="block hover:bg-gray-100 p-1">{n.title}</Link>)}
              </div>
            )}
          </div>
        )}
        <div className="flex-1"></div>
        <input placeholder="Search note..." value={search} onChange={e=>setSearch(e.target.value)} className="border p-1"/>
        {isLogged ? <button onClick={logout} className="ml-3 text-red-600">Logout</button> : <Link href="/login">Login</Link>}
      </div>
      {search && (
        <div className="bg-white shadow p-3">
          {filtered.map(n=><Link key={n.note_id} href={`/?note=${n.note_id}`} className="block p-1 hover:bg-gray-100">{n.title}</Link>)}
        </div>
      )}
    </nav>
  )
}