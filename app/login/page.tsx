import Link from "next/link";
import { AuthForms } from "@/components/auth-forms";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-emerald-700">Nyawit</h1>
          <p className="mt-1 text-sm text-emerald-600">
            Masuk ke asisten kebun sawit Anda
          </p>
        </div>
        <AuthForms mode="login" />
        <p className="mt-4 text-center text-sm text-emerald-600">
          Belum punya akun?{" "}
          <Link
            href="/signup"
            className="font-semibold text-emerald-700 underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
