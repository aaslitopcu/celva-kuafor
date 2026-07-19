import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getBranches } from "@/lib/store";
import { BranchEditor } from "@/components/admin/BranchEditor";

export const dynamic = "force-dynamic";

export default async function AdminBranchesPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const branches = await getBranches();

  return (
    <div>
      <h1 className="font-display text-3xl text-ink">Şubeler</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Şube tanımlayın; stilistler ve online randevu bu şubelere bağlanır.
      </p>
      <div className="mt-8">
        <BranchEditor branches={branches} />
      </div>
    </div>
  );
}
