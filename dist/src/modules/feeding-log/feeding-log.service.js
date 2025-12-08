"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedingLogService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../../drizzle/schema");
const db_1 = require("../../config/db");
const error_1 = require("../../common/error");
class FeedingLogService {
    static async getFeedingLogsByAnimalId(animalId, page = 1, limit = 10) {
        const [existingAnimal] = await db_1.db.select().from(schema_1.feeding_logs).where((0, drizzle_orm_1.eq)(schema_1.feeding_logs.animal_id, animalId));
        if (!existingAnimal)
            throw new error_1.NotFoundError('Animal');
        const feedingLogs = await db_1.db.select({
            id: schema_1.feeding_logs.id,
            datetime: schema_1.feeding_logs.created_at,
            feed: schema_1.feeds.name,
            amount: schema_1.feeding_logs.quantity,
            new_weight: schema_1.feeding_logs.new_weight,
            health_notes: schema_1.feeding_logs.health_notes
        }).from(schema_1.feeding_logs)
            .innerJoin(schema_1.feeds, (0, drizzle_orm_1.eq)(schema_1.feeding_logs.feed_id, schema_1.feeds.id))
            .where((0, drizzle_orm_1.eq)(schema_1.feeding_logs.animal_id, animalId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.feeding_logs.created_at))
            .limit(limit)
            .offset((page - 1) * limit);
        const [totalItemsResult] = await db_1.db.select({ count: (0, drizzle_orm_1.count)(schema_1.feeding_logs.id) }).from(schema_1.feeding_logs).where((0, drizzle_orm_1.eq)(schema_1.feeding_logs.animal_id, animalId));
        const totalItems = Number(totalItemsResult.count);
        const totalPages = Math.ceil(totalItems / limit);
        return {
            data: feedingLogs.map(feedingLog => ({
                id: feedingLog.id,
                date: feedingLog.datetime.toISOString().split('T')[0],
                time: feedingLog.datetime.toISOString().split('T')[1],
                feed: feedingLog.feed,
                amount: feedingLog.amount,
                new_weight: feedingLog.new_weight,
                health_notes: feedingLog.health_notes
            })),
            meta: {
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_items: totalItems,
            }
        };
    }
    static async createFeedingLog(data, user) {
        const [existingAnimal] = await db_1.db.select().from(schema_1.animals).where((0, drizzle_orm_1.eq)(schema_1.animals.id, data.animal_id));
        if (!existingAnimal)
            throw new error_1.NotFoundError('Animal');
        const [existingFeed] = await db_1.db.select().from(schema_1.feeds).where((0, drizzle_orm_1.eq)(schema_1.feeds.id, data.feed_id));
        if (!existingFeed)
            throw new error_1.NotFoundError('Feed');
        try {
            return await db_1.db.transaction(async (tx) => {
                const [result] = await db_1.db.insert(schema_1.feeding_logs).values({
                    animal_id: data.animal_id,
                    feed_id: data.feed_id,
                    quantity: data.quantity,
                    new_weight: data.new_weight,
                    health_notes: data.health_notes,
                    user_id: user.id
                }).$returningId();
                const updatedQuantity = existingFeed.quantity - data.quantity;
                if (updatedQuantity < 0) {
                    throw new error_1.AppError('Insufficient feed quantity in inventory', 400);
                }
                await tx.update(schema_1.feeds).set({ quantity: updatedQuantity }).where((0, drizzle_orm_1.eq)(schema_1.feeds.id, data.feed_id));
                await tx.update(schema_1.animals).set({ weight: data.new_weight }).where((0, drizzle_orm_1.eq)(schema_1.animals.id, data.animal_id));
                return {
                    id: Number(result.id)
                };
            });
        }
        catch (error) {
            (0, error_1.handleDbError)(error, 'create feeding log data');
        }
    }
}
exports.FeedingLogService = FeedingLogService;
