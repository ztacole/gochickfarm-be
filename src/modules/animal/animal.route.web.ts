import { Router } from "express";
import { AnimalController } from "./animal.controller";
import { adminMiddleware, authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken, adminMiddleware);

router.get("/", AnimalController.getAllAnimals);
router.get("/:id", AnimalController.getAnimalById);
router.post("/", authToken, AnimalController.createAnimal);
router.put("/:id", authToken, AnimalController.updateAnimal);
router.delete("/:id", authToken, AnimalController.deleteAnimal);

export default router;