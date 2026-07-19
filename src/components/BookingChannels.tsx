"use client";

import { useMemo, useState } from "react";
import { BookingForm } from "@/components/BookingForm";
import type { Appointment, Branch, Service, Stylist } from "@/lib/types";
import {
  buildBookingWhatsAppMessage,
  buildWhatsAppUrl,
  telHref,
} from "@/lib/whatsapp";

type Method = "online" | "phone" | "whatsapp";

type Props = {
  branches: Branch[];
  services: Service[];
  stylists: Stylist[];
  appointments: Appointment[];
  salonName: string;
  defaultPhone: string;
  defaultWhatsapp: string;
  initialServiceId?: string;
  initialNotes?: string;
};

const methods: { id: Method; label: string; hint: string }[] = [
  {
    id: "online",
    label: "Online form",
    hint: "Site üzerinden talep",
  },
  {
    id: "phone",
    label: "Telefon",
    hint: "Ara ve randevu al",
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    hint: "Mesaj ile randevu",
  },
];

export function BookingChannels({
  branches,
  services,
  stylists,
  appointments,
  salonName,
  defaultPhone,
  defaultWhatsapp,
  initialServiceId,
  initialNotes,
}: Props) {
  const [method, setMethod] = useState<Method>("online");
  const [branchId, setBranchId] = useState(branches[0]?.id || "");
  const [serviceId, setServiceId] = useState(
    initialServiceId && services.some((s) => s.id === initialServiceId)
      ? initialServiceId
      : services[0]?.id || "",
  );

  const branch = branches.find((b) => b.id === branchId);
  const service = services.find((s) => s.id === serviceId);
  const phone = branch?.phone || defaultPhone;
  const whatsapp = branch?.whatsapp || defaultWhatsapp || phone;

  const waMessage = useMemo(
    () =>
      buildBookingWhatsAppMessage({
        salonName,
        branchName: branch?.name,
        serviceName: service?.name,
        notes: initialNotes,
      }),
    [salonName, branch?.name, service?.name, initialNotes],
  );

  const waUrl = buildWhatsAppUrl(whatsapp, waMessage);

  return (
    <div className="space-y-6">
      <div className="border border-line bg-paper p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">
          Randevu al
        </p>
        <h1 className="font-display mt-2 text-3xl text-ink md:text-4xl">
          Nasıl randevu oluşturmak istersiniz?
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Online form, telefon veya WhatsApp ile randevu oluşturabilirsiniz.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {methods.map((m) => {
            const active = method === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                className={`border px-4 py-3 text-left transition ${
                  active
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-mist text-ink hover:border-bronze"
                }`}
              >
                <span className="block text-sm font-medium">{m.label}</span>
                <span
                  className={`mt-1 block text-xs ${
                    active ? "text-paper/70" : "text-ink-soft"
                  }`}
                >
                  {m.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {method === "online" ? (
        <BookingForm
          branches={branches}
          services={services}
          stylists={stylists}
          appointments={appointments}
          initialServiceId={initialServiceId}
          initialNotes={initialNotes}
        />
      ) : (
        <div className="space-y-5 border border-line bg-paper p-6 md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bronze">
              {method === "phone" ? "Telefon ile randevu" : "WhatsApp ile randevu"}
            </p>
            <h2 className="font-display mt-2 text-2xl text-ink md:text-3xl">
              {method === "phone"
                ? "Bizi arayın"
                : "WhatsApp’tan yazın"}
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Şube ve hizmet seçin; ardından{" "}
              {method === "phone" ? "arama" : "WhatsApp"} bağlantısına geçin.
            </p>
          </div>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-ink-soft">
              Şube
            </span>
            <select
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
            {branch ? (
              <p className="mt-1.5 text-xs text-ink-soft">{branch.address}</p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-xs uppercase tracking-wider text-ink-soft">
              Hizmet (opsiyonel)
            </span>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="mt-2 w-full border border-line bg-mist px-3 py-3 text-sm outline-none focus:border-sage"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>

          {method === "phone" ? (
            <div className="space-y-3">
              <p className="text-sm text-ink">
                <span className="text-ink-soft">Aranacak numara: </span>
                {phone}
              </p>
              <a
                href={telHref(phone)}
                className="inline-flex w-full items-center justify-center bg-ink px-5 py-3.5 text-sm text-paper transition hover:bg-ink-soft"
              >
                Telefon ile ara
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="border border-line bg-mist px-4 py-3 text-sm text-ink-soft whitespace-pre-line">
                {waMessage}
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center bg-ink px-5 py-3.5 text-sm text-paper transition hover:bg-ink-soft"
              >
                WhatsApp ile randevu oluştur
              </a>
              <p className="text-xs text-ink-soft">
                Mesaj önceden doldurulur; göndermeden önce düzenleyebilirsiniz.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
