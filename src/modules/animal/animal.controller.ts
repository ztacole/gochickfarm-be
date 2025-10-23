import { Request, Response } from "express";
import { AnimalService } from "./animal.service";
import { asyncHandler } from "../../common/async.handler";

export class AnimalController {
    static getAllAnimals = asyncHandler(async (req: Request, res: Response) => {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);
        const search = String(req.query.search || '');
        const species = String(req.query.species || '');
        const { data, meta } = await AnimalService.getAllAnimals(page, limit, search, species);
        res.status(200).json({
            success: true,
            message: "Data hewan berhasil diambil!",
            data,
            meta
        })
    })
}