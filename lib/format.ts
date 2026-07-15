export function formatRupiah(n: number): string {
  const value = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatAngka(n: number): string {
  const value = Number.isFinite(n) ? n : 0;
  return new Intl.NumberFormat("id-ID").format(value);
}

export function formatTanggal(t: string): string {
  if (!t) return "-";
  const iso = t.length <= 10 ? `${t}T00:00:00` : t;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return t;
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const NAMA_BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function bulanTahun(t: string): string {
  const d = new Date(`${t}T00:00:00`);
  if (Number.isNaN(d.getTime())) return t;
  return `${NAMA_BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export function hariIni(): string {
  return new Date().toISOString().slice(0, 10);
}
