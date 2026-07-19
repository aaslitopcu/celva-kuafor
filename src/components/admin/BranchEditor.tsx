"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Branch } from "@/lib/types";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  mapsUrl: "",
  whatsapp: "",
};

export function BranchEditor({ branches }: { branches: Branch[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(branches);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  function updateLocal(id: string, patch: Partial<Branch>) {
    setRows((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }

  async function save(id: string) {
    const row = rows.find((b) => b.id === id);
    if (!row) return;
    if (!row.name.trim() || !row.phone.trim() || !row.address.trim() || !row.city.trim()) {
      setError("Ad, telefon, adres ve şehir gerekli.");
      return;
    }
    setError("");
    setSaving(id);
    const res = await fetch("/api/branches", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(row),
    });
    setSaving(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Kaydedilemedi");
      return;
    }
    router.refresh();
  }

  async function create() {
    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.address.trim() ||
      !form.city.trim()
    ) {
      setError("Ad, telefon, adres ve şehir gerekli.");
      return;
    }
    setError("");
    setCreating(true);
    const res = await fetch("/api/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setCreating(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Eklenemedi");
      return;
    }
    const created = (await res.json()) as Branch;
    setRows((prev) => [...prev, created]);
    setForm(emptyForm);
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Bu şubeyi silmek istediğinize emin misiniz?")) return;
    setError("");
    setSaving(id);
    const res = await fetch(`/api/branches?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setSaving(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Silinemedi");
      return;
    }
    setRows((prev) => prev.filter((b) => b.id !== id));
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {error ? (
        <p className="border border-line bg-paper px-3 py-2 text-sm text-ink">
          {error}
        </p>
      ) : null}

      <section className="border border-line bg-paper p-5">
        <h2 className="font-display text-xl text-ink">Yeni şube</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Şube tanımladıktan sonra stilistleri ilgili şubeye atayın.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-ink-soft">
            Şube adı
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
              placeholder="Örn. Kadıköy Moda"
            />
          </label>
          <label className="text-xs text-ink-soft">
            Telefon
            <input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-ink-soft sm:col-span-2">
            Adres
            <input
              value={form.address}
              onChange={(e) =>
                setForm((f) => ({ ...f, address: e.target.value }))
              }
              className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-ink-soft">
            Şehir
            <input
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-ink-soft">
            E-posta
            <input
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
            />
          </label>
          <label className="text-xs text-ink-soft">
            WhatsApp
            <input
              value={form.whatsapp}
              onChange={(e) =>
                setForm((f) => ({ ...f, whatsapp: e.target.value }))
              }
              className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
              placeholder="90555..."
            />
          </label>
          <label className="text-xs text-ink-soft">
            Harita URL
            <input
              value={form.mapsUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, mapsUrl: e.target.value }))
              }
              className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
            />
          </label>
        </div>
        <button
          type="button"
          onClick={create}
          disabled={creating}
          className="mt-4 bg-ink px-4 py-2 text-xs text-paper hover:bg-ink-soft disabled:opacity-60"
        >
          {creating ? "..." : "Şube ekle"}
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-ink">
          Şubeler ({rows.length})
        </h2>
        {rows.map((b) => (
          <div key={b.id} className="border border-line bg-paper p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-xs text-ink-soft">
                Şube adı
                <input
                  value={b.name}
                  onChange={(e) => updateLocal(b.id, { name: e.target.value })}
                  className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm font-medium"
                />
              </label>
              <label className="text-xs text-ink-soft">
                Telefon
                <input
                  value={b.phone}
                  onChange={(e) => updateLocal(b.id, { phone: e.target.value })}
                  className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs text-ink-soft sm:col-span-2">
                Adres
                <input
                  value={b.address}
                  onChange={(e) =>
                    updateLocal(b.id, { address: e.target.value })
                  }
                  className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs text-ink-soft">
                Şehir
                <input
                  value={b.city}
                  onChange={(e) => updateLocal(b.id, { city: e.target.value })}
                  className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs text-ink-soft">
                E-posta
                <input
                  value={b.email ?? ""}
                  onChange={(e) => updateLocal(b.id, { email: e.target.value })}
                  className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs text-ink-soft">
                WhatsApp
                <input
                  value={b.whatsapp ?? ""}
                  onChange={(e) =>
                    updateLocal(b.id, { whatsapp: e.target.value })
                  }
                  className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
                />
              </label>
              <label className="text-xs text-ink-soft">
                Harita URL
                <input
                  value={b.mapsUrl ?? ""}
                  onChange={(e) =>
                    updateLocal(b.id, { mapsUrl: e.target.value })
                  }
                  className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
                />
              </label>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => save(b.id)}
                disabled={saving === b.id}
                className="bg-ink px-4 py-2 text-xs text-paper hover:bg-ink-soft disabled:opacity-60"
              >
                {saving === b.id ? "..." : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={() => remove(b.id)}
                disabled={saving === b.id}
                className="border border-line px-4 py-2 text-xs text-ink-soft hover:bg-mist disabled:opacity-60"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
