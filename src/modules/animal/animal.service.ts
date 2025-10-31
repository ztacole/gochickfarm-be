import { db } from '../../config/db';
import {
    animals as animalTable,
    species as speciesTable
} from '../../../drizzle/schema';
import { AnimalRequest, AnimalResponse } from './animal.type';
import { asc, eq, like } from 'drizzle-orm';
import { Meta } from '../../common/meta.type';
import { calculateAge } from '../../helper/helper';
import { AppError, NotFoundError } from '../../common/error';

export class AnimalService {
    static async getAllAnimals(page: number = 1, limit: number = 10, search: string = '', species: string = ''): Promise<{ data: AnimalResponse[], meta: Meta }> {
        const animalsQuery = db.select({
            id: animalTable.id,
            tag: animalTable.tag,
            species: speciesTable.name,
            birthdate: animalTable.birthdate,
            sex: animalTable.sex,
            weight: animalTable.weight,
            status: animalTable.status
        }).from(animalTable)
            .innerJoin(speciesTable, eq(animalTable.species_id, speciesTable.id))
            .orderBy(asc(animalTable.birthdate), asc(animalTable.tag))
            .limit(limit)
            .offset((page - 1) * limit);

        if (search) {
            animalsQuery.where(like(animalTable.tag, `%${search}%`));
        }

        if (species) {
            animalsQuery.where(eq(speciesTable.name, species));
        }

        const [totalItemsResult] = await db.select({
            count: db.$count(animalTable)
        }).from(animalTable);
        const totalItems = Number(totalItemsResult.count);
        const totalPages = Math.ceil(totalItems / limit);

        const animalsData = await animalsQuery.execute();
        return {
            data: animalsData.map(animal => ({
                id: animal.id,
                tag: animal.tag,
                species: animal.species,
                age: calculateAge(animal.birthdate),
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

    static async getAnimalById(id: number): Promise<AnimalResponse> {
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

        if (!animal) throw new NotFoundError('Animal not found!');

        return {
            id: animal.id,
            tag: animal.tag,
            species: animal.species,
            age: calculateAge(animal.birthdate),
            sex: animal.sex,
            weight: animal.weight,
            birthdate: animal.birthdate.toISOString().split('T')[0],
            status: animal.status
        };
    }

    static async createAnimal(data: AnimalRequest): Promise<any> {
        const [speciesExists] = await db.select().from(speciesTable).where(eq(speciesTable.name, data.species));
        if (!speciesExists) throw new AppError('Specified species does not exist.', 400);
        try {
            const [result] = await db.insert(animalTable).values({
                tag: data.tag,
                species_id: speciesExists.id,
                birthdate: new Date(data.birthdate),
                sex: data.sex,
                weight: data.weight,
                status: 'Hidup'
            }).$returningId();
            return {
                id: Number(result.id)
            };
        } catch (error) {
            throw new AppError('Failed to create animal.', 500);
        }
    }

    static async updateAnimal(id: number, data: Partial<AnimalRequest>): Promise<void> {
        const [animal] = await db.select().from(animalTable).where(eq(animalTable.id, id));
        if (!animal) throw new NotFoundError('Animal not found!');

        const [speciesExists] = await db.select().from(speciesTable).where(eq(speciesTable.name, data.species ?? ''));
        if (!speciesExists) throw new AppError('Specified species does not exist.', 400);

        try {
            await db.update(animalTable).set({
                tag: data.tag ?? animal.tag,
                species_id: speciesExists.id ?? animal.species_id,
                birthdate: data.birthdate ? new Date(data.birthdate) : animal.birthdate,
                sex: data.sex ?? animal.sex,
                weight: data.weight ?? animal.weight,
                status: data.status ?? animal.status
            }).where(eq(animalTable.id, id));
        } catch (error) {
            throw new AppError('Failed to update animal data.', 500);
        }
    }

    static async deleteAnimal(id: number): Promise<void> {
        const [animal] = await db.select().from(animalTable).where(eq(animalTable.id, id));
        if (!animal) throw new NotFoundError('Animal not found!');

        try {
            await db.delete(animalTable).where(eq(animalTable.id, id));
        } catch (error) {
            throw new AppError('Failed to delete animal data.', 500);
        }
    }
}