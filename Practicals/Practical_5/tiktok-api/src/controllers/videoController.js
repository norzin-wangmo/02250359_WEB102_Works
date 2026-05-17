import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "../lib/prisma.js";
import { isSupabaseConfigured } from "../lib/supabase.js";
import * as storage from "../services/storageService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "../..");
const videosDir = path.join(rootDir, "uploads/videos");
const thumbsDir = path.join(rootDir, "uploads/thumbnails");

function publicBase() {
  let base = process.env.PUBLIC_BASE_URL || `http://localhost:${process.env.PORT || 5050}`;
  return base.replace(/\/api\/?$/i, "").replace(/\/$/, "");
}

const userSelect = { id: true, username: true, email: true };

const videoInclude = {
  user: { select: userSelect },
  _count: { select: { likes: true, comments: true } },
};

function parseLimit(raw) {
  const n = parseInt(raw, 10);
  if (Number.isNaN(n) || n < 1) return 10;
  return Math.min(n, 50);
}

async function attachLikedByMe(viewerId, videos) {
  if (!viewerId || !videos.length) {
    return videos.map((v) => ({ ...v, likedByMe: false }));
  }
  const ids = videos.map((v) => v.id);
  const likes = await prisma.like.findMany({
    where: { userId: viewerId, videoId: { in: ids } },
    select: { videoId: true },
  });
  const set = new Set(likes.map((l) => l.videoId));
  return videos.map((v) => ({ ...v, likedByMe: set.has(v.id) }));
}

/**
 * Cursor-based pagination (n+1 pattern): returns videos, nextCursor, hasNextPage.
 */
export async function getAllVideos(req, res) {
  const limit = parseLimit(req.query.limit);
  const cursor = req.query.cursor || undefined;
  const viewerId = req.user?.id;

  try {
    const take = limit + 1;
    const videos = await prisma.video.findMany({
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: videoInclude,
    });

    const hasNextPage = videos.length > limit;
    let items = hasNextPage ? videos.slice(0, limit) : videos;
    items = await attachLikedByMe(viewerId, items);
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    res.json({
      videos: items,
      nextCursor,
      hasNextPage,
      pagination: { nextCursor, hasNextPage },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load videos" });
  }
}

/**
 * Following feed: same cursor contract, filtered to videos from followed users.
 */
export async function getFollowingVideos(req, res) {
  const limit = parseLimit(req.query.limit);
  const cursor = req.query.cursor || undefined;
  const userId = req.user.id;

  try {
    const follows = await prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });
    const followingIds = follows.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return res.json({
        videos: [],
        nextCursor: null,
        hasNextPage: false,
        pagination: { nextCursor: null, hasNextPage: false },
      });
    }

    const take = limit + 1;
    const videos = await prisma.video.findMany({
      where: { userId: { in: followingIds } },
      take,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: "desc" },
      include: videoInclude,
    });

    const hasNextPage = videos.length > limit;
    let items = hasNextPage ? videos.slice(0, limit) : videos;
    items = await attachLikedByMe(userId, items);
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    res.json({
      videos: items,
      nextCursor,
      hasNextPage,
      pagination: { nextCursor, hasNextPage },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load following feed" });
  }
}

export async function getUserVideos(req, res) {
  const { userId } = req.params;
  const viewerId = req.user?.id;
  try {
    let videos = await prisma.video.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: videoInclude,
    });
    videos = await attachLikedByMe(viewerId, videos);
    res.json(videos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load user videos" });
  }
}

export async function getVideoById(req, res) {
  const { videoId } = req.params;
  const viewerId = req.user?.id;
  try {
    const include = {
      user: { select: userSelect },
      _count: { select: { likes: true, comments: true } },
    };
    if (viewerId) {
      include.likes = { where: { userId: viewerId }, take: 1, select: { id: true } };
    }
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      include,
    });
    if (!video) return res.status(404).json({ message: "Video not found" });
    const likedByMe = viewerId ? (video.likes?.length ?? 0) > 0 : false;
    const { likes, ...rest } = video;
    res.json({ ...rest, likedByMe });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load video" });
  }
}

