"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [themeName, setThemeName] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved && ["light", "dark", "system"].includes(saved)) {
        return saved;
      }
      return "system"; // Default to system on first load
    }
    return "light";
  });

  const getSystemTheme = () => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light";
  };

  const getEffectiveTheme = () => {
    return themeName === "system" ? getSystemTheme() : themeName;
  };

  function setTheme(newTheme: string) {
    setThemeName(newTheme);
    localStorage.setItem("theme", newTheme);
    const effectiveTheme = newTheme === "system" ? getSystemTheme() : newTheme;
    document.documentElement.className = effectiveTheme;
  }

  useEffect(() => {
    const getEffectiveThemeLocal = () => {
      return themeName === "system" ? getSystemTheme() : themeName;
    };
    const effectiveTheme = getEffectiveThemeLocal();
    document.documentElement.className = effectiveTheme;

    if (themeName === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const newEffectiveTheme = getSystemTheme();
        document.documentElement.className = newEffectiveTheme;
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [themeName]);

  const effectiveTheme = getEffectiveTheme();

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-screen transition-colors duration-300 ${
        effectiveTheme === "dark"
          ? "bg-gray-900 text-white"
          : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`p-8 rounded-lg shadow-lg transition-colors duration-300 ${
          effectiveTheme === "dark"
            ? "bg-gray-800 border border-gray-700"
            : "bg-gray-50 border border-gray-200"
        }`}
      >
        <h1 className="text-3xl font-bold mb-4 text-center">Theme Selector</h1>
        <p className="text-center mb-6 opacity-80">
          Current theme: <span className="font-semibold">{effectiveTheme}</span>
          {themeName === "system" && (
            <span className="text-sm"> (following system)</span>
          )}
        </p>
        <div className="space-y-3">
          <button
            onClick={() => setTheme("light")}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              themeName === "light"
                ? "bg-yellow-500 text-white"
                : effectiveTheme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Light Mode
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              themeName === "dark"
                ? "bg-indigo-600 text-white"
                : effectiveTheme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Dark Mode
          </button>
          <button
            onClick={() => setTheme("system")}
            className={`w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              themeName === "system"
                ? "bg-green-500 text-white"
                : effectiveTheme === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            System ({getSystemTheme()})
          </button>
        </div>
      </div>
    </div>
  );
}
