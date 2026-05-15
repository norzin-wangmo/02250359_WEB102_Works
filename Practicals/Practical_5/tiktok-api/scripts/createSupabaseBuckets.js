/**
 * Creates public Storage buckets `videos` and `thumbnails` using the service role key.
 * Run from repo root: npm run setup:supabase-buckets
 *
 * You must still apply row-level policies (see scripts/supabase-storage-policies.sql)
 * in Supabase → SQL Editor so the browser anon key can upload/read as intended.
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  console.error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env first.");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const buckets = [
  process.env.SUPABASE_VIDEO_BUCKET || "videos",
  process.env.SUPABASE_THUMBNAIL_BUCKET || "thumbnails",
];

async function ensureBucket(id) {
  const { error } = await supabase.storage.createBucket(id, {
    public: true,
    fileSizeLimit: null,
  });
  if (!error) {
    console.log(`Created bucket: ${id}`);
    return;
  }
  const msg = error.message || String(error);
  if (/exists|already/i.test(msg)) {
    console.log(`Bucket already exists (ok): ${id}`);
    return;
  }
  throw error;
}

async function main() {
  for (const id of buckets) {
    await ensureBucket(id);
  }
  console.log("\nNext: open Supabase → SQL Editor and run scripts/supabase-storage-policies.sql");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
