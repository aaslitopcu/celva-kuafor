"use client";

import { useEffect, useMemo, useState } from "react";
import type { Appointment, Branch, Service, Stylist } from "@/lib/types";

type Props = {
  branches: Branch[];
  services: Service[];
  stylists: Stylist[];
  appointments: Appointment[];
  initialServiceId?: string;
  initialNotes?: string;
};

function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function availableTimes(
  date: string,
  durationMin: number,
  appointments: Appointment[],
  stylistId: string,
) {
  const base = [
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
    "17:00",
    "17:30",
    "18:00",
    "18:30",
  ];
  const booked = appointments.filter(
    (a) =>
      a.date === date &&
      a.stylistId === stylistId &&
      a.status !== "cancelled",
  );
  return base.filter((slot) => {
    const start = toMinutes(slot);
    const end = start + durationMin;
    if (end > 20 * 60) return false;
    return !booked.some((a) => {
      const bStart = toMinutes(a.time);
      const bEnd = bStart + 60;
      return start < bEnd && end > bStart;
    });
  });
}

export function BookingForm({
  branches,
  services,
  stylists,
  appointments,
  initialServiceId,
  initialNotes,
}: Props) {
  const [branchId, setBranchId] = useState(branches[0]?.id || "");
  const [serviceId, setServiceId] = useState(
    initialServiceId && services.some((s) => s.id === initialServiceId)
      ? initialServiceId
      : services[0]?.id || "",
  );
  const [stylistId, setStylistId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState(initialNotes || "");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<null | { id: string; points: number }>(
    null,
  );
  const [error, setError] = useState("");

  const service = services.find((s) => s.id === serviceId);
  const selectedBranch = branches.find((b) => b.id === branchId);

  const matchedStylists = useMemo(() => {
    const atBranch = stylists.filter((s) => s.branchId === branchId);
    if (!service) return atBranch;
    return atBranch.filter((s) =>
      s.specialties.includes(service.categoryId),
    );
  }, [service, stylists, branchId]);

  useEffect(() => {
    if (!matchedStylists.find((s) => s.id === stylistId)) {
      setStylistId(matchedStylists[0]?.id || "");
    }
  }, [matchedStylists, stylistId]);

  const times = useMemo(() => {
    if (!date || !service || !stylistId) return [];
    return availableTimes(date, service.durationMin, appointments, stylistId);
  }, [date, service, stylistId, appointments]);

  useEffect(() => {
    if (time && !times.includes(time)) setTime("");
  }, [times, time]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          email,
          branchId,
          serviceId,
          stylistId,
          date,
          time,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Kayıt başarısız");
      setDone({ id: data.id, points: data.loyaltyPoints ?? 10 });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="border border-line bg-mist p-8 text-center">
        <p className="text-xs uppercase tracking-[0.2em] text-sage">
          Randevu alındı
        </p>
        <h2 className="font-display mt-3 text-3xl text-ink">Teşekkürler</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-ink-soft">
          Talebiniz alındı. Ekibimiz kısa sürede onay için sizi arayacak.
          Bu ziyaret için{" "}
          <strong className="text-ink">+{done.points} sadakat puanı</strong>{" "}
          hesabınıza işlenecek.
        </p>
        <p className="mt-4 text-xs text-ink-soft">Ref: {done.id}</p>
      </div>
    );
  }

  const minDate = new Date().toISOString().slice(0, 10);

  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-line bg-paper p-6 md:p-8">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">
          Online form
        </p>
        <h2 className="font-display mt-2 text-2xl text-ink md:text-3xl">
          Randevu talebi
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          Şube, hizmet ve stilist uzmanlığına göre uygun saatler otomatik
          filtrelenir.
        </p>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-wider text-ink-soft">
          Şube
        </span>
        <select
          required
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
          className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage"
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name} — {b.city}
            </option>
          ))}
        </select>
        {selectedBranch ? (
          <p className="mt-1.5 text-xs text-ink-soft">{selectedBranch.address}</p>
        ) : null}
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-wider text-ink-soft">
          Hizmet
        </span>
        <select
          required
          value={serviceId}
          onChange={(e) => setServiceId(e.target.value)}
          className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage"
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · {s.durationMin} dk · ₺{s.priceFrom}+
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-wider text-ink-soft">
          Stilist (uzmanlığa göre)
        </span>
        <select
          required
          value={stylistId}
          onChange={(e) => setStylistId(e.target.value)}
          disabled={matchedStylists.length === 0}
          className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage disabled:opacity-50"
        >
          {matchedStylists.length === 0 ? (
            <option value="">Bu şubede uygun stilist yok</option>
          ) : (
            matchedStylists.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.title}
              </option>
            ))
          )}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-ink-soft">
            Tarih
          </span>
          <input
            type="date"
            required
            min={minDate}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-ink-soft">
            Saat
          </span>
          <select
            required
            value={time}
            onChange={(e) => setTime(e.target.value)}
            disabled={!date}
            className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage disabled:opacity-50"
          >
            <option value="">Seçin</option>
            {times.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-ink-soft">
            Ad Soyad
          </span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wider text-ink-soft">
            Telefon
          </span>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-wider text-ink-soft">
          E-posta (opsiyonel)
        </span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage"
        />
      </label>

      <label className="block">
        <span className="text-xs uppercase tracking-wider text-ink-soft">
          Not / stil quiz sonucu
        </span>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Örn: yumuşak katlar, düşük bakım..."
          className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage"
        />
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={loading || !stylistId || matchedStylists.length === 0}
        className="w-full bg-ink px-5 py-3.5 text-sm text-paper transition hover:bg-ink-soft disabled:opacity-60"
      >
        {loading ? "Gönderiliyor..." : "Randevu talebi gönder"}
      </button>
    </form>
  );
}
