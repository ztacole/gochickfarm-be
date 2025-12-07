import { Request, Response } from "express"
import { BreedingLogService } from "./breeding-log.service"
import { asyncHandler } from "../../common/async.handler"
import { JwtPayload } from "../auth/auth.type";
import { BreedingLogRequest } from "./breeding-log.type";

export class BreedingLogController {
    static getByAnimalId = asyncHandler(async (req: Request, res: Response) => {
        const animalId = Number(req.params.id);
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);
        const { data, meta } = await BreedingLogService.getByAnimalId(animalId, page, limit);
        res.status(200).json({
            success: true,
            message: "Breeding log data has been retrieved successfully!",
            data,
            meta
        });
    })

    static create = asyncHandler(async (req: Request, res: Response) => {
        const data = req.body as BreedingLogRequest;
        const user = req.user as JwtPayload;
        const result = await BreedingLogService.create(data, user);
        res.status(201).json({
            success: true,
            message: "Breeding log data has been saved successfully!",
            data: result
        });
    });
}