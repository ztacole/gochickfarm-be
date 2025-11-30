import { Router } from "express";
import { FeedController } from "./feed.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken);

router.get("/", FeedController.getAllFeeds);
router.get("/:id", FeedController.getFeedById);

export default router;