import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    bio: user.bio ?? null,
  };
}

export async function register(req, res) {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ message: "email, password, and username are required" });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, username, password: hashed },
    });
    const token = signToken(user.id);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = signToken(user.id);
    res.json({ token, user: publicUser(user) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Login failed" });
  }
}

async function countsForUser(userId) {
  const [videoCount, followerCount, followingCount] = await Promise.all([
    prisma.video.count({ where: { userId } }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);
  return { videoCount, followerCount, followingCount };
}

export async function getMe(req, res) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ message: "User not found" });
    const counts = await countsForUser(user.id);
    res.json({ ...publicUser(user), ...counts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load profile" });
  }
}

export async function listUsers(req, res) {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    const viewerId = req.user?.id;
    const result = await Promise.all(
      users.map(async (u) => {
        const { videoCount, followerCount, followingCount } = await countsForUser(u.id);
        let isFollowing = false;
        if (viewerId && viewerId !== u.id) {
          const f = await prisma.follow.findUnique({
            where: {
              followerId_followingId: { followerId: viewerId, followingId: u.id },
            },
          });
          isFollowing = Boolean(f);
        }
        return {
          ...publicUser(u),
          videoCount,
          followerCount,
          followingCount,
          isFollowing,
        };
      })
    );
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to list users" });
  }
}

export async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return res.status(404).json({ message: "User not found" });
    const counts = await countsForUser(user.id);
    let isFollowing = false;
    if (req.user?.id && req.user.id !== user.id) {
      const f = await prisma.follow.findUnique({
        where: {
          followerId_followingId: { followerId: req.user.id, followingId: user.id },
        },
      });
      isFollowing = Boolean(f);
    }
    res.json({ ...publicUser(user), ...counts, isFollowing });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Failed to load user" });
  }
}

export async function followUser(req, res) {
  try {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;
    if (followerId === followingId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }
    const target = await prisma.user.findUnique({ where: { id: followingId } });
    if (!target) return res.status(404).json({ message: "User not found" });
    await prisma.follow.upsert({
      where: {
        followerId_followingId: { followerId, followingId },
      },
      create: { followerId, followingId },
      update: {},
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Follow failed" });
  }
}

export async function unfollowUser(req, res) {
  try {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;
    await prisma.follow.deleteMany({
      where: { followerId, followingId },
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || "Unfollow failed" });
  }
}
