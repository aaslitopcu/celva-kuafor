import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getServiceCategories, getServices } from "@/lib/store";
import { ServiceEditor } from "@/components/admin/ServiceEditor";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const [categories, services] = await Promise.all([
    getServiceCategories(),
    getServices(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Hizmetler</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Kategorileri ve altındaki hizmetleri yönetin; site buradan dolar.
      </p>
      <div className="mt-8">
        <ServiceEditor categories={categories} services={services} />
      </div>
    </div>
  );
}
