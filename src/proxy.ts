import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

export function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ 'self' 'nonce-${nonce}' 'strict-dynamic' ${
      process.env.NODE_ENV === "production" ? "" : `'unsafe-eval'`
    };
    connect-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-src https://www.google.com https://www.google.com/recaptcha/ https://recaptcha.google.com/recaptcha/;
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;
  //Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue,
  );

  //Session cookie extension
  if (request.method === "GET") {
    const token = request.cookies.get("session")?.value ?? null;
    if (token !== null) {
      // Only extend cookie expiration on GET requests since we can be sure
      // a new session wasn't set when handling the request.
      response.cookies.set("session", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
    }
    return response;
  }

  //CSRF protection
  if (request.method !== "GET") {
    const originHeader = requestHeaders.get("Origin");
    const hostHeader = requestHeaders.get("Host");
    const forbiddenResponse = new NextResponse(null, {
      status: 403,
    });
    forbiddenResponse.headers.set(
      "Content-Security-Policy",
      contentSecurityPolicyHeaderValue,
    );

    if (originHeader === null || hostHeader === null) {
      return forbiddenResponse;
    }

    let origin: URL;
    try {
      origin = new URL(originHeader);
    } catch {
      return forbiddenResponse;
    }

    if (origin.host !== hostHeader) {
      return forbiddenResponse;
    }
  }

  return response;
}
