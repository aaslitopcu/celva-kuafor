"use client";

import type { OccupancySlot } from "@/lib/types";

const labels = ["Sakin", "Rahat", "Normal", "Yoğun", "Çok yoğun"];

export function OccupancyMeter({ slots }: { slots: OccupancySlot[] }) {
  const now = new Date().getHours();
  const current =
    slots.find((s) => s.hour === now) ||
    slots.reduce((a, b) =>
      Math.abs(b.hour - now) < Math.abs(a.hour - now) ? b : a,
    );

  return (
    <section className="border-y border-line bg-mist/60">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-bronze">
              <span className="live-dot inline-block h-1.5 w-1.5 rounded-full bg-bronze" />
              Canlı yoğunluk
            </div>
            <h2 className="font-display mt-3 text-3xl text-ink md:text-4xl">
              Bugün salon nasıl?
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
              Tipik kuaför sitelerinde olmayan gerçek zamanlı yoğunluk
              göstergesi. Daha sakin bir saat seçerek bekleme sürenizi kısaltın.
            </p>
          </div>
          <div className="rounded-sm border border-line bg-paper px-6 py-5">
            <p className="text-xs uppercase tracking-[0.18em] text-ink-soft">
              Şu an · {current.hour}:00
            </p>
            <p className="font-display mt-2 text-3xl text-ink">
              {labels[current.level - 1]}
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-5 gap-2 sm:grid-cols-10">
          {slots.map((slot, i) => (
            <div key={slot.hour} className="text-center">
              <div className="flex h-24 items-end justify-center rounded-sm bg-mist-deep/50 p-1">
                <div
                  className={`bar-grow w-full rounded-sm ${
                    slot.hour === current.hour ? "bg-ink" : "bg-bronze/80"
                  }`}
                  style={{
                    height: `${slot.level * 18}%`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                  title={`${slot.hour}:00 — ${labels[slot.level - 1]}`}
                />
              </div>
              <p className="mt-2 text-[11px] text-ink-soft">{slot.hour}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
