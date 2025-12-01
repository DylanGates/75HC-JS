import React from 'react';

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
}

export default function SideBar() {
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [newNote, setNewNote] = React.useState({ title: '', content: '' });

    const handleDeleteNote = (id: string) => {
        setNotes(notes.filter(note => note.id !== id));
    };

    const handleAddNote = (title: string, content: string) => {
        const newNote: Note = {
            id: Date.now().toString(),
            title,
            content,
            createdAt: new Date(),
        };
        setNotes([...notes, newNote]);
        setNewNote({ title: '', content: '' });
    };

    return (
        <div className="w-1/4 p-4 border-r">
            {notes.map(note => (
                <div key={note.id} className="p-4 border-b">
                    <h2 className="text-lg font-bold">{note.title}</h2>
                    <p>{note.content}</p>
                    <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="bg-red-500 text-white p-2 mt-2 rounded"
                    >
                        Delete
                    </button>
                </div>
            ))}
        </div>
    )};