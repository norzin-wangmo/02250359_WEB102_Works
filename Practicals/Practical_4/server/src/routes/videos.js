const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { protect } = require('../middleware/auth');

router.get('/', videoController.getAllVideos);
router.get('/:id', videoController.getVideoById);
router.post('/', protect, videoController.createVideo);
router.put('/:id', protect, videoController.updateVideo);
router.delete('/:id', protect, videoController.deleteVideo);
router.get('/:id/comments', videoController.getVideoComments);
router.get('/:id/likes', videoController.getVideoLikes);
router.post('/:id/likes', protect, videoController.likeVideo);
router.delete('/:id/likes', protect, videoController.unlikeVideo);

module.exports = router;