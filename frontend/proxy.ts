import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const canonicalHost = (process.env.CANONICAL_HOST || '').trim().toLowerCase();
  if (!canonicalHost) return NextResponse.next();

  const host = (request.headers.get('host') || '').trim().toLowerCase();
  if (!host) return NextResponse.next();

  // Avoid interfering with local development.
  if (host.includes('localhost') || host.startsWith('127.0.0.1')) return NextResponse.next();

  // Strip port for comparison.
  const hostWithoutPort = host.split(':')[0];

  if (hostWithoutPort === canonicalHost) return NextResponse.next();

  const url = request.nextUrl;
  const target = new URL(url.pathname + url.search, `https://${canonicalHost}`);
  return NextResponse.redirect(target, 308);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
