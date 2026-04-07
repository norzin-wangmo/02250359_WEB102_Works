const dataStore = require('../models');

const getAllVideos = (req, res) => {
  res.json(dataStore.videos);
};

const getVideoById = (req, res) => {
  const video = dataStore.videos.find(v => v.id == req.params.id);
  if (!video) return res.status(404).json({ error: 'Not found' });
  res.json(video);
};

const createVideo = (req, res) => {
  const { title, url, userId } = req.body;

  const newVideo = {
    id: dataStore.nextIds.videos++,
    title,
    url,
    userId,
    description: '',
    likes: [],
    createdAt: new Date().toISOString()
  };

  dataStore.videos.push(newVideo);
  res.status(201).json(newVideo);
};

const updateVideo = (req, res) => {
  const video = dataStore.videos.find(v => v.id == req.params.id);
  if (!video) return res.status(404).json({ error: 'Not found' });

  Object.assign(video, req.body);
  res.json(video);
};

const deleteVideo = (req, res) => {
  dataStore.videos = dataStore.videos.filter(v => v.id != req.params.id);
  res.json({ message: 'Deleted' });
};

const getVideoComments = (req, res) => {
  const comments = dataStore.comments.filter(c => c.videoId == req.params.id);
  res.json(comments);
};

const likeVideo = (req, res) => {
  const video = dataStore.videos.find(v => v.id == req.params.id);
  video.likes.push(req.body.userId);
  res.json(video);
};

const unlikeVideo = (req, res) => {
  const video = dataStore.videos.find(v => v.id == req.params.id);
  video.likes = video.likes.filter(id => id != req.body.userId);
  res.json(video);
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