"use client";

import React from "react";

interface Folder {
    id: string;
    name: string;
}

interface FoldersProps {
    folders: Folder[];
    selectedFolder: string | null;
    onSelectFolder: (folderId: string | null) => void;
}

export default function Folders({ folders, selectedFolder, onSelectFolder }: FoldersProps) {
    return (
        <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-600 mb-2">Folders</h3>
            <div className="space-y-1">
                <div
                    onClick={() => onSelectFolder(null)}
                    className={`p-2 rounded cursor-pointer ${selectedFolder === null ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                >
                    All Notes
                </div>
                {folders.map(folder => (
                    <div
                        key={folder.id}
                        onClick={() => onSelectFolder(folder.id)}
                        className={`p-2 rounded cursor-pointer ${selectedFolder === folder.id ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                    >
                        {folder.name}
                    </div>
                ))}
            </div>
        </div>
    );
}