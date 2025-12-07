import { Request, Response } from "express";
import { asyncHandler } from "../../common/async.handler";
import { FeedService } from "./feed.service";
import { FeedRequest } from "./feed.type";
import { AppError } from "../../common/error";

export class FeedController {
    static getAll = asyncHandler(async (req: Request, res: Response) => {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);
        const search = String(req.query.search || '');
        const { data, meta } = await FeedService.getAll(page, limit, search);
        res.status(200).json({
            success: true,
            message: "Feed data has been retrieved successfully!",
            data,
            meta
        });
    })

    static getById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const feed = await FeedService.getById(id);
        res.status(200).json({
            success: true,
            message: "Feed data has been retrieved successfully!",
            data: feed
        });
    })

    static create = asyncHandler(async (req: Request, res: Response) => {
        const { name, quantity, price_per_unit } = req.body as FeedRequest;
        if (!name || !quantity || !price_per_unit) throw new AppError('Invalid feed data!', 400);
        const feed = await FeedService.create({ name, quantity, price_per_unit });
        res.status(200).json({
            success: true,
            message: "Feed data has been created successfully!",
            data: feed
        });
    })

    static update = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { name, quantity, price_per_unit } = req.body as FeedRequest;
        if (!name && !quantity && !price_per_unit) throw new AppError('Invalid feed data!', 400);
        await FeedService.update(id, { name, quantity, price_per_unit });
        res.status(200).json({
            success: true,
            message: "Feed data has been updated successfully!"
        });
    })

    static delete = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        await FeedService.delete(id);
        res.status(200).json({
            success: true,
            message: "Feed data has been deleted successfully!"
        });
    })

    static getAllWithoutPagination = asyncHandler(async (req: Request, res: Response) => {
        const data = await FeedService.getAllWithoutPagination();
        res.status(200).json({
            success: true,
            message: "Feed data has been retrieved successfully!",
            data
        });
    });
}