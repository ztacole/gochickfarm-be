import { Router } from "express";
import { AnimalController } from "./animal.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken);

router.get("/", AnimalController.getAllAnimals);
router.get("/:id", AnimalController.getAnimalById);

export default router;