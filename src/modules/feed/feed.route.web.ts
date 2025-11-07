import { Router } from "express";
import { FeedController } from "./feed.controller";
import { adminMiddleware, authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken, adminMiddleware);

router.get("/", FeedController.getAllFeeds);
router.get("/:id", FeedController.getFeedById);
router.post("/", FeedController.createFeed);
router.put("/:id", FeedController.updateFeed);
router.delete("/:id", FeedController.deleteFeed);

export default router;