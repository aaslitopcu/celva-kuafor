"use client";

import { useMemo, useState } from "react";
import type { Service } from "@/lib/types";
import Link from "next/link";

const hairLengths = [
  { id: "short", label: "Kısa", factor: 0.9 },
  { id: "medium", label: "Orta", factor: 1 },
  { id: "long", label: "Uzun", factor: 1.2 },
] as const;

export function PriceEstimator({ services }: { services: Service[] }) {
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [length, setLength] = useState<(typeof hairLengths)[number]["id"]>(
    "medium",
  );
  const [addonCare, setAddonCare] = useState(false);

  const estimate = useMemo(() => {
    const service = services.find((s) => s.id === serviceId);
    if (!service) return null;
    const factor = hairLengths.find((l) => l.id === length)?.factor ?? 1;
    const from = Math.round(service.priceFrom * factor);
    const to = Math.round((service.priceTo ?? service.priceFrom) * factor);
    const care = addonCare ? 650 : 0;
    return {
      from: from + care,
      to: to + care,
      duration: service.durationMin + (addonCare ? 30 : 0),
      name: service.name,
    };
  }, [serviceId, length, addonCare, services]);

  return (
    <div className="border border-line bg-paper p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.2em] text-bronze">
        Fiyat şeffaflığı
      </p>
      <h3 className="font-display mt-2 text-2xl text-ink md:text-3xl">
        Ne kadar tutar?
      </h3>
      <p className="mt-2 text-sm text-ink-soft">
        Sürpriz fatura yok. Saç boyu ve ek bakıma göre anlık aralık.
      </p>

      <div className="mt-6 space-y-5">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-ink-soft">
            Hizmet
          </span>
          <select
            className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="text-xs uppercase tracking-wider text-ink-soft">
            Saç boyu
          </span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {hairLengths.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLength(l.id)}
                className={`border px-3 py-2.5 text-sm transition ${
                  length === l.id
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-mist text-ink hover:border-ink/40"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={addonCare}
            onChange={(e) => setAddonCare(e.target.checked)}
            className="h-4 w-4 accent-sage-deep"
          />
          Bond / onarım bakımı ekle (+₺650)
        </label>
      </div>

      {estimate && (
        <div className="mt-8 border-t border-line pt-6">
          <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
            Tahmini aralık · {estimate.duration} dk
          </p>
          <p className="font-display mt-2 text-3xl text-ink">
            ₺{estimate.from.toLocaleString("tr-TR")} – ₺
            {estimate.to.toLocaleString("tr-TR")}
          </p>
          <Link
            href={`/randevu?service=${serviceId}`}
            className="mt-5 inline-flex bg-paper px-5 py-3 text-sm text-ink transition hover:bg-bronze-soft"
          >
            Bu hizmetle randevu al
          </Link>
        </div>
      )}
    </div>
  );
}
