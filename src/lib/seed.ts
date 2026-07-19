import type { SiteData } from "./types";

export const seedData: SiteData = {
  settings: {
    salonName: "CELVA",
    tagline: "Saçın hikâyesini birlikte yazıyoruz",
    phone: "+90 216 555 01 24",
    email: "merhaba@celvaatelier.com",
    address: "Caferağa Mah. Moda Cad. No:48",
    city: "Kadıköy, İstanbul",
    mapsUrl: "https://maps.google.com/?q=Kadikoy+Moda",
    whatsapp: "905555550124",
    loyaltyPerVisit: 10,
    hours: [
      { day: "Pazartesi", open: "10:00", close: "20:00" },
      { day: "Salı", open: "10:00", close: "20:00" },
      { day: "Çarşamba", open: "10:00", close: "20:00" },
      { day: "Perşembe", open: "10:00", close: "21:00" },
      { day: "Cuma", open: "10:00", close: "21:00" },
      { day: "Cumartesi", open: "09:00", close: "19:00" },
      { day: "Pazar", open: "11:00", close: "17:00", closed: false },
    ],
  },
  branches: [
    {
      id: "br-kadikoy",
      name: "Kadıköy Moda",
      phone: "+90 216 555 01 24",
      email: "kadikoy@celvaatelier.com",
      address: "Caferağa Mah. Moda Cad. No:48",
      city: "Kadıköy, İstanbul",
      mapsUrl: "https://maps.google.com/?q=Kadikoy+Moda",
      whatsapp: "905555550124",
    },
    {
      id: "br-besiktas",
      name: "Beşiktaş",
      phone: "+90 212 555 01 25",
      email: "besiktas@celvaatelier.com",
      address: "Sinanpaşa Mah. Beşiktaş Cad. No:12",
      city: "Beşiktaş, İstanbul",
      mapsUrl: "https://maps.google.com/?q=Besiktas",
      whatsapp: "905555550125",
    },
  ],
  serviceCategories: [
    { id: "cat-kesim", name: "Saç Kesim Hizmetleri", slug: "kesim", sortOrder: 0 },
    {
      id: "cat-sekillendirme",
      name: "Şekillendirme Hizmetleri",
      slug: "sekillendirme",
      sortOrder: 1,
    },
    {
      id: "cat-renk",
      name: "Renklendirme Hizmetleri",
      slug: "renk",
      sortOrder: 2,
    },
    {
      id: "cat-bakim",
      name: "Saç Bakımı Düzleştirme Hizmetleri",
      slug: "bakim",
      sortOrder: 3,
    },
    {
      id: "cat-kaynak",
      name: "Kaynak Uygulama",
      slug: "kaynak",
      sortOrder: 4,
    },
    { id: "cat-gelin", name: "Gelin Sepeti", slug: "gelin", sortOrder: 5 },
    { id: "cat-kas", name: "Kaş Dizayn", slug: "kas-dizayn", sortOrder: 6 },
    {
      id: "cat-elayak",
      name: "El Ayak Bakım",
      slug: "el-ayak-bakim",
      sortOrder: 7,
    },
    {
      id: "cat-kisisel",
      name: "Kişisel Bakım",
      slug: "kisisel-bakim",
      sortOrder: 8,
    },
  ],
  services: [
    {
      id: "svc-kesim",
      name: "Şekillendirici Kesim",
      slug: "sekillendirici-kesim",
      description:
        "Yüz hatınıza ve yaşam temposunuza göre tasarlanan kişisel kesim.",
      categoryId: "cat-kesim",
      durationMin: 45,
      priceFrom: 650,
      priceTo: 950,
      popular: true,
      sortOrder: 0,
    },
    {
      id: "svc-uc-kesim",
      name: "Uç Kesim",
      slug: "uc-kesim",
      description: "Saç uçlarını yenileyen hızlı kesim.",
      categoryId: "cat-kesim",
      durationMin: 30,
      priceFrom: 400,
      priceTo: 600,
      sortOrder: 1,
    },
    {
      id: "svc-fön",
      name: "Fön & Şekillendirme",
      slug: "fon",
      description: "Günlük veya özel gün için hacimli, uzun ömürlü şekillendirme.",
      categoryId: "cat-sekillendirme",
      durationMin: 40,
      priceFrom: 450,
      priceTo: 750,
      sortOrder: 0,
    },
    {
      id: "svc-yikama",
      name: "Saç Yıkama",
      slug: "sac-yikama",
      description: "Masajlı yıkama ve saça uygun bakım ürünüyle kurulama.",
      categoryId: "cat-sekillendirme",
      durationMin: 20,
      priceFrom: 250,
      priceTo: 400,
      sortOrder: 1,
    },
    {
      id: "svc-balayage",
      name: "Balayage & Soft Blend",
      slug: "balayage",
      description:
        "Doğal geçişli ışıklandırma. Saç tipine özel formül ve bakım protokolü.",
      categoryId: "cat-renk",
      durationMin: 180,
      priceFrom: 3200,
      priceTo: 5500,
      popular: true,
      sortOrder: 0,
    },
    {
      id: "svc-renk",
      name: "Tek Renk Boyama",
      slug: "tek-renk",
      description: "Kalıcı veya yarı kalıcı tek ton uygulama, saç sağlığı odaklı.",
      categoryId: "cat-renk",
      durationMin: 120,
      priceFrom: 1800,
      priceTo: 2800,
      sortOrder: 1,
    },
    {
      id: "svc-ombre",
      name: "Ombre / Sombre",
      slug: "ombre",
      description: "Kökten uca kontrollü geçiş, bakım kit önerisiyle.",
      categoryId: "cat-renk",
      durationMin: 150,
      priceFrom: 2800,
      priceTo: 4500,
      sortOrder: 2,
    },
    {
      id: "svc-keratin",
      name: "Keratin & Bond Bakımı",
      slug: "keratin-bakim",
      description:
        "Kırılma önleyici bond tedavisi ve nem dengesi. Renk sonrası önerilir.",
      categoryId: "cat-bakim",
      durationMin: 90,
      priceFrom: 2200,
      priceTo: 3800,
      sortOrder: 0,
    },
    {
      id: "svc-sac-botoksu",
      name: "Saç Botoksu",
      slug: "sac-botoksu",
      description: "Derin onarım, parlaklık ve yumuşaklık. 4–6 hafta etki.",
      categoryId: "cat-bakim",
      durationMin: 75,
      priceFrom: 1600,
      priceTo: 2400,
      sortOrder: 1,
    },
    {
      id: "svc-kaynak",
      name: "Saç Kaynak",
      slug: "sac-kaynak",
      description: "Doğal görünüm için kaynak uygulama ve bakım önerisi.",
      categoryId: "cat-kaynak",
      durationMin: 120,
      priceFrom: 3500,
      priceTo: 12000,
      sortOrder: 0,
    },
    {
      id: "svc-gelin",
      name: "Gelin Saçı & Prova",
      slug: "gelin-saci",
      description:
        "Prova + düğün günü. Stil quiz sonucuna göre look önerisi dahildir.",
      categoryId: "cat-gelin",
      durationMin: 150,
      priceFrom: 4500,
      priceTo: 8500,
      popular: true,
      sortOrder: 0,
    },
    {
      id: "svc-kas",
      name: "Kaş Dizayn",
      slug: "kas-dizayn",
      description: "Yüz hatına uygun kaş şekillendirme.",
      categoryId: "cat-kas",
      durationMin: 30,
      priceFrom: 350,
      priceTo: 550,
      sortOrder: 0,
    },
    {
      id: "svc-manikur",
      name: "Manikür",
      slug: "manikur",
      description: "Klasik manikür ve bakım.",
      categoryId: "cat-elayak",
      durationMin: 45,
      priceFrom: 500,
      priceTo: 800,
      sortOrder: 0,
    },
    {
      id: "svc-pedikur",
      name: "Pedikür",
      slug: "pedikur",
      description: "Klasik pedikür ve bakım.",
      categoryId: "cat-elayak",
      durationMin: 50,
      priceFrom: 600,
      priceTo: 900,
      sortOrder: 1,
    },
    {
      id: "svc-kas-agda",
      name: "Kaş & Yüz Ağda",
      slug: "kas-yuz-agda",
      description: "Hassas bölge için nazik ağda uygulaması.",
      categoryId: "cat-kisisel",
      durationMin: 25,
      priceFrom: 300,
      priceTo: 500,
      sortOrder: 0,
    },
  ],
  stylists: [
    {
      id: "sty-elif",
      name: "Elif Kara",
      title: "Sanat Yönetmeni",
      branchId: "br-kadikoy",
      specialties: ["cat-renk", "cat-kesim", "cat-gelin"],
      bio: "12 yıllık deneyim. Balayage ve yüz şekline özel kesimde uzman.",
      image:
        "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80",
    },
    {
      id: "sty-mert",
      name: "Mert Aydın",
      title: "Renk Uzmanı",
      branchId: "br-besiktas",
      specialties: ["cat-renk", "cat-bakim"],
      bio: "Formül odaklı renk çalışmaları. Soft blend ve düzeltme uzmanı.",
      image:
        "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80",
    },
    {
      id: "sty-selin",
      name: "Selin Yılmaz",
      title: "Stil & Bakım",
      branchId: "br-kadikoy",
      specialties: ["cat-kesim", "cat-sekillendirme", "cat-bakim"],
      bio: "Günlük giyilebilir stiller ve bakım protokolleri.",
      image:
        "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=600&q=80",
    },
  ],
  appointments: [
    {
      id: "apt-demo-1",
      customerName: "Ayşe Demir",
      phone: "0532 111 22 33",
      email: "ayse@example.com",
      branchId: "br-kadikoy",
      serviceId: "svc-balayage",
      stylistId: "sty-elif",
      date: "2026-07-20",
      time: "14:00",
      status: "confirmed",
      createdAt: "2026-07-18T10:00:00.000Z",
      loyaltyPoints: 10,
    },
    {
      id: "apt-demo-2",
      customerName: "Zeynep Kaya",
      phone: "0533 444 55 66",
      branchId: "br-kadikoy",
      serviceId: "svc-kesim",
      stylistId: "sty-selin",
      date: "2026-07-21",
      time: "11:00",
      status: "pending",
      createdAt: "2026-07-19T08:30:00.000Z",
    },
  ],
  gallery: [
    {
      id: "gal-1",
      title: "Soft caramel balayage",
      categoryId: "cat-renk",
      before:
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      after:
        "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&q=80",
      stylistId: "sty-elif",
    },
    {
      id: "gal-2",
      title: "Katlı bob kesim",
      categoryId: "cat-kesim",
      before:
        "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&q=80",
      after:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&q=80",
      stylistId: "sty-selin",
    },
    {
      id: "gal-3",
      title: "Soğuk kül ton düzeltme",
      categoryId: "cat-renk",
      before:
        "https://images.unsplash.com/photo-1560869713-bf0c1adf4f54?w=800&q=80",
      after:
        "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=800&q=80",
      stylistId: "sty-mert",
    },
    {
      id: "gal-4",
      title: "Gelin topuz & doku",
      categoryId: "cat-gelin",
      before:
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
      after:
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
      stylistId: "sty-elif",
    },
    {
      id: "gal-5",
      title: "Keratin sonrası parlaklık",
      categoryId: "cat-bakim",
      before:
        "https://images.unsplash.com/photo-1634449573010-91bd8000ba47?w=800&q=80",
      after:
        "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80",
      stylistId: "sty-mert",
    },
    {
      id: "gal-6",
      title: "Dalgalı şekillendirme",
      categoryId: "cat-sekillendirme",
      before:
        "https://images.unsplash.com/photo-1595475884564-07393ea29f49?w=800&q=80",
      after:
        "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&q=80",
      stylistId: "sty-selin",
    },
  ],
  posts: [
    {
      id: "post-1",
      slug: "yaz-2026-renk-trendleri",
      title: "2026 Yaz Renk Trendleri: Soft Blend mi, Cesur Kontrast mı?",
      excerpt:
        "Bu yaz İstanbul ışığında öne çıkan tonlar, bakım ihtiyacı ve kimlere yakıştığı.",
      cover:
        "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1200&q=80",
      publishedAt: "2026-06-12",
      tags: ["renk", "trend", "bakım"],
      content: `## Soft blend neden önde?

Yaz ışığında sert çizgiler yerine yumuşak geçişler daha doğal duruyor. Balayage ve soft blend, kök büyüdükçe de şık kalıyor.

## Kimlere öneriyoruz?

- Ofis & günlük yaşam dengesi arayanlar
- İlk kez renk yaptıracaklar
- Saç sağlığını korumak isteyenler

## Bakım notu

Renk sonrası bond bakımı ve UV korumalı sprey, tonun ömrünü 2–3 hafta uzatabilir.`,
    },
    {
      id: "post-2",
      slug: "kesim-oncesi-hazirlik",
      title: "Kesim Öncesi 5 Dakikalık Hazırlık Checklist",
      excerpt:
        "Randevudan önce stilistinize ne söylemelisiniz? Kısa bir kontrol listesi.",
      cover:
        "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1200&q=80",
      publishedAt: "2026-05-28",
      tags: ["kesim", "randevu"],
      content: `## Ne getirmelisiniz?

Beğendiğiniz 2–3 referans fotoğraf yeterli. Filtreli görseller yerine doğal ışık tercih edin.

## Ne söylemeli?

- Günlük bakım süreniz
- Saçınızın nasıl davrandığı (yağlı kök, kuru uç vb.)
- Önümüzdeki 3 ayda renk planınız

CELVA'da stil quiz sonucu randevuya otomatik not olarak eklenebilir.`,
    },
    {
      id: "post-3",
      slug: "sac-sagligi-renk-sonrasi",
      title: "Renk Sonrası Saç Sağlığı: İlk 14 Gün",
      excerpt:
        "İlk iki hafta tonu ve dokuyu korumanın pratik yolları.",
      cover:
        "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=1200&q=80",
      publishedAt: "2026-04-15",
      tags: ["bakım", "renk"],
      content: `## İlk 48 saat

Sıcak su ve sık yıkamadan kaçının. Sulfatlı şampuanlar tonu hızla soldurur.

## 3–14. gün

Haftada 1–2 kez maske, soğuk durulama ve ısı koruyucu. CELVA sadakat üyelerine bakım protokolü PDF olarak iletilir.`,
    },
  ],
  occupancy: [
    { hour: 10, level: 2 },
    { hour: 11, level: 3 },
    { hour: 12, level: 4 },
    { hour: 13, level: 3 },
    { hour: 14, level: 5 },
    { hour: 15, level: 5 },
    { hour: 16, level: 4 },
    { hour: 17, level: 3 },
    { hour: 18, level: 2 },
    { hour: 19, level: 1 },
  ],
};
