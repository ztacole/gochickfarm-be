import { and, asc, desc, eq, like, or } from "drizzle-orm";
import { transactions as transactionTable, animals as animalTable, species as speciesTable, feeding_logs } from "../../../drizzle/schema";
import { db } from "../../config/db";
import { WebTransactionResponse } from "../transaction/transaction.type";
import { AnimalHarvestReportResponse, AnimalSickReportResponse } from "./report.type";
import { calculateAgeFormatted, calculateAgeInMonths } from "../../helper/helper";

export class ReportService {
    static async getReportTransaction(type?: "Pemasukan" | "Pengeluaran"): Promise<WebTransactionResponse[]> {
        const transactionsQuery = db.select()
            .from(transactionTable)
            .orderBy(desc(transactionTable.date));

        if (type) {
            transactionsQuery.where(eq(transactionTable.type, type));
        }

        const transactions = await transactionsQuery.execute();
        return transactions.map(transaction => ({
            id: transaction.id,
            description: transaction.description,
            type: transaction.type,
            total: transaction.total,
            date: transaction.date.toISOString()
        }));
    }

    static async getAnimalHarvestReport(search?: string): Promise<AnimalHarvestReportResponse[]> {
        const animalHarvestQuery = db.select({
            id: animalTable.id,
            tag: animalTable.tag,
            species: speciesTable.name,
            birthdate: animalTable.birthdate,
            sex: animalTable.sex,
            weight: animalTable.weight
        }).from(animalTable)
            .innerJoin(speciesTable, eq(animalTable.species_id, speciesTable.id))
            .orderBy(asc(animalTable.birthdate), asc(animalTable.tag));

        if (search) {
            animalHarvestQuery.where(like(animalTable.tag, `%${search}%`))
        }

        const rawAnimalHarvest = await animalHarvestQuery.execute();
        const animalHarvest = rawAnimalHarvest.map(animal => {
            const ageInMonths = calculateAgeInMonths(animal.birthdate);
            const isReadyToHarvest = (animal.species === "Ayam" && ageInMonths >= 4) || (animal.species === "Kambing" && ageInMonths >= 12);
            if (!isReadyToHarvest) return null;

            return {
                id: animal.id,
                tag: animal.tag,
                species: animal.species,
                age: calculateAgeFormatted(animal.birthdate),
                sex: animal.sex,
                weight: animal.weight,
                birthdate: animal.birthdate.toISOString().split('T')[0],
                status: 'Siap Dijual'
            };
        }).filter(animal => animal !== null);

        return animalHarvest as AnimalHarvestReportResponse[];
    }

    static async getAnimalSickReport(search?: string): Promise<AnimalSickReportResponse[]> {
        const animalSickQuery = db.select({
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

        if (search) {
            animalSickQuery.where(
                and(
                    or(eq(animalTable.status, 'Hidup'), eq(animalTable.status, 'Mati')),
                    like(animalTable.tag, `%${search}%`)
                )
            )
        } else animalSickQuery.where(or(eq(animalTable.status, 'Hidup'), eq(animalTable.status, 'Mati')));

        const rawAnimalSick = await animalSickQuery.execute();
        const animalSick = await Promise.all(
            rawAnimalSick.map(async (animal) => {
                let status: string = animal.status;
                let healthNotes = "-";

                if (animal.status === "Hidup") {
                    const [lastHealthCheck] = await db
                        .select({
                            health_notes: feeding_logs.health_notes,
                        })
                        .from(feeding_logs)
                        .where(eq(feeding_logs.animal_id, animal.id))
                        .orderBy(desc(feeding_logs.created_at))
                        .limit(1);

                    if (lastHealthCheck && lastHealthCheck.health_notes !== "-") {
                        status = "Sakit";
                        healthNotes = lastHealthCheck.health_notes;
                    } else {
                        return null;
                    }
                }

                return {
                    id: animal.id,
                    tag: animal.tag,
                    species: animal.species,
                    age: calculateAgeFormatted(animal.birthdate),
                    sex: animal.sex,
                    weight: animal.weight,
                    birthdate: animal.birthdate.toISOString().split("T")[0],
                    status,
                    health_notes: healthNotes,
                };
            })
        );

        const filteredAnimalSick = animalSick.filter((animal) => animal !== null);

        return filteredAnimalSick as AnimalSickReportResponse[];

    }
}