import { Request, Response } from "express";
import { asyncHandler } from "../../common/async.handler";
import { ReportService } from "./report.service";

export class ReportController {
    static getReportTransaction = asyncHandler(async (req: Request, res: Response) => {
        const transactions = await ReportService.getReportTransaction(req.query.type as "Pemasukan" | "Pengeluaran");
        res.status(200).json({
            success: true,
            message: "Report data has been retrieved successfully!",
            data: transactions
        });
    })

    static getAnimalHarvestReport = asyncHandler(async (req: Request, res: Response) => {
        const animals = await ReportService.getAnimalHarvestReport(req.query.search as string);
        res.status(200).json({
            success: true,
            message: "Animal harvest report data has been retrieved successfully!",
            data: animals
        });
    })

    static getAnimalSickReport = asyncHandler(async (req: Request, res: Response) => {
        const animals = await ReportService.getAnimalSickReport(req.query.search as string);
        res.status(200).json({
            success: true,
            message: "Animal sick report data has been retrieved successfully!",
            data: animals
        });
    })
}