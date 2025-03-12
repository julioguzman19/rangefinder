"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/select-course"); // Redirect to course selection on load
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen text-lg">
      ⏳ Loading...
    </div>
  );
}
