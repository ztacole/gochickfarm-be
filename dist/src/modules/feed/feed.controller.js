"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedController = void 0;
const async_handler_1 = require("../../common/async.handler");
const feed_service_1 = require("./feed.service");
const error_1 = require("../../common/error");
class FeedController {
}
exports.FeedController = FeedController;
_a = FeedController;
FeedController.getAll = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 10);
    const search = String(req.query.search || '');
    const { data, meta } = await feed_service_1.FeedService.getAll(page, limit, search);
    res.status(200).json({
        success: true,
        message: "Feed data has been retrieved successfully!",
        data,
        meta
    });
});
FeedController.getById = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const id = Number(req.params.id);
    const feed = await feed_service_1.FeedService.getById(id);
    res.status(200).json({
        success: true,
        message: "Feed data has been retrieved successfully!",
        data: feed
    });
});
FeedController.create = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const { name, quantity, price_per_unit } = req.body;
    if (!name || !quantity || !price_per_unit)
        throw new error_1.AppError('Invalid feed data!', 400);
    const feed = await feed_service_1.FeedService.create({ name, quantity, price_per_unit });
    res.status(200).json({
        success: true,
        message: "Feed data has been created successfully!",
        data: feed
    });
});
FeedController.update = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const id = Number(req.params.id);
    const { name, quantity, price_per_unit } = req.body;
    if (!name && !quantity && !price_per_unit)
        throw new error_1.AppError('Invalid feed data!', 400);
    await feed_service_1.FeedService.update(id, { name, quantity, price_per_unit });
    res.status(200).json({
        success: true,
        message: "Feed data has been updated successfully!"
    });
});
FeedController.delete = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const id = Number(req.params.id);
    await feed_service_1.FeedService.delete(id);
    res.status(200).json({
        success: true,
        message: "Feed data has been deleted successfully!"
    });
});
FeedController.getAllWithoutPagination = (0, async_handler_1.asyncHandler)(async (req, res) => {
    const data = await feed_service_1.FeedService.getAllWithoutPagination();
    res.status(200).json({
        success: true,
        message: "Feed data has been retrieved successfully!",
        data
    });
});
