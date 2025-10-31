# GoChick Farm (Backend)

Backend API untuk aplikasi manajemen peternakan "GoChick Farm" — dibangun dengan Node.js, TypeScript, Express dan Drizzle ORM (MySQL).

## Ringkasan

Repository ini berisi backend untuk mengelola data pengguna, hewan, pakan, log pemberian pakan, transaksi, dan pencatatan kawin (breeding) pada sebuah peternakan.

Tech stack utama:
- Node.js + TypeScript
- Express
- Drizzle ORM (MySQL)
- mysql2
- dotenv

## Persyaratan

- Node.js (LTS) dan npm
- MySQL server
- TypeScript (terpasang via devDependencies)

## Setup cepat

1. Clone repository dan masuk ke folder:

   ```powershell
   cd "your-directory\gochickfarm-be"
   npm install
   ```

2. Salin file contoh .env dan sesuaikan koneksi database:

   ```powershell
   copy .env.example .env
   # lalu edit .env sesuai environment Anda (DATABASE_URL, PORT, JWT_SECRET)
   ```

   Contoh .env (project sudah menyertakan file `.env` untuk dev):

   ```env
   DATABASE_URL="mysql://root:@localhost:3306/gochickfarm"
   PORT=3000
   JWT_SECRET="secret banget"
   ```

3. Jalankan migrasi/schema/seed

- Generate atau push schema Drizzle jika diperlukan:

  ```powershell
  npm run drizzle:gen   # generate (opsional)
  npm run drizzle:push  # push ke database
  ```

- Isi data awal (seed):

  ```powershell
  npm run seed
  ```

## Skrip npm penting

- `npm run dev` — jalankan server dalam mode pengembangan (nodemon pada `src/server.ts`).
- `npm run build` — compile TypeScript ke `dist/`.
- `npm run start` — jalankan build (`node dist/src/server.js`).
- `npm run seed` — jalankan seed script (`src/config/seed.ts`).
- `npm run drizzle:gen` — generate migration/schema (drizzle-kit).
- `npm run drizzle:push` — push schema ke DB (drizzle-kit).

## Struktur singkat proyek

- `drizzle/schema.ts` — definisi tabel Drizzle (roles, users, animals, feeds, feeding_logs, transactions, transaction_details, breeding_logs).
- `src/` — kode sumber TypeScript
  - `src/server.ts`, `src/app.ts` — entry point server
  - `src/modules/` — modul fitur (auth, user, animal, dashboard, dsb.)
  - `src/middleware/` — middleware express (auth, error handling)
  - `src/config/db.ts` — koneksi database

Modul utama yang ada saat ini:
- `auth` — autentikasi (login/register, JWT)
- `user` — manajemen pengguna
- `animal` — manajemen hewan
- `dashboard` — endpoint ringkasan/statistik

## Menjalankan secara lokal

Development:

```powershell
npm run dev
```

Build + start (production-ish):

```powershell
npm run build; npm run start
```

## Environment & Keamanan

- Simpan `JWT_SECRET` dan kredensial DB di `.env`. Jangan commit `.env` ke repo publik.
- Saat production, gunakan user DB dengan password kuat dan non-root, serta atur akses jaringan database.

## Testing & Quality gates

Proyek ini tidak menyertakan test otomatis saat ini. Pastikan TypeScript build lulus setelah dependency terpasang:

```powershell
npm run build
```

Jika ada error build/TS, periksa pesan tsc dan dependencies.

## Contributing

- Buat issue terlebih dahulu untuk fitur besar.
- Fork, buat branch fitur, buka pull request dengan deskripsi perubahan.

## Lisensi

Tambahkan file LICENSE jika ingin menetapkan lisensi. Saat ini tidak disertakan lisensi dalam repo.

---

Jika ingin saya tambahkan bagian API docs (daftar endpoint), contoh request/response, atau instruksi deploy ke server, beri tahu — saya bisa tambahkan secara terperinci.