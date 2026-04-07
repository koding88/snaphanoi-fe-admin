import { NextResponse, type NextRequest } from "next/server";

const AUTH_SESSION_COOKIE = "snaphanoi_admin_session";
const AUTH_PUBLIC_REDIRECT_ROUTES = new Set(["/login", "/register", "/forgot-password"]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasSessionHint = request.cookies.get(AUTH_SESSION_COOKIE)?.value === "1";

  if (pathname === "/") {
    return NextResponse.redirect(new URL(hasSessionHint ? "/admin" : "/login", request.url));
  }

  if (pathname.startsWith("/admin") && !hasSessionHint) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (hasSessionHint && AUTH_PUBLIC_REDIRECT_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin/:path*", "/login", "/register", "/forgot-password"],
};
