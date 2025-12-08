"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../../drizzle/schema");
const db_1 = require("../../config/db");
const error_1 = require("../../common/error");
class FeedService {
    static async getAll(page = 1, limit = 10, search = '') {
        const conditions = [];
        if (search) {
            conditions.push((0, drizzle_orm_1.like)(schema_1.feeds.name, `%${search}%`));
        }
        const feedsQuery = db_1.db.select({
            id: schema_1.feeds.id,
            name: schema_1.feeds.name,
            quantity: schema_1.feeds.quantity,
            price_per_unit: schema_1.feeds.price_per_unit
        }).from(schema_1.feeds)
            .where((0, drizzle_orm_1.and)(...conditions))
            .limit(limit)
            .offset((page - 1) * limit);
        const [totalItemsResult] = await db_1.db.select({ count: (0, drizzle_orm_1.count)(schema_1.feeds.id) }).from(schema_1.feeds);
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
    static async getById(id) {
        const [feed] = await db_1.db.select({
            id: schema_1.feeds.id,
            name: schema_1.feeds.name,
            quantity: schema_1.feeds.quantity,
            price_per_unit: schema_1.feeds.price_per_unit
        }).from(schema_1.feeds)
            .where((0, drizzle_orm_1.eq)(schema_1.feeds.id, id));
        if (!feed)
            throw new error_1.NotFoundError('Feed');
        return feed;
    }
    static async create(data) {
        try {
            const [result] = await db_1.db.insert(schema_1.feeds).values(data).$returningId();
            return {
                id: Number(result.id)
            };
        }
        catch (error) {
            (0, error_1.handleDbError)(error, 'create feed data');
        }
    }
    static async update(id, data) {
        const [feed] = await db_1.db.select().from(schema_1.feeds).where((0, drizzle_orm_1.eq)(schema_1.feeds.id, id));
        if (!feed)
            throw new error_1.NotFoundError('Feed');
        try {
            await db_1.db.update(schema_1.feeds).set(data).where((0, drizzle_orm_1.eq)(schema_1.feeds.id, id));
        }
        catch (error) {
            (0, error_1.handleDbError)(error, 'update feed data');
        }
    }
    static async delete(id) {
        const [feed] = await db_1.db.select().from(schema_1.feeds).where((0, drizzle_orm_1.eq)(schema_1.feeds.id, id));
        if (!feed)
            throw new error_1.NotFoundError('Feed');
        try {
            await db_1.db.delete(schema_1.feeds).where((0, drizzle_orm_1.eq)(schema_1.feeds.id, id));
        }
        catch (error) {
            (0, error_1.handleDbError)(error, 'delete feed data');
        }
    }
    static async getAllWithoutPagination() {
        const feedsData = await db_1.db.select({
            id: schema_1.feeds.id,
            name: schema_1.feeds.name,
            quantity: schema_1.feeds.quantity,
        }).from(schema_1.feeds);
        return feedsData;
    }
}
exports.FeedService = FeedService;
