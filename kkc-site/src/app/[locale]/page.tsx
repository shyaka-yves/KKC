import { getTranslations, setRequestLocale } from "next-intl/server";

import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Reveal } from "@/components/motion/Reveal";
import { Hero } from "@/components/site/Hero";
import { locales } from "@/i18n/routing";

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const base = `/${locale}`;

  return (
    <>
      <Hero
        localeBase={base}
        headline={t("home.heroHeadline")}
        subheadline={t("home.heroSubheadline")}
        ctaBrowseLabel={t("home.ctaBrowse")}
        ctaWhatsAppLabel={t("home.ctaWhatsApp")}
      />

      <FeaturedProducts />

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <Reveal>
          <div className="grid gap-8 md:grid-cols-12 md:items-center">
            <div className="md:col-span-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-brand-blue-700 uppercase">
                {t("home.whyTitle")}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
                {t("home.whyTitle")}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
                {t("home.aboutText")}
              </p>
            </div>
            <div className="md:col-span-6">
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { title: t("home.why1Title"), desc: t("home.why1Desc") },
                  { title: t("home.why2Title"), desc: t("home.why2Desc") },
                  { title: t("home.why3Title"), desc: t("home.why3Desc") }
                ].map((item) => (
                  <div
                    key={item.title}
                    className="glass rounded-2xl p-5 transition hover:-translate-y-1"
                  >
                    <div className="text-sm font-semibold text-slate-950">
                      {item.title}
                    </div>
                    <div className="mt-2 text-xs leading-6 text-slate-600">
                      {item.desc}
                    </div>
                  </div>
                ))}
                <div className="glass rounded-2xl p-5 transition hover:-translate-y-1 sm:col-span-2">
                  <div className="text-sm font-semibold text-slate-950">
                    {t("home.aboutTitle")}
                  </div>
                  <div className="mt-2 text-xs leading-6 text-slate-600">
                    {t("brand.location")} • {t("brand.phoneLabel")}: +250 788 318 876
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-12 md:items-stretch">
            <div className="glass rounded-3xl p-6 md:col-span-5 md:p-8">
              <p className="text-xs font-semibold tracking-[0.14em] text-brand-blue-700 uppercase">
                {t("home.contactTitle")}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 md:text-3xl">
                {t("home.contactTitle")}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {t("brand.location")}
              </p>
              <a
                className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-b from-brand-orange-500 to-brand-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-orange-500/25 transition hover:from-brand-orange-400 hover:to-brand-orange-600 sm:w-auto"
                href="https://wa.me/250788318876?text=Hello%20KKC,%20I%20am%20interested%20in%20your%20construction%20materials."
                target="_blank"
                rel="noreferrer"
              >
                {t("home.contactCta")}
              </a>
              <div className="mt-5 grid gap-2 text-sm text-slate-700">
                <div>
                  <span className="font-semibold">{t("brand.phoneLabel")}:</span>{" "}
                  +250 788 318 876
                </div>
              </div>
            </div>

            <div className="glass overflow-hidden rounded-3xl md:col-span-7">
              <iframe
                title="Google Maps - KKC Quincaillerie"
                className="h-[360px] w-full md:h-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps?q=Gisozi%2C%20Kigali%2C%20Rwanda&output=embed"
              />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

