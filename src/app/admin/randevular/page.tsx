import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import {
  getAppointments,
  getBranches,
  getServices,
  getStylists,
} from "@/lib/store";
import { AppointmentManager } from "@/components/admin/AppointmentManager";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const [appointments, services, stylists, branches] = await Promise.all([
    getAppointments(),
    getServices(),
    getStylists(),
    getBranches(),
  ]);

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Randevular</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Durum güncelleyin: pending → confirmed → completed
      </p>
      <div className="mt-8">
        <AppointmentManager
          appointments={appointments}
          services={services}
          stylists={stylists}
          branches={branches}
        />
      </div>
    </div>
  );
}
