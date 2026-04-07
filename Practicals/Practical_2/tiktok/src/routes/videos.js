const express = require('express');
const router = express.Router();
const controller = require('../controllers/videoController');

router.get('/', controller.getAllVideos);
router.get('/:id', controller.getVideoById);
router.post('/', controller.createVideo);
router.put('/:id', controller.updateVideo);
router.delete('/:id', controller.deleteVideo);

router.get('/:id/comments', controller.getVideoComments);
router.post('/:id/likes', controller.likeVideo);
router.delete('/:id/likes', controller.unlikeVideo);

module.exports = router;