const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  unlikeComment
} = require('../controllers/commentController');

// Public routes
router.get('/', getAllComments);
router.get('/:id', getCommentById);

// Protected routes
router.post('/', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/likes', protect, likeComment);
router.delete('/:id/likes', protect, unlikeComment);

module.exports = router;
