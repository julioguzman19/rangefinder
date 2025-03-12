"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { RosePark } from "../data/courses";

export default function RangeFinder() {
  const searchParams = useSearchParams();
  const courseName = searchParams.get("courseName") || "Rose Park"; // Default course
  const [selectedHole, setSelectedHole] = useState(1);
  const [userLocation, setUserLocation] = useState(null);
  const [distanceToGreen, setDistanceToGreen] = useState(null);
  const [error, setError] = useState("");

  // 📡 Get user's GPS location
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        // 🔍 Log user location in the console
        console.log(`📍 User Location: Lat ${latitude}, Lon ${longitude}`);
      },
      (err) => setError("Error retrieving location."),
      { enableHighAccuracy: true }
    );
  }, []);

  // 📏 Calculate Distance (Haversine Formula)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return "N/A";

    const R = 6371; // Radius of Earth in km
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
    if (!userLocation || !RosePark.holes[selectedHole]) return;

    const hole = RosePark.holes[selectedHole];
    setDistanceToGreen(
      calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        hole.front_green_lat,
        hole.front_green_lon
      )
    );
  }, [selectedHole, userLocation]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">⛳ Range Finder - {courseName}</h1>

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
            {Object.keys(RosePark.holes).map((holeNumber) => (
              <option key={holeNumber} value={holeNumber}>
                Hole {holeNumber}
              </option>
            ))}
          </select>

          {/* 📡 Live Distance Display */}
          <div className="mt-4 border p-4 rounded shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-bold">Hole {selectedHole}</h2>

            {/* 📍 User Location */}
            {userLocation && (
              <p>
                📍 Your Location: Lat {userLocation.latitude.toFixed(6)}, Lon{" "}
                {userLocation.longitude.toFixed(6)}
              </p>
            )}

            {/* 📏 Distance Calculation */}
            <p>
              🎯 Distance to Front of Green:{" "}
              {distanceToGreen !== null ? `${distanceToGreen} yds` : "Calculating..."}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
