"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../../drizzle/schema");
const db_1 = require("../../config/db");
const helper_1 = require("../../helper/helper");
class DashboardService {
    static async getWebDashboardData() {
        const [chickenCount = { count: 0 }] = await db_1.db.select({
            count: (0, drizzle_orm_1.count)(schema_1.animals.id)
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.species.name, 'Ayam'), (0, drizzle_orm_1.eq)(schema_1.animals.status, 'Hidup')));
        const [soldChickenCount = { count: 0 }] = await db_1.db.select({
            count: (0, drizzle_orm_1.count)(schema_1.animals.id)
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.species.name, 'Ayam'), (0, drizzle_orm_1.eq)(schema_1.animals.status, 'Terjual')));
        const [goatCount = { count: 0 }] = await db_1.db.select({
            count: (0, drizzle_orm_1.count)(schema_1.animals.id)
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.species.name, 'Kambing'), (0, drizzle_orm_1.eq)(schema_1.animals.status, 'Hidup')));
        const [soldGoatCount = { count: 0 }] = await db_1.db.select({
            count: (0, drizzle_orm_1.count)(schema_1.animals.id)
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.species.name, 'Kambing'), (0, drizzle_orm_1.eq)(schema_1.animals.status, 'Terjual')));
        const recentAnimals = await db_1.db.select({
            id: schema_1.animals.id,
            tag: schema_1.animals.tag,
            species: schema_1.species.name,
            birthdate: schema_1.animals.birthdate,
            sex: schema_1.animals.sex,
            weight: schema_1.animals.weight,
            status: schema_1.animals.status
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.animals.created_at))
            .limit(5);
        return {
            chicken_count: Number(chickenCount.count),
            sold_chicken_count: Number(soldChickenCount.count),
            goat_count: Number(goatCount.count),
            sold_goat_count: Number(soldGoatCount.count),
            recent_animals: recentAnimals.map(animal => ({
                id: animal.id,
                tag: animal.tag,
                species: animal.species,
                age: (0, helper_1.calculateAgeFormatted)(animal.birthdate),
                sex: animal.sex,
                weight: animal.weight,
                birthdate: animal.birthdate.toISOString().split('T')[0],
                status: animal.status
            }))
        };
    }
    static async getTransactionDashboardData() {
        const transactions = await db_1.db.select()
            .from(schema_1.transactions)
            .orderBy((0, drizzle_orm_1.desc)(schema_1.transactions.date))
            .limit(6);
        return transactions.map(transaction => ({
            id: transaction.id,
            description: transaction.description,
            type: transaction.type,
            total: transaction.total,
            date: transaction.date.toISOString()
        }));
    }
    static async getGraphDashboardData(year) {
        const speciesList = await db_1.db.select().from(schema_1.species);
        const graphData = [];
        for (const spec of speciesList) {
            const monthlyData = [];
            for (let month = 1; month <= 12; month++) {
                const [result] = await db_1.db.select({
                    total_income: (0, drizzle_orm_1.sql) `SUM(${schema_1.transactions.total})`
                }).from(schema_1.transactions)
                    .innerJoin(schema_1.transaction_details, (0, drizzle_orm_1.eq)(schema_1.transaction_details.header_id, schema_1.transactions.id))
                    .innerJoin(schema_1.animals, (0, drizzle_orm_1.eq)(schema_1.animals.id, schema_1.transaction_details.animal_id))
                    .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.species.id, schema_1.animals.species_id))
                    .where((0, drizzle_orm_1.sql) `${schema_1.species.name} = ${spec.name} AND ${schema_1.transactions.type} = ${'Pemasukan'} AND MONTH(${schema_1.transactions.date}) = ${month} AND YEAR(${schema_1.transactions.date}) = ${year}`);
                monthlyData.push({
                    month: new Date(year, month - 1).toLocaleString('id-ID', { month: 'long' }),
                    total_income: Number(result.total_income) ?? 0
                });
            }
            graphData.push({
                species: spec.name,
                detail: monthlyData
            });
        }
        return graphData;
    }
    static async getMobileDashboardData() {
        const [chickenCount = { count: 0 }] = await db_1.db.select({
            count: (0, drizzle_orm_1.count)(schema_1.animals.id)
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.species.name, 'Ayam'), (0, drizzle_orm_1.eq)(schema_1.animals.status, 'Hidup')));
        const [soldChickenCount = { count: 0 }] = await db_1.db.select({
            count: (0, drizzle_orm_1.count)(schema_1.transaction_details.id)
        }).from(schema_1.transaction_details)
            .innerJoin(schema_1.transactions, (0, drizzle_orm_1.eq)(schema_1.transaction_details.header_id, schema_1.transactions.id))
            .innerJoin(schema_1.animals, (0, drizzle_orm_1.eq)(schema_1.animals.id, schema_1.transaction_details.animal_id))
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.species.name, 'Ayam'), (0, drizzle_orm_1.eq)(schema_1.transactions.type, 'Pemasukan'), (0, drizzle_orm_1.sql) `DATE(${schema_1.transactions.date}) = CURDATE()`));
        const [goatCount = { count: 0 }] = await db_1.db.select({
            count: (0, drizzle_orm_1.count)(schema_1.animals.id)
        }).from(schema_1.animals)
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.species.name, 'Kambing'), (0, drizzle_orm_1.eq)(schema_1.animals.status, 'Hidup')));
        const [soldGoatCount = { count: 0 }] = await db_1.db.select({
            count: (0, drizzle_orm_1.count)(schema_1.transaction_details.id)
        }).from(schema_1.transaction_details)
            .innerJoin(schema_1.transactions, (0, drizzle_orm_1.eq)(schema_1.transaction_details.header_id, schema_1.transactions.id))
            .innerJoin(schema_1.animals, (0, drizzle_orm_1.eq)(schema_1.animals.id, schema_1.transaction_details.animal_id))
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.species.name, 'Kambing'), (0, drizzle_orm_1.eq)(schema_1.transactions.type, 'Pemasukan'), (0, drizzle_orm_1.sql) `DATE(${schema_1.transactions.date}) = CURDATE()`));
        const [totalIncome] = await db_1.db.select({
            total: (0, drizzle_orm_1.sql) `SUM(${schema_1.transactions.total})`
        }).from(schema_1.transactions)
            .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.transactions.type, 'Pemasukan'), (0, drizzle_orm_1.sql) `DATE(${schema_1.transactions.date}) = CURDATE()`));
        return {
            chicken_count: Number(chickenCount.count),
            today_sold_chicken_count: Number(soldChickenCount.count),
            goat_count: Number(goatCount.count),
            today_sold_goat_count: Number(soldGoatCount.count),
            today_income: Number(totalIncome.total)
        };
    }
}
exports.DashboardService = DashboardService;
