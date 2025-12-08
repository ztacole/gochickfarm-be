"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.breeding_logs_relations = exports.transaction_details_relations = exports.transactions_relations = exports.animals_relations = exports.users_relations = exports.breeding_logs = exports.transaction_details = exports.transactions = exports.feeding_logs = exports.animals = exports.species = exports.feeds = exports.users = exports.roles = void 0;
const mysql_core_1 = require("drizzle-orm/mysql-core");
const drizzle_orm_1 = require("drizzle-orm");
const timestamps = {
    created_at: (0, mysql_core_1.timestamp)('created_at').defaultNow().notNull(),
    updated_at: (0, mysql_core_1.timestamp)('updated_at').defaultNow().onUpdateNow().notNull(),
};
// =====================
// TABLES
// =====================
exports.roles = (0, mysql_core_1.mysqlTable)("roles", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)("name", { length: 100 }).notNull(),
});
exports.users = (0, mysql_core_1.mysqlTable)("users", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    email: (0, mysql_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    password: (0, mysql_core_1.varchar)("password", { length: 255 }).notNull(),
    full_name: (0, mysql_core_1.varchar)("full_name", { length: 255 }).notNull(),
    role_id: (0, mysql_core_1.int)("role_id")
        .notNull()
        .references(() => exports.roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
    session_id: (0, mysql_core_1.varchar)("session_id", { length: 255 }),
    ...timestamps
});
exports.feeds = (0, mysql_core_1.mysqlTable)("feeds", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)("name", { length: 255 }).notNull(),
    quantity: (0, mysql_core_1.double)("quantity").notNull(),
    price_per_unit: (0, mysql_core_1.int)("price_per_unit").notNull(),
    ...timestamps
});
exports.species = (0, mysql_core_1.mysqlTable)("species", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    name: (0, mysql_core_1.varchar)("name", { length: 100 }).notNull(),
});
exports.animals = (0, mysql_core_1.mysqlTable)("animals", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    tag: (0, mysql_core_1.varchar)("tag", { length: 100 }).notNull().unique(),
    species_id: (0, mysql_core_1.int)("species_id")
        .notNull()
        .references(() => exports.species.id, { onDelete: "cascade", onUpdate: "cascade" }),
    birthdate: (0, mysql_core_1.date)("birthdate").notNull(),
    sex: (0, mysql_core_1.mysqlEnum)("sex", ["Jantan", "Betina"]).notNull(),
    weight: (0, mysql_core_1.double)("weight").notNull(),
    status: (0, mysql_core_1.mysqlEnum)("status", ["Hidup", "Mati", "Terjual"]).notNull(),
    ...timestamps
});
exports.feeding_logs = (0, mysql_core_1.mysqlTable)("feeding_logs", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    animal_id: (0, mysql_core_1.int)("animal_id")
        .notNull()
        .references(() => exports.animals.id, { onDelete: "cascade", onUpdate: "cascade" }),
    feed_id: (0, mysql_core_1.int)("feed_id")
        .notNull()
        .references(() => exports.feeds.id, { onDelete: "cascade", onUpdate: "cascade" }),
    quantity: (0, mysql_core_1.double)("quantity").notNull(),
    new_weight: (0, mysql_core_1.double)("new_weight").notNull(),
    health_notes: (0, mysql_core_1.text)("health_notes").notNull(),
    user_id: (0, mysql_core_1.int)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ...timestamps
});
exports.transactions = (0, mysql_core_1.mysqlTable)("transactions", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    description: (0, mysql_core_1.varchar)("description", { length: 255 }).notNull(),
    type: (0, mysql_core_1.mysqlEnum)("type", ["Pemasukan", "Pengeluaran"]).notNull(),
    total: (0, mysql_core_1.int)("total").notNull(),
    date: (0, mysql_core_1.datetime)("date").notNull(),
    user_id: (0, mysql_core_1.int)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ...timestamps
});
exports.transaction_details = (0, mysql_core_1.mysqlTable)("transaction_details", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    header_id: (0, mysql_core_1.int)("header_id")
        .notNull()
        .references(() => exports.transactions.id, { onDelete: "cascade", onUpdate: "cascade" }),
    animal_id: (0, mysql_core_1.int)("animal_id")
        .notNull()
        .references(() => exports.animals.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ...timestamps
});
exports.breeding_logs = (0, mysql_core_1.mysqlTable)("breeding_logs", {
    id: (0, mysql_core_1.int)("id").primaryKey().autoincrement(),
    male_id: (0, mysql_core_1.int)("male_id")
        .notNull()
        .references(() => exports.animals.id, { onDelete: "cascade", onUpdate: "cascade" }),
    female_id: (0, mysql_core_1.int)("female_id")
        .notNull()
        .references(() => exports.animals.id, { onDelete: "cascade", onUpdate: "cascade" }),
    mating_date: (0, mysql_core_1.date)("mating_date").notNull(),
    offspring_count: (0, mysql_core_1.int)("offspring_count").default(0).notNull(),
    user_id: (0, mysql_core_1.int)("user_id")
        .notNull()
        .references(() => exports.users.id, { onDelete: "cascade", onUpdate: "cascade" }),
    ...timestamps
});
// =====================
// RELATIONS
// =====================
exports.users_relations = (0, drizzle_orm_1.relations)(exports.users, ({ one, many }) => ({
    role: one(exports.roles, {
        fields: [exports.users.role_id],
        references: [exports.roles.id],
    }),
    feeding_logs: many(exports.feeding_logs),
    transactions: many(exports.transactions),
    breeding_logs: many(exports.breeding_logs),
}));
exports.animals_relations = (0, drizzle_orm_1.relations)(exports.animals, ({ one, many }) => ({
    species: one(exports.species, {
        fields: [exports.animals.species_id],
        references: [exports.species.id],
    }),
    feeding_logs: many(exports.feeding_logs),
    transaction_details: many(exports.transaction_details),
    breeding_logs_as_male: many(exports.breeding_logs, { relationName: "male" }),
    breeding_logs_as_female: many(exports.breeding_logs, { relationName: "female" }),
}));
exports.transactions_relations = (0, drizzle_orm_1.relations)(exports.transactions, ({ one, many }) => ({
    user: one(exports.users, {
        fields: [exports.transactions.user_id],
        references: [exports.users.id],
    }),
    details: many(exports.transaction_details),
}));
exports.transaction_details_relations = (0, drizzle_orm_1.relations)(exports.transaction_details, ({ one }) => ({
    transaction: one(exports.transactions, {
        fields: [exports.transaction_details.header_id],
        references: [exports.transactions.id],
    }),
    animal: one(exports.animals, {
        fields: [exports.transaction_details.animal_id],
        references: [exports.animals.id],
    }),
}));
exports.breeding_logs_relations = (0, drizzle_orm_1.relations)(exports.breeding_logs, ({ one }) => ({
    male: one(exports.animals, {
        fields: [exports.breeding_logs.male_id],
        references: [exports.animals.id],
        relationName: "male",
    }),
    female: one(exports.animals, {
        fields: [exports.breeding_logs.female_id],
        references: [exports.animals.id],
        relationName: "female",
    }),
    user: one(exports.users, {
        fields: [exports.breeding_logs.user_id],
        references: [exports.users.id],
    }),
}));
