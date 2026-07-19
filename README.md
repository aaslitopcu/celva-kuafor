# CELVA — Kuaför & Güzellik Atölyesi

Next.js 16 tabanlı, SEO odaklı, responsive kuaför sitesi + minimal admin panel.

## Özellikler

**Sitede tipik kuaför sitelerinden farklı olanlar:**
- Canlı yoğunluk göstergesi (saatlik doluluk)
- Stil Quiz → randevuya aktarım
- Şeffaf fiyat hesaplayıcı (saç boyu + ek bakım)
- Akıllı randevu (süre + stilist uzmanlığı filtresi)
- Öncesi/sonrası filtreli galeri
- Sadakat puanı (randevu sonrası)
- Blog + JSON-LD + sitemap/robots

## Başlatma

```bash
cd vera-kuafor
npm install
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- Varsayılan şifre: `celva2026` (`ADMIN_PASSWORD` env ile değiştirin)

## Scripts

- `npm run dev` — geliştirme
- `npm run build` — production build
- `npm run start` — production sunucu
