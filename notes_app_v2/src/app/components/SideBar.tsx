import React from "react";
import Folders from "./Folders";

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category?: string;
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
  darkMode: boolean;
}

export default function SideBar({
  todos,
  folders,
  selectedFolder,
  onSelectTodo,
  onDeleteTodo,
  onSelectFolder,
  darkMode,
}: SideBarProps) {
  return (
    <div className={`w-80 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-r border-gray-200 p-4 shadow-sm`}>
      <Folders
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectFolder={onSelectFolder}
      />
      <h2 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>Todos</h2>
      <div className="space-y-3">
        {todos.map((todo) => (
          <div
            key={todo.id}
            className={`p-4 ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-lg shadow-sm cursor-pointer hover:bg-gray-100 transition-colors group relative border ${
              todo.completed ? 'border-green-200 bg-green-50' : darkMode ? 'border-gray-600' : 'border-gray-100'
            }`}
          >
            <div onClick={() => onSelectTodo(todo)} className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className={`font-medium truncate text-base ${
                  todo.completed ? 'line-through text-gray-500' : darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {todo.title || "Untitled"}
                </h3>
                <span className={`text-xs px-2 py-1 rounded ${
                  todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                  todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {todo.priority}
                </span>
              </div>
              <p className={`text-sm truncate leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {todo.description}
              </p>
              {todo.category && (
                <p className="text-xs text-blue-600 mt-1">
                  {todo.category}
                </p>
              )}
              {todo.dueDate && (
                <p className="text-xs text-orange-600 mt-1">
                  Due: {todo.dueDate.toLocaleDateString()}
                </p>
              )}
              <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>
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
