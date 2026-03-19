const dataStore = require("../models");

// Get all videos
exports.getAllVideos = (req, res) => {
  res.json(dataStore.videos);
};

// Get video by ID
exports.getVideoById = (req, res) => {
  const video = dataStore.videos.find(v => v.id == req.params.id);
  if (!video) return res.status(404).json({ message: "Video not found" });
  res.json(video);
};

// Create video
exports.createVideo = (req, res) => {
  const newVideo = {
    id: dataStore.nextIds.videos++,
    ...req.body,
    likes: [],
    createdAt: new Date().toISOString()
  };

  dataStore.videos.push(newVideo);
  res.status(201).json(newVideo);
};

// Delete video
exports.deleteVideo = (req, res) => {
  const index = dataStore.videos.findIndex(v => v.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Video not found" });

  dataStore.videos.splice(index, 1);
  res.json({ message: "Video deleted" });
};

// Get video comments
exports.getVideoComments = (req, res) => {
  const videoComments = dataStore.comments.filter(
    c => c.videoId == req.params.id
  );
  res.json(videoComments);
};