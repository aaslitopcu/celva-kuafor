import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import {
  getAppointments,
  getBranches,
  getGallery,
  getOccupancy,
  getServices,
  getStylists,
} from "@/lib/store";
import { OccupancyEditor } from "@/components/admin/OccupancyEditor";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const [appointments, services, stylists, branches, gallery, occupancy] =
    await Promise.all([
      getAppointments(),
      getServices(),
      getStylists(),
      getBranches(),
      getGallery(),
      getOccupancy(),
    ]);

  const pending = appointments.filter((a) => a.status === "pending").length;
  const confirmed = appointments.filter((a) => a.status === "confirmed").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Özet</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Minimal yönetim paneli — şube, randevu, hizmet, stilist, galeri.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: "Bekleyen", value: pending, href: "/admin/randevular" },
          { label: "Onaylı", value: confirmed, href: "/admin/randevular" },
          {
            label: "Şube",
            value: branches.length,
            href: "/admin/subeler",
          },
          {
            label: "Hizmet",
            value: services.length,
            href: "/admin/hizmetler",
          },
          {
            label: "Stilist",
            value: stylists.length,
            href: "/admin/stilistler",
          },
          {
            label: "Galeri",
            value: gallery.length,
            href: "/admin/galeri",
          },
        ].map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="border border-line bg-paper p-5 hover:border-sage"
          >
            <p className="text-xs uppercase tracking-wider text-ink-soft">
              {c.label}
            </p>
            <p className="font-display mt-2 text-3xl text-ink">{c.value}</p>
          </Link>
        ))}
      </div>

      <OccupancyEditor initial={occupancy} />

      <div className="border border-line bg-paper p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">Son randevular</h2>
          <Link
            href="/admin/randevular"
            className="text-sm text-sage-deep hover:underline"
          >
            Tümü
          </Link>
        </div>
        <ul className="mt-4 divide-y divide-line">
          {appointments.slice(0, 5).map((a) => (
            <li
              key={a.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
            >
              <span className="text-ink">
                {a.customerName} · {a.date} {a.time}
              </span>
              <span className="text-xs uppercase tracking-wider text-ink-soft">
                {a.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
