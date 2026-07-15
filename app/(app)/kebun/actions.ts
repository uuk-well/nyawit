"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { kebun } from "@/lib/schema";
import { requireUser } from "@/lib/session";

export type ActionState = { success?: boolean; error?: string };

export async function createKebun(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) return { error: "Sesi telah berakhir." };

  const nama = String(formData.get("nama") || "").trim();
  const lokasi = String(formData.get("lokasi") || "").trim() || null;
  const luasRaw = String(formData.get("luas") || "").trim();
  const luas = luasRaw ? Number(luasRaw) : null;

  if (!nama) return { error: "Nama kebun wajib diisi." };
  if (luas !== null && (Number.isNaN(luas) || luas < 0)) {
    return { error: "Luas harus berupa angka positif." };
  }

  await db.insert(kebun).values({
    id: randomUUID(),
    userId: user.id,
    nama,
    lokasi,
    luas,
    createdAt: Date.now(),
  });

  revalidatePaths();
  return { success: true };
}

export async function updateKebun(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  if (!user) return { error: "Sesi telah berakhir." };

  const id = String(formData.get("id") || "");
  const nama = String(formData.get("nama") || "").trim();
  const lokasi = String(formData.get("lokasi") || "").trim() || null;
  const luasRaw = String(formData.get("luas") || "").trim();
  const luas = luasRaw ? Number(luasRaw) : null;

  if (!id) return { error: "ID tidak valid." };
  if (!nama) return { error: "Nama kebun wajib diisi." };
  if (luas !== null && (Number.isNaN(luas) || luas < 0)) {
    return { error: "Luas harus berupa angka positif." };
  }

  const existing = await db
    .select()
    .from(kebun)
    .where(eq(kebun.id, id))
    .limit(1);
  if (!existing[0] || existing[0].userId !== user.id) {
    return { error: "Data tidak ditemukan." };
  }

  await db
    .update(kebun)
    .set({ nama, lokasi, luas })
    .where(eq(kebun.id, id));

  revalidatePaths();
  return { success: true };
}

export async function deleteKebun(id: string): Promise<void> {
  const user = await requireUser();
  if (!user) return;
  await db.delete(kebun).where(eq(kebun.id, id));
  revalidatePaths();
}

function revalidatePaths() {
  revalidatePath("/kebun");
  revalidatePath("/dashboard");
  revalidatePath("/panen");
  revalidatePath("/upah");
  revalidatePath("/pengeluaran");
  revalidatePath("/jadwal");
}
