import { Router } from "express";
import { BreedingLogController } from "./breeding-log.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken);

router.post("/", BreedingLogController.create);
router.get("/animals/:id", BreedingLogController.getByAnimalId);

export default router;