"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/randevu", label: "Randevu" },
  { href: "/galeri", label: "Galeri" },
  { href: "/stil-quiz", label: "Stil Quiz" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 24);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const solid = !isHome || scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[100] transition-[background-color,box-shadow] duration-300 ${
        solid
          ? "border-b border-line bg-paper/95 shadow-sm backdrop-blur-md"
          : "bg-gradient-to-b from-ink/75 via-ink/35 to-transparent"
      }`}
    >
      <div className="relative z-[101] mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <Link
          href="/"
          className={`font-display text-2xl tracking-[0.08em] ${
            solid ? "text-ink" : "text-paper drop-shadow-sm"
          }`}
          onClick={() => setOpen(false)}
        >
          CELVA
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition ${
                  solid
                    ? `text-ink-soft hover:text-ink ${active ? "text-ink" : ""}`
                    : `text-paper drop-shadow-sm hover:text-paper ${
                        active ? "underline underline-offset-4" : "text-paper/95"
                      }`
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/randevu"
            className={`px-4 py-2 text-sm font-medium tracking-wide transition ${
              solid
                ? "bg-ink text-paper hover:bg-ink-soft"
                : "border border-paper/70 bg-transparent text-paper hover:bg-paper hover:text-ink"
            }`}
          >
            Randevu Al
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          className={`relative z-[102] -mr-1 flex h-11 w-11 items-center justify-center md:hidden ${
            solid ? "text-ink" : "text-paper drop-shadow-sm"
          }`}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menü</span>
          <span className="flex w-6 flex-col gap-1.5" aria-hidden>
            <span
              className={`block h-0.5 w-6 bg-current transition ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-current transition ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-line bg-paper px-5 py-6 md:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-base text-ink-soft"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/randevu"
            className="mt-2 bg-ink px-4 py-3 text-center text-paper hover:bg-ink-soft"
            onClick={() => setOpen(false)}
          >
            Randevu Al
          </Link>
        </div>
      </div>
    </header>
  );
}
