import { PriceEstimator } from "@/components/PriceEstimator";
import { ServiceAccordion } from "@/components/ServiceAccordion";
import { getServiceCategories, getServices } from "@/lib/store";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Hizmetler & Fiyatlar",
  description:
    "CELVA hizmet menüsü: kategorilere göre kesim, renk, bakım ve daha fazlası. Şeffaf fiyat aralıkları.",
  path: "/hizmetler",
});

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [categories, services] = await Promise.all([
    getServiceCategories(),
    getServices(),
  ]);

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">Menü</p>
        <h1 className="font-display mt-3 text-4xl text-ink md:text-6xl">
          Hizmetler & fiyatlar
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
          Kategorilere göre fiyat listesi. Detaylı tahmin için sağdaki
          hesaplayıcıyı kullanın.
        </p>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <ServiceAccordion categories={categories} services={services} />
          <div className="lg:sticky lg:top-28 lg:self-start">
            <PriceEstimator services={services} />
          </div>
        </div>
      </div>
    </div>
  );
}