async function persistMultipartUpload(req, res) {
  const videoFile = req.files?.videoFile?.[0];
  if (!videoFile) {
    res.status(400).json({ message: "videoFile is required" });
    return null;
  }
  const { caption, description } = req.body;
  if (!caption || !String(caption).trim()) {
    res.status(400).json({ message: "caption is required" });
    return null;
  }

  let url;
  let thumbnailUrl = null;
  let videoStoragePath = null;
  let thumbnailStoragePath = null;

  if (isSupabaseConfigured()) {
    const userId = req.user.id;
    const videoPath = storage.buildObjectPath(userId, videoFile.originalname || "video.mp4");
    await storage.uploadObject(storage.VIDEO_BUCKET, videoPath, videoFile.buffer, {
      contentType: videoFile.mimetype || "video/mp4",
    });
    url = storage.getPublicUrl(storage.VIDEO_BUCKET, videoPath);
    videoStoragePath = videoPath;

    const thumb = req.files?.thumbnail?.[0];
    if (thumb) {
      const thumbPath = storage.buildObjectPath(userId, thumb.originalname || "thumb.jpg");
      await storage.uploadObject(storage.THUMB_BUCKET, thumbPath, thumb.buffer, {
        contentType: thumb.mimetype || "image/jpeg",
      });
      thumbnailUrl = storage.getPublicUrl(storage.THUMB_BUCKET, thumbPath);
      thumbnailStoragePath = thumbPath;
    }
  } else {
    [videosDir, thumbsDir].forEach((dir) => {
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });
    const ext =
      path.extname(videoFile.originalname || "") ||
      (String(videoFile.mimetype || "").includes("webm") ? ".webm" : ".mp4");
    const vf = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    fs.writeFileSync(path.join(videosDir, vf), videoFile.buffer);
    const base = publicBase();
    url = `${base}/uploads/videos/${vf}`;

    const thumb = req.files?.thumbnail?.[0];
    if (thumb) {
      const te =
        path.extname(thumb.originalname || "") ||
        (String(thumb.mimetype || "").includes("png") ? ".png" : ".jpg");
      const tf = `${Date.now()}-${Math.random().toString(36).slice(2)}${te}`;
      fs.writeFileSync(path.join(thumbsDir, tf), thumb.buffer);
      thumbnailUrl = `${base}/uploads/thumbnails/${tf}`;
    }
  }

  return prisma.video.create({
    data: {
      url,
      caption: String(caption).trim(),
      description: description ? String(description).trim() : null,
      thumbnailUrl,
      videoStoragePath,
      thumbnailStoragePath,
      userId: req.user.id,
    },
    include: videoInclude,
  });
}

async function persistClientSideUpload(req, res) {
  if (!isSupabaseConfigured()) {
    res.status(503).json({ message: "Supabase is not configured" });
    return null;
  }
  const {
    caption,
    description,
    videoUrl,
    thumbnailUrl,
    videoStoragePath,
    thumbnailStoragePath,
  } = req.body;

  if (!caption || !String(caption).trim()) {
    res.status(400).json({ message: "caption is required" });
    return null;
  }
  if (!videoUrl || !String(videoUrl).trim()) {
    res.status(400).json({ message: "videoUrl is required" });
    return null;
  }
  if (!videoStoragePath || !String(videoStoragePath).trim()) {
    res.status(400).json({ message: "videoStoragePath is required for direct uploads" });
    return null;
  }
  if (thumbnailUrl && !thumbnailStoragePath) {
    res.status(400).json({ message: "thumbnailStoragePath is required when thumbnailUrl is set" });
    return null;
  }

  const supabaseHost = process.env.SUPABASE_URL ? new URL(process.env.SUPABASE_URL).hostname : "";
  try {
    const vu = new URL(String(videoUrl));
    if (supabaseHost && vu.hostname !== supabaseHost) {
      res.status(400).json({ message: "videoUrl must be hosted on your Supabase project" });
      return null;
    }
  } catch {
    res.status(400).json({ message: "Invalid videoUrl" });
    return null;
  }

  if (thumbnailUrl) {
    try {
      const tu = new URL(String(thumbnailUrl));
      if (supabaseHost && tu.hostname !== supabaseHost) {
        res.status(400).json({ message: "thumbnailUrl must be hosted on your Supabase project" });
        return null;
      }
    } catch {
      res.status(400).json({ message: "Invalid thumbnailUrl" });
      return null;
    }
  }

  return prisma.video.create({
    data: {
      url: String(videoUrl).trim(),
      caption: String(caption).trim(),
      description: description ? String(description).trim() : null,
      thumbnailUrl: thumbnailUrl ? String(thumbnailUrl).trim() : null,
      videoStoragePath: String(videoStoragePath).trim(),
      thumbnailStoragePath: thumbnailStoragePath ? String(thumbnailStoragePath).trim() : null,
      userId: req.user.id,
    },
    include: videoInclude,
  });
}

