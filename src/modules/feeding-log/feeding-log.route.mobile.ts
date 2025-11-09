import { Router } from "express";
import { FeedingLogController } from "./feeding-log.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken);

router.get("/animals/:id", FeedingLogController.getFeedingLogByAnimalId);
router.post("/", FeedingLogController.createFeedingLog);

export default router;