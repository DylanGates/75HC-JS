"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import SideBar from "./components/SideBar";
import Toolbar from "./components/Toolbar";
import FormattingToolbar from "./components/FormattingToolbar";

interface Folder {
  id: string;
  name: string;
}

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  folderId: string;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  category?: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority' | 'dueDate'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [darkMode, setDarkMode] = useState(false);

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch =
      todo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder =
      selectedFolder === null || todo.folderId === selectedFolder;
    const matchesFilter =
      filter === 'all' ||
      (filter === 'completed' && todo.completed) ||
      (filter === 'incomplete' && !todo.completed);
    return matchesSearch && matchesFolder && matchesFilter;
  }).sort((a, b) => {
    let aValue: any, bValue: any;
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        aValue = priorityOrder[a.priority];
        bValue = priorityOrder[b.priority];
        break;
      case 'dueDate':
        aValue = a.dueDate ? a.dueDate.getTime() : Infinity;
        bValue = b.dueDate ? b.dueDate.getTime() : Infinity;
        break;
      default:
        aValue = a.createdAt.getTime();
        bValue = b.createdAt.getTime();
    }
    if (sortOrder === 'asc') {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  useEffect(() => {
    // Load todos and folders from localStorage
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
      }));
      setTodos(parsedTodos);
    }
    const savedFolders = localStorage.getItem("folders");
    if (savedFolders) {
      setFolders(JSON.parse(savedFolders));
    } else {
      // Default folder
      setFolders([{ id: "default", name: "Todos" }]);
    }
  }, []);

  useEffect(() => {
    // Save todos and folders to localStorage
    localStorage.setItem("todos", JSON.stringify(todos));
    localStorage.setItem("folders", JSON.stringify(folders));
  }, [todos, folders]);

  const handleAddTodo = () => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      title: "New Todo",
      description: "",
      completed: false,
      createdAt: new Date(),
      folderId: selectedFolder || "default",
      priority: 'medium',
    };
    setTodos([newTodo, ...todos]);
    setSelectedTodo(newTodo);
  };

  const handleSelectTodo = (todo: Todo) => {
    setSelectedTodo(todo);
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setTodos(
      todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
    );
    setSelectedTodo(updatedTodo);
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    if (selectedTodo?.id === id) {
      setSelectedTodo(null);
    }
  };

  const handleMarkAllComplete = () => {
    setTodos(todos.map((todo) => ({ ...todo, completed: true })));
  };

  const handleDeleteCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
    if (selectedTodo?.completed) {
      setSelectedTodo(null);
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}>
      <SideBar
        todos={filteredTodos}
        folders={folders}
        selectedFolder={selectedFolder}
        onSelectTodo={handleSelectTodo}
        onDeleteTodo={handleDeleteTodo}
        onSelectFolder={setSelectedFolder}
        darkMode={darkMode}
      />
      <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <Toolbar
          onAdd={handleAddTodo}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          onMarkAllComplete={handleMarkAllComplete}
          onDeleteCompleted={handleDeleteCompleted}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          totalTodos={todos.length}
          completedTodos={todos.filter(t => t.completed).length}
        />
        <div className="flex-1 p-6 overflow-auto">
          {selectedTodo ? (
            <div className="max-w-4xl mx-auto">
              <div className="mt-4">
                <input
                  type="text"
                  value={selectedTodo.title}
                  onChange={(e) =>
                    handleUpdateTodo({ ...selectedTodo, title: e.target.value })
                  }
                  className="w-full text-3xl font-light mb-6 border-none outline-none placeholder-gray-300 text-gray-900"
                  placeholder="Todo Title"
                />
                <textarea
                  value={selectedTodo.description}
                  onChange={(e) =>
                    handleUpdateTodo({
                      ...selectedTodo,
                      description: e.target.value,
                    })
                  }
                  className="w-full h-96 border-none outline-none resize-none text-lg leading-relaxed placeholder-gray-400 text-gray-800"
                  placeholder="Todo description..."
                />
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTodo.completed}
                      onChange={(e) =>
                        handleUpdateTodo({
                          ...selectedTodo,
                          completed: e.target.checked,
                        })
                      }
                      className="mr-2"
                    />
                    Completed
                  </label>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={selectedTodo.priority}
                    onChange={(e) =>
                      handleUpdateTodo({
                        ...selectedTodo,
                        priority: e.target.value as 'low' | 'medium' | 'high',
                      })
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={selectedTodo.dueDate ? selectedTodo.dueDate.toISOString().split('T')[0] : ''}
                    onChange={(e) =>
                      handleUpdateTodo({
                        ...selectedTodo,
                        dueDate: e.target.value ? new Date(e.target.value) : undefined,
                      })
                    }
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    value={selectedTodo.category || ''}
                    onChange={(e) =>
                      handleUpdateTodo({
                        ...selectedTodo,
                        category: e.target.value || undefined,
                      })
                    }
                    placeholder="e.g. Work, Personal"
                    className="border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-xl">
                  Select a todo to view or create a new one.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
