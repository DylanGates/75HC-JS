"use client";

import React from "react";
import AddButton from "./AddButton";

interface ToolbarProps {
    onAdd: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export default function Toolbar({ onAdd, searchQuery, onSearchChange }: ToolbarProps) {
    return (
        <div className="p-4 border-b flex items-center justify-between bg-white">
            <h1 className="text-2xl font-bold">Notes</h1>
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <AddButton onAdd={onAdd} />
            </div>
        </div>
    );
}