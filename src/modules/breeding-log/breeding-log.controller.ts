import { Request, Response } from "express"
import { BreedingLogService } from "./breeding-log.service"
import { asyncHandler } from "../../common/async.handler"

export class BreedingLogController {
    static getBreedingLogByAnimalId = asyncHandler(async (req: Request, res: Response) => {
        const animalId = Number(req.params.id);
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);
        const { data, meta } = await BreedingLogService.getBreedingLogsByAnimalId(animalId, page, limit);
        res.status(200).json({
            success: true,
            message: "Breeding log data has been retrieved successfully!",
            data,
            meta
        });
    })
}