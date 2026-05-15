"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VideoCard from "@/components/ui/VideoCard";
import { getApiBase, getToken } from "@/lib/api";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const base = getApiBase();
    const token = getToken();
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(`${base}/api/videos?limit=12`, { headers })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || res.statusText);
        return data;
      })
      .then((data) => {
        if (Array.isArray(data.videos)) setVideos(data.videos);
        else if (Array.isArray(data)) setVideos(data);
        else setVideos([]);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load feed"));
  }, []);

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <h1 style={{ color: "#fafafa", fontSize: 22, marginBottom: 8 }}>Feed</h1>
      <p style={{ color: "#888", marginBottom: 24, fontSize: 14 }}>
        API: <code>{getApiBase()}</code> ·{" "}
        <Link href="/upload" style={{ color: "#93c5fd" }}>
          Upload to Supabase
        </Link>
      </p>
      {error ? (
        <p style={{ color: "#f87171" }} role="alert">
          {error}
        </p>
      ) : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}
      >
        {videos.map((v) => (
          <VideoCard key={v.id} video={v} />
        ))}
      </div>
      {!error && videos.length === 0 ? (
        <p style={{ color: "#888" }}>No videos yet. Upload one or register another account that has posts.</p>
      ) : null}
    </main>
  );
}
