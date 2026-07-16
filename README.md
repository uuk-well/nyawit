# 🌿 Nyawit

Asisten kebun sawit — catat panen, upah, pengeluaran, dan jadwal kebun sawit Anda dalam satu aplikasi web.

## Fitur

- **Autentikasi** — daftar & masuk akun (Better Auth).
- **Kebun** — kelola daftar kebun (nama, lokasi, luas).
- **Panen** — catat hasil panen TBS per kebun; otomatis menghitung estimasi pemasukan (harga TBS/ kg).
- **Upah** — catat upah panen, tebas, dan lainnya.
- **Pengeluaran** — catat pupuk, herbisida, dan biaya lainnya.
- **Jadwal** — atur rencana panen dan tandai bila sudah selesai.
- **Dashboard** — ringkasan: total panen, estimasi pemasukan, pendapatan bersih, serta grafik panen 6 bulan terakhir.

## Tech Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Drizzle ORM + libSQL (SQLite lokal / Turso)
- Better Auth
- Recharts

## Cara Menjalankan (Lokal)

1. Install dependency:
   ```bash
   npm install
   ```
2. Salin `.env.example` menjadi `.env.local` dan isi `BETTER_AUTH_SECRET`
   (generate dengan `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
3. Jalankan development server:
   ```bash
   npm run dev
   ```
4. Buka http://localhost:3000 dan daftar akun baru.

Tabel database dibuat otomatis saat server pertama kali dijalankan.

## Deploy ke Vercel

1. Set environment variables di Vercel:
   - `BETTER_AUTH_SECRET`
   - `BETTER_AUTH_URL` → URL produksi (mis. `https://nyawit.vercel.app`)
   - `NEXT_PUBLIC_BETTER_AUTH_URL` → sama
   - `DATABASE_PATH` → `libsql://<nama-db>.turso.io`
   - `DATABASE_AUTH_TOKEN` → token dari Turso
2. Push repo ke GitHub dan hubungkan ke Vercel.

## Struktur

```
lib/            # schema DB, koneksi, auth, helper
app/(app)/      # halaman terproteksi (kebun, panen, upah, pengeluaran, jadwal, dashboard)
app/login       # halaman masuk
app/signup      # halaman daftar
components/      # komponen UI (nav, auth, empty state)
```
"# nyawit" 
