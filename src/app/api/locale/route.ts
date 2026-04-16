import { NextResponse } from "next/server";

import { isValidLocale } from "@/i18n/config";
import { setLocaleCookie } from "@/i18n/locale-cookie";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { locale?: string };

    if (!isValidLocale(body.locale)) {
      return NextResponse.json({ message: "Invalid locale" }, { status: 400 });
    }

    await setLocaleCookie(body.locale);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Bad request" }, { status: 400 });
  }
}
