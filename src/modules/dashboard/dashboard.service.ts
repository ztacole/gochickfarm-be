import { and, desc, eq, sql } from "drizzle-orm";
import { animals, species, transaction_details, transactions as transactionTable } from "../../../drizzle/schema";
import { db } from "../../config/db";
import { DashboardGraphResponse, DashboardTransactionResponse, WebDashboardResponse } from "./dashboard.type";
import { calculateAge } from "../../helper/helper";
import { stat } from "fs";


export class DashboardService {
    static async getWebDashboardData(): Promise<WebDashboardResponse> {
        const [chickenCount = { count: 0 }] = await db.select({
            count: db.$count(animals)
        }).from(animals)
        .innerJoin(species, eq(animals.species_id, species.id))
        .where(and(eq(species.name, 'Ayam'), eq(animals.status, 'Hidup')));

        const [soldChickenCount = { count: 0 }] = await db.select({
            count: db.$count(animals)
        }).from(animals)
        .innerJoin(species, eq(animals.species_id, species.id))
        .where(and(eq(species.name, 'Ayam'), eq(animals.status, 'Terjual')));

        const [goatCount = { count: 0 }] = await db.select({
            count: db.$count(animals)
        }).from(animals)
        .innerJoin(species, eq(animals.species_id, species.id))
        .where(and(eq(species.name, 'Kambing'), eq(animals.status, 'Hidup')));

        const [soldGoatCount = { count: 0 }] = await db.select({
            count: db.$count(animals)
        }).from(animals)
        .innerJoin(species, eq(animals.species_id, species.id))
        .where(and(eq(species.name, 'Kambing'), eq(animals.status, 'Terjual')));

        const recentAnimals = await db.select({
            id: animals.id,
            tag: animals.tag,
            species: species.name,
            birthdate: animals.birthdate,
            sex: animals.sex,
            weight: animals.weight,
            status: animals.status
        }).from(animals)
        .innerJoin(species, eq(animals.species_id, species.id))
        .orderBy(desc(animals.created_at))
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
                age: calculateAge(animal.birthdate),
                sex: animal.sex,
                weight: animal.weight,
                birthdate: animal.birthdate.toISOString().split('T')[0],
                status: animal.status
            }))
        };
    }

    static async getTransactionDashboardData(): Promise<DashboardTransactionResponse[]> {
        const transactions = await db.select()
        .from(transactionTable)
        .orderBy(desc(transactionTable.date))
        .limit(6);

        return transactions.map(transaction => ({
            id: transaction.id,
            description: transaction.description,
            type: transaction.type,
            total: transaction.total,
            date: transaction.date.toISOString()
        }));
    }

    static async getGraphDashboardData(year: number): Promise<DashboardGraphResponse[]> {
        const speciesList = await db.select().from(species);

        const graphData: DashboardGraphResponse[] = [];

        for (const spec of speciesList) {
            const monthlyData: { month: string; total_income: number }[] = [];

            for (let month = 1; month <= 12; month++) {
                const [result] = await db.select({
                    total_income: sql<number>`SUM(${transactionTable.total})`
                }).from(transactionTable)
                .innerJoin(transaction_details, eq(transaction_details.header_id, transactionTable.id))
                .innerJoin(animals, eq(animals.id, transaction_details.animal_id))
                .innerJoin(species, eq(species.id, animals.species_id))
                .where(
                    sql`${species.name} = ${spec.name} AND ${transactionTable.type} = ${'Pemasukan'} AND MONTH(${transactionTable.date}) = ${month} AND YEAR(${transactionTable.date}) = ${year}`
                );

                monthlyData.push({
                    month: new Date(year, month - 1).toLocaleString('id-ID', { month: 'long' }),
                    total_income: Number(result.total_income) ?? 0
                });
            }

            graphData.push({
                species: spec.name,
                detail: monthlyData
            })
        }

        return graphData;
    }
}