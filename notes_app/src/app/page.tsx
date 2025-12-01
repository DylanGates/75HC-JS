'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import SideBar from "./components/SideBar";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  useEffect(() => {
    // Fetch notes from an API or local storage
    // setNotes(fetchedNotes);
  }, []);
  
  const handleAddNote = () => {
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date(),
    };
    setNotes([...notes, note]);
    setNewNote({ title: "", content: "" });
  };

  // const handleDeleteNote = (id: string) => {
  //   setNotes(notes.filter((note) => note.id !== id));
  // };


  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center"> 
      <h1 className="text-2xl font-bold mb-4 mt-30">Notes App</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Title"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Content"
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddNote} className="bg-blue-500 text-white p-2">
          Add Note
        </button>
      </div>

      <div>
        <SideBar />
      </div>

      <Image
        src="/notes.png"
        alt="Notes App Image"
        width={500}
        height={300}
        className="mt-4 rounded-lg shadow-lg"
      />
      <p className="text-sm text-gray-500 mt-2">
        Note: This is a simple notes app built with Next.js and React.
      </p>
    </div>
  );
}
