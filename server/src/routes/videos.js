const express = require("express");
const router = express.Router();
const controller = require("../controllers/videoController");

router.get("/", controller.getAllVideos);
router.get("/:id", controller.getVideoById);
router.post("/", controller.createVideo);
router.delete("/:id", controller.deleteVideo);

router.get("/:id/comments", controller.getVideoComments);

module.exports = router;