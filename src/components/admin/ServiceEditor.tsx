"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Service, ServiceCategory } from "@/lib/types";

export function ServiceEditor({
  categories,
  services,
}: {
  categories: ServiceCategory[];
  services: Service[];
}) {
  const router = useRouter();
  const [cats, setCats] = useState(categories);
  const [rows, setRows] = useState(services);
  const [catName, setCatName] = useState("");
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    categoryId: categories[0]?.id || "",
    durationMin: 45,
    priceFrom: 500,
    priceTo: "" as string | number,
  });
  const [saving, setSaving] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [showNewService, setShowNewService] = useState(false);
  const [openServiceId, setOpenServiceId] = useState<string | null>(null);

  function updateCatLocal(id: string, patch: Partial<ServiceCategory>) {
    setCats((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function updateServiceLocal(id: string, patch: Partial<Service>) {
    setRows((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  async function createCategory() {
    if (!catName.trim()) {
      setError("Kategori adı gerekli.");
      return;
    }
    setError("");
    setCreating(true);
    const res = await fetch("/api/service-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: catName.trim() }),
    });
    setCreating(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Kategori eklenemedi");
      return;
    }
    const created = (await res.json()) as ServiceCategory;
    setCats((prev) => [...prev, created]);
    if (!serviceForm.categoryId) {
      setServiceForm((f) => ({ ...f, categoryId: created.id }));
    }
    setCatName("");
    setShowNewCategory(false);
    router.refresh();
  }

  async function saveCategory(id: string) {
    const row = cats.find((c) => c.id === id);
    if (!row?.name.trim()) {
      setError("Kategori adı gerekli.");
      return;
    }
    setError("");
    setSaving(`cat-${id}`);
    const res = await fetch("/api/service-categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name: row.name.trim() }),
    });
    setSaving(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Kaydedilemedi");
      return;
    }
    router.refresh();
  }

  async function removeCategory(id: string) {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    setError("");
    setSaving(`cat-${id}`);
    const res = await fetch(
      `/api/service-categories?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    setSaving(null);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Silinemedi");
      return;
    }
    setCats((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  async function createService() {
    if (!serviceForm.name.trim() || !serviceForm.categoryId) {
      setError("Hizmet adı ve kategori gerekli.");
      return;
    }
    setError("");
    setCreating(true);
    const res = await fetch("/api/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: serviceForm.name,
        description: serviceForm.description,
        categoryId: serviceForm.categoryId,
        durationMin: Number(serviceForm.durationMin),
        priceFrom: Number(serviceForm.priceFrom),
        priceTo: serviceForm.priceTo
          ? Number(serviceForm.priceTo)
          : undefined,
      }),
    });
    setCreating(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Hizmet eklenemedi");
      return;
    }
    const created = (await res.json()) as Service;
    setRows((prev) => [...prev, created]);
    setServiceForm((f) => ({
      ...f,
      name: "",
      description: "",
      durationMin: 45,
      priceFrom: 500,
      priceTo: "",
    }));
    setShowNewService(false);
    router.refresh();
  }

  async function saveService(id: string) {
    const row = rows.find((s) => s.id === id);
    if (!row) return;
    setError("");
    setSaving(id);
    const res = await fetch("/api/services", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id,
        name: row.name,
        description: row.description,
        categoryId: row.categoryId,
        priceFrom: Number(row.priceFrom),
        priceTo: row.priceTo ? Number(row.priceTo) : undefined,
        durationMin: Number(row.durationMin),
        popular: Boolean(row.popular),
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

  async function removeService(id: string) {
    if (!confirm("Bu hizmeti silmek istediğinize emin misiniz?")) return;
    setError("");
    setSaving(id);
    const res = await fetch(`/api/services?id=${encodeURIComponent(id)}`, {
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

  const sortedServices = [...rows].sort((a, b) => {
    const catA = cats.find((c) => c.id === a.categoryId)?.sortOrder ?? 0;
    const catB = cats.find((c) => c.id === b.categoryId)?.sortOrder ?? 0;
    if (catA !== catB) return catA - catB;
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  });

  function categoryName(categoryId: string) {
    return cats.find((c) => c.id === categoryId)?.name || "Kategori yok";
  }

  function resetServiceForm() {
    setShowNewService(false);
    setServiceForm((f) => ({
      ...f,
      name: "",
      description: "",
      durationMin: 45,
      priceFrom: 500,
      priceTo: "",
      categoryId: cats[0]?.id || "",
    }));
  }

  return (
    <div className="space-y-10">
      {error ? (
        <p className="border border-line bg-paper px-3 py-2 text-sm text-ink">
          {error}
        </p>
      ) : null}

      <section className="overflow-hidden border border-line bg-paper">
        <button
          type="button"
          onClick={() => setCategoriesOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-mist/60"
          aria-expanded={categoriesOpen}
        >
          <div>
            <h2 className="font-display text-xl text-ink">Kategoriler</h2>
            <p className="mt-0.5 text-sm text-ink-soft">
              {cats.length} kategori · sitede accordion başlıkları
            </p>
          </div>
          <span
            className={`text-lg leading-none text-ink-soft transition ${
              categoriesOpen ? "rotate-45" : ""
            }`}
            aria-hidden
          >
            +
          </span>
        </button>

        {categoriesOpen ? (
          <div className="space-y-3 border-t border-line px-4 py-4">
            {!showNewCategory ? (
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="border border-line px-4 py-2 text-xs text-ink hover:bg-mist"
              >
                + Kategori tanımla
              </button>
            ) : (
              <div className="flex flex-col gap-2 border border-line bg-mist/40 p-3 sm:flex-row sm:items-center">
                <input
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Örn. Saç Kesim Hizmetleri"
                  className="flex-1 border border-line bg-paper px-3 py-2 text-sm"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={createCategory}
                    disabled={creating}
                    className="bg-ink px-4 py-2 text-xs text-paper hover:bg-ink-soft disabled:opacity-60"
                  >
                    {creating ? "..." : "Kaydet"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewCategory(false);
                      setCatName("");
                    }}
                    className="border border-line px-3 py-2 text-xs text-ink-soft hover:bg-mist"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {cats.map((c) => (
                <div
                  key={c.id}
                  className="flex flex-col gap-2 border border-line bg-mist/40 p-3 sm:flex-row sm:items-center"
                >
                  <input
                    value={c.name}
                    onChange={(e) =>
                      updateCatLocal(c.id, { name: e.target.value })
                    }
                    className="flex-1 border border-line bg-paper px-3 py-2 text-sm font-medium"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveCategory(c.id)}
                      disabled={saving === `cat-${c.id}`}
                      className="bg-ink px-3 py-2 text-xs text-paper disabled:opacity-60"
                    >
                      Kaydet
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCategory(c.id)}
                      disabled={saving === `cat-${c.id}`}
                      className="border border-line px-3 py-2 text-xs text-ink-soft hover:bg-mist disabled:opacity-60"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <section className="overflow-hidden border border-line bg-paper">
        <button
          type="button"
          onClick={() => setServicesOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-mist/60"
          aria-expanded={servicesOpen}
        >
          <div>
            <h2 className="font-display text-xl text-ink">Hizmetler</h2>
            <p className="mt-0.5 text-sm text-ink-soft">
              {rows.length} hizmet · site ve randevu buradan dolar
            </p>
          </div>
          <span
            className={`text-lg leading-none text-ink-soft transition ${
              servicesOpen ? "rotate-45" : ""
            }`}
            aria-hidden
          >
            +
          </span>
        </button>

        {servicesOpen ? (
          <div className="space-y-3 border-t border-line px-4 py-4">
            {!showNewService ? (
              <button
                type="button"
                onClick={() => setShowNewService(true)}
                disabled={!cats.length}
                className="border border-line px-4 py-2 text-xs text-ink hover:bg-mist disabled:opacity-50"
              >
                + Hizmet tanımla
              </button>
            ) : (
              <div className="space-y-3 border border-line bg-mist/40 p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <input
                    value={serviceForm.name}
                    onChange={(e) =>
                      setServiceForm((f) => ({ ...f, name: e.target.value }))
                    }
                    placeholder="Örn. Uç Kesim"
                    className="w-full border border-line bg-paper px-3 py-2 text-sm"
                    autoFocus
                  />
                  <select
                    value={serviceForm.categoryId}
                    onChange={(e) =>
                      setServiceForm((f) => ({
                        ...f,
                        categoryId: e.target.value,
                      }))
                    }
                    className="w-full border border-line bg-paper px-3 py-2 text-sm"
                  >
                    {cats.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <textarea
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm((f) => ({
                      ...f,
                      description: e.target.value,
                    }))
                  }
                  rows={2}
                  placeholder="Açıklama"
                  className="w-full border border-line bg-paper px-3 py-2 text-sm"
                />
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    value={serviceForm.durationMin}
                    onChange={(e) =>
                      setServiceForm((f) => ({
                        ...f,
                        durationMin: Number(e.target.value),
                      }))
                    }
                    placeholder="Süre (dk)"
                    className="w-full border border-line bg-paper px-2 py-1.5 text-sm"
                  />
                  <input
                    type="number"
                    value={serviceForm.priceFrom}
                    onChange={(e) =>
                      setServiceForm((f) => ({
                        ...f,
                        priceFrom: Number(e.target.value),
                      }))
                    }
                    placeholder="Fiyat başlangıç"
                    className="w-full border border-line bg-paper px-2 py-1.5 text-sm"
                  />
                  <input
                    type="number"
                    value={serviceForm.priceTo}
                    onChange={(e) =>
                      setServiceForm((f) => ({
                        ...f,
                        priceTo: e.target.value,
                      }))
                    }
                    placeholder="Fiyat bitiş"
                    className="w-full border border-line bg-paper px-2 py-1.5 text-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={createService}
                    disabled={creating}
                    className="bg-ink px-4 py-2 text-xs text-paper hover:bg-ink-soft disabled:opacity-60"
                  >
                    {creating ? "..." : "Kaydet"}
                  </button>
                  <button
                    type="button"
                    onClick={resetServiceForm}
                    className="border border-line px-3 py-2 text-xs text-ink-soft hover:bg-mist"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {sortedServices.map((s) => {
                const open = openServiceId === s.id;
                return (
                  <div
                    key={s.id}
                    className="overflow-hidden border border-line bg-mist/40"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenServiceId(open ? null : s.id)}
                      className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left hover:bg-mist"
                      aria-expanded={open}
                    >
                      <span>
                        <span className="block text-[11px] uppercase tracking-wider text-ink-soft">
                          {categoryName(s.categoryId)}
                        </span>
                        <span className="mt-0.5 block text-sm font-medium text-ink">
                          {s.name}
                        </span>
                      </span>
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
                      <div className="space-y-3 border-t border-line bg-paper p-3">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            value={s.name}
                            onChange={(e) =>
                              updateServiceLocal(s.id, {
                                name: e.target.value,
                              })
                            }
                            className="w-full border border-line bg-mist px-3 py-2 text-sm font-medium"
                          />
                          <select
                            value={s.categoryId}
                            onChange={(e) =>
                              updateServiceLocal(s.id, {
                                categoryId: e.target.value,
                              })
                            }
                            className="w-full border border-line bg-mist px-3 py-2 text-sm"
                          >
                            {cats.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <textarea
                          value={s.description}
                          onChange={(e) =>
                            updateServiceLocal(s.id, {
                              description: e.target.value,
                            })
                          }
                          rows={2}
                          className="w-full border border-line bg-mist px-3 py-2 text-sm"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <label className="text-xs text-ink-soft">
                            Süre (dk)
                            <input
                              type="number"
                              value={s.durationMin}
                              onChange={(e) =>
                                updateServiceLocal(s.id, {
                                  durationMin: Number(e.target.value),
                                })
                              }
                              className="mt-1 w-full border border-line bg-mist px-2 py-1.5 text-sm"
                            />
                          </label>
                          <label className="text-xs text-ink-soft">
                            Fiyat (başlangıç)
                            <input
                              type="number"
                              value={s.priceFrom}
                              onChange={(e) =>
                                updateServiceLocal(s.id, {
                                  priceFrom: Number(e.target.value),
                                })
                              }
                              className="mt-1 w-full border border-line bg-mist px-2 py-1.5 text-sm"
                            />
                          </label>
                          <label className="text-xs text-ink-soft">
                            Fiyat (bitiş)
                            <input
                              type="number"
                              value={s.priceTo ?? ""}
                              onChange={(e) =>
                                updateServiceLocal(s.id, {
                                  priceTo: e.target.value
                                    ? Number(e.target.value)
                                    : undefined,
                                })
                              }
                              className="mt-1 w-full border border-line bg-mist px-2 py-1.5 text-sm"
                            />
                          </label>
                        </div>
                        <label className="flex items-center gap-2 text-xs text-ink-soft">
                          <input
                            type="checkbox"
                            checked={Boolean(s.popular)}
                            onChange={(e) =>
                              updateServiceLocal(s.id, {
                                popular: e.target.checked,
                              })
                            }
                          />
                          Popüler (anasayfa)
                        </label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveService(s.id)}
                            disabled={saving === s.id}
                            className="bg-ink px-3 py-2 text-xs text-paper disabled:opacity-60"
                          >
                            Kaydet
                          </button>
                          <button
                            type="button"
                            onClick={() => removeService(s.id)}
                            disabled={saving === s.id}
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
