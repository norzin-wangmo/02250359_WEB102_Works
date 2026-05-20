import supabase from "@/lib/supabase";
import { apiFetch } from "@/lib/api";

const VIDEO_BUCKET = "videos";
const THUMB_BUCKET = "thumbnails";

async function uploadFile(bucket, file, storagePath) {
  if (!supabase) {
    throw new Error("Supabase is not configured (check .env.local)");
  }
  const { error } = await supabase.storage.from(bucket).upload(storagePath, file, {
    contentType: file.type || undefined,
    upsert: true,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(storagePath);
  return { publicUrl: data.publicUrl, storagePath };
}

/**
 * Direct browser uploads to Supabase Storage, then your API stores metadata.
 * @param {{ videoFile: File, thumbnailFile?: File | null, userId: string }} params
 */
export async function uploadVideoAndThumbnail({ videoFile, thumbnailFile, userId }) {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const vSafe = (videoFile.name || "video").replace(/[^\w.-]+/g, "_");
  const videoPath = `${userId}/${stamp}-${vSafe}`;
  const video = await uploadFile(VIDEO_BUCKET, videoFile, videoPath);

  let thumbnail = null;
  if (thumbnailFile) {
    const tSafe = (thumbnailFile.name || "thumb").replace(/[^\w.-]+/g, "_");
    const thumbPath = `${userId}/${stamp}-${tSafe}`;
    thumbnail = await uploadFile(THUMB_BUCKET, thumbnailFile, thumbPath);
  }

  return { video, thumbnail };
}

/**
 * Upload via API (service role on server). Use when browser Supabase keys are missing or wrong.
 */
export async function uploadViaApi({ videoFile, thumbnailFile, caption, description }) {
  const form = new FormData();
  form.append("videoFile", videoFile);
  if (thumbnailFile) form.append("thumbnail", thumbnailFile);
  form.append("caption", caption);
  if (description) form.append("description", description);
  return apiFetch("/api/videos", { method: "POST", body: form });
}
