"use client";

import React from "react";
import AddButton from "./AddButton";

interface ToolbarProps {
  onAdd: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filter: 'all' | 'completed' | 'incomplete';
  onFilterChange: (filter: 'all' | 'completed' | 'incomplete') => void;
  sortBy: 'createdAt' | 'priority' | 'dueDate';
  onSortByChange: (sortBy: 'createdAt' | 'priority' | 'dueDate') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  onMarkAllComplete: () => void;
  onDeleteCompleted: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  totalTodos: number;
  completedTodos: number;
}

export default function Toolbar({
  onAdd,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onMarkAllComplete,
  onDeleteCompleted,
  darkMode,
  onToggleDarkMode,
  totalTodos,
  completedTodos,
}: ToolbarProps) {
  return (
    <div className={`flex items-center justify-between p-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} border-b border-gray-200 shadow-sm`}>
      <div className="flex items-center space-x-4">
        <h1 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Todos</h1>
        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {completedTodos}/{totalTodos} completed
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'createdAt' | 'priority' | 'dueDate')}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="createdAt">Date</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due Date</option>
          </select>
          <button
            onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1 rounded ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button
            onClick={() => onFilterChange('incomplete')}
            className={`px-3 py-1 rounded ${filter === 'incomplete' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Incomplete
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`px-3 py-1 rounded ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Completed
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onMarkAllComplete}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Mark All Complete
          </button>
          <button
            onClick={onDeleteCompleted}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete Completed
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleDarkMode}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <AddButton onAdd={onAdd} />
        </div>
      </div>
  );
}
