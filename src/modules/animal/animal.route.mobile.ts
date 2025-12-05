import { Router } from "express";
import { AnimalController } from "./animal.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken);

router.get("/", AnimalController.getAll);
router.get("/:id", AnimalController.getById);
router.patch("/:id/status", AnimalController.update);

export default router;