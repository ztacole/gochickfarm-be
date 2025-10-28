import { Router } from "express";
import { UserController } from "./user.controller";
import { adminMiddleware, authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken, adminMiddleware);

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/", authToken, UserController.createUser);
router.put("/:id", authToken, UserController.updateUser);
router.delete("/:id", authToken, UserController.deleteUser);

export default router;