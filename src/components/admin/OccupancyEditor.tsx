"use client";

import { useState } from "react";
import type { OccupancySlot } from "@/lib/types";

export function OccupancyEditor({ initial }: { initial: OccupancySlot[] }) {
  const [slots, setSlots] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function setLevel(hour: number, level: number) {
    setSlots((prev) =>
      prev.map((s) =>
        s.hour === hour
          ? { ...s, level: Math.min(5, Math.max(1, level)) as OccupancySlot["level"] }
          : s,
      ),
    );
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/occupancy", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slots),
      });
      if (!res.ok) throw new Error("Kayıt başarısız");
      setMessage("Kaydedildi");
    } catch {
      setMessage("Hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-line bg-paper p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl">Canlı yoğunluk</h2>
          <p className="text-xs text-ink-soft">1 = sakin · 5 = çok yoğun</p>
        </div>
        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="bg-ink px-4 py-2 text-sm text-paper hover:bg-ink-soft disabled:opacity-60"
        >
          {saving ? "..." : "Kaydet"}
        </button>
      </div>
      {message && <p className="mt-2 text-xs text-sage-deep">{message}</p>}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {slots.map((s) => (
          <label key={s.hour} className="border border-line p-3 text-center">
            <span className="text-xs text-ink-soft">{s.hour}:00</span>
            <input
              type="number"
              min={1}
              max={5}
              value={s.level}
              onChange={(e) => setLevel(s.hour, Number(e.target.value))}
              className="mt-2 w-full border border-line bg-mist px-2 py-1.5 text-center text-sm"
            />
          </label>
        ))}
      </div>
    </div>
  );
}
