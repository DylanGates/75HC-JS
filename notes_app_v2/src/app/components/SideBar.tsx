import React from "react";
import Folders from "./Folders";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
}

interface Folder {
  id: string;
  name: string;
}

interface SideBarProps {
  todos: Todo[];
  folders: Folder[];
  selectedFolder: string | null;
  onSelectTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  onSelectFolder: (folderId: string | null) => void;
}

export default function SideBar({
  todos,
  folders,
  selectedFolder,
  onSelectTodo,
  onDeleteTodo,
  onSelectFolder,
}: SideBarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 p-4 shadow-sm">
      <Folders
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={onSelectFolder}
      />
      <h2 className="text-lg font-semibold mb-4 text-gray-700">Todos</h2>
      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`p-4 bg-gray-50 rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors group relative border ${
              todo.completed ? 'border-green-200 bg-green-50' : 'border-gray-100'
            }`}
          >
            <div onClick={() => onSelectTodo(todo)} className="flex-1">
              <h3 className={`font-medium truncate text-base mb-1 ${
                todo.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {todo.title || "Untitled"}
              </h3>
              <p className="text-sm text-gray-600 truncate leading-relaxed">
                {todo.description}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {todo.createdAt.toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteTodo(todo.id);
              }}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded-full transition-opacity"
              title="Delete todo"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-red-500"
              >
                <path
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
