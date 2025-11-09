import {
  mysqlTable,
  int,
  varchar,
  text,
  timestamp,
  date,
  double,
  mysqlEnum,
  datetime,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

const timestamps = {
    created_at: timestamp('created_at').defaultNow().notNull(),
    updated_at: timestamp('updated_at').defaultNow().onUpdateNow().notNull(),
};

// =====================
// TABLES
// =====================

export const roles = mysqlTable("roles", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  full_name: varchar("full_name", { length: 255 }).notNull(),
  role_id: int("role_id")
    .notNull()
    .references(() => roles.id, { onDelete: "cascade", onUpdate: "cascade" }),
  session_id: varchar("session_id", { length: 255 }),
  ...timestamps
});

export const feeds = mysqlTable("feeds", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  quantity: double("quantity").notNull(),
  price_per_unit: int("price_per_unit").notNull(),
  ...timestamps
});

export const species = mysqlTable("species", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
});

export const animals = mysqlTable("animals", {
  id: int("id").primaryKey().autoincrement(),
  tag: varchar("tag", { length: 100 }).notNull().unique(),
  species_id: int("species_id")
    .notNull()
    .references(() => species.id, { onDelete: "cascade", onUpdate: "cascade" }),
  birthdate: date("birthdate").notNull(),
  sex: mysqlEnum("sex", ["Jantan", "Betina"]).notNull(),
  weight: double("weight").notNull(),
  status: mysqlEnum("status", ["Hidup", "Mati", "Terjual"]).notNull(),
  ...timestamps
});

export const feeding_logs = mysqlTable("feeding_logs", {
  id: int("id").primaryKey().autoincrement(),
  animal_id: int("animal_id")
    .notNull()
    .references(() => animals.id, { onDelete: "cascade", onUpdate: "cascade" }),
  feed_id: int("feed_id")
    .notNull()
    .references(() => feeds.id, { onDelete: "cascade", onUpdate: "cascade" }),
  quantity: double("quantity").notNull(),
  new_weight: double("new_weight").notNull(),
  health_notes: text("health_notes").notNull(),
  user_id: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  ...timestamps
});

export const transactions = mysqlTable("transactions", {
  id: int("id").primaryKey().autoincrement(),
  description: varchar("description", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["Pemasukan", "Pengeluaran"]).notNull(),
  total: int("total").notNull(),
  date: datetime("date").notNull(),
  user_id: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  ...timestamps
});

export const transaction_details = mysqlTable("transaction_details", {
  id: int("id").primaryKey().autoincrement(),
  header_id: int("header_id")
    .notNull()
    .references(() => transactions.id, { onDelete: "cascade", onUpdate: "cascade" }),
  animal_id: int("animal_id")
    .notNull()
    .references(() => animals.id, { onDelete: "cascade", onUpdate: "cascade" }),
  ...timestamps
});

export const breeding_logs = mysqlTable("breeding_logs", {
  id: int("id").primaryKey().autoincrement(),
  male_id: int("male_id")
    .notNull()
    .references(() => animals.id, { onDelete: "cascade", onUpdate: "cascade" }),
  female_id: int("female_id")
    .notNull()
    .references(() => animals.id, { onDelete: "cascade", onUpdate: "cascade" }),
  mating_date: date("mating_date").notNull(),
  offspring_count: int("offspring_count").default(0).notNull(),
  user_id: int("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" }),
  ...timestamps
});

// =====================
// RELATIONS
// =====================

export const users_relations = relations(users, ({ one, many }) => ({
  role: one(roles, {
    fields: [users.role_id],
    references: [roles.id],
  }),
  feeding_logs: many(feeding_logs),
  transactions: many(transactions),
  breeding_logs: many(breeding_logs),
}));

export const animals_relations = relations(animals, ({ one, many }) => ({
  species: one(species, {
    fields: [animals.species_id],
    references: [species.id],
  }),
  feeding_logs: many(feeding_logs),
  transaction_details: many(transaction_details),
  breeding_logs_as_male: many(breeding_logs, { relationName: "male" }),
  breeding_logs_as_female: many(breeding_logs, { relationName: "female" }),
}));

export const transactions_relations = relations(transactions, ({ one, many }) => ({
  user: one(users, {
    fields: [transactions.user_id],
    references: [users.id],
  }),
  details: many(transaction_details),
}));

export const transaction_details_relations = relations(transaction_details, ({ one }) => ({
  transaction: one(transactions, {
    fields: [transaction_details.header_id],
    references: [transactions.id],
  }),
  animal: one(animals, {
    fields: [transaction_details.animal_id],
    references: [animals.id],
  }),
}));

export const breeding_logs_relations = relations(breeding_logs, ({ one }) => ({
  male: one(animals, {
    fields: [breeding_logs.male_id],
    references: [animals.id],
    relationName: "male",
  }),
  female: one(animals, {
    fields: [breeding_logs.female_id],
    references: [animals.id],
    relationName: "female",
  }),
  user: one(users, {
    fields: [breeding_logs.user_id],
    references: [users.id],
  }),
}));
