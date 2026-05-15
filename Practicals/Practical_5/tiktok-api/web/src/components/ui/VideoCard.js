"use client";

import { getApiBase } from "@/lib/api";

/**
 * Resolves a video URL from the API (relative /uploads/...) or Supabase (absolute).
 */
export function getFullVideoUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  const base = getApiBase();
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
}

export default function VideoCard({ video }) {
  const src = getFullVideoUrl(video.url);
  const poster = video.thumbnailUrl ? getFullVideoUrl(video.thumbnailUrl) : undefined;

  return (
    <article
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        overflow: "hidden",
        maxWidth: 320,
        background: "#111",
      }}
    >
      <video
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        style={{ width: "100%", display: "block", aspectRatio: "9/16", objectFit: "cover" }}
      />
      <div style={{ padding: "10px 12px", color: "#fafafa", fontSize: 14 }}>
        <div style={{ fontWeight: 600 }}>{video.user?.username || "User"}</div>
        <div style={{ marginTop: 4, opacity: 0.9 }}>{video.caption}</div>
      </div>
    </article>
  );
}
