const express = require("express");
const router = express.Router();
const controller = require("../controllers/commentController");

router.get("/", controller.getAllComments);
router.get("/:id", controller.getCommentById);
router.post("/", controller.createComment);
router.delete("/:id", controller.deleteComment);

module.exports = router;