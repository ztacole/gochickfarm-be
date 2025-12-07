import { Request, Response } from "express";
import { AnimalService } from "./animal.service";
import { asyncHandler } from "../../common/async.handler";
import { AnimalRequest } from "./animal.type";
import { ValidationError } from "../../common/error";

export class AnimalController {
    static getAll = asyncHandler(async (req: Request, res: Response) => {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);
        const search = String(req.query.search || '');
        const species = String(req.query.species || '');
        const status = String(req.query.status || '') as 'Hidup' | 'Mati' | 'Terjual' || 'Hidup';
        if (status.toLowerCase() !== 'hidup' && status.toLowerCase() !== 'mati' && status.toLowerCase() !== 'terjual') throw new ValidationError("Invalid status! Only 'Hidup', 'Mati', or 'Terjual' are allowed.");

        const { data, meta } = await AnimalService.getAll(page, limit, search, species, status);
        res.status(200).json({
            success: true,
            message: "Animal data has been retrieved successfully!",
            data,
            meta
        })
    })

    static getById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const animal = await AnimalService.getById(id);
        res.status(200).json({
            success: true,
            message: "Animal data has been retrieved successfully!",
            data: animal
        });
    })

    static create = asyncHandler(async (req: Request, res: Response) => {
        const { species, birthdate, sex, weight } = req.body as AnimalRequest;
        if (!species || !birthdate || !sex || !weight) throw new ValidationError('Invalid animal data!');

        const animal = await AnimalService.create({ species, birthdate, sex, weight });
        res.status(200).json({
            success: true,
            message: "Animal data has been created successfully!",
            data: animal
        });
    })

    static update = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const { species, birthdate, sex, weight, status } = req.body as AnimalRequest;

        await AnimalService.update(id, { species, birthdate, sex, weight, status });
        res.status(200).json({
            success: true,
            message: "Animal data has been updated successfully!"
        });
    })

    static delete = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        await AnimalService.delete(id);
        res.status(200).json({
            success: true,
            message: "Animal data has been deleted successfully!"
        });
    })

    static getAllWithoutPagination = asyncHandler(async (req: Request, res: Response) => {
        const species = req.query.species as string | undefined;
        const sex = req.query.sex as "Jantan" | "Betina";
        const animals = await AnimalService.getAllWithoutPagination(species, sex);
        res.status(200).json({
            success: true,
            message: "Animal data has been retrieved successfully!",
            data: animals
        });
    });
}