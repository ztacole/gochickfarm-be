import { Router } from "express";
import { AuthController } from "./auth.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();

// Web
router.post("/web/login", AuthController.loginWeb);
router.get("/web/me", authToken, AuthController.me);

// Mobile
router.post("/mobile/login", AuthController.loginMobile);
router.get("/mobile/me", authToken, AuthController.me);

export default router;