"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [themeName, setThemeName] = useState(() => {
    return typeof window !== "undefined" &&
      localStorage.getItem("theme") === "dark"
      ? "dark"
      : "light";
  });

  function toggleDarkMode() {
    const newTheme = themeName === "dark" ? "light" : "dark";
    setThemeName(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.className = newTheme;
  }

  useEffect(() => {
    document.documentElement.className = themeName;
  }, [themeName]);

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300 ${
        themeName === "dark"
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-lg transition-colors duration-300 ${
          themeName === "dark"
            ? "bg-gray-800 border border-gray-700"
            : "bg-gray-50 border border-gray-200"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4 text-center">
          Dark Mode Toggle
        </h1>
        <p className="text-center mb-6 opacity-80">
          Current theme: <span className="font-semibold">{themeName}</span>
        </p>
        <button
          onClick={toggleDarkMode}
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
            themeName === "dark"
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          Switch to {themeName === "dark" ? "Light" : "Dark"} Mode
        </button>
      </div>
    </div>
  );
}
