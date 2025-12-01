import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken);

router.get("/", TransactionController.getAllTransactions);

export default router;