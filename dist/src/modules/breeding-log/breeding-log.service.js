"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreedingLogService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../../drizzle/schema");
const db_1 = require("../../config/db");
const error_1 = require("../../common/error");
class BreedingLogService {
    static async getByAnimalId(animalId, page = 1, limit = 10) {
        const [existingAnimal] = await db_1.db.select().from(schema_1.animals).where((0, drizzle_orm_1.eq)(schema_1.animals.id, animalId));
        if (!existingAnimal)
            throw new error_1.NotFoundError('Animal');
        const sexCondition = existingAnimal.sex === 'Jantan' ? schema_1.breeding_logs.male_id : schema_1.breeding_logs.female_id;
        const sexPair = existingAnimal.sex === 'Jantan' ? schema_1.breeding_logs.female_id : schema_1.breeding_logs.male_id;
        const breedingLogs = await db_1.db.select({
            id: schema_1.breeding_logs.id,
            animal_pair: {
                id: schema_1.breeding_logs.male_id,
                tag: schema_1.animals.tag,
                sex: schema_1.animals.sex
            },
            offspring_count: schema_1.breeding_logs.offspring_count,
            mating_date: schema_1.breeding_logs.mating_date
        }).from(schema_1.breeding_logs)
            .innerJoin(schema_1.animals, (0, drizzle_orm_1.eq)(sexPair, schema_1.animals.id))
            .where((0, drizzle_orm_1.eq)(sexCondition, animalId))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.breeding_logs.created_at))
            .limit(limit)
            .offset((page - 1) * limit);
        const [totalItemsResult] = await db_1.db.select({ count: (0, drizzle_orm_1.count)(schema_1.breeding_logs.id) }).from(schema_1.breeding_logs).where((0, drizzle_orm_1.eq)(sexCondition, animalId));
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
    static async create(data, user) {
        const [existingAnimal] = await db_1.db.select().from(schema_1.animals).innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id)).where((0, drizzle_orm_1.eq)(schema_1.animals.id, data.animal_id));
        if (!existingAnimal)
            throw new error_1.NotFoundError('Animal');
        const [existingPair] = await db_1.db.select().from(schema_1.animals).where((0, drizzle_orm_1.eq)(schema_1.animals.id, data.pair_id));
        if (!existingPair)
            throw new error_1.NotFoundError('Pair Animal');
        return await db_1.db.transaction(async (tx) => {
            const [newBreedingLog] = await tx.insert(schema_1.breeding_logs).values({
                male_id: data.animal_id,
                female_id: data.pair_id,
                offspring_count: data.offspring_count,
                mating_date: new Date(data.mating_date),
                user_id: user.id
            }).$returningId();
            const [lastSpeciesTag] = await db_1.db.select({
                tag: schema_1.animals.tag
            }).from(schema_1.animals)
                .where((0, drizzle_orm_1.eq)(schema_1.animals.species_id, existingAnimal.species.id))
                .orderBy((0, drizzle_orm_1.desc)(schema_1.animals.tag));
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
                    status: 'Hidup'
                };
            });
            if (offspringInserts && offspringInserts.length > 0) {
                await tx.insert(schema_1.animals).values(offspringInserts);
            }
            return {
                id: newBreedingLog.id
            };
        });
    }
}
exports.BreedingLogService = BreedingLogService;
