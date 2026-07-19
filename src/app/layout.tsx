import type { Metadata } from "next";
import { Fraunces, Figtree } from "next/font/google";
import { createMetadata, localBusinessJsonLd } from "@/lib/seo";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  ...createMetadata(),
  keywords: [
    "kuaför kadıköy",
    "kuaför moda",
    "balayage istanbul",
    "online randevu kuaför",
    "celva kuaför",
  ],
  authors: [{ name: "CELVA Atelier" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = localBusinessJsonLd();

  return (
    <html
      lang="tr"
      data-scroll-behavior="smooth"
      className={`${fraunces.variable} ${figtree.variable} h-full`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col antialiased"
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
