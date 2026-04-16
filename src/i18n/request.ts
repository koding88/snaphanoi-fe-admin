import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import {
  isValidLocale,
  localeCookieName,
  resolveLocaleFromAcceptLanguage,
} from "@/i18n/config";

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;
  const locale = isValidLocale(cookieLocale)
    ? cookieLocale
    : resolveLocaleFromAcceptLanguage(headerStore.get("accept-language"));

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
    now: new Date(),
    timeZone: "Asia/Ho_Chi_Minh",
  };
});
