import { count, desc, eq } from "drizzle-orm";
import { animals as animalTable, breeding_logs as breedingLogTable, species as speciesTable } from "../../../drizzle/schema";
import { db } from "../../config/db";
import { BreedingLogByAnimalResponse, BreedingLogRequest } from "./breeding-log.type";
import { NotFoundError } from "../../common/error";
import { Meta } from "../../common/meta.type";
import { JwtPayload } from "../auth/auth.type";

export class BreedingLogService {
    static async getByAnimalId(animalId: number, page: number = 1, limit: number = 10): Promise<{ data: BreedingLogByAnimalResponse[], meta: Meta }> {
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
            .orderBy(desc(breedingLogTable.created_at))
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

    static async create(data: BreedingLogRequest, user: JwtPayload): Promise<any> {
        const [existingAnimal] = await db.select().from(animalTable).innerJoin(speciesTable, eq(animalTable.species_id, speciesTable.id)).where(eq(animalTable.id, data.animal_id));
        if (!existingAnimal) throw new NotFoundError('Animal');

        const [existingPair] = await db.select().from(animalTable).where(eq(animalTable.id, data.pair_id));
        if (!existingPair) throw new NotFoundError('Pair Animal');

        return await db.transaction(async (tx) => {
            const [newBreedingLog] = await tx.insert(breedingLogTable).values({
                male_id: data.animal_id,
                female_id: data.pair_id,
                offspring_count: data.offspring_count,
                mating_date: new Date(data.mating_date),
                user_id: user.id
            }).$returningId();

            const [lastSpeciesTag] = await db.select({
                tag: animalTable.tag
            }).from(animalTable)
                .where(eq(animalTable.species_id, existingAnimal.species.id))
                .orderBy(desc(animalTable.tag));
            
            let lastNumber = Number(lastSpeciesTag.tag.slice(2));

            const offspringInserts = data.offspring_animals.map(offspring => {
                const speciesTag = (existingAnimal.species.name === 'Ayam') ? 'A' : 'K';
                const newTag = `${speciesTag}-${(++lastNumber).toString().padStart(3, '0')}`;
                return {
                    tag: newTag,
                    species_id: existingAnimal.species.id,
                    birthdate: new Date(),
                    sex: offspring.sex,
                    weight: offspring.weight,
                    status: 'Hidup' as 'Hidup' | 'Mati' | 'Terjual'
                }
            });
            if (offspringInserts && offspringInserts.length > 0) {
                await tx.insert(animalTable).values(offspringInserts);
            }

            return {
                id: newBreedingLog.id
            };
        });
    }
}