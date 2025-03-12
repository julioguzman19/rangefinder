"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RosePark } from "@/app/data/courses"; // Import the course data

export default function SelectCourse() {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState("RosePark");

  // 🎯 Function to navigate to the Range Finder with the selected course
  const handleSelect = () => {
    router.push(`/rangefinder?course=${selectedCourse}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">⛳ Select a Course</h1>

      {/* Dropdown for Course Selection */}
      <select
        className="border p-2 rounded mt-2 w-full max-w-xs"
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
      >
        <option value="RosePark">Rose Park Golf Course</option>
        {/* Future courses can be added here */}
      </select>

      {/* Button to Confirm Selection */}
      <button
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded"
        onClick={handleSelect}
      >
        Continue
      </button>
    </div>
  );
}
