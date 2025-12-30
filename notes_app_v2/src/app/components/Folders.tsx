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

export default function Folders({
  folders,
  selectedFolder,
  onSelectFolder,
}: FoldersProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
        Folders
      </h3>
      <div className="space-y-1">
        <div
          onClick={() => onSelectFolder(null)}
          className={`p-3 rounded-lg cursor-pointer transition-colors ${
            selectedFolder === null
              ? "bg-blue-50 text-blue-700 border border-blue-200"
              : "hover:bg-gray-100 text-gray-700"
          }`}
        >
          📁 All Notes
        </div>
        {folders.map((folder) => (
          <div
            key={folder.id}
            onClick={() => onSelectFolder(folder.id)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedFolder === folder.id
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "hover:bg-gray-100 text-gray-700"
            }`}
          >
            📁 {folder.name}
          </div>
        ))}
      </div>
    </div>
  );
}
