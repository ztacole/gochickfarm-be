import { Request, Response } from "express";
import { asyncHandler } from "../../common/async.handler";
import { DashboardService } from "./dashboard.service";


export class DashboardController {
    static getWebDashboardData = asyncHandler(async (req: Request, res: Response) => {
        const data = await DashboardService.getWebDashboardData();
        res.status(200).json({
            success: true,
            message: "Web dashboard data has been retrieved successfully!",
            data
        });
    });

    static getTransactionDashboardData = asyncHandler(async (req: Request, res: Response) => {
        const data = await DashboardService.getTransactionDashboardData();
        res.status(200).json({
            success: true,
            message: "Transaction dashboard data has been retrieved successfully!",
            data
        });
    });

    static getGraphDashboardData = asyncHandler(async (req: Request, res: Response) => {
        const year = Number(req.query.year ?? new Date().getFullYear());
        const data = await DashboardService.getGraphDashboardData(year);
        res.status(200).json({
            success: true,
            message: "Graph dashboard data has been retrieved successfully!",
            data
        });
    });
}