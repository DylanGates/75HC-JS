"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [themeName, setThemeName] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      const timestamp = localStorage.getItem("themeTimestamp");
      if (saved && timestamp) {
        const expiry = parseInt(timestamp) + 30 * 24 * 60 * 60 * 1000; // 30 days
        if (
          Date.now() < expiry &&
          ["light", "dark", "system"].includes(saved)
        ) {
          return saved;
        }
      }
      return "system"; // Default to system on first load
    }
    return "light";
  });

  const [rememberChoice, setRememberChoice] = useState(false);
  const [effectiveTheme, setEffectiveTheme] = useState("light");
  const [mounted, setMounted] = useState(false);

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
    if (rememberChoice) {
      localStorage.setItem("theme", newTheme);
      localStorage.setItem("themeTimestamp", Date.now().toString());
    } else {
      localStorage.removeItem("theme");
      localStorage.removeItem("themeTimestamp");
    }
    const effectiveThemeLocal =
      newTheme === "system" ? getSystemTheme() : newTheme;
    setEffectiveTheme(effectiveThemeLocal);
    document.documentElement.className = effectiveThemeLocal;
  }

  useEffect(() => {
    const getEffectiveThemeLocal = () => {
      return themeName === "system" ? getSystemTheme() : themeName;
    };
    const effectiveThemeLocal = getEffectiveThemeLocal();
    setEffectiveTheme(effectiveThemeLocal);
    document.documentElement.className = effectiveThemeLocal;
    setMounted(true);

    if (themeName === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const newEffectiveTheme = getSystemTheme();
        setEffectiveTheme(newEffectiveTheme);
        document.documentElement.className = newEffectiveTheme;
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [themeName]);

  if (!mounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
        <div className="p-8 rounded-lg shadow-lg bg-white border border-gray-200">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Theme Selector
          </h1>
          <p className="text-center mb-6 opacity-80">Loading theme...</p>
        </div>
      </div>
    );
  }

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
        <div className="mt-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberChoice}
              onChange={(e) => setRememberChoice(e.target.checked)}
              className="mr-2"
            />
            Remember my choice
          </label>
        </div>
      </div>
    </div>
  );
}
