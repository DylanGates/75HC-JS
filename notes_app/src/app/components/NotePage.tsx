"use client";

import React, { useState, useEffect } from "react";

interface Note {
    title: string;
    content: string;
}

interface NotePageProps {
    note: Note;
    onDelete: () => void;
    onSave: (updatedNote: Note) => void;
    initialNote: Note | null;
}

export default function NotePage({
    note,
    onDelete,
    onSave,
    initialNote,
}: NotePageProps) {
    const [title, setTitle] = useState(initialNote ? initialNote.title : note.title);
    const [content, setContent] = useState(initialNote ? initialNote.content : note.content);

    const handleSave = () => {
        onSave({ title, content });
    };

    return (
        <div className="p-4">
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full p-2 mb-2 border rounded"
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                className="w-full p-2 mb-2 border rounded"
            />
            <button
                onClick={handleSave}
                className="bg-blue-500 text-white p-2 mr-2 rounded"
            >
                Save
            </button>
            <button
                onClick={onDelete}
                className="bg-red-500 text-white p-2 rounded"
            >
                Delete
            </button>
        </div>
    );
}
