"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const schema_1 = require("../../../drizzle/schema");
const db_1 = require("../../config/db");
class TransactionService {
    static async getAll(page = 1, limit = 10, type) {
        const conditions = [];
        if (type) {
            conditions.push((0, drizzle_orm_1.eq)(schema_1.transactions.type, type));
        }
        const transactions = db_1.db.select()
            .from(schema_1.transactions)
            .where((0, drizzle_orm_1.and)(...conditions))
            .orderBy((0, drizzle_orm_1.desc)(schema_1.transactions.date))
            .limit(limit)
            .offset((page - 1) * limit);
        const [totalItemsResult] = await db_1.db.select({ count: (0, drizzle_orm_1.count)(schema_1.transactions.id) }).from(schema_1.transactions);
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
        };
    }
    static async create(data, user) {
        // Run header and details inserts inside a DB transaction so that
        // the header insert is rolled back if details insertion fails.
        return await db_1.db.transaction(async (tx) => {
            const [newTransaction] = await tx.insert(schema_1.transactions).values({
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
                await tx.insert(schema_1.transaction_details).values(transactionDetailsData);
                await tx.update(schema_1.animals)
                    .set({ status: "Terjual" })
                    .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.inArray)(schema_1.animals.id, data.animal_ids), (0, drizzle_orm_1.eq)(schema_1.animals.status, "Hidup")));
            }
            return {
                id: newTransaction.id
            };
        });
    }
    static async getById(id) {
        const [transaction] = await db_1.db.select()
            .from(schema_1.transactions)
            .where((0, drizzle_orm_1.eq)(schema_1.transactions.id, id));
        if (!transaction)
            throw new Error('Transaction not found');
        const transactionDetails = await db_1.db.select()
            .from(schema_1.transaction_details)
            .innerJoin(schema_1.animals, (0, drizzle_orm_1.eq)(schema_1.transaction_details.animal_id, schema_1.animals.id))
            .innerJoin(schema_1.species, (0, drizzle_orm_1.eq)(schema_1.animals.species_id, schema_1.species.id))
            .where((0, drizzle_orm_1.eq)(schema_1.transaction_details.header_id, id));
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
exports.TransactionService = TransactionService;
