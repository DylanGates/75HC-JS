"use client";

import { useState, useEffect, useMemo } from "react";
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

function WorldClock({ zone }: { zone: string }) {
  const [time, setTime] = useState(() =>
    zone === "local" ? DateTime.local() : DateTime.utc().setZone(zone)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const now =
        zone === "local" ? DateTime.local() : DateTime.utc().setZone(zone);
      setTime(now);
    }, 1000);
    return () => clearInterval(timer);
  }, [zone]);

  const formattedTime = useMemo(() => {
    let h = time.hour.toString().padStart(2, "0");
    const m = time.minute.toString().padStart(2, "0");
    const s = time.second.toString().padStart(2, "0");

    if (parseInt(h) === 0) {
      h = "12";
    }
    if (parseInt(h) > 12) {
      h = (parseInt(h) - 12).toString().padStart(2, "0");
    }

    h = parseInt(h).toString();

    return `${h}:${m}:${s} ${time.hour >= 12 ? "PM" : "AM"}`;
  }, [time]);

  const label =
    timezones.find((tz) => tz.value === zone)?.label || "Local Time";

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-semibold mb-2 text-black">{label}</h2>
      <p className="text-3xl font-bold text-black">{formattedTime}</p>
    </div>
  );
}

export default function Home() {
  const [selectedZones, setSelectedZones] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedTimezones");
      return saved
        ? JSON.parse(saved)
        : ["local", "America/New_York", "Europe/London"];
    }
    return ["local", "America/New_York", "Europe/London"];
  });

  const addZone = (zone: string) => {
    if (!selectedZones.includes(zone)) {
      const newZones = [...selectedZones, zone];
      setSelectedZones(newZones);
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedTimezones", JSON.stringify(newZones));
      }
    }
  };

  const removeZone = (zone: string) => {
    if (selectedZones.length > 1) {
      const newZones = selectedZones.filter((z) => z !== zone);
      setSelectedZones(newZones);
      if (typeof window !== "undefined") {
        localStorage.setItem("selectedTimezones", JSON.stringify(newZones));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-black">
          World Clock
        </h1>

        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          <select
            onChange={(e) => addZone(e.target.value)}
            defaultValue=""
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Add City
            </option>
            {timezones
              .filter((tz) => !selectedZones.includes(tz.value))
              .map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedZones.map((zone) => (
            <div key={zone} className="relative">
              <WorldClock zone={zone} />
              {selectedZones.length > 1 && (
                <button
                  onClick={() => removeZone(zone)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
