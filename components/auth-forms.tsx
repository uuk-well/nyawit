"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export function AuthForms({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "signup") {
        const res = await authClient.signUp.email({
          name,
          email,
          password,
        });
        if (res.error) {
          setError(res.error.message || "Gagal mendaftar.");
          setLoading(false);
          return;
        }
      } else {
        const res = await authClient.signIn.email({ email, password });
        if (res.error) {
          setError(res.error.message || "Email atau kata sandi salah.");
          setLoading(false);
          return;
        }
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Coba lagi.");
      setLoading(false);
    }
  }

  const isSignup = mode === "signup";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignup && (
        <div>
          <label className="mb-1 block text-sm font-medium text-emerald-800">
            Nama
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-900 outline-none focus:border-emerald-500"
            placeholder="Nama lengkap"
          />
        </div>
      )}
      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Email
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-900 outline-none focus:border-emerald-500"
          placeholder="email@contoh.com"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-emerald-800">
          Kata Sandi
        </label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-emerald-900 outline-none focus:border-emerald-500"
          placeholder="Minimal 6 karakter"
        />
      </div>
      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Memproses..." : isSignup ? "Daftar" : "Masuk"}
      </button>
    </form>
  );
}
