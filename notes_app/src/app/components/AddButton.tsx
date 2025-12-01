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
            className="w-[38px] h-[38px] flex items-center justify-center rounded-full border-[#6C63FF] bg-[#6C63FF] hover:bg-[#534CC2] transition-colors"
            aria-label="Create new note"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#F7F7F7]"
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