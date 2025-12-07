import { Router } from "express";
import { FeedController } from "./feed.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken);

router.get("/no-pagination", FeedController.getAllWithoutPagination);
router.get("/", FeedController.getAll);
router.get("/:id", FeedController.getById);

export default router;