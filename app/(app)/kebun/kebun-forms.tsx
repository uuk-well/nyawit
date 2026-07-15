"use client";

import { useEffect, useRef, useState, useActionState } from "react";
import { Pencil, X, Trash2 } from "lucide-react";
import { createKebun, updateKebun, deleteKebun, type ActionState } from "./actions";

type Item = {
  id: string;
  nama: string;
  lokasi: string | null;
  luas: number | null;
};

export function KebunForms({ item }: { item?: Item }) {
  const isEdit = Boolean(item);
  const [open, setOpen] = useState(!isEdit);
  const [state, formAction] = useActionState<ActionState | undefined, FormData>(
    isEdit ? updateKebun : createKebun,
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
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-emerald-800">
            Nama Kebun
          </label>
          <input
            name="nama"
            required
            defaultValue={item?.nama ?? ""}
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-900 outline-none focus:border-emerald-500"
            placeholder="Kebun Sehat Jaya"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-emerald-800">
            Luas (ha)
          </label>
          <input
            name="luas"
            type="number"
            step="0.01"
            min="0"
            defaultValue={item?.luas ?? ""}
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-900 outline-none focus:border-emerald-500"
            placeholder="10"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Lokasi
        </label>
        <input
          name="lokasi"
          defaultValue={item?.lokasi ?? ""}
          className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-900 outline-none focus:border-emerald-500"
          placeholder="Desa Makmur, Kec. Sawit"
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
          {isEdit ? "Simpan Perubahan" : "Tambah Kebun"}
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

export function DeleteKebunButton({ id }: { id: string }) {
  async function handleDelete() {
    if (!confirm("Hapus kebun ini? Data panen terkait ikut terhapus.")) return;
    await deleteKebun(id);
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
