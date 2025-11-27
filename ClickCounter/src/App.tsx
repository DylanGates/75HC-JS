import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  const [stepValue, setStepValue] = useState(1);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCount(0);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="flex flex-row gap-4">
        <input
          type="number"
          value={stepValue}
          onChange={(e) => setStepValue(Number(e.target.value))}
          className="border border-gray-300 rounded px-2 py-1"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setCount((count) => count + stepValue)}
        >
          count
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => setCount((count) => count - stepValue)}
        >
          decrement
        </button>
      </div>
      <div className="mt-4 bg-gray-200 p-4 rounded opacity-80">
        <p className="text-gray-800">Count: {count}</p>
      </div>
      <button
        className="bg-red-500 mt-4 text-white px-4 py-2 rounded hover:bg-red-600"
        onClick={() => setCount(0)}
      >
        reset
      </button>
    </>
  );
}

export default App;
