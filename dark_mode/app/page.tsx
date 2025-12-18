'use client'

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

  return(
    <div>
      <button onClick={toggleDarkMode} className="px-4 py-2 bg-blue-500 text-white rounded">
        Toggle Dark Mode
      </button>
    </div>
  ) ;
}
