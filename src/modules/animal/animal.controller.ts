import { Request, Response } from "express";
import { AnimalService } from "./animal.service";
import { asyncHandler } from "../../common/async.handler";
import { AnimalRequest } from "./animal.type";
import { ValidationError } from "../../common/error";

export class AnimalController {
    static getAllAnimals = asyncHandler(async (req: Request, res: Response) => {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);
        const search = String(req.query.search || '');
        const species = String(req.query.species || '');
        const status = String(req.query.status || '') as 'Hidup' | 'Mati' | 'Terjual';
        if (status.toLowerCase() !== 'hidup' && status.toLowerCase() !== 'mati' && status.toLowerCase() !== 'terjual') throw new ValidationError("Invalid status! Only 'Hidup', 'Mati', or 'Terjual' are allowed.");

        const { data, meta } = await AnimalService.getAllAnimals(page, limit, search, species, status);
        res.status(200).json({
            success: true,
            message: "Animal data has been retrieved successfully!",
            data,
            meta
        })
    })

    static getAnimalById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const animal = await AnimalService.getAnimalById(id);
        res.status(200).json({
            success: true,
            message: "Animal data has been retrieved successfully!",
            data: animal
        });
    })

    static createAnimal = asyncHandler(async (req: Request, res: Response) => {
        const { species, birthdate, sex, weight } = req.body as AnimalRequest;
        if (!species || !birthdate || !sex || !weight) throw new ValidationError('Invalid animal data!');

        const animal = await AnimalService.createAnimal({ species, birthdate, sex, weight });
        res.status(200).json({
            success: true,
            message: "Animal data has been created successfully!",
            data: animal
        });
    })

    static updateAnimal = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        const { species, birthdate, sex, weight } = req.body as AnimalRequest;
        if (!species && !birthdate && !sex && !weight) throw new ValidationError('Invalid animal data!');

        await AnimalService.updateAnimal(id, { species, birthdate, sex, weight });
        res.status(200).json({
            success: true,
            message: "Animal data has been updated successfully!"
        });
    })

    static deleteAnimal = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);

        await AnimalService.deleteAnimal(id);
        res.status(200).json({
            success: true,
            message: "Animal data has been deleted successfully!"
        });
    })
}