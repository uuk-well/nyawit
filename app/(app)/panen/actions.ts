"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { panen } from "@/lib/schema";
import { requireUser } from "@/lib/session";
import type { ActionState } from "../kebun/actions";

export async function createPanen(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) return { error: "Sesi telah berakhir." };

  const kebunId = String(formData.get("kebunId") || "");
  const tanggal = String(formData.get("tanggal") || "");
  const beratRaw = String(formData.get("berat") || "").trim();
  const berat = Number(beratRaw);

  if (!kebunId) return { error: "Pilih kebun terlebih dahulu." };
  if (!tanggal) return { error: "Tanggal wajib diisi." };
  if (!beratRaw || Number.isNaN(berat) || berat <= 0) {
    return { error: "Berat harus berupa angka lebih dari 0." };
  }

  await db.insert(panen).values({
    id: randomUUID(),
    userId: user.id,
    kebunId,
    tanggal,
    berat,
    createdAt: Date.now(),
  });

  revalidatePaths();
  return { success: true };
}

export async function updatePanen(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) return { error: "Sesi telah berakhir." };

  const id = String(formData.get("id") || "");
  const kebunId = String(formData.get("kebunId") || "");
  const tanggal = String(formData.get("tanggal") || "");
  const beratRaw = String(formData.get("berat") || "").trim();
  const berat = Number(beratRaw);

  if (!id) return { error: "ID tidak valid." };
  if (!kebunId) return { error: "Pilih kebun terlebih dahulu." };
  if (!tanggal) return { error: "Tanggal wajib diisi." };
  if (!beratRaw || Number.isNaN(berat) || berat <= 0) {
    return { error: "Berat harus berupa angka lebih dari 0." };
  }

  const existing = await db
    .select()
    .from(panen)
    .where(eq(panen.id, id))
    .limit(1);
  if (!existing[0] || existing[0].userId !== user.id) {
    return { error: "Data tidak ditemukan." };
  }

  await db
    .update(panen)
    .set({ kebunId, tanggal, berat })
    .where(eq(panen.id, id));

  revalidatePaths();
  return { success: true };
}

export async function deletePanen(id: string): Promise<void> {
  const user = await requireUser();
  if (!user) return;
  await db.delete(panen).where(eq(panen.id, id));
  revalidatePaths();
}

function revalidatePaths() {
  revalidatePath("/panen");
  revalidatePath("/dashboard");
  revalidatePath("/kebun");
  revalidatePath("/upah");
  revalidatePath("/pengeluaran");
  revalidatePath("/jadwal");
}
