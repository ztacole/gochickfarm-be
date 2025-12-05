import { Router } from "express";
import { AnimalController } from "./animal.controller";
import { adminMiddleware, authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken, adminMiddleware);

router.get("/", AnimalController.getAll);
router.get("/:id", AnimalController.getById);
router.post("/", authToken, AnimalController.create);
router.put("/:id", authToken, AnimalController.update);
router.delete("/:id", authToken, AnimalController.delete);

export default router;