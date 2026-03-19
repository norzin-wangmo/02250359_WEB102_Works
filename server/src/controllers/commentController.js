const dataStore = require("../models");

// Get all comments
exports.getAllComments = (req, res) => {
  res.json(dataStore.comments);
};

// Get comment by ID
exports.getCommentById = (req, res) => {
  const comment = dataStore.comments.find(c => c.id == req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  res.json(comment);
};

// Create comment
exports.createComment = (req, res) => {
  const newComment = {
    id: dataStore.nextIds.comments++,
    ...req.body,
    likes: [],
    createdAt: new Date().toISOString()
  };

  dataStore.comments.push(newComment);
  res.status(201).json(newComment);
};

// Delete comment
exports.deleteComment = (req, res) => {
  const index = dataStore.comments.findIndex(c => c.id == req.params.id);
  if (index === -1)
    return res.status(404).json({ message: "Comment not found" });

  dataStore.comments.splice(index, 1);
  res.json({ message: "Comment deleted" });
};