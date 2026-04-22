const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// GET all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        createdAt: true
      }
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        bio: true,
        avatar: true,
        createdAt: true
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// REGISTER user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const existingUsername = await prisma.user.findUnique({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({ error: 'Username already taken' });
    }

    const existingEmail = await prisma.user.findUnique({ where: { email } });
    if (existingEmail) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        name: name || username
      }
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGIN user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      token: generateToken(user.id)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE user
exports.updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { name, email, bio, avatar } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) return res.status(404).json({ error: 'User not found' });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { name, email, bio, avatar }
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE user
exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser) return res.status(404).json({ error: 'User not found' });

    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET user videos
exports.getUserVideos = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const videos = await prisma.video.findMany({
      where: { userId },
      include: {
        user: {
          select: { id: true, username: true, name: true }
        },
        _count: {
          select: { likes: true, comments: true }
        }
      }
    });

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET followers
exports.getUserFollowers = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const followers = await prisma.follow.findMany({
      where: { followingId: userId },
      include: {
        follower: {
          select: { id: true, username: true, name: true }
        }
      }
    });

    res.status(200).json(followers.map(item => item.follower));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET following
exports.getUserFollowing = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const following = await prisma.follow.findMany({
      where: { followerId: userId },
      include: {
        following: {
          select: { id: true, username: true, name: true }
        }
      }
    });

    res.status(200).json(following.map(item => item.following));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FOLLOW user
exports.followUser = async (req, res) => {
  try {
    const followingId = parseInt(req.params.id);
    const followerId = req.user.id;

    if (followerId === followingId) {
      return res.status(400).json({ error: 'Users cannot follow themselves' });
    }

    const existing = await prisma.follow.findFirst({
      where: { followerId, followingId }
    });

    if (existing) {
      return res.status(409).json({ error: 'Already following this user' });
    }

    await prisma.follow.create({
      data: { followerId, followingId }
    });

    res.status(201).json({ message: 'User followed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UNFOLLOW user
exports.unfollowUser = async (req, res) => {
  try {
    const followingId = parseInt(req.params.id);
    const followerId = req.user.id;

    const relation = await prisma.follow.findFirst({
      where: { followerId, followingId }
    });

    if (!relation) {
      return res.status(404).json({ error: 'Follow relationship not found' });
    }

    await prisma.follow.delete({
      where: { id: relation.id }
    });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};