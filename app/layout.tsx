import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nyawit — Asisten Kebun Sawit",
  description:
    "Catat panen, upah, pengeluaran, dan jadwal kebun sawit Anda dalam satu aplikasi.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full bg-emerald-50/40 text-emerald-950">{children}</body>
    </html>
  );
}
