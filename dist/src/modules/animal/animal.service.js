"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalService = void 0;
const db_1 = require("../../config/db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
const helper_1 = require("../../helper/helper");
const error_1 = require("../../common/error");
class AnimalService {
    static async getAll(page = 1, limit = 10, search = '', species = '', status = 'Hidup') {
        const conditions = [
            (0, drizzle_orm_1.eq)(schema_1.animals.status, status)
        ];
        if (search) {
            conditions.push((0, drizzle_orm_1.like)(schema_1.animals.tag, `%${search}%`));
        }
        if (species) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.species.name, species));
        }
        const animalsQuery = db_1.db.select({
            id: schema_1.animals.id,
            tag: schema_1.animals.tag,
            species: schema_1.species.name,
            birthdate: schema_1.animals.birthdate,
            sex: schema_1.animals.sex,
            weight: schema_1.animals.weight,
            status: schema_1.animals.status,
            feed_count: (0, drizzle_orm_1.count)(schema_1.feeding_logs.id).as('feed_count')
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .leftJoin(schema_1.feeding_logs, (0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.feeding_logs.animal_id, schema_1.animals.id), (0, drizzle_orm_1.sql) `DATE(${schema_1.feeding_logs.created_at}) = CURDATE()`))
            .where((0, drizzle_orm_1.and)(...conditions))
            .groupBy(schema_1.animals.id, schema_1.species.name)
            .orderBy((0, drizzle_orm_1.asc)((0, drizzle_orm_1.sql) `feed_count`), (0, drizzle_orm_1.desc)(schema_1.animals.birthdate), (0, drizzle_orm_1.desc)(schema_1.animals.tag))
            .limit(limit)
            .offset((page - 1) * limit);
        const [totalItemsResult] = await db_1.db.select({
            count: (0, drizzle_orm_1.count)(schema_1.animals.id)
        }).from(schema_1.animals).where((0, drizzle_orm_1.eq)(schema_1.animals.status, status));
        const totalItems = Number(totalItemsResult.count);
        const totalPages = Math.ceil(totalItems / limit);
        const animalsData = await animalsQuery.execute();
        return {
            data: animalsData.map(animal => ({
                id: animal.id,
                tag: animal.tag,
                species: animal.species,
                age: (0, helper_1.calculateAgeFormatted)(animal.birthdate),
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
    static async getById(id) {
        const [animal] = await db_1.db.select({
            id: schema_1.animals.id,
            tag: schema_1.animals.tag,
            species: schema_1.species.name,
            birthdate: schema_1.animals.birthdate,
            sex: schema_1.animals.sex,
            weight: schema_1.animals.weight,
            status: schema_1.animals.status
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.eq)(schema_1.animals.id, id));
        if (!animal)
            throw new error_1.NotFoundError('Animal');
        return {
            id: animal.id,
            tag: animal.tag,
            species: animal.species,
            age: (0, helper_1.calculateAgeFormatted)(animal.birthdate),
            sex: animal.sex,
            weight: animal.weight,
            birthdate: animal.birthdate.toISOString().split('T')[0],
            status: animal.status
        };
    }
    static async create(data) {
        const [speciesExists] = await db_1.db.select().from(schema_1.species).where((0, drizzle_orm_1.eq)(schema_1.species.name, data.species));
        if (!speciesExists)
            throw new error_1.AppError('Specified species does not exist.', 400);
        const [lastSpeciesTag] = await db_1.db.select({
            tag: schema_1.animals.tag
        }).from(schema_1.animals)
            .where((0, drizzle_orm_1.eq)(schema_1.animals.species_id, speciesExists.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.animals.tag));
        let newTag = (data.species === 'Ayam') ? 'A' : 'K';
        if (lastSpeciesTag) {
            const lastTagNumber = Number(lastSpeciesTag.tag.slice(2));
            newTag = `${newTag}-${(lastTagNumber + 1).toString().padStart(3, '0')}`;
        }
        else
            newTag = `${newTag}-001`;
        try {
            const [result] = await db_1.db.insert(schema_1.animals).values({
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
        }
        catch (error) {
            (0, error_1.handleDbError)(error, 'create animal data');
        }
    }
    static async update(id, data) {
        const [animal] = await db_1.db.select().from(schema_1.animals).where((0, drizzle_orm_1.eq)(schema_1.animals.id, id));
        if (!animal)
            throw new error_1.NotFoundError('Animal');
        let speciesExists;
        if (data.species) {
            [speciesExists] = await db_1.db.select().from(schema_1.species).where((0, drizzle_orm_1.eq)(schema_1.species.name, data.species ?? ''));
            if (!speciesExists)
                throw new error_1.AppError('Specified species does not exist.', 400);
        }
        try {
            await db_1.db.update(schema_1.animals).set({
                species_id: speciesExists?.id ?? animal.species_id,
                birthdate: data.birthdate ? new Date(data.birthdate) : animal.birthdate,
                sex: data.sex ?? animal.sex,
                weight: data.weight ?? animal.weight,
                status: data.status ?? animal.status
            }).where((0, drizzle_orm_1.eq)(schema_1.animals.id, id));
        }
        catch (error) {
            (0, error_1.handleDbError)(error, 'update animal data');
        }
    }
    static async delete(id) {
        const [animal] = await db_1.db.select().from(schema_1.animals).where((0, drizzle_orm_1.eq)(schema_1.animals.id, id));
        if (!animal)
            throw new error_1.NotFoundError('Animal');
        try {
            await db_1.db.delete(schema_1.animals).where((0, drizzle_orm_1.eq)(schema_1.animals.id, id));
        }
        catch (error) {
            (0, error_1.handleDbError)(error, 'delete animal data');
        }
    }
    static async getAllWithoutPagination(species, sex) {
        const conditions = [
            (0, drizzle_orm_1.eq)(schema_1.animals.status, 'Hidup')
        ];
        if (species) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.species.name, species));
        }
        if (sex) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.animals.sex, sex));
        }
        const animals = await db_1.db.select({
            id: schema_1.animals.id,
            tag: schema_1.animals.tag
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.animals.tag));
        return animals.map(animal => ({
            id: animal.id,
            tag: animal.tag
        }));
    }
}
exports.AnimalService = AnimalService;
