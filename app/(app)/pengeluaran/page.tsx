import { initDb, db } from "@/lib/db";
import { kebun, pengeluaran } from "@/lib/schema";
import { requireUser } from "@/lib/session";
import { desc, eq } from "drizzle-orm";
import { PengeluaranForms, DeletePengeluaranButton } from "./pengeluaran-forms";
import { EmptyState } from "@/components/empty-state";
import { formatAngka, formatRupiah, formatTanggal } from "@/lib/format";

export default async function PengeluaranPage() {
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
    .from(pengeluaran)
    .where(eq(pengeluaran.userId, user.id))
    .orderBy(desc(pengeluaran.tanggal));

  const total = rows.reduce((sum, r) => sum + (r.nominal || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-800">Pengeluaran</h1>
        <p className="text-sm text-emerald-600">
          Catat pembelian pupuk, herbisida, dan biaya lainnya.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-emerald-600">Total Pengeluaran</p>
          <p className="text-xl font-bold text-emerald-900">
            {formatRupiah(total)}
          </p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
          <p className="text-sm text-emerald-600">Jumlah Catatan</p>
          <p className="text-xl font-bold text-emerald-900">
            {formatAngka(rows.length)}
          </p>
        </div>
      </div>

      <PengeluaranForms kebunList={kebunOptions} />

      {rows.length === 0 ? (
        <EmptyState
          title="Belum ada catatan pengeluaran"
          description="Tambahkan pengeluaran pertama Anda di atas."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-emerald-50 text-emerald-700">
              <tr>
                <th className="px-4 py-2 font-medium">Tanggal</th>
                <th className="px-4 py-2 font-medium">Kebun</th>
                <th className="px-4 py-2 font-medium">Jenis</th>
                <th className="px-4 py-2 text-right font-medium">Nominal</th>
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
                  <td className="px-4 py-2 text-emerald-800">{r.jenis}</td>
                  <td className="px-4 py-2 text-right text-emerald-900">
                    {formatRupiah(r.nominal)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex justify-end gap-2">
                      <PengeluaranForms
                        kebunList={kebunOptions}
                        item={{
                          id: r.id,
                          kebunId: r.kebunId,
                          jenis: r.jenis,
                          tanggal: r.tanggal,
                          nominal: r.nominal,
                          keterangan: r.keterangan,
                        }}
                      />
                      <DeletePengeluaranButton id={r.id} />
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
