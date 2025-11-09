import { Router } from "express";
import { BreedingLogController } from "./breeding-log.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken);

router.get("/animals/:id", BreedingLogController.getBreedingLogByAnimalId);

export default router;