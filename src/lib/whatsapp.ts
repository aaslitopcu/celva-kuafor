/** Digits only, with leading country code when possible (TR default 90). */
export function normalizeWhatsAppNumber(raw: string) {
  let digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) digits = `90${digits.slice(1)}`;
  if (digits.length === 10) digits = `90${digits}`;
  return digits;
}

export function buildWhatsAppUrl(phone: string, message?: string) {
  const number = normalizeWhatsAppNumber(phone);
  if (!number) return "#";
  const base = `https://wa.me/${number}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}

export function buildBookingWhatsAppMessage(input: {
  salonName?: string;
  branchName?: string;
  serviceName?: string;
  notes?: string;
}) {
  const lines = [
    `Merhaba${input.salonName ? ` ${input.salonName}` : ""},`,
    "Randevu oluşturmak istiyorum.",
  ];
  if (input.branchName) lines.push(`Şube: ${input.branchName}`);
  if (input.serviceName) lines.push(`Hizmet: ${input.serviceName}`);
  if (input.notes) lines.push(`Not: ${input.notes}`);
  lines.push("Uygun bir saat önerebilir misiniz?");
  return lines.join("\n");
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}
