"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { upah } from "@/lib/schema";
import { requireUser } from "@/lib/session";
import { JENIS_UPAH } from "@/lib/config";
import type { ActionState } from "../kebun/actions";

export async function createUpah(
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
  if (!JENIS_UPAH.includes(jenis as (typeof JENIS_UPAH)[number])) {
    return { error: "Jenis upah tidak valid." };
  }
  if (!tanggal) return { error: "Tanggal wajib diisi." };
  if (!nominalRaw || Number.isNaN(nominal) || nominal <= 0) {
    return { error: "Nominal harus berupa angka lebih dari 0." };
  }

  await db.insert(upah).values({
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

export async function updateUpah(
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
  if (!JENIS_UPAH.includes(jenis as (typeof JENIS_UPAH)[number])) {
    return { error: "Jenis upah tidak valid." };
  }
  if (!tanggal) return { error: "Tanggal wajib diisi." };
  if (!nominalRaw || Number.isNaN(nominal) || nominal <= 0) {
    return { error: "Nominal harus berupa angka lebih dari 0." };
  }

  const existing = await db
    .select()
    .from(upah)
    .where(eq(upah.id, id))
    .limit(1);
  if (!existing[0] || existing[0].userId !== user.id) {
    return { error: "Data tidak ditemukan." };
  }

  await db
    .update(upah)
    .set({ kebunId, jenis, tanggal, nominal, keterangan })
    .where(eq(upah.id, id));

  revalidatePaths();
  return { success: true };
}

export async function deleteUpah(id: string): Promise<void> {
  const user = await requireUser();
  if (!user) return;
  await db.delete(upah).where(eq(upah.id, id));
  revalidatePaths();
}

function revalidatePaths() {
  revalidatePath("/upah");
  revalidatePath("/dashboard");
  revalidatePath("/kebun");
  revalidatePath("/panen");
  revalidatePath("/pengeluaran");
  revalidatePath("/jadwal");
}
