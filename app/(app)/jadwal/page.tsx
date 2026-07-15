import { initDb, db } from "@/lib/db";
import { kebun, jadwalPanen } from "@/lib/schema";
import { requireUser } from "@/lib/session";
import { asc, eq } from "drizzle-orm";
import { JadwalForms, JadwalActions } from "./jadwal-forms";
import { EmptyState } from "@/components/empty-state";
import { formatTanggal, hariIni } from "@/lib/format";
import { Check } from "lucide-react";
import { toggleSelesai } from "./actions";

export default async function JadwalPage() {
  const user = await requireUser();
  if (!user) return null;
  await initDb();

  const kebunRows = await db
    .select()
    .from(kebun)
    .where(eq(kebun.userId, user.id));
  const kebunMap = new Map(kebunRows.map((k) => [k.id, k.nama]));
  const kebunOptions = kebunRows.map((k) => ({ id: k.id, nama: k.nama }));

  const rows = await db
    .select()
    .from(jadwalPanen)
    .where(eq(jadwalPanen.userId, user.id))
    .orderBy(asc(jadwalPanen.tanggal));

  const today = hariIni();
  const mendekat = rows.filter((r) => !r.selesai && r.tanggal >= today).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-800">Jadwal Panen</h1>
        <p className="text-sm text-emerald-600">
          Atur rencana panen dan tandai bila sudah selesai.
        </p>
      </div>

      <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
        <p className="text-sm text-emerald-600">Jadwal Mendatang</p>
        <p className="text-xl font-bold text-emerald-900">
          {mendekat} jadwal
        </p>
      </div>

      <JadwalForms kebunList={kebunOptions} />

      {rows.length === 0 ? (
        <EmptyState
          title="Belum ada jadwal"
          description="Tambahkan jadwal panen pertama Anda di atas."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((r) => (
            <div
              key={r.id}
              className={`rounded-2xl border p-4 shadow-sm ${
                r.selesai
                  ? "border-emerald-100 bg-emerald-50/50"
                  : "border-emerald-100 bg-white"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-emerald-900">
                    {kebunMap.get(r.kebunId) || "-"}
                  </h3>
                  <p className="text-sm text-emerald-600">
                    {formatTanggal(r.tanggal)}
                  </p>
                  {r.catatan && (
                    <p className="mt-1 text-sm text-emerald-700">{r.catatan}</p>
                  )}
                </div>
                <form action={toggleSelesai.bind(null, r.id)}>
                  <button
                    type="submit"
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm font-medium ${
                      r.selesai
                        ? "bg-emerald-600 text-white"
                        : "border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    }`}
                  >
                    <Check className="h-4 w-4" />
                    {r.selesai ? "Selesai" : "Tandai"}
                  </button>
                </form>
              </div>
              <div className="mt-3 flex gap-2">
                <JadwalForms
                  kebunList={kebunOptions}
                  item={{
                    id: r.id,
                    kebunId: r.kebunId,
                    tanggal: r.tanggal,
                    catatan: r.catatan,
                  }}
                />
                <JadwalActions id={r.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
