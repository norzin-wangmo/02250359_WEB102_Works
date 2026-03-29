const express = require('express');
const router = express.Router();

const {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideoComments,
  likeVideo,
  unlikeVideo
} = require('../controllers/videoController');

router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.post('/', createVideo);
router.put('/:id', updateVideo);
router.delete('/:id', deleteVideo);

router.get('/:id/comments', getVideoComments);
router.post('/:id/likes', likeVideo);
router.delete('/:id/likes', unlikeVideo);

module.exports = router;