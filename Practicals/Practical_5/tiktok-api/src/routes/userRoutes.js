import { Router } from "express";
import { optionalAuth, requireAuth } from "../middleware/authMiddleware.js";
import {
  register,
  login,
  getMe,
  listUsers,
  getUserById,
  followUser,
  unfollowUser,
} from "../controllers/userController.js";

const router = Router();

router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.get("/", optionalAuth, listUsers);
router.get("/:userId", optionalAuth, getUserById);
router.post("/:userId/follow", requireAuth, followUser);
router.delete("/:userId/follow", requireAuth, unfollowUser);
router.post("/", register);

export default router;
