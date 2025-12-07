import { Router } from "express";
import { FeedingLogController } from "./feeding-log.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken);

router.post("/", FeedingLogController.createFeedingLog);
router.get("/animals/:id", FeedingLogController.getFeedingLogByAnimalId);

export default router;