'use client'

import { useState, useEffect } from "react";

export default function Home() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
  return () => clearInterval(timer);
  }, []);

  let h = time.getHours().toString().padStart(2, "0");
  let m = time.getMinutes().toString().padStart(2, "0");
  let s = time.getSeconds().toString().padStart(2, "0");

  sessionStorage.setItem("hour", h);
  sessionStorage.setItem("minute", m);
  sessionStorage.setItem("second", s);

  sessionStorage.setItem("ampm", h >= '12' ? 'PM' : 'AM');

  if(parseInt(h) == 0) {
    h = '12';
  }
  if (parseInt(h) > 12) {
    h = (parseInt(h) - 12).toString().padStart(2, "0");

  }

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-lg">
          <h1 className="text-6xl font-bold mb-4">
            {h}:{m}:{s} {time.getHours() >= 12 ? 'PM' : 'AM'}
          </h1>
        </div>
      </div>
    </div>
  );
}
