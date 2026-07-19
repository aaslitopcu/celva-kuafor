import { BookingChannels } from "@/components/BookingChannels";
import {
  getAppointments,
  getBranches,
  getServices,
  getSettings,
  getStylists,
} from "@/lib/store";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Randevu Al",
  description:
    "CELVA'da online form, telefon veya WhatsApp ile randevu oluşturun.",
  path: "/randevu",
});

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ service?: string; notes?: string }>;
};

export default async function BookingPage({ searchParams }: Props) {
  const params = await searchParams;
  const [branches, services, stylists, appointments, settings] =
    await Promise.all([
      getBranches(),
      getServices(),
      getStylists(),
      getAppointments(),
      getSettings(),
    ]);

  return (
    <div className="pt-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1fr_0.85fr] md:px-8">
        <BookingChannels
          branches={branches}
          services={services}
          stylists={stylists}
          appointments={appointments}
          salonName={settings.salonName}
          defaultPhone={settings.phone}
          defaultWhatsapp={settings.whatsapp}
          initialServiceId={params.service}
          initialNotes={params.notes}
        />
        <aside className="space-y-6">
          <div className="border border-line bg-mist/50 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-bronze">
              Randevu kanalları
            </p>
            <ul className="mt-4 space-y-3 text-sm text-ink-soft">
              <li>
                <strong className="text-ink">Online:</strong> Şube, hizmet ve
                stilist seçerek talep gönderin
              </li>
              <li>
                <strong className="text-ink">Telefon:</strong> Seçtiğiniz şubeyi
                arayın
              </li>
              <li>
                <strong className="text-ink">WhatsApp:</strong> Hazır mesajla
                hızlı randevu isteyin
              </li>
            </ul>
          </div>
          <div className="border border-line bg-paper p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-sage">
              İpucu
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Stil Quiz sonucunu online formdaki nota yapıştırabilir veya
              WhatsApp mesajına ekleyebilirsiniz.{" "}
              <a href="/stil-quiz" className="text-sage-deep underline">
                Quiz&apos;e git
              </a>
            </p>
            {params.notes ? (
              <p className="mt-4 border-t border-line pt-4 text-xs text-ink">
                Quiz notunuz: {params.notes}
              </p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
