"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreedingLogController = void 0;
const breeding_log_service_1 = require("./breeding-log.service");
const async_handler_1 = require("../../common/async.handler");
class BreedingLogController {
}
exports.BreedingLogController = BreedingLogController;
_a = BreedingLogController;
BreedingLogController.getByAnimalId = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const animalId = Number(req.params.id);
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const { data, meta } = await breeding_log_service_1.BreedingLogService.getByAnimalId(animalId, page, limit);
    res.status(200).json({
        success: true,
        message: "Breeding log data has been retrieved successfully!",
        data,
        meta
    });
});
BreedingLogController.create = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    const user = req.user;
    const result = await breeding_log_service_1.BreedingLogService.create(data, user);
    res.status(201).json({
        success: true,
        message: "Breeding log data has been saved successfully!",
        data: result
    });
});
