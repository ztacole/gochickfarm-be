"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./db"); // koneksi drizzle
const schema_1 = require("../../drizzle/schema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
const today = new Date();
const date = today.toISOString();
async function seed() {
    console.log("🌱 Seeding database (MariaDB)...");
    const hashedPassword = await bcryptjs_1.default.hash("password", 10);
    // --- ROLES ---
    await db_1.db.insert(schema_1.roles).values([
        { name: "Admin" },
        { name: "Staff" }
    ]);
    const [adminRole, staffRole] = await db_1.db.select().from(schema_1.roles);
    // --- USERS ---
    await db_1.db.insert(schema_1.users).values([
        {
            email: "admin@example.com",
            password: hashedPassword,
            full_name: "Admin Sapi",
            role_id: adminRole.id,
        },
        {
            email: "staff@example.com",
            password: hashedPassword,
            full_name: "Petugas Kandang",
            role_id: staffRole.id,
        }
    ]);
    const [user1, user2] = await db_1.db.select().from(schema_1.users);
    // --- FEEDS ---
    await db_1.db.insert(schema_1.feeds).values([
        { name: "Pakan Sapi Premium", quantity: 100, price_per_unit: 50000 },
        { name: "Pakan Ayam Organik", quantity: 200, price_per_unit: 25000 },
        { name: "Pakan Kambing Hijau", quantity: 150, price_per_unit: 30000 },
    ]);
    const [feed1, feed2, feed3] = await db_1.db.select().from(schema_1.feeds);
    // --- SPECIES ---
    await db_1.db.insert(schema_1.species).values([
        { name: "Kambing" },
        { name: "Ayam" },
    ]);
    const [species1, species2] = await db_1.db.select().from(schema_1.species);
    // --- ANIMALS ---
    await db_1.db.insert(schema_1.animals).values([
        {
            tag: "K-001",
            species_id: Number(species1.id),
            birthdate: new Date(date),
            sex: "Jantan",
            weight: 50.5,
            status: "Hidup",
        },
        {
            tag: "K-002",
            species_id: Number(species1.id),
            birthdate: new Date(date),
            sex: "Betina",
            weight: 50.2,
            status: "Hidup",
        },
        {
            tag: "A-001",
            species_id: Number(species2.id),
            birthdate: new Date(date),
            sex: "Betina",
            weight: 3.4,
            status: "Hidup",
        },
        {
            tag: "A-002",
            species_id: Number(species2.id),
            birthdate: new Date(date),
            sex: "Jantan",
            weight: 3.6,
            status: "Hidup",
        },
        {
            tag: "A-003",
            species_id: Number(species2.id),
            birthdate: new Date(date),
            sex: "Jantan",
            weight: 5,
            status: "Hidup",
        },
    ]);
    const [animal1, animal2, animal3, animal4, animal5] = await db_1.db.select().from(schema_1.animals);
    // --- FEEDING LOGS ---
    await db_1.db.insert(schema_1.feeding_logs).values([
        {
            animal_id: animal1.id,
            feed_id: feed1.id,
            quantity: 5.5,
            new_weight: 52,
            health_notes: '-',
            user_id: user2.id,
        },
        {
            animal_id: animal2.id,
            feed_id: feed3.id,
            quantity: 2.5,
            new_weight: 52,
            health_notes: "-",
            user_id: user2.id,
        },
        {
            animal_id: animal3.id,
            feed_id: feed2.id,
            quantity: 0.5,
            new_weight: 3.6,
            health_notes: "-",
            user_id: user2.id,
        },
        {
            animal_id: animal4.id,
            feed_id: feed2.id,
            quantity: 1,
            new_weight: 3.6,
            health_notes: "Infection",
            user_id: user2.id,
        },
        {
            animal_id: animal5.id,
            feed_id: feed2.id,
            quantity: 0.5,
            new_weight: 5.2,
            health_notes: "-",
            user_id: user2.id,
        },
    ]);
    // --- TRANSACTIONS ---
    await db_1.db.insert(schema_1.transactions).values([
        {
            description: "Penjualan Ayam 1 ekor",
            type: "Pemasukan",
            total: 10000000,
            date: new Date(date),
            user_id: user1.id,
        },
        {
            description: "Pembelian Pakan Ayam",
            type: "Pengeluaran",
            total: 500000,
            date: new Date(date),
            user_id: user2.id,
        },
        {
            description: "Penjualan Kambing",
            type: "Pemasukan",
            total: 3000000,
            date: new Date(date),
            user_id: user1.id,
        },
    ]);
    const [trx1, trx2, trx3] = await db_1.db.select().from(schema_1.transactions);
    // --- TRANSACTION DETAILS ---
    await db_1.db.insert(schema_1.transaction_details).values([
        {
            header_id: trx1.id,
            animal_id: animal3.id,
        },
        {
            header_id: trx3.id,
            animal_id: animal2.id,
        },
        {
            header_id: trx3.id,
            animal_id: animal1.id,
        },
    ]);
    await db_1.db.update(schema_1.animals).set({ status: "Terjual" }).where((0, drizzle_orm_1.eq)(schema_1.animals.id, animal1.id));
    await db_1.db.update(schema_1.animals).set({ status: "Terjual" }).where((0, drizzle_orm_1.eq)(schema_1.animals.id, animal2.id));
    await db_1.db.update(schema_1.animals).set({ status: "Terjual" }).where((0, drizzle_orm_1.eq)(schema_1.animals.id, animal3.id));
    // --- BREEDING LOGS ---
    await db_1.db.insert(schema_1.breeding_logs).values([
        {
            male_id: animal1.id,
            female_id: animal2.id,
            mating_date: new Date(date),
            offspring_count: 1,
            user_id: user2.id,
        },
        {
            male_id: animal1.id,
            female_id: animal3.id,
            mating_date: new Date(date),
            offspring_count: 2,
            user_id: user2.id,
        },
        {
            male_id: animal2.id,
            female_id: animal3.id,
            mating_date: new Date(date),
            offspring_count: 0,
            user_id: user2.id,
        },
    ]);
    console.log("✅ Seeding selesai!");
    process.exit(0);
}
seed().catch((err) => {
    console.error("❌ Gagal seed:", err);
    process.exit(1);
});
