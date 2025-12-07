import { Request, Response } from "express";
import { asyncHandler } from "../../common/async.handler";
import { TransactionService } from "./transaction.service";
import { JwtPayload } from "jsonwebtoken";
import { TransactionRequest } from "./transaction.type";

export class TransactionController {
    static getAll = asyncHandler(async (req: Request, res: Response) => {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);
        const type = req.query.type as 'Pemasukan' | 'Pengeluaran' | undefined;
        const { data, meta } = await TransactionService.getAll(page, limit, type);
        res.status(200).json({
            success: true,
            message: "Transaction data has been retrieved successfully!",
            data: data,
            meta: meta
        });
    });

    static create = asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as JwtPayload;
        const transactionData = req.body as TransactionRequest;
        const result = await TransactionService.create(transactionData, user);
        res.status(201).json({
            success: true,
            message: "Transaction has been created successfully!",
            data: result
        });
    });
}