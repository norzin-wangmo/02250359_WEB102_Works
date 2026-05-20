"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, getToken } from "@/lib/api";
import supabase from "@/lib/supabase";
import { uploadVideoAndThumbnail, uploadViaApi } from "@/services/uploadService";

export default function UploadPage() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbFile, setThumbFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!getToken()) {
      setError("Please log in first.");
      return;
    }
    if (!videoFile) {
      setError("Choose a video file.");
      return;
    }
    if (!caption.trim()) {
      setError("Caption is required.");
      return;
    }

    setBusy(true);
    try {
      let uploaded = false;

      if (supabase) {
        try {
          const me = await apiFetch("/api/users/me");
          const { video, thumbnail } = await uploadVideoAndThumbnail({
            videoFile,
            thumbnailFile: thumbFile || null,
            userId: me.id,
          });

          await apiFetch("/api/videos", {
            method: "POST",
            body: JSON.stringify({
              caption: caption.trim(),
              description: description.trim() || undefined,
              videoUrl: video.publicUrl,
              videoStoragePath: video.storagePath,
              thumbnailUrl: thumbnail?.publicUrl,
              thumbnailStoragePath: thumbnail?.storagePath,
            }),
          });
          uploaded = true;
        } catch (directErr) {
          console.warn("Direct Supabase upload failed, using API upload:", directErr);
        }
      }

      if (!uploaded) {
        await uploadViaApi({
          videoFile,
          thumbnailFile: thumbFile || null,
          caption: caption.trim(),
          description: description.trim() || undefined,
        });
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "0 auto", padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Upload (Supabase)</h1>
      <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
        Files go to your Supabase buckets; metadata is saved via the API.
      </p>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Video</span>
          <input
            type="file"
            accept="video/*"
            onChange={(ev) => setVideoFile(ev.target.files?.[0] || null)}
            disabled={busy}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Thumbnail (optional)</span>
          <input
            type="file"
            accept="image/*"
            onChange={(ev) => setThumbFile(ev.target.files?.[0] || null)}
            disabled={busy}
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Caption</span>
          <input
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={busy}
            required
          />
        </label>
        <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span>Description (optional)</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={busy}
            rows={3}
          />
        </label>
        {error ? (
          <p style={{ color: "crimson", margin: 0, fontSize: 14 }} role="alert">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={busy} style={{ padding: "10px 16px" }}>
          {busy ? "Uploading…" : "Publish"}
        </button>
      </form>

      <p style={{ marginTop: 24, fontSize: 14 }}>
        <Link href="/">← Feed</Link>
      </p>
    </main>
  );
}
