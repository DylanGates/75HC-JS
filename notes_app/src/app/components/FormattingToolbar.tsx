"use client";

import React from "react";

interface FormattingToolbarProps {
  onFormat: (format: string) => void;
}

export default function FormattingToolbar({
  onFormat,
}: FormattingToolbarProps) {
  return (
    <div className="flex items-center space-x-1 p-3 border-b border-gray-200 bg-white shadow-sm">
      <button
        onClick={() => onFormat("bold")}
        className="px-3 py-2 text-sm font-bold hover:bg-gray-100 rounded-md transition-colors duration-150"
        title="Bold"
      >
        B
      </button>
      <button
        onClick={() => onFormat("italic")}
        className="px-3 py-2 text-sm italic hover:bg-gray-100 rounded-md transition-colors duration-150"
        title="Italic"
      >
        I
      </button>
      <button
        onClick={() => onFormat("underline")}
        className="px-3 py-2 text-sm underline hover:bg-gray-100 rounded-md transition-colors duration-150"
        title="Underline"
      >
        U
      </button>
      <div className="w-px h-6 bg-gray-300 mx-2"></div>
      <button
        onClick={() => onFormat("list")}
        className="px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors duration-150"
        title="Bullet List"
      >
        •
      </button>
      <button
        onClick={() => onFormat("numbered")}
        className="px-3 py-2 text-sm hover:bg-gray-100 rounded-md transition-colors duration-150"
        title="Numbered List"
      >
        1.
      </button>
    </div>
  );
}
