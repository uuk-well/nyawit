import Link from "next/link";
import { initDb, db } from "@/lib/db";
import { kebun, panen, upah, pengeluaran, jadwalPanen } from "@/lib/schema";
import { requireUser } from "@/lib/session";
import { eq } from "drizzle-orm";
import { StatCard } from "./stat-card";
import { HarvestChart } from "./harvest-chart";
import { NAMA_BULAN, formatAngka, formatRupiah, formatTanggal, hariIni } from "@/lib/format";
import { HARGA_TBS_PER_KG } from "@/lib/config";
import { Leaf, Wallet, Sprout, CalendarClock, TrendingUp } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireUser();
  if (!user) return null;
  await initDb();

  const [kebunRows, panenRows, upahRows, pengeluaranRows, jadwalRows] =
    await Promise.all([
      db.select().from(kebun).where(eq(kebun.userId, user.id)),
      db.select().from(panen).where(eq(panen.userId, user.id)),
      db.select().from(upah).where(eq(upah.userId, user.id)),
      db.select().from(pengeluaran).where(eq(pengeluaran.userId, user.id)),
      db
        .select()
        .from(jadwalPanen)
        .where(eq(jadwalPanen.userId, user.id))
        .orderBy(jadwalPanen.tanggal),
    ]);

  const totalBerat = panenRows.reduce((s, r) => s + (r.berat || 0), 0);
  const estIncome = totalBerat * HARGA_TBS_PER_KG;
  const totalUpah = upahRows.reduce((s, r) => s + (r.nominal || 0), 0);
  const totalPengeluaran = pengeluaranRows.reduce(
    (s, r) => s + (r.nominal || 0),
    0,
  );
  const netIncome = estIncome - totalUpah - totalPengeluaran;

  const kebunMap = new Map(kebunRows.map((k) => [k.id, k.nama]));

  const bulanMap = new Map<string, number>();
  for (const r of panenRows) {
    const key = r.tanggal.slice(0, 7);
    bulanMap.set(key, (bulanMap.get(key) || 0) + (r.berat || 0));
  }
  const now = new Date();
  const labels: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
    );
  }
  const chartData = labels.map((l) => ({
    name: NAMA_BULAN[parseInt(l.slice(5), 10) - 1],
    berat: Number((bulanMap.get(l) || 0).toFixed(1)),
  }));

  const today = hariIni();
  const mendekat = jadwalRows.filter((j) => !j.selesai && j.tanggal >= today);

  const recentPanen = panenRows
    .slice()
    .sort((a, b) =>
      b.tanggal === a.tanggal
        ? (b.createdAt || 0) - (a.createdAt || 0)
        : b.tanggal < a.tanggal ? -1 : 1,
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-800">Dashboard</h1>
        <p className="text-sm text-emerald-600">
          Ringkasan kebun sawit Anda.
        </p>
      </div>

      {mendekat.length > 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <CalendarClock className="mt-0.5 h-5 w-5 text-amber-600" />
          <div className="text-sm text-amber-800">
            <p className="font-semibold">Jadwal panen mendekat</p>
            <ul className="mt-1 space-y-0.5">
              {mendekat.slice(0, 3).map((j) => (
                <li key={j.id}>
                  {formatTanggal(j.tanggal)} — {kebunMap.get(j.kebunId) || "-"}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Total Panen"
          value={`${formatAngka(totalBerat)} kg`}
          icon={<Leaf className="h-5 w-5" />}
        />
        <StatCard
          label="Estimasi Pemasukan"
          value={formatRupiah(estIncome)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          label="Pendapatan Bersih"
          value={formatRupiah(netIncome)}
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          label="Total Upah"
          value={formatRupiah(totalUpah)}
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          label="Total Pengeluaran"
          value={formatRupiah(totalPengeluaran)}
          icon={<Wallet className="h-5 w-5" />}
        />
        <StatCard
          label="Jumlah Kebun"
          value={formatAngka(kebunRows.length)}
          icon={<Sprout className="h-5 w-5" />}
        />
      </div>

      <HarvestChart data={chartData} />

      <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-emerald-800">Panen Terbaru</h3>
          <Link href="/panen" className="text-sm font-medium text-emerald-700 hover:underline">
            Lihat semua
          </Link>
        </div>
        {recentPanen.length === 0 ? (
          <p className="text-sm text-emerald-600">Belum ada catatan panen.</p>
        ) : (
          <ul className="divide-y divide-emerald-50">
            {recentPanen.map((r) => (
              <li key={r.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-emerald-800">
                  {formatTanggal(r.tanggal)} · {kebunMap.get(r.kebunId) || "-"}
                </span>
                <span className="font-medium text-emerald-900">
                  {formatAngka(r.berat)} kg
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
