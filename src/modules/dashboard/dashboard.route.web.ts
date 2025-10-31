import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { adminMiddleware, authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken, adminMiddleware);

router.get("/", DashboardController.getWebDashboardData);
router.get("/transactions", DashboardController.getTransactionDashboardData);
router.get("/graph", DashboardController.getGraphDashboardData);

export default router;