"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RosePark } from "@/app/data/courses"; // ✅ Import Course Data

export default function RangeFinder() {
  const searchParams = useSearchParams();
  const course = searchParams.get("course") || "RosePark"; // Default to RosePark
  const [selectedHole, setSelectedHole] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [distanceToFront, setDistanceToFront] = useState(null);
  const [distanceToBack, setDistanceToBack] = useState(null);
  const [error, setError] = useState("");

  // 📡 Get user's GPS location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => setError("Error retrieving location."),
      { enableHighAccuracy: true }
    );
  }, []);

  // 📏 Calculate Distance (Haversine Formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "N/A";

    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 1093.61); // Convert km to yards
  };

  // 🏌️ Update Distance Calculation
  useEffect(() => {
    if (!userLocation) return;

    const holeData = RosePark[selectedHole]; // Get hole data from RosePark
    if (!holeData) return;

    setDistanceToFront(
      calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        holeData.front_green_lat,
        holeData.front_green_lon
      )
    );

    setDistanceToBack(
      calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        holeData.back_green_lat,
        holeData.back_green_lon
      )
    );
  }, [selectedHole, userLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">⛳ Range Finder - {course}</h1>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* 🎯 Hole Selection */}
          <label className="text-lg font-bold">Select Hole:</label>
          <select
            className="border p-2 rounded mt-2"
            value={selectedHole}
            onChange={(e) => setSelectedHole(Number(e.target.value))}
          >
            {Object.keys(RosePark).map((holeNumber) => (
              <option key={holeNumber} value={holeNumber}>
                Hole {holeNumber}
              </option>
            ))}
          </select>

          {/* 📡 Live Distance Display */}
          <div className="mt-4 border p-4 rounded shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-bold">Hole {selectedHole}</h2>

            {/* 📏 Distances */}
            {userLocation && (
              <>
                <p>
                  📍 Distance to Front of Green:{" "}
                  {distanceToFront !== null ? `${distanceToFront} yds` : "N/A"}
                </p>
                <p>
                  🎯 Distance to Back of Green:{" "}
                  {distanceToBack !== null ? `${distanceToBack} yds` : "N/A"}
                </p>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
