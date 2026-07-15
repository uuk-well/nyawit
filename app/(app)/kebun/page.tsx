import { initDb, db } from "@/lib/db";
import { kebun } from "@/lib/schema";
import { requireUser } from "@/lib/session";
import { desc, eq } from "drizzle-orm";
import { KebunForms, DeleteKebunButton } from "./kebun-forms";
import { EmptyState } from "@/components/empty-state";
import { formatAngka } from "@/lib/format";

export default async function KebunPage() {
  const user = await requireUser();
  if (!user) return null;
  await initDb();
  const rows = await db
    .select()
    .from(kebun)
    .where(eq(kebun.userId, user.id))
    .orderBy(desc(kebun.createdAt));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-emerald-800">Kebun</h1>
        <p className="text-sm text-emerald-600">
          Kelola daftar kebun sawit Anda.
        </p>
      </div>

      <KebunForms />

      {rows.length === 0 ? (
        <EmptyState
          title="Belum ada kebun"
          description="Tambahkan kebun pertama Anda di atas untuk mulai mencatat panen."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((k) => (
            <div
              key={k.id}
              className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-emerald-900">{k.nama}</h3>
                  {k.lokasi && (
                    <p className="text-sm text-emerald-600">{k.lokasi}</p>
                  )}
                </div>
                {k.luas !== null && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                    {formatAngka(k.luas)} ha
                  </span>
                )}
              </div>
              <div className="mt-3 flex gap-2">
                <KebunForms
                  item={{
                    id: k.id,
                    nama: k.nama,
                    lokasi: k.lokasi,
                    luas: k.luas,
                  }}
                />
                <DeleteKebunButton id={k.id} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
