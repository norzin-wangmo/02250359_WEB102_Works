import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { isSupabaseConfigured } from "../src/lib/supabase.js";
import * as storage from "../src/services/storageService.js";

const prisma = new PrismaClient();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

function isLocalVideoUrl(url) {
  try {
    const u = new URL(url);
    return u.pathname.includes("/uploads/videos/");
  } catch {
    return String(url || "").includes("/uploads/videos/");
  }
}

async function main() {
  if (!isSupabaseConfigured()) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_KEY before running this script.");
    process.exit(1);
  }

  const videos = await prisma.video.findMany({
    where: {
      OR: [{ videoStoragePath: null }, { videoStoragePath: "" }],
    },
  });

  for (const v of videos) {
    if (!isLocalVideoUrl(v.url)) {
      console.log(`Skip (URL is not a local upload): ${v.id}`);
      continue;
    }

    let filePath;
    try {
      const u = new URL(v.url);
      filePath = path.join(rootDir, u.pathname.replace(/^\//, ""));
    } catch {
      console.log(`Skip (invalid video URL): ${v.id}`);
      continue;
    }

    if (!fs.existsSync(filePath)) {
      console.warn(`Missing file on disk, skipping: ${filePath}`);
      continue;
    }

    const buf = fs.readFileSync(filePath);
    const ext = path.extname(filePath) || ".mp4";
    const mime =
      ext === ".webm"
        ? "video/webm"
        : ext === ".mov"
          ? "video/quicktime"
          : "video/mp4";
    const videoPath = storage.buildObjectPath(v.userId, path.basename(filePath));
    await storage.uploadObject(storage.VIDEO_BUCKET, videoPath, buf, { contentType: mime });
    const publicUrl = storage.getPublicUrl(storage.VIDEO_BUCKET, videoPath);

    let thumbnailUrl = v.thumbnailUrl;
    let thumbnailStoragePath = null;

    if (v.thumbnailUrl) {
      try {
        const tu = new URL(v.thumbnailUrl);
        if (tu.pathname.includes("/uploads/thumbnails/")) {
          const tf = path.join(rootDir, tu.pathname.replace(/^\//, ""));
          if (fs.existsSync(tf)) {
            const tbuf = fs.readFileSync(tf);
            const te = path.extname(tf).toLowerCase();
            const tMime =
              te === ".png"
                ? "image/png"
                : te === ".webp"
                  ? "image/webp"
                  : "image/jpeg";
            thumbnailStoragePath = storage.buildObjectPath(v.userId, path.basename(tf));
            await storage.uploadObject(storage.THUMB_BUCKET, thumbnailStoragePath, tbuf, {
              contentType: tMime,
            });
            thumbnailUrl = storage.getPublicUrl(storage.THUMB_BUCKET, thumbnailStoragePath);
          }
        }
      } catch {
        /* keep existing thumbnailUrl */
      }
    }

    await prisma.video.update({
      where: { id: v.id },
      data: {
        url: publicUrl,
        thumbnailUrl,
        videoStoragePath: videoPath,
        thumbnailStoragePath,
      },
    });

    console.log(`Migrated video ${v.id} -> ${publicUrl}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
