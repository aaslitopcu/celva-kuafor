import { GalleryFilter } from "@/components/GalleryFilter";
import {
  getGallery,
  getServiceCategories,
  getStylists,
} from "@/lib/store";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Öncesi / Sonrası Galeri",
  description:
    "CELVA dönüşüm galerisi: renk, kesim, bakım ve gelin saçı öncesi-sonrası çalışmaları.",
  path: "/galeri",
});

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [gallery, stylists, categories] = await Promise.all([
    getGallery(),
    getStylists(),
    getServiceCategories(),
  ]);

  return (
    <div className="pt-24">
      <div className="mx-auto max-w-6xl px-5 py-12 md:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">Galeri</p>
        <h1 className="font-display mt-3 text-4xl text-ink md:text-6xl">
          Öncesi / sonrası
        </h1>
        <p className="mt-4 max-w-xl text-sm text-ink-soft">
          Dönüşümler hizmet kategorilerine göre gruplanır. Filtreleyin veya
          çalışmayı büyütün.
        </p>
        <div className="mt-10">
          <GalleryFilter
            items={gallery}
            stylists={stylists}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}
