'use client';

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

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = selectedFolder === null || note.folderId === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  useEffect(() => {
    // Load notes and folders from localStorage
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt)
      }));
      setNotes(parsedNotes);
    }
    const savedFolders = localStorage.getItem('folders');
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      // Default folder
      setFolders([{ id: 'default', name: 'Notes' }]);
    }
  }, []);

  useEffect(() => {
    // Save notes and folders to localStorage
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('folders', JSON.stringify(folders));
  }, [notes, folders]);

  const handleAddNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "",
      createdAt: new Date(),
      folderId: selectedFolder || 'default',
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

  const handleFormat = (format: string) => {
    // Basic formatting - in a real app, use a rich text editor
    if (!selectedNote) return;
    let newContent = selectedNote.content;
    switch (format) {
      case 'bold':
        newContent += '**bold text**';
        break;
      case 'italic':
        newContent += '*italic text*';
        break;
      case 'underline':
        newContent += '<u>underlined text</u>';
        break;
      case 'list':
        newContent += '\n- Item';
        break;
      case 'numbered':
        newContent += '\n1. Item';
        break;
    }
    handleUpdateNote({ ...selectedNote, content: newContent });
  };

  return (
    <div className="flex h-screen">
      <SideBar 
        notes={filteredNotes} 
        folders={folders} 
        selectedFolder={selectedFolder} 
        onSelectNote={handleSelectNote} 
        onDeleteNote={handleDeleteNote} 
        onSelectFolder={setSelectedFolder} 
      />
      <div className="flex-1 flex flex-col">
        <Toolbar onAdd={handleAddNote} searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="flex-1 p-4">
          {selectedNote ? (
            <div className="h-full flex flex-col">
              <FormattingToolbar onFormat={handleFormat} />
              <div className="flex-1 p-4">
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
