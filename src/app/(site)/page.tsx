import Link from "next/link";
import { OccupancyMeter } from "@/components/OccupancyMeter";
import { PriceEstimator } from "@/components/PriceEstimator";
import {
  getGallery,
  getOccupancy,
  getPosts,
  getServices,
  getStylists,
} from "@/lib/store";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: undefined,
  path: "/",
});

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [services, stylists, occupancy, gallery, posts] = await Promise.all([
    getServices(),
    getStylists(),
    getOccupancy(),
    getGallery(),
    getPosts(),
  ]);

  const popular = services.filter((s) => s.popular);

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden grain">
        <div
          className="absolute inset-0 scale-105 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1800&q=80)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(20,17,15,0.72) 0%, rgba(20,17,15,0.35) 48%, rgba(20,17,15,0.55) 100%), linear-gradient(to top, rgba(20,17,15,0.55) 0%, transparent 45%)",
          }}
        />
        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 md:justify-center md:px-8 md:pb-24">
          <p className="reveal text-[11px] uppercase tracking-[0.42em] text-bronze-soft">
            Kadıköy · Moda
          </p>
          <h1 className="reveal reveal-delay-1 font-display mt-5 max-w-3xl text-5xl leading-[0.95] text-paper md:text-7xl lg:text-[7.5rem]">
            CELVA
          </h1>
          <div className="reveal reveal-delay-1 mt-5 h-px w-16 bg-bronze" />
          <p className="reveal reveal-delay-2 mt-6 max-w-md text-base leading-relaxed text-paper/85 md:text-lg">
            Saçın hikâyesini birlikte yazıyoruz. Özenli randevu, canlı yoğunluk
            ve kişisel stil eşleştirmesiyle.
          </p>
          <div className="reveal reveal-delay-3 mt-10 flex flex-wrap gap-3">
            <Link
              href="/randevu"
              className="bg-paper px-7 py-3.5 text-sm tracking-wide text-ink transition hover:bg-bronze-soft"
            >
              Randevu Al
            </Link>
            <Link
              href="/stil-quiz"
              className="border border-paper/50 px-7 py-3.5 text-sm tracking-wide text-paper transition hover:border-bronze-soft hover:text-bronze-soft"
            >
              Stil Quiz
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-bronze">
            Neden farklı?
          </p>
          <h2 className="font-display mt-3 text-3xl text-ink md:text-5xl">
            Tipik kuaför sitelerinde olmayanlar
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {[
            {
              title: "Canlı yoğunluk",
              text: "Günün saatlerine göre salon doluluğunu görün, sakin slot seçin.",
            },
            {
              title: "Stil Quiz",
              text: "4 soruda size uygun hizmet önerisi; sonucu randevuya aktarın.",
            },
            {
              title: "Şeffaf fiyat",
              text: "Saç boyu ve ek bakıma göre anlık fiyat aralığı hesaplayın.",
            },
          ].map((f, i) => (
            <div
              key={f.title}
              className="border-t border-line pt-6"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <h3 className="font-display text-2xl text-ink">{f.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <OccupancyMeter slots={occupancy} />

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bronze">
              Popüler hizmetler
            </p>
            <h2 className="font-display mt-3 text-3xl text-ink md:text-4xl">
              Öne çıkanlar
            </h2>
          </div>
          <Link
            href="/hizmetler"
            className="text-sm text-sage-deep underline-offset-4 hover:underline"
          >
            Tüm hizmetler & fiyatlar
          </Link>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {popular.map((s) => (
            <Link
              key={s.id}
              href={`/randevu?service=${s.id}`}
              className="group border border-line bg-mist/40 p-6 transition hover:border-sage hover:bg-paper"
            >
              <p className="text-xs uppercase tracking-wider text-ink-soft">
                {s.durationMin} dk
              </p>
              <h3 className="font-display mt-2 text-2xl text-ink group-hover:text-sage-deep">
                {s.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                {s.description}
              </p>
              <p className="mt-5 text-sm text-ink">
                ₺{s.priceFrom.toLocaleString("tr-TR")}
                {s.priceTo ? ` – ₺${s.priceTo.toLocaleString("tr-TR")}` : "+"}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 md:grid-cols-2 md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-bronze">
              Fiyat şeffaflığı
            </p>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">
              Sürpriz fatura yok
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/70">
              Çoğu kuaför sitesi yalnızca &quot;fiyat için arayın&quot; der. CELVA
              anlık aralık gösterir; randevuya tek tıkla geçersiniz.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {stylists.map((st) => (
                <div key={st.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={st.image}
                    alt={st.name}
                    className="aspect-[3/4] w-full object-cover"
                  />
                  <p className="mt-3 font-display text-lg">{st.name}</p>
                  <p className="text-xs text-paper/60">{st.title}</p>
                </div>
              ))}
            </div>
          </div>
          <PriceEstimator services={services} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 md:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-bronze">
              Dönüşümler
            </p>
            <h2 className="font-display mt-3 text-3xl text-ink md:text-4xl">
              Öncesi / sonrası
            </h2>
          </div>
          <Link
            href="/galeri"
            className="text-sm text-sage-deep underline-offset-4 hover:underline"
          >
            Galeri
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.slice(0, 3).map((g) => (
            <Link key={g.id} href="/galeri" className="group overflow-hidden">
              <div className="grid grid-cols-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.before}
                  alt=""
                  className="aspect-[3/4] object-cover transition duration-700 group-hover:scale-105"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={g.after}
                  alt=""
                  className="aspect-[3/4] object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 font-display text-lg text-ink">{g.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-mist/50">
        <div className="mx-auto max-w-6xl px-5 py-20 md:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-bronze">
                Blog
              </p>
              <h2 className="font-display mt-3 text-3xl text-ink">
                Bakım & trend notları
              </h2>
            </div>
            <Link href="/blog" className="text-sm text-sage-deep hover:underline">
              Tümü
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover}
                  alt=""
                  className="aspect-[16/10] w-full object-cover transition duration-500 group-hover:opacity-90"
                />
                <p className="mt-4 text-xs text-ink-soft">
                  {new Date(post.publishedAt).toLocaleDateString("tr-TR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h3 className="font-display mt-2 text-xl text-ink group-hover:text-sage-deep">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 text-center md:px-8">
        <h2 className="font-display text-3xl text-ink md:text-5xl">
          Bir sonraki look bir randevu uzağınızda
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm text-ink-soft">
          Sadakat puanı her ziyarette birikir. Quiz sonucunu not olarak
          ekleyebilirsiniz.
        </p>
        <Link
          href="/randevu"
          className="mt-8 inline-flex border border-ink bg-ink px-8 py-3.5 text-sm tracking-wide text-paper transition hover:bg-transparent hover:text-ink"
        >
          Randevu oluştur
        </Link>
      </section>
    </>
  );
}
