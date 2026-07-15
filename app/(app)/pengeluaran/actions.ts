"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pengeluaran } from "@/lib/schema";
import { requireUser } from "@/lib/session";
import { JENIS_PENGELUARAN } from "@/lib/config";
import type { ActionState } from "../kebun/actions";

export async function createPengeluaran(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) return { error: "Sesi telah berakhir." };

  const kebunId = String(formData.get("kebunId") || "");
  const jenis = String(formData.get("jenis") || "");
  const tanggal = String(formData.get("tanggal") || "");
  const nominalRaw = String(formData.get("nominal") || "").trim();
  const nominal = Number(nominalRaw);
  const keterangan = String(formData.get("keterangan") || "").trim() || null;

  if (!kebunId) return { error: "Pilih kebun terlebih dahulu." };
  if (!JENIS_PENGELUARAN.includes(jenis as (typeof JENIS_PENGELUARAN)[number])) {
    return { error: "Jenis pengeluaran tidak valid." };
  }
  if (!tanggal) return { error: "Tanggal wajib diisi." };
  if (!nominalRaw || Number.isNaN(nominal) || nominal <= 0) {
    return { error: "Nominal harus berupa angka lebih dari 0." };
  }

  await db.insert(pengeluaran).values({
    id: randomUUID(),
    userId: user.id,
    kebunId,
    jenis,
    tanggal,
    nominal,
    keterangan,
  });

  revalidatePaths();
  return { success: true };
}

export async function updatePengeluaran(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) return { error: "Sesi telah berakhir." };

  const id = String(formData.get("id") || "");
  const kebunId = String(formData.get("kebunId") || "");
  const jenis = String(formData.get("jenis") || "");
  const tanggal = String(formData.get("tanggal") || "");
  const nominalRaw = String(formData.get("nominal") || "").trim();
  const nominal = Number(nominalRaw);
  const keterangan = String(formData.get("keterangan") || "").trim() || null;

  if (!id) return { error: "ID tidak valid." };
  if (!kebunId) return { error: "Pilih kebun terlebih dahulu." };
  if (!JENIS_PENGELUARAN.includes(jenis as (typeof JENIS_PENGELUARAN)[number])) {
    return { error: "Jenis pengeluaran tidak valid." };
  }
  if (!tanggal) return { error: "Tanggal wajib diisi." };
  if (!nominalRaw || Number.isNaN(nominal) || nominal <= 0) {
    return { error: "Nominal harus berupa angka lebih dari 0." };
  }

  const existing = await db
    .select()
    .from(pengeluaran)
    .where(eq(pengeluaran.id, id))
    .limit(1);
  if (!existing[0] || existing[0].userId !== user.id) {
    return { error: "Data tidak ditemukan." };
  }

  await db
    .update(pengeluaran)
    .set({ kebunId, jenis, tanggal, nominal, keterangan })
    .where(eq(pengeluaran.id, id));

  revalidatePaths();
  return { success: true };
}

export async function deletePengeluaran(id: string): Promise<void> {
  const user = await requireUser();
  if (!user) return;
  await db.delete(pengeluaran).where(eq(pengeluaran.id, id));
  revalidatePaths();
}

function revalidatePaths() {
  revalidatePath("/pengeluaran");
  revalidatePath("/dashboard");
  revalidatePath("/kebun");
  revalidatePath("/panen");
  revalidatePath("/upah");
  revalidatePath("/jadwal");
}
