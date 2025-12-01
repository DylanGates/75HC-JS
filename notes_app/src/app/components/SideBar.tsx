import React from 'react';
import Folders from './Folders';

interface Note {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
}

interface Folder {
    id: string;
    name: string;
}

interface SideBarProps {
    notes: Note[];
    folders: Folder[];
    selectedFolder: string | null;
    onSelectNote: (note: Note) => void;
    onDeleteNote: (id: string) => void;
    onSelectFolder: (folderId: string | null) => void;
}

export default function SideBar({ notes, folders, selectedFolder, onSelectNote, onDeleteNote, onSelectFolder }: SideBarProps) {
    return (
        <div className="w-80 bg-gray-50 border-r p-4">
            <Folders folders={folders} selectedFolder={selectedFolder} onSelectFolder={onSelectFolder} />
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            <div className="space-y-2">
                {notes.map(note => (
                    <div
                        key={note.id}
                        onClick={() => onSelectNote(note)}
                        className="p-3 bg-white rounded-lg shadow-sm cursor-pointer hover:bg-gray-100"
                    >
                        <h3 className="font-medium text-gray-900 truncate">{note.title || "Untitled"}</h3>
                        <p className="text-sm text-gray-600 truncate">{note.content}</p>
                        <p className="text-xs text-gray-400 mt-1">{note.createdAt.toLocaleDateString()}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}