export async function createVideo(req, res) {
  try {
    const hasFile = Boolean(req.files?.videoFile?.[0]);
    const hasDirectMeta = Boolean(req.body?.videoUrl) && !hasFile;

    let video;
    if (hasDirectMeta) {
      video = await persistClientSideUpload(req, res);
    } else {
      video = await persistMultipartUpload(req, res);
    }
    if (!video) return;

    const [withLiked] = await attachLikedByMe(req.user.id, [video]);
    res.status(201).json(withLiked);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Upload failed" });
  }
}

export async function deleteVideo(req, res) {
  try {
    const { videoId } = req.params;
    const existing = await prisma.video.findUnique({ where: { id: videoId } });
    if (!existing) return res.status(404).json({ message: "Video not found" });
    if (existing.userId !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (isSupabaseConfigured() && (existing.videoStoragePath || existing.thumbnailStoragePath)) {
      try {
        if (existing.videoStoragePath) {
          await storage.removeObjects(storage.VIDEO_BUCKET, [existing.videoStoragePath]);
        }
        if (existing.thumbnailStoragePath) {
          await storage.removeObjects(storage.THUMB_BUCKET, [existing.thumbnailStoragePath]);
        }
      } catch (err) {
        console.error("Supabase delete:", err);
      }
    } else {
      try {
        const vUrl = existing.url ? new URL(existing.url) : null;
        if (vUrl?.pathname?.startsWith("/uploads/videos/")) {
          const fp = path.join(rootDir, vUrl.pathname.replace(/^\//, ""));
          if (fs.existsSync(fp)) fs.unlinkSync(fp);
        }
        if (existing.thumbnailUrl) {
          const tUrl = new URL(existing.thumbnailUrl);
          if (tUrl.pathname.startsWith("/uploads/thumbnails/")) {
            const fp = path.join(rootDir, tUrl.pathname.replace(/^\//, ""));
            if (fs.existsSync(fp)) fs.unlinkSync(fp);
          }
        }
      } catch (err) {
        console.error("Local file delete:", err);
      }
    }

    await prisma.video.delete({ where: { id: videoId } });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Delete failed" });
  }
}

export async function likeVideo(req, res) {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) return res.status(404).json({ message: "Video not found" });
    await prisma.like.upsert({
      where: { userId_videoId: { userId, videoId } },
      create: { userId, videoId },
      update: {},
    });
    const likeCount = await prisma.like.count({ where: { videoId } });
    res.json({ liked: true, likeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Like failed" });
  }
}

export async function unlikeVideo(req, res) {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    await prisma.like.deleteMany({ where: { userId, videoId } });
    const likeCount = await prisma.like.count({ where: { videoId } });
    res.json({ liked: false, likeCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Unlike failed" });
  }
}

export async function getVideoComments(req, res) {
  try {
    const { videoId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { videoId },
      orderBy: { createdAt: "asc" },
      include: { user: { select: userSelect } },
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load comments" });
  }
}

export async function addVideoComment(req, res) {
  try {
    const { videoId } = req.params;
    const userId = req.user.id;
    const { content } = req.body;
    if (!content || !String(content).trim()) {
      return res.status(400).json({ message: "content is required" });
    }
    const video = await prisma.video.findUnique({ where: { id: videoId } });
    if (!video) return res.status(404).json({ message: "Video not found" });
    const comment = await prisma.comment.create({
      data: {
        content: String(content).trim(),
        userId,
        videoId,
      },
      include: { user: { select: userSelect } },
    });
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Comment failed" });
  }
}
