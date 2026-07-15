import Link from "next/link";
import { AuthForms } from "@/components/auth-forms";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-emerald-700">Nyawit</h1>
          <p className="mt-1 text-sm text-emerald-600">
            Buat akun untuk mulai mencatat kebun
          </p>
        </div>
        <AuthForms mode="signup" />
        <p className="mt-4 text-center text-sm text-emerald-600">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-700 underline"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
