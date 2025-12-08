"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalController = void 0;
const animal_service_1 = require("./animal.service");
const async_handler_1 = require("../../common/async.handler");
const error_1 = require("../../common/error");
class AnimalController {
}
exports.AnimalController = AnimalController;
_a = AnimalController;
AnimalController.getAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const search = String(req.query.search || '');
    const species = String(req.query.species || '');
    const status = String(req.query.status || '') || 'Hidup';
    if (status.toLowerCase() !== 'hidup' && status.toLowerCase() !== 'mati' && status.toLowerCase() !== 'terjual')
        throw new error_1.ValidationError("Invalid status! Only 'Hidup', 'Mati', or 'Terjual' are allowed.");
    const { data, meta } = await animal_service_1.AnimalService.getAll(page, limit, search, species, status);
    res.status(200).json({
        success: true,
        message: "Animal data has been retrieved successfully!",
        data,
        meta
    });
});
AnimalController.getById = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const id = Number(req.params.id);
    const animal = await animal_service_1.AnimalService.getById(id);
    res.status(200).json({
        success: true,
        message: "Animal data has been retrieved successfully!",
        data: animal
    });
});
AnimalController.create = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { species, birthdate, sex, weight } = req.body;
    if (!species || !birthdate || !sex || !weight)
        throw new error_1.ValidationError('Invalid animal data!');
    const animal = await animal_service_1.AnimalService.create({ species, birthdate, sex, weight });
    res.status(200).json({
        success: true,
        message: "Animal data has been created successfully!",
        data: animal
    });
});
AnimalController.update = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const id = Number(req.params.id);
    const { species, birthdate, sex, weight, status } = req.body;
    await animal_service_1.AnimalService.update(id, { species, birthdate, sex, weight, status });
    res.status(200).json({
        success: true,
        message: "Animal data has been updated successfully!"
    });
});
AnimalController.delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const id = Number(req.params.id);
    await animal_service_1.AnimalService.delete(id);
    res.status(200).json({
        success: true,
        message: "Animal data has been deleted successfully!"
    });
});
AnimalController.getAllWithoutPagination = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const species = req.query.species;
    const sex = req.query.sex;
    const animals = await animal_service_1.AnimalService.getAllWithoutPagination(species, sex);
    res.status(200).json({
        success: true,
        message: "Animal data has been retrieved successfully!",
        data: animals
    });
});
