import { db } from '../../config/db';
import {
    animals as animalTable,
    feeding_logs as feedingLogsTable,
    species as speciesTable
} from '../../../drizzle/schema';
import { AnimalRequest, AnimalResponse } from './animal.type';
import { and, asc, between, count, desc, eq, like, sql } from 'drizzle-orm';
import { Meta } from '../../common/meta.type';
import { calculateAgeFormatted } from '../../helper/helper';
import { AppError, handleDbError, NotFoundError } from '../../common/error';

export class AnimalService {
    static async getAll(page: number = 1, limit: number = 10, search: string = '', species: string = '', status: 'Hidup' | 'Mati' | 'Terjual' = 'Hidup'): Promise<{ data: AnimalResponse[], meta: Meta }> {
        const conditions = [
            eq(animalTable.status, status)
        ];

        if (search) {
            conditions.push(like(animalTable.tag, `%${search}%`));
        }

        if (species) {
            conditions.push(eq(speciesTable.name, species));
        }

        const animalsQuery = db.select({
            id: animalTable.id,
            tag: animalTable.tag,
            species: speciesTable.name,
            birthdate: animalTable.birthdate,
            sex: animalTable.sex,
            weight: animalTable.weight,
            status: animalTable.status,
            feed_count: count(feedingLogsTable.id).as('feed_count')
        }).from(animalTable)
            .innerJoin(speciesTable, eq(animalTable.species_id, speciesTable.id))
            .leftJoin(
                feedingLogsTable,
                and(
                    eq(feedingLogsTable.animal_id, animalTable.id),
                    sql`DATE(${feedingLogsTable.created_at}) = CURDATE()`
                )
            )
            .where(and(...conditions))
            .groupBy(animalTable.id, speciesTable.name)
            .orderBy(
                asc(sql`feed_count`),
                asc(animalTable.birthdate),
                asc(animalTable.tag)
            )
            .limit(limit)
            .offset((page - 1) * limit);

        const [totalItemsResult] = await db.select({
            count: count(animalTable.id)
        }).from(animalTable).where(eq(animalTable.status, status));
        const totalItems = Number(totalItemsResult.count);
        const totalPages = Math.ceil(totalItems / limit);

        const animalsData = await animalsQuery.execute();
        return {
            data: animalsData.map(animal => ({
                id: animal.id,
                tag: animal.tag,
                species: animal.species,
                age: calculateAgeFormatted(animal.birthdate),
                sex: animal.sex,
                weight: animal.weight,
                birthdate: animal.birthdate.toISOString().split('T')[0],
                status: animal.status
            })),
            meta: {
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_items: totalItems
            }
        };
    }

    static async getById(id: number): Promise<AnimalResponse> {
        const [animal] = await db.select({
            id: animalTable.id,
            tag: animalTable.tag,
            species: speciesTable.name,
            birthdate: animalTable.birthdate,
            sex: animalTable.sex,
            weight: animalTable.weight,
            status: animalTable.status
        }).from(animalTable)
            .innerJoin(speciesTable, eq(animalTable.species_id, speciesTable.id))
            .where(eq(animalTable.id, id));

        if (!animal) throw new NotFoundError('Animal');

        return {
            id: animal.id,
            tag: animal.tag,
            species: animal.species,
            age: calculateAgeFormatted(animal.birthdate),
            sex: animal.sex,
            weight: animal.weight,
            birthdate: animal.birthdate.toISOString().split('T')[0],
            status: animal.status
        };
    }

    static async create(data: AnimalRequest): Promise<any> {
        const [speciesExists] = await db.select().from(speciesTable).where(eq(speciesTable.name, data.species));
        if (!speciesExists) throw new AppError('Specified species does not exist.', 400);

        const [lastSpeciesTag] = await db.select({
            tag: animalTable.tag
        }).from(animalTable)
            .where(eq(animalTable.species_id, speciesExists.id))
            .orderBy(desc(animalTable.tag));

        let newTag = (data.species === 'Ayam') ? 'A' : 'K';

        if (lastSpeciesTag) {
            const lastTagNumber = Number(lastSpeciesTag.tag.slice(2));
            newTag = `${newTag}-${(lastTagNumber + 1).toString().padStart(3, '0')}`;
        } else newTag = `${newTag}-001`;

        try {
            const [result] = await db.insert(animalTable).values({
                tag: newTag,
                species_id: speciesExists.id,
                birthdate: new Date(data.birthdate),
                sex: data.sex,
                weight: data.weight,
                status: 'Hidup'
            }).$returningId();
            return {
                id: Number(result.id)
            };
        } catch (error: any) {
            handleDbError(error, 'create animal data');
        }
    }

    static async update(id: number, data: Partial<AnimalRequest>): Promise<void> {
        const [animal] = await db.select().from(animalTable).where(eq(animalTable.id, id));
        if (!animal) throw new NotFoundError('Animal');

        let speciesExists;
        if (data.species) {
            [speciesExists] = await db.select().from(speciesTable).where(eq(speciesTable.name, data.species ?? ''));
            if (!speciesExists) throw new AppError('Specified species does not exist.', 400);
        }

        try {
            await db.update(animalTable).set({
                species_id: speciesExists?.id ?? animal.species_id,
                birthdate: data.birthdate ? new Date(data.birthdate) : animal.birthdate,
                sex: data.sex ?? animal.sex,
                weight: data.weight ?? animal.weight,
                status: data.status ?? animal.status
            }).where(eq(animalTable.id, id));
        } catch (error: any) {
            handleDbError(error, 'update animal data');
        }
    }

    static async delete(id: number): Promise<void> {
        const [animal] = await db.select().from(animalTable).where(eq(animalTable.id, id));
        if (!animal) throw new NotFoundError('Animal');

        try {
            await db.delete(animalTable).where(eq(animalTable.id, id));
        } catch (error) {
            handleDbError(error, 'delete animal data');
        }
    }
}