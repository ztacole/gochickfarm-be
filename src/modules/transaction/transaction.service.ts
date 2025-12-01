import { and, count, desc, eq } from "drizzle-orm";
import { transactions as transactionTable } from "../../../drizzle/schema";
import { db } from "../../config/db";
import { Meta } from "../../common/meta.type";
import { TransactionResponse } from "./transaction.type";

export class TransactionService {
    static async getTransactions(page: number = 1, limit: number = 10, type: 'Pemasukan' | 'Pengeluaran' | undefined): Promise<{ meta: Meta, data: TransactionResponse[] }> {
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
}