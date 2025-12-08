"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedingLogController = void 0;
const feeding_log_service_1 = require("./feeding-log.service");
const async_handler_1 = require("../../common/async.handler");
class FeedingLogController {
}
exports.FeedingLogController = FeedingLogController;
_a = FeedingLogController;
FeedingLogController.getFeedingLogByAnimalId = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const animalId = Number(req.params.id);
    const { data, meta } = await feeding_log_service_1.FeedingLogService.getFeedingLogsByAnimalId(animalId);
    res.status(200).json({
        success: true,
        message: "Feeding log data has been retrieved successfully!",
        data,
        meta
    });
});
FeedingLogController.createFeedingLog = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    const user = req.user;
    const result = await feeding_log_service_1.FeedingLogService.createFeedingLog(data, user);
    res.status(201).json({
        success: true,
        message: "Feeding log data has been saved successfully!",
        data: result
    });
});
