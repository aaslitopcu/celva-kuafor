"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Giriş başarısız");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm border border-line bg-paper p-8"
      >
        <p className="font-display text-2xl text-ink">CELVA</p>
        <h1 className="mt-1 text-sm text-ink-soft">Admin girişi</h1>
        <label className="mt-8 block">
          <span className="text-xs uppercase tracking-wider text-ink-soft">
            Şifre
          </span>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full bg-ink py-3 text-sm text-paper hover:bg-ink-soft disabled:opacity-60"
        >
          {loading ? "..." : "Giriş yap"}
        </button>
        <p className="mt-4 text-[11px] text-ink-soft">
          Varsayılan: celva2026 (ADMIN_PASSWORD ile değiştirilebilir)
        </p>
      </form>
    </div>
  );
}
