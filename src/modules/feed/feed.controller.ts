import { Request, Response } from "express";
import { asyncHandler } from "../../common/async.handler";
import { FeedService } from "./feed.service";
import { FeedRequest } from "./feed.type";
import { AppError } from "../../common/error";

export class FeedController {
    static getAllFeeds = asyncHandler(async (req: Request, res: Response) => {
        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.min(100, Number(req.query.limit) || 10);
        const search = String(req.query.search || '');
        const { data, meta } = await FeedService.getAllFeeds(page, limit, search);
        res.status(200).json({
            success: true,
            message: "Feed data has been retrieved successfully!",
            data,
            meta
        });
    })

    static getFeedById = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const feed = await FeedService.getFeedById(id);
        res.status(200).json({
            success: true,
            message: "Feed data has been retrieved successfully!",
            data: feed
        });
    })

    static createFeed = asyncHandler(async (req: Request, res: Response) => {
        const { name, quantity, price_per_unit } = req.body as FeedRequest;
        if (!name || !quantity || !price_per_unit) throw new AppError('Invalid feed data!', 400);
        const feed = await FeedService.createFeed({ name, quantity, price_per_unit });
        res.status(200).json({
            success: true,
            message: "Feed data has been created successfully!",
            data: feed
        });
    })

    static updateFeed = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        const { name, quantity, price_per_unit } = req.body as FeedRequest;
        if (!name && !quantity && !price_per_unit) throw new AppError('Invalid feed data!', 400);
        await FeedService.updateFeed(id, { name, quantity, price_per_unit });
        res.status(200).json({
            success: true,
            message: "Feed data has been updated successfully!"
        });
    })

    static deleteFeed = asyncHandler(async (req: Request, res: Response) => {
        const id = Number(req.params.id);
        await FeedService.deleteFeed(id);
        res.status(200).json({
            success: true,
            message: "Feed data has been deleted successfully!"
        });
    })
}