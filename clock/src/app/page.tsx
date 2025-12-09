"use client";

import { useState, useEffect } from "react";
import { DateTime } from "luxon";

const timezones = [
  { label: "Local Time", value: "local" },
  { label: "New York", value: "America/New_York" },
  { label: "London (GMT)", value: "Europe/London" },
  { label: "Lagos (WAT)", value: "Africa/Lagos" },
  { label: "Tokyo", value: "Asia/Tokyo" },
  { label: "Sydney", value: "Australia/Sydney" },
  { label: "Mumbai", value: "Asia/Kolkata" },
  { label: "Los Angeles", value: "America/Los_Angeles" },
];

export default function Home() {
  const [selectedZone, setSelectedZone] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("selectedTimezone") || "local";
    }
    return "local";
  });
  const [time, setTime] = useState(() => {
    if (typeof window === "undefined") return DateTime.local();
    const saved = localStorage.getItem("selectedTimezone") || "local";
    return saved === "local" ? DateTime.local() : DateTime.utc().setZone(saved);
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now =
        selectedZone === "local"
          ? DateTime.local()
          : DateTime.utc().setZone(selectedZone);
      setTime(now);
    }, 1000);
    return () => clearInterval(timer);
  }, [selectedZone]);

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zone = e.target.value;
    setSelectedZone(zone);
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedTimezone", zone);
    }
  };

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

  const selectedLabel =
    timezones.find((tz) => tz.value === selectedZone)?.label || "Local Time";

  return (
    <div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-lg">
          <div className="mb-4">
            <select
              value={selectedZone}
              onChange={handleZoneChange}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {timezones.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
          <h1 className="text-4xl font-bold mb-2 text-black">
            {selectedLabel}
          </h1>
          <h1 className="text-6xl font-bold mb-4 text-black">
            {h}:{m}:{s} {time.hour >= 12 ? "PM" : "AM"}
          </h1>
        </div>
      </div>
    </div>
  );
}
