const express = require("express");
const router = express.Router();
const controller = require("../controllers/userController");

router.get("/", controller.getAllUsers);
router.get("/:id", controller.getUserById);
router.post("/", controller.createUser);
router.delete("/:id", controller.deleteUser);

router.get("/:id/videos", controller.getUserVideos);

module.exports = router;