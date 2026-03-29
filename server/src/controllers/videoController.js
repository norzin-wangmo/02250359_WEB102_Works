const dataStore = require('../models');

// Get all videos
const getAllVideos = (req, res) => {
  res.status(200).json(dataStore.videos);
};

// Get one video by ID
const getVideoById = (req, res) => {
  const id = parseInt(req.params.id);
  const video = dataStore.videos.find(v => v.id === id);

  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  res.status(200).json(video);
};

// Create video
const createVideo = (req, res) => {
  const { title, description, url, userId } = req.body;

  if (!title || !url || !userId) {
    return res.status(400).json({
      error: 'title, url, and userId are required'
    });
  }

  const user = dataStore.users.find(u => u.id === parseInt(userId));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const newVideo = {
    id: dataStore.nextIds.videos++,
    title,
    description: description || '',
    url,
    userId: parseInt(userId),
    likes: [],
    createdAt: new Date().toISOString()
  };

  dataStore.videos.push(newVideo);
  res.status(201).json(newVideo);
};

// Update video
const updateVideo = (req, res) => {
  const id = parseInt(req.params.id);
  const video = dataStore.videos.find(v => v.id === id);

  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const { title, description, url } = req.body;

  if (title !== undefined) video.title = title;
  if (description !== undefined) video.description = description;
  if (url !== undefined) video.url = url;

  res.status(200).json(video);
};

// Delete video
const deleteVideo = (req, res) => {
  const id = parseInt(req.params.id);
  const index = dataStore.videos.findIndex(v => v.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Video not found' });
  }

  dataStore.videos.splice(index, 1);

  // also delete comments of that video
  dataStore.comments = dataStore.comments.filter(c => c.videoId !== id);

  res.status(200).json({ message: 'Video deleted successfully' });
};

// Get comments for a video
const getVideoComments = (req, res) => {
  const id = parseInt(req.params.id);
  const video = dataStore.videos.find(v => v.id === id);

  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const comments = dataStore.comments.filter(c => c.videoId === id);
  res.status(200).json(comments);
};

// Like a video
const likeVideo = (req, res) => {
  const id = parseInt(req.params.id);
  const { userId } = req.body;

  const video = dataStore.videos.find(v => v.id === id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const user = dataStore.users.find(u => u.id === parseInt(userId));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!video.likes.includes(parseInt(userId))) {
    video.likes.push(parseInt(userId));
  }

  res.status(200).json({
    message: 'Video liked successfully',
    likes: video.likes
  });
};

// Unlike a video
const unlikeVideo = (req, res) => {
  const id = parseInt(req.params.id);
  const { userId } = req.body;

  const video = dataStore.videos.find(v => v.id === id);
  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  video.likes = video.likes.filter(uid => uid !== parseInt(userId));

  res.status(200).json({
    message: 'Video unliked successfully',
    likes: video.likes
  });
};

module.exports = {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideoComments,
  likeVideo,
  unlikeVideo
};