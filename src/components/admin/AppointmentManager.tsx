"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Appointment, Branch, Service, Stylist } from "@/lib/types";

export function AppointmentManager({
  appointments,
  services,
  stylists,
  branches,
}: {
  appointments: Appointment[];
  services: Service[];
  stylists: Stylist[];
  branches: Branch[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);

  async function setStatus(id: string, status: Appointment["status"]) {
    setBusy(id);
    await fetch("/api/appointments/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setBusy(null);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {appointments.map((a) => {
        const service = services.find((s) => s.id === a.serviceId);
        const stylist = stylists.find((s) => s.id === a.stylistId);
        const branch = branches.find((b) => b.id === a.branchId);
        return (
          <div key={a.id} className="border border-line bg-paper p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium text-ink">{a.customerName}</p>
                <p className="mt-1 text-sm text-ink-soft">
                  {a.phone}
                  {a.email ? ` · ${a.email}` : ""}
                </p>
                <p className="mt-2 text-sm text-ink">
                  {branch?.name ? `${branch.name} · ` : ""}
                  {a.date} {a.time} · {service?.name} · {stylist?.name}
                </p>
                {a.notes && (
                  <p className="mt-1 text-xs text-ink-soft">{a.notes}</p>
                )}
              </div>
              <span className="text-[11px] uppercase tracking-wider text-sage">
                {a.status}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {(
                [
                  "confirmed",
                  "pending",
                  "completed",
                  "cancelled",
                ] as Appointment["status"][]
              ).map((status) => (
                <button
                  key={status}
                  type="button"
                  disabled={busy === a.id || a.status === status}
                  onClick={() => setStatus(a.id, status)}
                  className="border border-line px-3 py-1.5 text-xs text-ink-soft hover:bg-mist disabled:opacity-40"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {appointments.length === 0 && (
        <p className="text-sm text-ink-soft">Henüz randevu yok.</p>
      )}
    </div>
  );
}
