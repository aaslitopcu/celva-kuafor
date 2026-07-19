"use client";

import { useMemo, useState } from "react";
import type { GalleryItem, ServiceCategory, Stylist } from "@/lib/types";

export function GalleryFilter({
  items,
  stylists,
  categories,
}: {
  items: GalleryItem[];
  stylists: Stylist[];
  categories: ServiceCategory[];
}) {
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<string | null>(null);

  const usedCategories = useMemo(() => {
    const ids = new Set(items.map((i) => i.categoryId));
    return [...categories]
      .filter((c) => ids.has(c.id))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }, [categories, items]);

  const filters = [
    { id: "all", label: "Tümü" },
    ...usedCategories.map((c) => ({ id: c.id, label: c.name })),
  ];

  const sections = useMemo(() => {
    const cats =
      filter === "all"
        ? usedCategories
        : usedCategories.filter((c) => c.id === filter);

    return cats.map((cat) => ({
      category: cat,
      items: items
        .filter((i) => i.categoryId === cat.id)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    }));
  }, [filter, usedCategories, items]);

  const activeItem = items.find((i) => i.id === active);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {filters.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setFilter(c.id)}
            className={`px-4 py-2 text-sm transition ${
              filter === c.id
                ? "bg-ink text-paper"
                : "border border-line bg-paper text-ink-soft hover:border-ink/30"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-10 space-y-14">
        {sections.length === 0 ? (
          <p className="text-sm text-ink-soft">Henüz galeri kaydı yok.</p>
        ) : (
          sections.map(({ category, items: catItems }) => (
            <section key={category.id}>
              <h2 className="font-display text-2xl text-ink md:text-3xl">
                {category.name}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-soft">
                {catItems.length} dönüşüm
              </p>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {catItems.map((item) => {
                  const stylist = stylists.find((s) => s.id === item.stylistId);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActive(item.id)}
                      className="group text-left"
                    >
                      <div className="grid grid-cols-2 overflow-hidden">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.before}
                            alt={`${item.title} önce`}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                          <span className="absolute bottom-2 left-2 bg-ink/70 px-2 py-1 text-[10px] uppercase tracking-wider text-paper">
                            Önce
                          </span>
                        </div>
                        <div className="relative aspect-[3/4] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.after}
                            alt={`${item.title} sonra`}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                          <span className="absolute bottom-2 left-2 bg-bronze/90 px-2 py-1 text-[10px] uppercase tracking-wider text-ink">
                            Sonra
                          </span>
                        </div>
                      </div>
                      <p className="mt-3 font-display text-lg text-ink">
                        {item.title}
                      </p>
                      {stylist ? (
                        <p className="text-xs text-ink-soft">{stylist.name}</p>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </section>
          ))
        )}
      </div>

      {activeItem ? (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-4"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-auto bg-paper p-4 md:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ink-soft">
                  {categoryName(activeItem.categoryId, categories)}
                </p>
                <h3 className="font-display mt-1 text-2xl text-ink">
                  {activeItem.title}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">
                  {
                    stylists.find((s) => s.id === activeItem.stylistId)
                      ?.name
                  }
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="text-sm text-ink-soft hover:text-ink"
              >
                Kapat
              </button>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.before}
                alt="Önce"
                className="aspect-[3/4] w-full object-cover"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activeItem.after}
                alt="Sonra"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function categoryName(id: string, categories: ServiceCategory[]) {
  return categories.find((c) => c.id === id)?.name || "";
}
