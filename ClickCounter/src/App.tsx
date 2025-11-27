import { useState } from "react";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);
  // const [decrement, setDecrement] = useState(0)

  return (
    <>
      <div className="flex flex-row gap-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => setCount((count) => count + 1)}
        >
          count
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => setCount((count) => count - 1)}
        >
          decrement
        </button>
      </div>
      <div className="mt-4 bg-gray-200 p-4 rounded opacity-80">
        <p className="text-gray-800">Count: {count}</p>
      </div>
    </>
  );
}

export default App;
