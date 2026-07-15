"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { Pencil, X, Trash2 } from "lucide-react";
import { createJadwal, updateJadwal, deleteJadwal } from "./actions";
import { type ActionState } from "../kebun/actions";
import { hariIni } from "@/lib/format";

export type KebunOption = { id: string; nama: string };

type Item = {
  id: string;
  kebunId: string;
  tanggal: string;
  catatan: string | null;
};

export function JadwalForms({
  item,
  kebunList,
}: {
  item?: Item;
  kebunList: KebunOption[];
}) {
  const isEdit = Boolean(item);
  const [open, setOpen] = useState(!isEdit);
  const [state, formAction] = useActionState<ActionState | undefined, FormData>(
    isEdit ? updateJadwal : createJadwal,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state?.success) return;
    const t = setTimeout(() => {
      if (isEdit) setOpen(false);
      else formRef.current?.reset();
    }, 0);
    return () => clearTimeout(t);
  }, [state, isEdit]);

  if (kebunList.length === 0 && !isEdit) {
    return (
      <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Buat kebun terlebih dahulu di menu Kebun sebelum mengatur jadwal.
      </p>
    );
  }

  if (isEdit && !open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
      >
        <Pencil className="h-4 w-4" /> Edit
      </button>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm"
    >
      {isEdit && <input type="hidden" name="id" defaultValue={item!.id} />}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-emerald-800">
            Kebun
          </label>
          <select
            name="kebunId"
            required
            defaultValue={item?.kebunId ?? ""}
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-900 outline-none focus:border-emerald-500"
          >
            <option value="">Pilih kebun</option>
            {kebunList.map((k) => (
              <option key={k.id} value={k.id}>
                {k.nama}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-emerald-800">
            Tanggal Panen
          </label>
          <input
            name="tanggal"
            type="date"
            required
            defaultValue={item?.tanggal ?? hariIni()}
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-900 outline-none focus:border-emerald-500"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Catatan
        </label>
        <input
          name="catatan"
          defaultValue={item?.catatan ?? ""}
          className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-900 outline-none focus:border-emerald-500"
          placeholder="Siapkan tenaga panen, koordinasi dengan pabrik"
        />
      </div>
      {state?.error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      )}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          {isEdit ? "Simpan Perubahan" : "Tambah Jadwal"}
        </button>
        {isEdit && (
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1 rounded-lg border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100"
          >
            <X className="h-4 w-4" /> Batal
          </button>
        )}
      </div>
    </form>
  );
}

export function JadwalActions({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Hapus jadwal ini?")) return;
    await deleteJadwal(id);
  }
  return (
    <button
      onClick={handleDelete}
      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
    >
      <Trash2 className="h-4 w-4" /> Hapus
    </button>
  );
}
