import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import {
  getBranches,
  getServiceCategories,
  getStylists,
} from "@/lib/store";
import { StylistEditor } from "@/components/admin/StylistEditor";

export const dynamic = "force-dynamic";

export default async function AdminStylistsPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const [stylists, branches, categories] = await Promise.all([
    getStylists(),
    getBranches(),
    getServiceCategories(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Stilistler / Çalışanlar</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Ekibi şubelere atayın; online randevu stilist seçimi buna göre dolar.
      </p>
      <div className="mt-8">
        <StylistEditor
          stylists={stylists}
          branches={branches}
          categories={categories}
        />
      </div>
    </div>
  );
}
