import { count, eq } from "drizzle-orm";
import { animals as animalTable, breeding_logs as breedingLogTable } from "../../../drizzle/schema";
import { db } from "../../config/db";
import { BreedingLogByAnimalResponse } from "./breeding-log.type";
import { NotFoundError } from "../../common/error";
import { Meta } from "../../common/meta.type";

export class BreedingLogService {
    static async getBreedingLogsByAnimalId(animalId: number, page: number = 1, limit: number = 10): Promise<{ data: BreedingLogByAnimalResponse[], meta: Meta }> {
        const [existingAnimal] = await db.select().from(animalTable).where(eq(animalTable.id, animalId));
        if (!existingAnimal) throw new NotFoundError('Animal');

        const sexCondition = existingAnimal.sex === 'Jantan' ? breedingLogTable.male_id : breedingLogTable.female_id;
        const sexPair = existingAnimal.sex === 'Jantan' ? breedingLogTable.female_id : breedingLogTable.male_id;

        const breedingLogs = await db.select({
            id: breedingLogTable.id,
            animal_pair: {
                id: breedingLogTable.male_id,
                tag: animalTable.tag,
                sex: animalTable.sex
            },
            offspring_count: breedingLogTable.offspring_count,
            mating_date: breedingLogTable.mating_date
        }).from(breedingLogTable)
        .innerJoin(animalTable, eq(sexPair, animalTable.id))
        .where(eq(sexCondition, animalId))
        .limit(limit)
        .offset((page - 1) * limit);

        const [totalItemsResult] = await db.select({ count: count(breedingLogTable.id) }).from(breedingLogTable).where(eq(sexCondition, animalId));
        const totalItems = Number(totalItemsResult.count);
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: breedingLogs.map(breedingLog => ({
                id: breedingLog.id,
                animal_pair: breedingLog.animal_pair,
                offspring_count: breedingLog.offspring_count,
                mating_date: breedingLog.mating_date.toISOString().split('T')[0]
            })), 
            meta: {
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_items: totalItems
            }
        };
    }
}