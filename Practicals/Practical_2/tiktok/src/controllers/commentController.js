const dataStore = require('../models');

const getAllComments = (req, res) => {
  res.json(dataStore.comments);
};

const getCommentById = (req, res) => {
  const comment = dataStore.comments.find(c => c.id == req.params.id);
  res.json(comment);
};

const createComment = (req, res) => {
  const newComment = {
    id: dataStore.nextIds.comments++,
    ...req.body,
    likes: [],
    createdAt: new Date().toISOString()
  };

  dataStore.comments.push(newComment);
  res.status(201).json(newComment);
};

const deleteComment = (req, res) => {
  dataStore.comments = dataStore.comments.filter(c => c.id != req.params.id);
  res.json({ message: 'Deleted' });
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  deleteComment
};