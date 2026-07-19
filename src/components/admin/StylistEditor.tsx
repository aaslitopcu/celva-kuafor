"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Branch, ServiceCategory, Stylist } from "@/lib/types";

export function StylistEditor({
  stylists,
  branches,
  categories,
}: {
  stylists: Stylist[];
  branches: Branch[];
  categories: ServiceCategory[];
}) {
  const router = useRouter();
  const defaultBranchId = branches[0]?.id || "";
  const [rows, setRows] = useState(stylists);
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    image: "",
    branchId: defaultBranchId,
    specialties: [] as string[],
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  function updateLocal(id: string, patch: Partial<Stylist>) {
    setRows((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  function toggleSpecialty(
    current: string[],
    value: string,
    onChange: (next: string[]) => void,
  ) {
    if (current.includes(value)) {
      onChange(current.filter((c) => c !== value));
    } else {
      onChange([...current, value]);
    }
  }

  function branchLabel(branchId: string) {
    return branches.find((b) => b.id === branchId)?.name || "Şube yok";
  }

  async function save(id: string) {
    const row = rows.find((s) => s.id === id);
    if (!row) return;
    if (!row.branchId) {
      setError("Her stilistin bir şubesi olmalı.");
      return;
    }
    if (!row.specialties.length) {
      setError("Her stilistin en az bir uzmanlığı olmalı.");
      return;
    }
    setError("");
    setSaving(id);
    const res = await fetch("/api/stylists", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: row.name,
        title: row.title,
        bio: row.bio,
        image: row.image,
        branchId: row.branchId,
        specialties: row.specialties,
      }),
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
    if (!form.name.trim() || !form.title.trim()) {
      setError("Ad ve unvan gerekli.");
      return;
    }
    if (!form.branchId) {
      setError("Şube seçin.");
      return;
    }
    if (!form.specialties.length) {
      setError("En az bir uzmanlık seçin.");
      return;
    }
    setError("");
    setCreating(true);
    const res = await fetch("/api/stylists", {
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
    const created = (await res.json()) as Stylist;
    setRows((prev) => [...prev, created]);
    setForm({
      name: "",
      title: "",
      bio: "",
      image: "",
      branchId: defaultBranchId,
      specialties: [],
    });
    router.refresh();
  }

  async function remove(id: string) {
    if (!confirm("Bu stilisti silmek istediğinize emin misiniz?")) return;
    setError("");
    setSaving(id);
    const res = await fetch(`/api/stylists?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setSaving(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Silinemedi");
      return;
    }
    setRows((prev) => prev.filter((s) => s.id !== id));
    router.refresh();
  }

  if (!branches.length) {
    return (
      <p className="text-sm text-ink-soft">
        Önce{" "}
        <a href="/admin/subeler" className="text-sage-deep underline">
          şube tanımlayın
        </a>
        ; ardından stilist ekleyebilirsiniz.
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {error ? (
        <p className="border border-line bg-paper px-3 py-2 text-sm text-ink">
          {error}
        </p>
      ) : null}

      <section className="border border-line bg-paper p-5">
        <h2 className="font-display text-xl text-ink">Yeni stilist / çalışan</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Stilist bir şubeye atanır; online randevuda yalnızca o şubenin
          stilistleri listelenir.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-xs text-ink-soft">
            Ad soyad
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
              placeholder="Örn. Elif Kara"
            />
          </label>
          <label className="text-xs text-ink-soft">
            Unvan
            <input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
              placeholder="Örn. Renk Uzmanı"
            />
          </label>
          <label className="text-xs text-ink-soft sm:col-span-2">
            Şube
            <select
              value={form.branchId}
              onChange={(e) =>
                setForm((f) => ({ ...f, branchId: e.target.value }))
              }
              className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
            >
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="mt-3 block text-xs text-ink-soft">
          Kısa bio
          <textarea
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            rows={2}
            className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
          />
        </label>
        <label className="mt-3 block text-xs text-ink-soft">
          Görsel URL
          <input
            value={form.image}
            onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
            placeholder="https://..."
          />
        </label>
        <fieldset className="mt-3">
          <legend className="text-xs text-ink-soft">Uzmanlık alanları</legend>
          <div className="mt-2 flex flex-wrap gap-3">
            {categories.map((opt) => (
              <label
                key={opt.id}
                className="flex items-center gap-2 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={form.specialties.includes(opt.id)}
                  onChange={() =>
                    toggleSpecialty(form.specialties, opt.id, (next) =>
                      setForm((f) => ({ ...f, specialties: next })),
                    )
                  }
                />
                {opt.name}
              </label>
            ))}
          </div>
        </fieldset>
        <button
          type="button"
          onClick={create}
          disabled={creating}
          className="mt-4 bg-ink px-4 py-2 text-xs text-paper hover:bg-ink-soft disabled:opacity-60"
        >
          {creating ? "..." : "Stilist ekle"}
        </button>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl text-ink">
          Kayıtlı stilistler ({rows.length})
        </h2>
        {rows.length === 0 ? (
          <p className="text-sm text-ink-soft">
            Henüz stilist yok. Yukarıdan ekleyin; randevu formu buradan dolar.
          </p>
        ) : (
          rows.map((s) => (
            <div key={s.id} className="border border-line bg-paper p-4">
              <p className="mb-3 text-xs text-ink-soft">
                Şube: {branchLabel(s.branchId)}
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="text-xs text-ink-soft">
                  Ad soyad
                  <input
                    value={s.name}
                    onChange={(e) =>
                      updateLocal(s.id, { name: e.target.value })
                    }
                    className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm font-medium"
                  />
                </label>
                <label className="text-xs text-ink-soft">
                  Unvan
                  <input
                    value={s.title}
                    onChange={(e) =>
                      updateLocal(s.id, { title: e.target.value })
                    }
                    className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
                  />
                </label>
                <label className="text-xs text-ink-soft sm:col-span-2">
                  Şube
                  <select
                    value={s.branchId}
                    onChange={(e) =>
                      updateLocal(s.id, { branchId: e.target.value })
                    }
                    className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="mt-2 block text-xs text-ink-soft">
                Bio
                <textarea
                  value={s.bio}
                  onChange={(e) => updateLocal(s.id, { bio: e.target.value })}
                  rows={2}
                  className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
                />
              </label>
              <label className="mt-2 block text-xs text-ink-soft">
                Görsel URL
                <input
                  value={s.image}
                  onChange={(e) => updateLocal(s.id, { image: e.target.value })}
                  className="mt-1 w-full border border-line bg-mist px-3 py-2 text-sm"
                />
              </label>
              <fieldset className="mt-3">
                <legend className="text-xs text-ink-soft">Uzmanlık</legend>
                <div className="mt-2 flex flex-wrap gap-3">
                  {categories.map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 text-sm text-ink"
                    >
                      <input
                        type="checkbox"
                        checked={s.specialties.includes(opt.id)}
                        onChange={() =>
                          toggleSpecialty(s.specialties, opt.id, (next) =>
                            updateLocal(s.id, { specialties: next }),
                          )
                        }
                      />
                      {opt.name}
                    </label>
                  ))}
                </div>
              </fieldset>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => save(s.id)}
                  disabled={saving === s.id}
                  className="bg-ink px-4 py-2 text-xs text-paper hover:bg-ink-soft disabled:opacity-60"
                >
                  {saving === s.id ? "..." : "Kaydet"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  disabled={saving === s.id}
                  className="border border-line px-4 py-2 text-xs text-ink-soft hover:bg-mist disabled:opacity-60"
                >
                  Sil
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
