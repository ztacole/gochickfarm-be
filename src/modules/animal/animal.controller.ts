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

        const { data, meta } = await AnimalService.getAllAnimals(page, limit, search, species);
        res.status(200).json({
            success: true,
            message: "Data hewan berhasil diambil!",
            data,
            meta
        })
    })

    static getAnimalById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if (!id) throw new ValidationError('ID hewan tidak valid!');

        const animal = await AnimalService.getAnimalById(id);
        res.status(200).json({
            success: true,
            message: "Data hewan berhasil diambil!",
            data: animal
        });
    })

    static createAnimal = asyncHandler(async (req: Request, res: Response) => {
        const { tag, species_id, birthdate, sex, weight, status } = req.body as AnimalRequest;
        if (!tag || !species_id || !birthdate || !sex || !weight) throw new ValidationError('Data hewan tidak valid!');

        const animal = await AnimalService.createAnimal({ tag, species_id, birthdate, sex, weight, status });
        res.status(200).json({
            success: true,
            message: "Data hewan berhasil ditambahkan!",
            data: animal
        });
    })

    static updateAnimal = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if (!id) throw new ValidationError('ID hewan tidak valid!');

        const { tag, species_id, birthdate, sex, weight, status } = req.body as AnimalRequest;
        if (!tag && !species_id && !birthdate && !sex && !weight) throw new ValidationError('Data hewan tidak valid!');

        await AnimalService.updateAnimal(id, { tag, species_id, birthdate, sex, weight, status });
        res.status(200).json({
            success: true,
            message: "Data hewan berhasil diubah!"
        });
    })

    static deleteAnimal = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        if (!id) throw new ValidationError('ID hewan tidak valid!');

        await AnimalService.deleteAnimal(id);
        res.status(200).json({
            success: true,
            message: "Data hewan berhasil dihapus!"
        });
    })
}