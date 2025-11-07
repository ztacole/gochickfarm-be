import { db } from '../../config/db';
import {
    animals as animalTable,
    species as speciesTable
} from '../../../drizzle/schema';
import { AnimalRequest, AnimalResponse } from './animal.type';
import { asc, desc, eq, like } from 'drizzle-orm';
import { Meta } from '../../common/meta.type';
import { calculateAgeFormatted } from '../../helper/helper';
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

    static async createAnimal(data: AnimalRequest): Promise<any> {
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
            throw new AppError(`Failed to create animal data: ${error.message}`, 500);
        }
    }

    static async updateAnimal(id: number, data: Partial<AnimalRequest>): Promise<void> {
        const [animal] = await db.select().from(animalTable).where(eq(animalTable.id, id));
        if (!animal) throw new NotFoundError('Animal');

        const [speciesExists] = await db.select().from(speciesTable).where(eq(speciesTable.name, data.species ?? ''));
        if (!speciesExists) throw new AppError('Specified species does not exist.', 400);

        try {
            await db.update(animalTable).set({
                species_id: speciesExists.id ?? animal.species_id,
                birthdate: data.birthdate ? new Date(data.birthdate) : animal.birthdate,
                sex: data.sex ?? animal.sex,
                weight: data.weight ?? animal.weight,
            }).where(eq(animalTable.id, id));
        } catch (error: any) {
            throw new AppError('Failed to update animal data: ' + error.message, 500);
        }
    }

    static async deleteAnimal(id: number): Promise<void> {
        const [animal] = await db.select().from(animalTable).where(eq(animalTable.id, id));
        if (!animal) throw new NotFoundError('Animal');

        try {
            await db.delete(animalTable).where(eq(animalTable.id, id));
        } catch (error) {
            throw new AppError('Failed to delete animal data.', 500);
        }
    }
}