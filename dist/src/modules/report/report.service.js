"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../../drizzle/schema");
const db_1 = require("../../config/db");
const helper_1 = require("../../helper/helper");
class ReportService {
    static async getReportTransaction(type) {
        const conditions = [];
        if (type) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.transactions.type, type));
        }
        const transactionsQuery = db_1.db.select()
            .from(schema_1.transactions)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.transactions.date));
        const transactions = await transactionsQuery.execute();
        return transactions.map(transaction => ({
            id: transaction.id,
            description: transaction.description,
            type: transaction.type,
            total: transaction.total,
            date: transaction.date.toISOString()
        }));
    }
    static async getAnimalHarvestReport(search) {
        const conditions = [];
        if (search) {
            conditions.push((0, drizzle_orm_1.like)(schema_1.animals.tag, `%${search}%`));
        }
        const animalHarvestQuery = db_1.db.select({
            id: schema_1.animals.id,
            tag: schema_1.animals.tag,
            species: schema_1.species.name,
            birthdate: schema_1.animals.birthdate,
            sex: schema_1.animals.sex,
            weight: schema_1.animals.weight
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.animals.birthdate), (0, drizzle_orm_1.asc)(schema_1.animals.tag));
        const rawAnimalHarvest = await animalHarvestQuery.execute();
        const animalHarvest = rawAnimalHarvest.map(animal => {
            const ageInMonths = (0, helper_1.calculateAgeInMonths)(animal.birthdate);
            const isReadyToHarvest = (animal.species === "Ayam" && ageInMonths >= 4) || (animal.species === "Kambing" && ageInMonths >= 12);
            if (!isReadyToHarvest)
                return null;
            return {
                id: animal.id,
                tag: animal.tag,
                species: animal.species,
                age: (0, helper_1.calculateAgeFormatted)(animal.birthdate),
                sex: animal.sex,
                weight: animal.weight,
                birthdate: animal.birthdate.toISOString().split('T')[0],
                status: 'Siap Dijual'
            };
        }).filter(animal => animal !== null);
        return animalHarvest;
    }
    static async getAnimalSickReport(search) {
        const conditions = [
            (0, drizzle_orm_1.or)((0, drizzle_orm_1.eq)(schema_1.animals.status, 'Hidup'), (0, drizzle_orm_1.eq)(schema_1.animals.status, 'Mati'))
        ];
        if (search) {
            conditions.push((0, drizzle_orm_1.like)(schema_1.animals.tag, `%${search}%`));
        }
        const animalSickQuery = db_1.db.select({
            id: schema_1.animals.id,
            tag: schema_1.animals.tag,
            species: schema_1.species.name,
            birthdate: schema_1.animals.birthdate,
            sex: schema_1.animals.sex,
            weight: schema_1.animals.weight,
            status: schema_1.animals.status
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.asc)(schema_1.animals.birthdate), (0, drizzle_orm_1.asc)(schema_1.animals.tag));
        const rawAnimalSick = await animalSickQuery.execute();
        const animalSick = await Promise.all(rawAnimalSick.map(async (animal) => {
            let status = animal.status;
            let healthNotes = "-";
            if (animal.status === "Hidup") {
                const [lastHealthCheck] = await db_1.db
                    .select({
                    health_notes: schema_1.feeding_logs.health_notes,
                })
                    .from(schema_1.feeding_logs)
                    .where((0, drizzle_orm_1.eq)(schema_1.feeding_logs.animal_id, animal.id))
                    .orderBy((0, drizzle_orm_1.desc)(schema_1.feeding_logs.created_at))
                    .limit(1);
                if (lastHealthCheck && lastHealthCheck.health_notes !== "-") {
                    status = "Sakit";
                    healthNotes = lastHealthCheck.health_notes;
                }
                else {
                    return null;
                }
            }
            return {
                id: animal.id,
                tag: animal.tag,
                species: animal.species,
                age: (0, helper_1.calculateAgeFormatted)(animal.birthdate),
                sex: animal.sex,
                weight: animal.weight,
                birthdate: animal.birthdate.toISOString().split("T")[0],
                status,
                health_notes: healthNotes,
            };
        }));
        const filteredAnimalSick = animalSick.filter((animal) => animal !== null);
        return filteredAnimalSick;
    }
}
exports.ReportService = ReportService;
