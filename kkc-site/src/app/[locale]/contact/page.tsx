import { getTranslations, setRequestLocale } from "next-intl/server";

import { Reveal } from "@/components/motion/Reveal";

export default async function ContactPage({
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
        <div className="grid gap-6 md:grid-cols-12 md:items-stretch">
          <div className="glass rounded-3xl p-7 md:col-span-5 md:p-10">
            <p className="text-xs font-semibold tracking-[0.14em] text-brand-blue-700 uppercase">
              {t("nav.contact")}
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              {t("home.contactTitle")}
            </h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 md:text-base">
              {t("brand.location")}
            </p>

            <div className="mt-6 space-y-2 text-sm text-slate-700">
              <div>
                <span className="font-semibold">{t("brand.phoneLabel")}:</span>{" "}
                +250 788 318 876
              </div>
            </div>

            <a
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-b from-brand-orange-500 to-brand-orange-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-orange-500/25 transition hover:from-brand-orange-400 hover:to-brand-orange-600 sm:w-auto"
              href="https://wa.me/250788318876?text=Hello%20KKC,%20I%20am%20interested%20in%20your%20construction%20materials."
              target="_blank"
              rel="noreferrer"
            >
              {t("home.contactCta")}
            </a>
          </div>

          <div className="glass overflow-hidden rounded-3xl md:col-span-7">
            <iframe
              title="Google Maps - Kigali Gisozi"
              className="h-[420px] w-full md:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Gisozi%2C%20Kigali%2C%20Rwanda&output=embed"
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

