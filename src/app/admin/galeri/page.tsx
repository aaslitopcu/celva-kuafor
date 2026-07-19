import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getGallery, getServiceCategories } from "@/lib/store";
import { GalleryEditor } from "@/components/admin/GalleryEditor";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const [items, categories] = await Promise.all([
    getGallery(),
    getServiceCategories(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Galeri</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Öncesi / sonrası fotoğrafları yükleyin; sitede kategorilere göre
        listelenir.
      </p>
      <div className="mt-8">
        <GalleryEditor items={items} categories={categories} />
      </div>
    </div>
  );
}
