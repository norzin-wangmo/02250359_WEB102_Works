const prisma = require('../lib/prisma');

// GET all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      include: {
        user: {
          select: { id: true, username: true, name: true }
        },
        comments: true,
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

// GET video by ID
exports.getVideoById = async (req, res) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: {
          select: { id: true, username: true, name: true }
        },
        comments: {
          include: {
            user: {
              select: { id: true, username: true, name: true }
            }
          }
        },
        _count: {
          select: { likes: true, comments: true }
        }
      }
    });

    if (!video) return res.status(404).json({ error: 'Video not found' });

    res.status(200).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CREATE video
exports.createVideo = async (req, res) => {
  try {
    const { title, description, url, thumbnail } = req.body;

    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' });
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        url,
        thumbnail,
        userId: req.user.id
      }
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE video
exports.updateVideo = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    const { title, description, url, thumbnail } = req.body;

    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!existingVideo) return res.status(404).json({ error: 'Video not found' });

    const updatedVideo = await prisma.video.update({
      where: { id: videoId },
      data: { title, description, url, thumbnail }
    });

    res.status(200).json(updatedVideo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE video
exports.deleteVideo = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);

    const existingVideo = await prisma.video.findUnique({
      where: { id: videoId }
    });

    if (!existingVideo) return res.status(404).json({ error: 'Video not found' });

    await prisma.video.delete({
      where: { id: videoId }
    });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET video comments
exports.getVideoComments = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);

    const comments = await prisma.comment.findMany({
      where: { videoId },
      include: {
        user: {
          select: { id: true, username: true, name: true }
        },
        _count: {
          select: { likes: true }
        }
      }
    });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET video likes
exports.getVideoLikes = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);

    const likes = await prisma.videoLike.findMany({
      where: { videoId },
      include: {
        user: {
          select: { id: true, username: true, name: true }
        }
      }
    });

    res.status(200).json(likes.map(item => item.user));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LIKE video
exports.likeVideo = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    const userId = req.user.id;

    const existing = await prisma.videoLike.findFirst({
      where: { userId, videoId }
    });

    if (existing) {
      return res.status(409).json({ error: 'User already liked this video' });
    }

    await prisma.videoLike.create({
      data: { userId, videoId }
    });

    res.status(201).json({ message: 'Video liked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UNLIKE video
exports.unlikeVideo = async (req, res) => {
  try {
    const videoId = parseInt(req.params.id);
    const userId = req.user.id;

    const existing = await prisma.videoLike.findFirst({
      where: { userId, videoId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Like not found' });
    }

    await prisma.videoLike.delete({
      where: { id: existing.id }
    });

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};