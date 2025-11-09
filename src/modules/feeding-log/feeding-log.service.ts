import { count, eq } from "drizzle-orm";
import { feeding_logs as feedingLogTable, feeds as feedTable } from "../../../drizzle/schema";
import { db } from "../../config/db";
import { FeedingLogByAnimalResponse, FeedingLogCreateRequest } from "./feeding-log.type";
import { AppError, handleDbError, NotFoundError } from "../../common/error";
import { Meta } from "../../common/meta.type";
import { JwtPayload } from "../auth/auth.type";

export class FeedingLogService {
    static async getFeedingLogsByAnimalId(animalId: number, page: number = 1, limit: number = 10): Promise<{ data: FeedingLogByAnimalResponse[], meta: Meta }> {
        const [existingAnimal] = await db.select().from(feedingLogTable).where(eq(feedingLogTable.animal_id, animalId));
        if (!existingAnimal) throw new NotFoundError('Animal');

        const feedingLogs = await db.select({
            id: feedingLogTable.id,
            datetime: feedingLogTable.created_at,
            feed: feedTable.name,
            amount: feedingLogTable.quantity,
            new_weight: feedingLogTable.new_weight,
            health_notes: feedingLogTable.health_notes
        }).from(feedingLogTable)
            .innerJoin(feedTable, eq(feedingLogTable.feed_id, feedTable.id))
            .where(eq(feedingLogTable.animal_id, animalId))
            .limit(limit)
            .offset((page - 1) * limit);

        const [totalItemsResult] = await db.select({ count: count(feedingLogTable.id) }).from(feedingLogTable).where(eq(feedingLogTable.animal_id, animalId));
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
        }
    }

    static async createFeedingLog(data: FeedingLogCreateRequest, user: JwtPayload): Promise<any> {
        const [existingAnimal] = await db.select().from(feedingLogTable).where(eq(feedingLogTable.animal_id, data.animal_id));
        if (!existingAnimal) throw new NotFoundError('Animal');

        const [existingFeed] = await db.select().from(feedTable).where(eq(feedTable.id, data.feed_id));
        if (!existingFeed) throw new NotFoundError('Feed');

        try {
            const [result] = await db.insert(feedingLogTable).values(
                {
                    animal_id: data.animal_id,
                    feed_id: data.feed_id,
                    quantity: data.quantity,
                    new_weight: data.new_weight,
                    health_notes: data.health_notes,
                    user_id: user.id
                }
            ).$returningId();
            return {
                id: Number(result.id)
            };
        } catch (error: any) {
            handleDbError(error, 'create feeding log data');
        }
    }
}