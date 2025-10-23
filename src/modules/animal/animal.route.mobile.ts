import { Router } from "express";
import { AnimalController } from "./animal.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();

router.get("/", AnimalController.getAllAnimals);

export default router;