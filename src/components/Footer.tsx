import Link from "next/link";
import { getSettings } from "@/lib/store";
import {
  buildBookingWhatsAppMessage,
  buildWhatsAppUrl,
  telHref,
} from "@/lib/whatsapp";

export async function Footer() {
  const settings = await getSettings();
  const waUrl = buildWhatsAppUrl(
    settings.whatsapp || settings.phone,
    buildBookingWhatsAppMessage({ salonName: settings.salonName }),
  );

  return (
    <footer className="mt-auto border-t border-line bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3 md:px-8">
        <div>
          <p className="font-display text-3xl tracking-[0.08em]">CELVA</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-paper/70">
            {settings.tagline}. Online, telefon veya WhatsApp ile randevu.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-bronze-soft">
            Keşfet
          </p>
          <div className="mt-4 flex flex-col gap-2 text-sm text-paper/80">
            <Link href="/hizmetler" className="hover:text-paper">
              Hizmetler & fiyat
            </Link>
            <Link href="/randevu" className="hover:text-paper">
              Randevu al
            </Link>
            <Link href="/stil-quiz" className="hover:text-paper">
              Stil Quiz
            </Link>
            <Link href="/galeri" className="hover:text-paper">
              Öncesi / Sonrası
            </Link>
            <Link href="/blog" className="hover:text-paper">
              Blog
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-bronze-soft">
            İletişim
          </p>
          <div className="mt-4 space-y-2 text-sm text-paper/80">
            <p>{settings.address}</p>
            <p>{settings.city}</p>
            <a href={telHref(settings.phone)} className="block hover:text-paper">
              {settings.phone}
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="block hover:text-paper"
            >
              {settings.email}
            </a>
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:text-paper"
            >
              WhatsApp ile randevu
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-paper/10 px-5 py-5 text-center text-xs text-paper/50 md:px-8">
        © {new Date().getFullYear()} CELVA Atelier · Tüm hakları saklıdır
      </div>
    </footer>
  );
}
