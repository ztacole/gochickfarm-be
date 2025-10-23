import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();

router.post("/login", AuthController.loginMobile);
router.get("/me", authToken, AuthController.me);

export default router;