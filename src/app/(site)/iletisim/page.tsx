import { getSettings } from "@/lib/store";
import { createMetadata } from "@/lib/seo";
import {
  buildBookingWhatsAppMessage,
  buildWhatsAppUrl,
  telHref,
} from "@/lib/whatsapp";

export const metadata = createMetadata({
  title: "İletişim",
  description:
    "CELVA Kuaför Kadıköy Moda iletişim, adres, çalışma saatleri ve WhatsApp.",
  path: "/iletisim",
});

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const settings = await getSettings();
  const waUrl = buildWhatsAppUrl(
    settings.whatsapp || settings.phone,
    buildBookingWhatsAppMessage({ salonName: settings.salonName }),
  );

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">
          İletişim
        </p>
        <h1 className="font-display mt-3 text-4xl text-ink md:text-6xl">
          Bizi ziyaret edin
        </h1>

        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sage">
                Adres
              </p>
              <p className="mt-2 text-ink">
                {settings.address}
                <br />
                {settings.city}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sage">
                Telefon & e-posta
              </p>
              <a
                href={telHref(settings.phone)}
                className="mt-2 block text-ink hover:text-sage-deep"
              >
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="block text-ink hover:text-sage-deep"
              >
                {settings.email}
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sage">
                WhatsApp
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex border border-ink px-4 py-2 text-sm text-ink hover:bg-ink hover:text-paper"
              >
                WhatsApp ile randevu oluştur
              </a>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-sage">
                Çalışma saatleri
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ink-soft">
                {settings.hours.map((h) => (
                  <li key={h.day} className="flex justify-between gap-4 border-b border-line py-2">
                    <span>{h.day}</span>
                    <span>
                      {h.closed ? "Kapalı" : `${h.open} – ${h.close}`}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="min-h-[360px] border border-line bg-mist">
            <iframe
              title="CELVA harita"
              className="h-full min-h-[360px] w-full grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=Kad%C4%B1k%C3%B6y%20Moda&t=&z=15&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
