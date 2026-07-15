"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

const LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/kebun", label: "Kebun" },
  { href: "/panen", label: "Panen" },
  { href: "/upah", label: "Upah" },
  { href: "/pengeluaran", label: "Pengeluaran" },
  { href: "/jadwal", label: "Jadwal" },
];

export function AppNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = authClient.useSession();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b border-emerald-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-2 px-4 py-3">
        <Link href="/dashboard" className="mr-4 text-lg font-bold text-emerald-700">
          🌿 Nyawit
        </Link>
        <nav className="flex flex-wrap gap-1">
          {LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + "/");
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-700 hover:bg-emerald-100"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-3">
          {data?.user?.email && (
            <span className="hidden text-sm text-emerald-600 sm:inline">
              {data.user.email}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="rounded-lg border border-emerald-200 px-3 py-1.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-100"
          >
            Keluar
          </button>
        </div>
      </div>
    </header>
  );
}
