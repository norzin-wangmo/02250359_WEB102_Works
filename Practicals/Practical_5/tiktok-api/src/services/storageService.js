import supabase from "../lib/supabase.js";

export const VIDEO_BUCKET = process.env.SUPABASE_VIDEO_BUCKET || "videos";
export const THUMB_BUCKET = process.env.SUPABASE_THUMBNAIL_BUCKET || "thumbnails";

function requireClient() {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }
  return supabase;
}

/**
 * Upload bytes to a bucket. Returns the object path within the bucket.
 */
export async function uploadObject(bucket, objectPath, data, options = {}) {
  const client = requireClient();
  const { error } = await client.storage.from(bucket).upload(objectPath, data, {
    contentType: options.contentType,
    upsert: Boolean(options.upsert),
  });
  if (error) throw error;
  return objectPath;
}

export function getPublicUrl(bucket, objectPath) {
  const client = requireClient();
  const { data } = client.storage.from(bucket).getPublicUrl(objectPath);
  return data.publicUrl;
}

/**
 * Remove one or more objects from a bucket (paths are relative to bucket root).
 */
export async function removeObjects(bucket, paths) {
  const filtered = [...new Set(paths.filter(Boolean))];
  if (!filtered.length) return;
  const client = requireClient();
  const { error } = await client.storage.from(bucket).remove(filtered);
  if (error) throw error;
}

export function buildObjectPath(userId, originalName, prefix = "") {
  const safe = String(originalName || "file").replace(/[^\w.\-]+/g, "_");
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const base = `${userId}/${stamp}-${safe}`;
  return prefix ? `${prefix.replace(/\/$/, "")}/${base}` : base;
}
