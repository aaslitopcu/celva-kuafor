import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://celvaatelier.com";

export const siteConfig = {
  name: "CELVA",
  fullName: "CELVA Kuaför & Güzellik Atölyesi",
  description:
    "Kadıköy Moda'da akıllı randevu, canlı yoğunluk, stil quiz ve şeffaf fiyatlandırma ile modern kuaför deneyimi.",
  url: SITE_URL,
  locale: "tr_TR",
  phone: "+90 216 555 01 24",
  email: "merhaba@celvaatelier.com",
  address: {
    street: "Caferağa Mah. Moda Cad. No:48",
    locality: "Kadıköy",
    region: "İstanbul",
    country: "TR",
  },
};

export function createMetadata({
  title,
  description,
  path = "/",
  image,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
} = {}): Metadata {
  const pageTitle = title
    ? `${title} | ${siteConfig.name}`
    : `${siteConfig.fullName} | Kadıköy Moda`;
  const desc = description || siteConfig.description;
  const url = `${siteConfig.url}${path}`;
  const ogImage = image || `${siteConfig.url}/og.jpg`;

  return {
    title: pageTitle,
    description: desc,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: path },
    openGraph: {
      title: pageTitle,
      description: desc,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: desc,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: siteConfig.fullName,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    image: `${siteConfig.url}/og.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.locality,
      addressRegion: siteConfig.address.region,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 40.9847,
      longitude: 29.0254,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    priceRange: "₺₺₺",
    areaServed: "İstanbul",
  };
}
