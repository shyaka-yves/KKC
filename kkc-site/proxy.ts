import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

import { defaultLocale, locales } from "./src/i18n/routing";

const intlHandler = createMiddleware({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
});

export function proxy(request: NextRequest) {
  return intlHandler(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
