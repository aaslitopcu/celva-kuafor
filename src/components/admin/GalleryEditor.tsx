"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GalleryItem, ServiceCategory } from "@/lib/types";

type FormState = {
  title: string;
  categoryId: string;
  before: string;
  after: string;
};

export function GalleryEditor({
  items,
  categories,
}: {
  items: GalleryItem[];
  categories: ServiceCategory[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(items);
  const [open, setOpen] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<FormState>({
    title: "",
    categoryId: categories[0]?.id || "",
    before: "",
    after: "",
  });

  function updateLocal(id: string, patch: Partial<GalleryItem>) {
    setRows((prev) => prev.map((g) => (g.id === id ? { ...g, ...patch } : g)));
  }

  function categoryName(id: string) {
    return categories.find((c) => c.id === id)?.name || "Kategori yok";
  }

  async function uploadFile(
    file: File,
    target: "form-before" | "form-after" | `row-${string}-before` | `row-${string}-after`,
  ) {
    setError("");
    setUploading(target);
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body });
    setUploading(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Yükleme başarısız");
      return null;
    }
    const data = (await res.json()) as { url: string };
    return data.url;
  }

  async function onFormFile(
    e: React.ChangeEvent<HTMLInputElement>,
    field: "before" | "after",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, `form-${field}`);
    if (url) setForm((f) => ({ ...f, [field]: url }));
    e.target.value = "";
  }

  async function onRowFile(
    e: React.ChangeEvent<HTMLInputElement>,
    id: string,
    field: "before" | "after",
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadFile(file, `row-${id}-${field}`);
    if (url) updateLocal(id, { [field]: url });
    e.target.value = "";
  }

  async function create() {
    if (!form.title.trim() || !form.categoryId || !form.before || !form.after) {
      setError("Başlık, kategori ve her iki görsel gerekli.");
      return;
    }
    setError("");
    setCreating(true);
    const res = await fetch("/api/gallery", {
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
    const created = (await res.json()) as GalleryItem;
    setRows((prev) => [...prev, created]);
    setForm({
      title: "",
      categoryId: categories[0]?.id || "",
      before: "",
      after: "",
    });
    setShowNew(false);
    router.refresh();
  }

  async function save(id: string) {
    const row = rows.find((g) => g.id === id);
    if (!row) return;
    if (!row.title.trim() || !row.before || !row.after) {
      setError("Başlık ve görseller gerekli.");
      return;
    }
    setError("");
    setSaving(id);
    const res = await fetch("/api/gallery", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        title: row.title,
        categoryId: row.categoryId,
        before: row.before,
        after: row.after,
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

  async function remove(id: string) {
    if (!confirm("Bu galeri kaydını silmek istediğinize emin misiniz?")) return;
    setError("");
    setSaving(id);
    const res = await fetch(`/api/gallery?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setSaving(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Silinemedi");
      return;
    }
    setRows((prev) => prev.filter((g) => g.id !== id));
    if (openItemId === id) setOpenItemId(null);
    router.refresh();
  }

  const sorted = [...rows].sort((a, b) => {
    const ca = categories.find((c) => c.id === a.categoryId)?.sortOrder ?? 0;
    const cb = categories.find((c) => c.id === b.categoryId)?.sortOrder ?? 0;
    if (ca !== cb) return ca - cb;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });

  return (
    <div className="space-y-4">
      {error ? (
        <p className="border border-line bg-paper px-3 py-2 text-sm text-ink">
          {error}
        </p>
      ) : null}

      <section className="overflow-hidden border border-line bg-paper">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-mist/60"
          aria-expanded={open}
        >
          <div>
            <h2 className="font-display text-xl text-ink">Öncesi / Sonrası</h2>
            <p className="mt-0.5 text-sm text-ink-soft">
              {rows.length} kayıt · kategorilere göre sitede listelenir
            </p>
          </div>
          <span
            className={`text-lg leading-none text-ink-soft transition ${
              open ? "rotate-45" : ""
            }`}
            aria-hidden
          >
            +
          </span>
        </button>

        {open ? (
          <div className="space-y-3 border-t border-line px-4 py-4">
            {!showNew ? (
              <button
                type="button"
                onClick={() => setShowNew(true)}
                disabled={!categories.length}
                className="border border-line px-4 py-2 text-xs text-ink hover:bg-mist disabled:opacity-50"
              >
                + Dönüşüm ekle
              </button>
            ) : (
              <div className="space-y-3 border border-line bg-mist/40 p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    placeholder="Başlık"
                    className="w-full border border-line bg-paper px-3 py-2 text-sm"
                    autoFocus
                  />
                  <select
                    value={form.categoryId}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, categoryId: e.target.value }))
                    }
                    className="w-full border border-line bg-paper px-3 py-2 text-sm"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ImageField
                    label="Öncesi"
                    url={form.before}
                    uploading={uploading === "form-before"}
                    onFile={(e) => onFormFile(e, "before")}
                  />
                  <ImageField
                    label="Sonrası"
                    url={form.after}
                    uploading={uploading === "form-after"}
                    onFile={(e) => onFormFile(e, "after")}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={create}
                    disabled={creating}
                    className="bg-ink px-4 py-2 text-xs text-paper disabled:opacity-60"
                  >
                    {creating ? "..." : "Kaydet"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNew(false);
                      setForm({
                        title: "",
                        categoryId: categories[0]?.id || "",
                        before: "",
                        after: "",
                      });
                    }}
                    className="border border-line px-3 py-2 text-xs text-ink-soft hover:bg-mist"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {sorted.map((g) => {
                const itemOpen = openItemId === g.id;
                return (
                  <div
                    key={g.id}
                    className="overflow-hidden border border-line bg-mist/40"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenItemId(itemOpen ? null : g.id)
                      }
                      className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left hover:bg-mist"
                      aria-expanded={itemOpen}
                    >
                      <span>
                        <span className="block text-[11px] uppercase tracking-wider text-ink-soft">
                          {categoryName(g.categoryId)}
                        </span>
                        <span className="mt-0.5 block text-sm font-medium text-ink">
                          {g.title}
                        </span>
                      </span>
                      <span
                        className={`text-lg leading-none text-ink-soft transition ${
                          itemOpen ? "rotate-45" : ""
                        }`}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    {itemOpen ? (
                      <div className="space-y-3 border-t border-line bg-paper p-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={g.title}
                            onChange={(e) =>
                              updateLocal(g.id, { title: e.target.value })
                            }
                            className="w-full border border-line bg-mist px-3 py-2 text-sm font-medium"
                          />
                          <select
                            value={g.categoryId}
                            onChange={(e) =>
                              updateLocal(g.id, {
                                categoryId: e.target.value,
                              })
                            }
                            className="w-full border border-line bg-mist px-3 py-2 text-sm"
                          >
                            {categories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <ImageField
                            label="Öncesi"
                            url={g.before}
                            uploading={uploading === `row-${g.id}-before`}
                            onFile={(e) => onRowFile(e, g.id, "before")}
                          />
                          <ImageField
                            label="Sonrası"
                            url={g.after}
                            uploading={uploading === `row-${g.id}-after`}
                            onFile={(e) => onRowFile(e, g.id, "after")}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => save(g.id)}
                            disabled={saving === g.id}
                            className="bg-ink px-3 py-2 text-xs text-paper disabled:opacity-60"
                          >
                            Kaydet
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(g.id)}
                            disabled={saving === g.id}
                            className="border border-line px-3 py-2 text-xs text-ink-soft hover:bg-mist disabled:opacity-60"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}

function ImageField({
  label,
  url,
  uploading,
  onFile,
}: {
  label: string;
  url: string;
  uploading: boolean;
  onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block text-xs text-ink-soft">
      {label}
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={label}
          className="mt-1 aspect-[3/4] w-full max-w-[180px] object-cover"
        />
      ) : (
        <div className="mt-1 flex aspect-[3/4] max-w-[180px] items-center justify-center border border-dashed border-line bg-mist text-[11px]">
          Görsel yok
        </div>
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onFile}
        disabled={uploading}
        className="mt-2 block w-full text-xs"
      />
      {uploading ? <p className="mt-1 text-[11px]">Yükleniyor...</p> : null}
    </label>
  );
}
