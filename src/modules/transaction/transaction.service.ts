import { and, count, desc, eq, inArray } from "drizzle-orm";
import { animals as animalTable, species as speciesTable, transaction_details as transactionDetailsTable, transactions as transactionTable } from "../../../drizzle/schema";
import { db } from "../../config/db";
import { Meta } from "../../common/meta.type";
import { TransactionDetailResponse, TransactionRequest, TransactionResponse } from "./transaction.type";
import { JwtPayload } from "jsonwebtoken";

export class TransactionService {
    static async getAll(page: number = 1, limit: number = 10, type: 'Pemasukan' | 'Pengeluaran' | undefined): Promise<{ meta: Meta, data: TransactionResponse[] }> {
        const conditions = [];
        if (type) {
            conditions.push(eq(transactionTable.type, type));
        }

        const transactions = db.select()
            .from(transactionTable)
            .where(and(...conditions))
            .orderBy(desc(transactionTable.date))
            .limit(limit)
            .offset((page - 1) * limit);

        const [totalItemsResult] = await db.select({ count: count(transactionTable.id) }).from(transactionTable);
        const totalItems = Number(totalItemsResult.count);
        const totalPages = Math.ceil(totalItems / limit);

        const transactionsData = await transactions.execute();
        return {
            meta: {
                current_page: page,
                per_page: limit,
                total_pages: totalPages,
                total_items: totalItems,
            },
            data: transactionsData.map(transaction => ({
                id: transaction.id,
                description: transaction.description,
                type: transaction.type,
                total: transaction.total,
                date: transaction.date.toISOString()
            }))
        }
    }

    static async create(data: TransactionRequest, user: JwtPayload): Promise<any> {
        // Run header and details inserts inside a DB transaction so that
        // the header insert is rolled back if details insertion fails.
        return await db.transaction(async (tx) => {
            const [newTransaction] = await tx.insert(transactionTable).values({
                type: data.type,
                description: data.description,
                total: data.total,
                date: new Date(data.date),
                user_id: user.id
            }).$returningId();

            if (data.type === "Pemasukan" && data.animal_ids && data.animal_ids.length > 0) {
                const transactionDetailsData = data.animal_ids.map(animalId => ({
                    header_id: newTransaction.id,
                    animal_id: animalId
                }));
                await tx.insert(transactionDetailsTable).values(transactionDetailsData);
                await tx.update(animalTable)
                    .set({ status: "Terjual" })
                    .where(and(
                        inArray(animalTable.id, data.animal_ids),
                        eq(animalTable.status, "Hidup")
                    ));
            }

            return {
                id: newTransaction.id
            };
        });
    }

    static async getById(id: number): Promise<TransactionDetailResponse> {
        const [transaction] = await db.select()
            .from(transactionTable)
            .where(eq(transactionTable.id, id));
        if (!transaction) throw new Error('Transaction not found');

        const transactionDetails = await db.select()
            .from(transactionDetailsTable)
            .innerJoin(animalTable, eq(transactionDetailsTable.animal_id, animalTable.id))
            .innerJoin(speciesTable, eq(animalTable.species_id, speciesTable.id))
            .where(eq(transactionDetailsTable.header_id, id));
        return {
            id: transaction.id,
            description: transaction.description,
            type: transaction.type,
            total: transaction.total,
            date: transaction.date.toISOString(),
            animals: transactionDetails.map(detail => ({
                id: detail.animals.id,
                tag: detail.animals.tag,
                species: detail.species.name,
                status: detail.animals.status
            }))
        };
    }
}