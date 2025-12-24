"use client";

import React from "react";

interface AddButtonProps {
  onAdd: () => void;
}

export default function AddButton({ onAdd }: AddButtonProps) {
  return (
    <button
      onClick={onAdd}
      title="Create new note"
      className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
      aria-label="Create new note"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 5V15M5 10H15"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
