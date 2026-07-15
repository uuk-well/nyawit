import { initDb, db } from "@/lib/db";
import { kebun, panen } from "@/lib/schema";
import { requireUser } from "@/lib/session";
import { desc, eq } from "drizzle-orm";
import { PanenForms, DeletePanenButton } from "./panen-forms";
import { EmptyState } from "@/components/empty-state";
import { formatAngka, formatRupiah, formatTanggal } from "@/lib/format";
import { HARGA_TBS_PER_KG } from "@/lib/config";

export default async function PanenPage() {
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
    .from(panen)
    .where(eq(panen.userId, user.id))
    .orderBy(desc(panen.tanggal), desc(panen.createdAt));

  const totalBerat = rows.reduce((sum, r) => sum + (r.berat || 0), 0);
  const estIncome = totalBerat * HARGA_TBS_PER_KG;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-800">Panen</h1>
        <p className="text-sm text-emerald-600">
          Catat hasil panen tandan buah segar (TBS) per kebun.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-emerald-600">Total Panen</p>
          <p className="text-xl font-bold text-emerald-900">
            {formatAngka(totalBerat)} kg
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-emerald-600">Estimasi Pemasukan</p>
          <p className="text-xl font-bold text-emerald-900">
            {formatRupiah(estIncome)}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-emerald-600">Harga TBS</p>
          <p className="text-xl font-bold text-emerald-900">
            {formatRupiah(HARGA_TBS_PER_KG)}/kg
          </p>
        </div>
      </div>

      <PanenForms kebunList={kebunOptions} />

      {rows.length === 0 ? (
        <EmptyState
          title="Belum ada catatan panen"
          description="Tambahkan panen pertama Anda di atas."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-emerald-50 text-emerald-700">
              <tr>
                <th className="px-4 py-2 font-medium">Tanggal</th>
                <th className="px-4 py-2 font-medium">Kebun</th>
                <th className="px-4 py-2 text-right font-medium">Berat (kg)</th>
                <th className="px-4 py-2 text-right font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-emerald-50">
                  <td className="px-4 py-2 text-emerald-800">
                    {formatTanggal(r.tanggal)}
                  </td>
                  <td className="px-4 py-2 text-emerald-800">
                    {kebunMap.get(r.kebunId) || "-"}
                  </td>
                  <td className="px-4 py-2 text-right text-emerald-900">
                    {formatAngka(r.berat)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <PanenForms
                        kebunList={kebunOptions}
                        item={{
                          id: r.id,
                          kebunId: r.kebunId,
                          tanggal: r.tanggal,
                          berat: r.berat,
                        }}
                      />
                      <DeletePanenButton id={r.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
