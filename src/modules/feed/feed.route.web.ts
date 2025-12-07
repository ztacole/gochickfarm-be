import { Router } from "express";
import { FeedController } from "./feed.controller";
import { adminMiddleware, authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken, adminMiddleware);

router.get("/", FeedController.getAll);
router.get("/:id", FeedController.getById);
router.post("/", FeedController.create);
router.put("/:id", FeedController.update);
router.delete("/:id", FeedController.delete);

export default router;