"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";

export default function Home() {
  const [time, setTime] = useState(DateTime.local());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(DateTime.local());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  let h = time.hour.toString().padStart(2, "0");
  const m = time.minute.toString().padStart(2, "0");
  const s = time.second.toString().padStart(2, "0");

  if (typeof window !== "undefined") {
    sessionStorage.setItem("hour", h);
    sessionStorage.setItem("minute", m);
    sessionStorage.setItem("second", s);

    sessionStorage.setItem("ampm", h >= "12" ? "PM" : "AM");
  }

  if (parseInt(h) == 0) {
    h = "12";
  }
  if (parseInt(h) > 12) {
    h = (parseInt(h) - 12).toString().padStart(2, "0");
  }

  h = parseInt(h).toString();

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-lg">
          <h1 className="text-6xl font-bold mb-4 text-black">
            {h}:{m}:{s} {time.hour >= 12 ? "PM" : "AM"}
          </h1>
        </div>
      </div>
    </div>
  );
}
