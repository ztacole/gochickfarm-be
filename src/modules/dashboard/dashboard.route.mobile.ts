import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken);

router.get('/summary', DashboardController.getMobileDashboardData);

export default router;