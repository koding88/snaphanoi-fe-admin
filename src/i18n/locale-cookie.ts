import { cookies } from "next/headers";

import type { AppLocale } from "@/i18n/config";
import { localeCookieName } from "@/i18n/config";

export async function setLocaleCookie(locale: AppLocale) {
  const cookieStore = await cookies();

  cookieStore.set(localeCookieName, locale, {
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
