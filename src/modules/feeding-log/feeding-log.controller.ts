import { Request, Response } from "express";
import { FeedingLogService } from "./feeding-log.service";
import { asyncHandler } from "../../common/async.handler";
import { FeedingLogCreateRequest } from "./feeding-log.type";
import { JwtPayload } from "../auth/auth.type";

export class FeedingLogController {
    static getFeedingLogByAnimalId = asyncHandler(async (req: Request, res: Response) => {
        const animalId = Number(req.params.id);
        const { data, meta } = await FeedingLogService.getFeedingLogsByAnimalId(animalId);
        res.status(200).json({
            success: true,
            message: "Feeding log data has been retrieved successfully!",
            data,
            meta
        });
    })

    static createFeedingLog = asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as FeedingLogCreateRequest;
        const user = req.user as JwtPayload;
        const result = await FeedingLogService.createFeedingLog(data, user);
        res.status(201).json({
            success: true,
            message: "Feeding log data has been saved successfully!",
            data: result
        });
    });
}