import { and, count, desc, eq } from "drizzle-orm";
import { transaction_details as transactionDetailsTable, transactions as transactionTable } from "../../../drizzle/schema";
import { db } from "../../config/db";
import { Meta } from "../../common/meta.type";
import { TransactionRequest, TransactionResponse } from "./transaction.type";
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
            }

            return {
                id: newTransaction.id
            };
        });
    }
}