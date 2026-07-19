"use client";

import Link from "next/link";
import { useState } from "react";
import type { Service, ServiceCategory } from "@/lib/types";

function formatPrice(s: Service) {
  const from = `₺${s.priceFrom.toLocaleString("tr-TR")}`;
  if (s.priceTo) return `${from} – ₺${s.priceTo.toLocaleString("tr-TR")}`;
  return `${from}+`;
}

export function ServiceAccordion({
  categories,
  services,
}: {
  categories: ServiceCategory[];
  services: Service[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const sortedCategories = [...categories].sort(
    (a, b) => a.sortOrder - b.sortOrder,
  );

  return (
    <div className="space-y-3">
      <h2 className="font-display text-center text-3xl text-ink md:text-4xl">
        Hizmet Fiyatlarımız
      </h2>
      <div className="mt-8 space-y-3">
        {sortedCategories.map((cat) => {
          const items = services
            .filter((s) => s.categoryId === cat.id)
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
          const open = openId === cat.id;

          return (
            <div
              key={cat.id}
              className="overflow-hidden border border-line bg-mist/70 transition hover:border-bronze/50"
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : cat.id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={open}
              >
                <span className="text-sm font-semibold uppercase tracking-wide text-ink">
                  {cat.name}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center text-lg leading-none text-bronze transition ${
                    open ? "rotate-45" : ""
                  }`}
                  aria-hidden
                >
                  +
                </span>
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-line bg-paper px-5 py-4">
                    {items.length === 0 ? (
                      <p className="text-sm text-ink-soft">
                        Bu kategoride henüz hizmet yok.
                      </p>
                    ) : (
                      <ul className="divide-y divide-line">
                        {items.map((s) => (
                          <li
                            key={s.id}
                            className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <p className="font-medium text-ink">{s.name}</p>
                              {s.description ? (
                                <p className="mt-1 max-w-lg text-sm text-ink-soft">
                                  {s.description}
                                </p>
                              ) : null}
                              <p className="mt-1 text-xs text-ink-soft">
                                {s.durationMin} dk
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-3">
                              <p className="text-sm text-ink">{formatPrice(s)}</p>
                              <Link
                                href={`/randevu?service=${s.id}`}
                                className="border border-ink px-3 py-2 text-xs text-ink hover:bg-ink hover:text-paper"
                              >
                                Randevu
                              </Link>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
