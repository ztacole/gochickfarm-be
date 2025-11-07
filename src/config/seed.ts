import { db } from "./db"; // koneksi drizzle
import {
  roles,
  users,
  feeds,
  species,
  animals,
  feeding_logs,
  transactions,
  transaction_details,
  breeding_logs,
} from "../../drizzle/schema";
import bcrypt from "bcryptjs";

const today = new Date();
const date = today.toISOString();

async function seed() {
  console.log("🌱 Seeding database (MariaDB)...");
  const hashedPassword = await bcrypt.hash("password", 10);

  // --- ROLES ---
  await db.insert(roles).values([
    { name: "Admin" },
    { name: "Staff" }
  ]);
  const [adminRole, staffRole] = await db.select().from(roles);

  // --- USERS ---
  await db.insert(users).values([
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
  const [user1, user2] = await db.select().from(users);

  // --- FEEDS ---
  await db.insert(feeds).values([
    { name: "Pakan Sapi Premium", quantity: 100, price_per_unit: 50000 },
    { name: "Pakan Ayam Organik", quantity: 200, price_per_unit: 25000 },
    { name: "Pakan Kambing Hijau", quantity: 150, price_per_unit: 30000 },
  ]);
  const [feed1, feed2, feed3] = await db.select().from(feeds);

  // --- SPECIES ---
  await db.insert(species).values([
    { name: "Kambing" },
    { name: "Ayam" },
  ]);
  const [species1, species2] = await db.select().from(species);

  // --- ANIMALS ---
  await db.insert(animals).values([
    {
      tag: "K-001",
      species_id: Number(species1.id),
      birthdate: new Date(date),
      sex: "Jantan",
      weight: 350.5,
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
  ]);
  const [animal1, animal2, animal3] = await db.select().from(animals);

  // --- FEEDING LOGS ---
  await db.insert(feeding_logs).values([
    {
      animal_id: animal1.id,
      feed_id: feed1.id,
      quantity: 5.5,
      new_weight: 360,
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
  ]);

  // --- TRANSACTIONS ---
  await db.insert(transactions).values([
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
  const [trx1, trx2, trx3] = await db.select().from(transactions);

  // --- TRANSACTION DETAILS ---
  await db.insert(transaction_details).values([
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

  // --- BREEDING LOGS ---
  await db.insert(breeding_logs).values([
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
