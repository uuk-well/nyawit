"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { jadwalPanen } from "@/lib/schema";
import { requireUser } from "@/lib/session";
import type { ActionState } from "../kebun/actions";

export async function createJadwal(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) return { error: "Sesi telah berakhir." };

  const kebunId = String(formData.get("kebunId") || "");
  const tanggal = String(formData.get("tanggal") || "");
  const catatan = String(formData.get("catatan") || "").trim() || null;

  if (!kebunId) return { error: "Pilih kebun terlebih dahulu." };
  if (!tanggal) return { error: "Tanggal jadwal wajib diisi." };

  await db.insert(jadwalPanen).values({
    id: randomUUID(),
    userId: user.id,
    kebunId,
    tanggal,
    catatan,
    selesai: false,
    createdAt: Date.now(),
  });

  revalidatePaths();
  return { success: true };
}

export async function updateJadwal(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) return { error: "Sesi telah berakhir." };

  const id = String(formData.get("id") || "");
  const kebunId = String(formData.get("kebunId") || "");
  const tanggal = String(formData.get("tanggal") || "");
  const catatan = String(formData.get("catatan") || "").trim() || null;

  if (!id) return { error: "ID tidak valid." };
  if (!kebunId) return { error: "Pilih kebun terlebih dahulu." };
  if (!tanggal) return { error: "Tanggal jadwal wajib diisi." };

  const existing = await db
    .select()
    .from(jadwalPanen)
    .where(eq(jadwalPanen.id, id))
    .limit(1);
  if (!existing[0] || existing[0].userId !== user.id) {
    return { error: "Data tidak ditemukan." };
  }

  await db
    .update(jadwalPanen)
    .set({ kebunId, tanggal, catatan })
    .where(eq(jadwalPanen.id, id));

  revalidatePaths();
  return { success: true };
}

export async function toggleSelesai(id: string): Promise<void> {
  const user = await requireUser();
  if (!user) return;
  const existing = await db
    .select()
    .from(jadwalPanen)
    .where(eq(jadwalPanen.id, id))
    .limit(1);
  if (!existing[0] || existing[0].userId !== user.id) return;
  await db
    .update(jadwalPanen)
    .set({ selesai: !existing[0].selesai })
    .where(eq(jadwalPanen.id, id));
  revalidatePaths();
}

export async function deleteJadwal(id: string): Promise<void> {
  const user = await requireUser();
  if (!user) return;
  await db.delete(jadwalPanen).where(eq(jadwalPanen.id, id));
  revalidatePaths();
}

function revalidatePaths() {
  revalidatePath("/jadwal");
  revalidatePath("/dashboard");
  revalidatePath("/kebun");
  revalidatePath("/panen");
  revalidatePath("/upah");
  revalidatePath("/pengeluaran");
}
