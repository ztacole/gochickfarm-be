import { Request, Response } from "express";
import { asyncHandler } from "../../common/async.handler";
import { TransactionService } from "./transaction.service";

export class TransactionController {
    static getAllTransactions = asyncHandler(async (req: Request, res: Response) => {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);
        const type = req.query.type as 'Pemasukan' | 'Pengeluaran' | undefined;
        const { data, meta } = await TransactionService.getTransactions(page, limit, type);
        res.status(200).json({
            success: true,
            message: "Transaction data has been retrieved successfully!",
            data: data,
            meta: meta
        });
    });
}