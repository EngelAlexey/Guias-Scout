import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "./i18n/routing";
import { PORTAL_SESSION_COOKIE } from "./lib/portal/cookie";

const intlMiddleware = createMiddleware(routing);

const PORTAL_PATH = new RegExp(
  `^/(${routing.locales.join("|")})/portal(/.*)?$`,
);

/**
 * Revision barata: si no hay cookie de sesion, la persona no llega ni a
 * renderizar la pagina. La decision real la toma `getPortalSession()` en el
 * servidor, que ademas verifica la firma y si la cuenta sigue activa.
 */
function portalRedirect(request: NextRequest) {
  const match = request.nextUrl.pathname.match(PORTAL_PATH);
  if (!match) return null;

  const rest = match[2] ?? "";
  if (rest === "/login" || rest.startsWith("/login/")) return null;

  if (request.cookies.has(PORTAL_SESSION_COOKIE)) return null;

  const url = request.nextUrl.clone();
  url.pathname = `/${match[1]}/portal/login`;
  url.search = "";

  return NextResponse.redirect(url);
}

export default function middleware(request: NextRequest) {
  return portalRedirect(request) ?? intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
