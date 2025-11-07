import { Router } from "express";
import { ReportController } from "./report.controller";
import { adminMiddleware, authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken, adminMiddleware);

router.get("/transactions", ReportController.getReportTransaction);
router.get("/animal-harvest", ReportController.getAnimalHarvestReport);
router.get("/sick-animals", ReportController.getAnimalSickReport);

export default router;