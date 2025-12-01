"use client";

import React from "react";

interface FormattingToolbarProps {
    onFormat: (format: string) => void;
}

export default function FormattingToolbar({ onFormat }: FormattingToolbarProps) {
    return (
        <div className="flex items-center space-x-2 p-2 border-b bg-gray-50">
            <button
                onClick={() => onFormat('bold')}
                className="px-3 py-1 text-sm font-bold hover:bg-gray-200 rounded"
                title="Bold"
            >
                B
            </button>
            <button
                onClick={() => onFormat('italic')}
                className="px-3 py-1 text-sm italic hover:bg-gray-200 rounded"
                title="Italic"
            >
                I
            </button>
            <button
                onClick={() => onFormat('underline')}
                className="px-3 py-1 text-sm underline hover:bg-gray-200 rounded"
                title="Underline"
            >
                U
            </button>
            <div className="w-px h-6 bg-gray-300"></div>
            <button
                onClick={() => onFormat('list')}
                className="px-3 py-1 text-sm hover:bg-gray-200 rounded"
                title="Bullet List"
            >
                •
            </button>
            <button
                onClick={() => onFormat('numbered')}
                className="px-3 py-1 text-sm hover:bg-gray-200 rounded"
                title="Numbered List"
            >
                1.
            </button>
        </div>
    );
}