"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type AnswerKey = "A" | "B" | "C";

const questions = [
  {
    id: "lifestyle",
    q: "Sabah hazırlık süreniz ne kadar?",
    options: [
      { key: "A" as const, label: "5–10 dk, pratik olsun" },
      { key: "B" as const, label: "15–20 dk, şekillendiririm" },
      { key: "C" as const, label: "Zaman ayırırım, özel look isterim" },
    ],
  },
  {
    id: "change",
    q: "Ne kadar değişim istiyorsunuz?",
    options: [
      { key: "A" as const, label: "Hafif yenileme" },
      { key: "B" as const, label: "Belirgin ama doğal" },
      { key: "C" as const, label: "Cesur dönüşüm" },
    ],
  },
  {
    id: "texture",
    q: "Saçınızın doğal hali?",
    options: [
      { key: "A" as const, label: "Düz / ince" },
      { key: "B" as const, label: "Dalgalı / orta" },
      { key: "C" as const, label: "Kıvırcık / kalın" },
    ],
  },
  {
    id: "priority",
    q: "Önceliğiniz?",
    options: [
      { key: "A" as const, label: "Saç sağlığı" },
      { key: "B" as const, label: "Renk & ışık" },
      { key: "C" as const, label: "Şekil & kesim" },
    ],
  },
];

const results: Record<
  string,
  {
    title: string;
    summary: string;
    services: string[];
    serviceIds: string[];
  }
> = {
  care: {
    title: "Sağlık Odaklı Soft Look",
    summary:
      "Düşük bakım, doğal hareket ve onarım öncelikli bir plan öneriyoruz.",
    services: ["Keratin & Bond Bakımı", "Şekillendirici Kesim"],
    serviceIds: ["svc-keratin", "svc-kesim"],
  },
  color: {
    title: "Soft Blend Işıklandırma",
    summary:
      "Yüzünüzü aydınlatan, büyüdükçe de şık kalan soft renk geçişleri sizin için.",
    services: ["Balayage & Soft Blend", "Saç Botoksu"],
    serviceIds: ["svc-balayage", "svc-sac-botoksu"],
  },
  shape: {
    title: "Mimari Kesim & Form",
    summary:
      "Yüz hatınıza oturan katlar ve günlük şekillendirmesi kolay bir silüet.",
    services: ["Şekillendirici Kesim", "Fön & Şekillendirme"],
    serviceIds: ["svc-kesim", "svc-fon"],
  },
  bold: {
    title: "Cesur Dönüşüm Paketi",
    summary:
      "Renk + kesim kombinasyonuyla belirgin bir yenilenme. Prova notu önerilir.",
    services: ["Ombre / Sombre", "Şekillendirici Kesim"],
    serviceIds: ["svc-ombre", "svc-kesim"],
  },
};

function scoreResult(answers: AnswerKey[]) {
  const counts = { A: 0, B: 0, C: 0 };
  answers.forEach((a) => {
    counts[a] += 1;
  });
  if (answers[3] === "A") return "care";
  if (answers[1] === "C") return "bold";
  if (counts.B >= 2 || answers[3] === "B") return "color";
  return "shape";
}

export function StyleQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerKey[]>([]);

  const result = useMemo(() => {
    if (answers.length < questions.length) return null;
    return results[scoreResult(answers)];
  }, [answers]);

  function choose(key: AnswerKey) {
    const next = [...answers.slice(0, step), key];
    setAnswers(next);
    setStep((s) => s + 1);
  }

  function reset() {
    setAnswers([]);
    setStep(0);
  }

  if (result) {
    const note = `Stil Quiz: ${result.title} — ${result.services.join(", ")}`;
    return (
      <div className="border border-line bg-paper p-6 md:p-10">
        <p className="text-xs uppercase tracking-[0.2em] text-sage">
          Eşleşme tamam
        </p>
        <h2 className="font-display mt-3 text-3xl text-ink md:text-4xl">
          {result.title}
        </h2>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
          {result.summary}
        </p>
        <ul className="mt-6 space-y-2 text-sm text-ink">
          {result.services.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-bronze" />
              {s}
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/randevu?service=${result.serviceIds[0]}&notes=${encodeURIComponent(note)}`}
            className="bg-ink px-5 py-3 text-sm text-paper hover:bg-ink-soft"
          >
            Randevuya aktar
          </Link>
          <button
            type="button"
            onClick={reset}
            className="border border-line px-5 py-3 text-sm text-ink hover:bg-mist"
          >
            Yeniden dene
          </button>
        </div>
      </div>
    );
  }

  const current = questions[step];
  const progress = ((step + 1) / questions.length) * 100;

  return (
    <div className="border border-line bg-paper p-6 md:p-10">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.2em] text-bronze">
          Stil Quiz
        </p>
        <p className="text-xs text-ink-soft">
          {step + 1} / {questions.length}
        </p>
      </div>
      <div className="mt-4 h-1 w-full bg-mist-deep">
        <div
          className="h-full bg-sage transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <h2 className="font-display mt-8 text-2xl text-ink md:text-4xl">
        {current.q}
      </h2>
      <div className="mt-8 grid gap-3">
        {current.options.map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => choose(opt.key)}
            className="border border-line bg-mist px-4 py-4 text-left text-sm text-ink transition hover:border-sage hover:bg-paper"
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
