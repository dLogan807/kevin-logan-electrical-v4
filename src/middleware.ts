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

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ 'self' 'nonce-${nonce}' 'strict-dynamic' 'unsafe-inline' ${
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
    block-all-mixed-content;
    upgrade-insecure-requests;
`;
  // Replace newline characters and spaces
  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);

  if (request.method !== "GET") {
    const originHeader = requestHeaders.get("Origin");
    // NOTE: May need to use `X-Forwarded-Host` instead
    const hostHeader = requestHeaders.get("Host");
    if (originHeader === null || hostHeader === null) {
      return new NextResponse(null, {
        status: 403,
      });
    }
    let origin: URL;
    try {
      origin = new URL(originHeader);
    } catch {
      return new NextResponse(null, {
        status: 403,
      });
    }
    if (origin.host !== hostHeader) {
      return new NextResponse(null, {
        status: 403,
      });
    }
  }

  requestHeaders.set("x-nonce", nonce);

  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  return response;
}
