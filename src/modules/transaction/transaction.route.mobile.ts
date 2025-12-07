import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { authToken } from "../../middleware/auth.middleware";

const router = Router();
router.use(authToken);

router.get("/", TransactionController.getAll);
router.post("/", TransactionController.create);
router.get("/:id", TransactionController.getById);

export default router;