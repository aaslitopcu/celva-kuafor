import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated, destroySession } from "@/lib/auth";

async function logoutAction() {
  "use server";
  await destroySession();
  redirect("/admin/login");
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mist">
      <AdminChrome>{children}</AdminChrome>
    </div>
  );
}

async function AdminChrome({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();

  if (!authed) {
    return <>{children}</>;
  }

  return (
    <>
      <header className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-xl tracking-wide">
              CELVA Admin
            </Link>
            <nav className="hidden gap-4 text-sm text-ink-soft sm:flex">
              <Link href="/admin" className="hover:text-ink">
                Özet
              </Link>
              <Link href="/admin/randevular" className="hover:text-ink">
                Randevular
              </Link>
              <Link href="/admin/hizmetler" className="hover:text-ink">
                Hizmetler
              </Link>
              <Link href="/admin/subeler" className="hover:text-ink">
                Şubeler
              </Link>
              <Link href="/admin/stilistler" className="hover:text-ink">
                Stilistler
              </Link>
              <Link href="/admin/galeri" className="hover:text-ink">
                Galeri
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link href="/" className="text-ink-soft hover:text-ink">
              Siteye dön
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="border border-line px-3 py-1.5 text-ink-soft hover:bg-mist"
              >
                Çıkış
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-8">{children}</div>
    </>
  );
}
