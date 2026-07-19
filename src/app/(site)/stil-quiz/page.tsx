import { StyleQuiz } from "@/components/StyleQuiz";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Stil Quiz",
  description:
    "4 soruda size uygun kuaför hizmetini keşfedin. Sonucu CELVA randevusuna aktarın.",
  path: "/stil-quiz",
});

export default function StyleQuizPage() {
  return (
    <div className="pt-24">
      <div className="mx-auto max-w-3xl px-5 py-12 md:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">
          Kişisel eşleşme
        </p>
        <h1 className="font-display mt-3 text-4xl text-ink md:text-5xl">
          Stil Quiz
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">
          Çoğu kuaför sitesi yalnızca menü listeler. CELVA yaşam tarzınıza göre
          hizmet önerir ve randevuya taşır.
        </p>
        <div className="mt-10">
          <StyleQuiz />
        </div>
      </div>
    </div>
  );
}
