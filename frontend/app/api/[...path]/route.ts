export const dynamic = 'force-dynamic';

type RouteContext = {
  params: Promise<{ path?: string[] }>;
};

const getBackendUrl = () => {
  return process.env.BACKEND_URL || 'http://127.0.0.1:4000';
};

async function proxy(request: Request, ctx: RouteContext) {
  const { path = [] } = await ctx.params;
  const backendUrl = getBackendUrl();

  const targetUrl = new URL(`${backendUrl}/api/${path.join('/')}`);
  const incomingUrl = new URL(request.url);
  targetUrl.search = incomingUrl.search;

  const headers = new Headers(request.headers);
  headers.delete('host');

  const method = request.method.toUpperCase();
  const body = method === 'GET' || method === 'HEAD' ? undefined : await request.arrayBuffer();

  const upstream = await fetch(targetUrl, {
    method,
    headers,
    body,
    redirect: 'manual'
  });

  const responseHeaders = new Headers(upstream.headers);
  // Avoid sending compressed data that Next may not handle as-is.
  responseHeaders.delete('content-encoding');

  const responseBody = await upstream.arrayBuffer();
  return new Response(responseBody, {
    status: upstream.status,
    headers: responseHeaders
  });
}

export async function GET(request: Request, ctx: RouteContext) {
  return proxy(request, ctx);
}

export async function POST(request: Request, ctx: RouteContext) {
  return proxy(request, ctx);
}

export async function PUT(request: Request, ctx: RouteContext) {
  return proxy(request, ctx);
}

export async function PATCH(request: Request, ctx: RouteContext) {
  return proxy(request, ctx);
}

export async function DELETE(request: Request, ctx: RouteContext) {
  return proxy(request, ctx);
}
