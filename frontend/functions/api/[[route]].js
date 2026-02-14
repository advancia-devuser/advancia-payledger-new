/**
 * Cloudflare Worker for Advancia Pay Ledger
 * Handles API routing, rate limiting, and request transformation
 * 
 * Deploy: wrangler publish
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders,
        status: 204,
      });
    }

    // Rate limiting (basic implementation)
    const ip = request.headers.get('CF-Connecting-IP');
    const cacheKey = new Request(url, { method: 'GET' });
    const cache = caches.default;

    // Check rate limit
    const rateLimitKey = `ratelimit:${ip}`;
    let rateLimitData = await env.RATE_LIMIT.get(rateLimitKey);
    
    if (!rateLimitData) {
      rateLimitData = JSON.stringify({ count: 1, reset: Date.now() + 60000 });
      await env.RATE_LIMIT.put(rateLimitKey, rateLimitData, { expirationTtl: 60 });
    } else {
      const data = JSON.parse(rateLimitData);
      if (data.count >= 100) { // 100 requests per minute
        return new Response('Too Many Requests', { 
          status: 429,
          headers: corsHeaders 
        });
      }
      data.count++;
      await env.RATE_LIMIT.put(rateLimitKey, JSON.stringify(data), { expirationTtl: 60 });
    }

    // API routing
    if (url.pathname.startsWith('/api/')) {
      // Route to backend API
      const apiUrl = new URL(url.pathname, env.BACKEND_API_URL || 'https://api.advancia.io');
      apiUrl.search = url.search;

      const apiRequest = new Request(apiUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' ? request.body : undefined,
      });

      let response = await fetch(apiRequest);
      
      // Add security headers
      response = new Response(response.body, response);
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'SAMEORIGIN');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      
      // Add CORS headers
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });

      return response;
    }

    // Cache static assets
    if (/\.(js|css|woff|woff2|ttf|eot|png|jpg|jpeg|gif|svg|webp)$/.test(url.pathname)) {
      let response = await cache.match(cacheKey);
      
      if (!response) {
        response = await fetch(request);
        if (response.status === 200) {
          response = new Response(response.body, response);
          response.headers.set('Cache-Control', 'public, max-age=31536000'); // 1 year
          ctx.waitUntil(cache.put(cacheKey, response.clone()));
        }
      }
      
      return response;
    }

    // Default: fetch from origin
    const response = await fetch(request);
    
    // Add security headers to all responses
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
    newResponse.headers.set('X-Frame-Options', 'SAMEORIGIN');
    newResponse.headers.set('X-XSS-Protection', '1; mode=block');
    newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    Object.entries(corsHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });

    return newResponse;
  },
};

// Environment variables needed in wrangler.toml:
// BACKEND_API_URL = "https://api.advancia.io"
// RATE_LIMIT = "KV namespace binding"
