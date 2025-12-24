"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import SideBar from "./components/SideBar";
import Toolbar from "./components/Toolbar";
import FormattingToolbar from "./components/FormattingToolbar";

interface Folder {
  id: string;
  name: string;
}

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  folderId: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder =
      selectedFolder === null || note.folderId === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  useEffect(() => {
    // Load notes and folders from localStorage
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
      }));
      setNotes(parsedNotes);
    }
    const savedFolders = localStorage.getItem("folders");
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      // Default folder
      setFolders([{ id: "default", name: "Notes" }]);
    }
  }, []);

  useEffect(() => {
    // Save notes and folders to localStorage
    localStorage.setItem("notes", JSON.stringify(notes));
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [notes, folders]);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "",
      createdAt: new Date(),
      folderId: selectedFolder || "default",
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(
      notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    );
    setSelectedNote(updatedNote);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const handleFormat = (format: string) => {
    // Basic formatting - in a real app, use a rich text editor
    if (!selectedNote) return;
    let newContent = selectedNote.content;
    switch (format) {
      case "bold":
        newContent += "**bold text**";
        break;
      case "italic":
        newContent += "*italic text*";
        break;
      case "underline":
        newContent += "<u>underlined text</u>";
        break;
      case "list":
        newContent += "\n- Item";
        break;
      case "numbered":
        newContent += "\n1. Item";
        break;
    }
    handleUpdateNote({ ...selectedNote, content: newContent });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <SideBar
        notes={filteredNotes}
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectNote={handleSelectNote}
        onDeleteNote={handleDeleteNote}
        onSelectFolder={setSelectedFolder}
      />
      <div className="flex-1 flex flex-col bg-white">
        <Toolbar
          onAdd={handleAddNote}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="flex-1 p-6 overflow-auto">
          {selectedNote ? (
            <div className="max-w-4xl mx-auto">
              <FormattingToolbar onFormat={handleFormat} />
              <div className="mt-4">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) =>
                    handleUpdateNote({ ...selectedNote, title: e.target.value })
                  }
                  className="w-full text-3xl font-light mb-6 border-none outline-none placeholder-gray-300 text-gray-900"
                  placeholder="Note Title"
                />
                <textarea
                  value={selectedNote.content}
                  onChange={(e) =>
                    handleUpdateNote({
                      ...selectedNote,
                      content: e.target.value,
                    })
                  }
                  className="w-full h-96 border-none outline-none resize-none text-lg leading-relaxed placeholder-gray-400 text-gray-800"
                  placeholder="Start writing..."
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">📝</div>
                <p className="text-xl">
                  Select a note to view or create a new one.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
