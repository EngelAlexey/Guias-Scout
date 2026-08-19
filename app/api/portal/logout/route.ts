import { NextResponse } from "next/server";

import { PORTAL_SESSION_COOKIE } from "@/lib/portal/session";

export const runtime = "nodejs";

// Se llama desde un <form method="post">, asi que la salida funciona aunque el
// navegador no ejecute JavaScript.
export async function POST(request: Request) {
  const response = NextResponse.redirect(
    new URL("/es/portal/login", request.url),
    { status: 303 },
  );

  response.cookies.delete(PORTAL_SESSION_COOKIE);

  return response;
}
