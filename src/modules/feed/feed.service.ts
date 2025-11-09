import { and, count, eq, like } from "drizzle-orm";
import { Meta } from "../../common/meta.type";
import { FeedRequest, FeedResponse } from "./feed.type";
import { feeds } from "../../../drizzle/schema";
import { db } from "../../config/db";
import { AppError, handleDbError, NotFoundError } from "../../common/error";

export class FeedService {
    static async getAllFeeds(page: number = 1, limit: number = 10, search: string = ''): Promise<{ data: FeedResponse[], meta: Meta }> {
        const conditions = [];

        if (search) {
            conditions.push(like(feeds.name, `%${search}%`));
        }

        const feedsQuery = db.select({
            id: feeds.id,
            name: feeds.name,
            quantity: feeds.quantity,
            price_per_unit: feeds.price_per_unit
        }).from(feeds)
        .where(and(...conditions))
        .limit(limit)
        .offset((page - 1) * limit);

        const [totalItemsResult] = await db.select({ count: count(feeds.id) }).from(feeds);
        const totalItems = Number(totalItemsResult.count);
        const totalPages = Math.ceil(totalItems / limit);

        const feedsData = await feedsQuery.execute();
        return {
            data: feedsData,
            meta: {
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_items: totalItems,
            },
        };
    }

    static async getFeedById(id: number): Promise<FeedResponse> {
        const [feed] = await db.select({
            id: feeds.id,
            name: feeds.name,
            quantity: feeds.quantity,
            price_per_unit: feeds.price_per_unit
        }).from(feeds)
        .where(eq(feeds.id, id));

        if (!feed) throw new NotFoundError('Feed')

        return feed;
    }

    static async createFeed(data: FeedRequest): Promise<any> {
        try {
            const [result] = await db.insert(feeds).values(data).$returningId();
            return {
                id: Number(result.id)
            };
        } catch (error: any) {
            handleDbError(error, 'create feed data');
        }
    }

    static async updateFeed(id: number, data: Partial<FeedRequest>): Promise<void> {
        const [feed] = await db.select().from(feeds).where(eq(feeds.id, id));
        if (!feed) throw new NotFoundError('Feed');

        try {
            await db.update(feeds).set(data).where(eq(feeds.id, id));
        } catch (error: any) {
            handleDbError(error, 'update feed data');
        }
    }

    static async deleteFeed(id: number): Promise<void> {
        const [feed] = await db.select().from(feeds).where(eq(feeds.id, id));
        if (!feed) throw new NotFoundError('Feed');

        try {
            await db.delete(feeds).where(eq(feeds.id, id));
        } catch (error) {
            handleDbError(error, 'delete feed data');
        }
    }
}