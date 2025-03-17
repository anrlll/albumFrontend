"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios.get("/api") // Next.js の API を経由
      .then((response) => setMessage(response.data.message))
      .catch((error) => console.error("API fetch error:", error));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-xl font-bold">API Response: {message}</h1>
    </div>
  );
}
