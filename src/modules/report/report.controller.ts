import { Request, Response } from "express";
import { asyncHandler } from "../../common/async.handler";
import { ReportService } from "./report.service";
import { ValidationError } from "../../common/error";

export class ReportController {
    static getReportTransaction = asyncHandler(async (req: Request, res: Response) => {
        const type = req.query.type as "Pemasukan" | "Pengeluaran";
        if (type && type !== "Pemasukan" && type !== "Pengeluaran") throw new ValidationError("Invalid type! Only 'Pemasukan' or 'Pengeluaran' are allowed.");

        const transactions = await ReportService.getReportTransaction(type);
        res.status(200).json({
            success: true,
            message: "Report data has been retrieved successfully!",
            data: transactions
        });
    })

    static getAnimalHarvestReport = asyncHandler(async (req: Request, res: Response) => {
        const search = req.query.search as string;
        const animals = await ReportService.getAnimalHarvestReport(search);
        res.status(200).json({
            success: true,
            message: "Animal harvest report data has been retrieved successfully!",
            data: animals
        });
    })

    static getAnimalSickReport = asyncHandler(async (req: Request, res: Response) => {
        const search = req.query.search as string;
        const animals = await ReportService.getAnimalSickReport(search);
        res.status(200).json({
            success: true,
            message: "Animal sick report data has been retrieved successfully!",
            data: animals
        });
    })
}