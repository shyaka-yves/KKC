import { getTranslations, setRequestLocale } from "next-intl/server";

import { Reveal } from "@/components/motion/Reveal";

export default async function AboutPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <Reveal>
        <div className="glass rounded-3xl p-7 md:p-10">
          <p className="text-xs font-semibold tracking-[0.14em] text-brand-blue-700 uppercase">
            {t("nav.about")}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
            {t("home.aboutTitle")}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
            {t("home.aboutText")}
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl bg-white/55 p-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                {t("about.visionTitle")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t("about.visionText")}
              </p>
            </div>
            <div className="rounded-2xl bg-white/55 p-6">
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">
                {t("about.missionTitle")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t("about.missionText")}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Premium service",
                desc: "Professional support for contractors and homeowners."
              },
              {
                title: "Modern catalog",
                desc: "Organized categories with quick WhatsApp quoting."
              },
              {
                title: "Kigali local",
                desc: "Fast response and easy access in Gisozi."
              }
            ].map((x) => (
              <div key={x.title} className="rounded-2xl bg-white/55 p-5">
                <div className="text-sm font-semibold text-slate-950">{x.title}</div>
                <div className="mt-2 text-xs leading-6 text-slate-600">{x.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

