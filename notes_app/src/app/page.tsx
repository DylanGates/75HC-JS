'use client';

import Image from "next/image";
import { useState, useEffect } from "react";
import SideBar from "./components/SideBar";
import AddButton from "./components/AddButton";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    // Load notes from localStorage
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt)
      }));
      setNotes(parsedNotes);
    }
  }, []);

  useEffect(() => {
    // Save notes to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "",
      createdAt: new Date(),
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  return (
    <div className="flex h-screen">
      <SideBar notes={notes} onSelectNote={handleSelectNote} onDeleteNote={handleDeleteNote} />
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold">Notes</h1>
          <AddButton onAdd={handleAddNote} />
        </div>
        <div className="flex-1 p-4">
          {selectedNote ? (
            <div>
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => handleUpdateNote({ ...selectedNote, title: e.target.value })}
                className="w-full text-2xl font-bold mb-4 border-none outline-none"
                placeholder="Note Title"
              />
              <textarea
                value={selectedNote.content}
                onChange={(e) => handleUpdateNote({ ...selectedNote, content: e.target.value })}
                className="w-full h-full border-none outline-none resize-none"
                placeholder="Start writing..."
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a note to view or create a new one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
