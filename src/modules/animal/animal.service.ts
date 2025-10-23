import { db } from '../../config/db';
import {
    animals as animalTable,
    species as speciesTable
} from '../../../drizzle/schema';
import { AnimalResponse } from './animal.type';
import { and, asc, eq, like } from 'drizzle-orm';
import { Meta } from '../../common/meta.type';
import { calculateAge } from '../../helper/helper';
import { NotFoundError } from '../../common/error';

export class AnimalService {
    static async getAllAnimals(page: number = 1, limit: number = 10, search: string = '', species: string = ''): Promise<{ data: AnimalResponse[], meta: Meta }> {
        const animals = await db.select({
            id: animalTable.id,
            tag: animalTable.tag,
            species: speciesTable.name,
            birthdate: animalTable.birthdate,
            sex: animalTable.sex,
            weight: animalTable.weight
        })
            .from(animalTable)
            .innerJoin(speciesTable, eq(animalTable.species_id, speciesTable.id))
            .where(
                and(
                    like(animalTable.tag, `%${search}%`),
                    species ? eq(speciesTable.name, species) : undefined,
                    eq(animalTable.status, 'Hidup')
                )
            )
            .orderBy(asc(animalTable.birthdate), asc(animalTable.tag))
            .limit(limit)
            .offset((page - 1) * limit);

        const [totalItemsResult] = await db.select({
            count: db.$count(animalTable)
        }).from(animalTable);
        const totalItems = Number(totalItemsResult.count);
        const totalPages = Math.ceil(totalItems / limit);

        return {
            data: animals.map(animal => ({
                id: animal.id,
                tag: animal.tag,
                species: animal.species,
                age: calculateAge(animal.birthdate),
                sex: animal.sex,
                weight: animal.weight,
                birthdate: animal.birthdate.toISOString().split('T')[0]
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
            weight: animalTable.weight
        })
            .from(animalTable)
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
            birthdate: animal.birthdate.toISOString().split('T')[0]
        };
    }
}