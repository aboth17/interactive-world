interface Env {
  GOOGLE_MAPS_API_KEY: string;
  ALLOWED_ORIGINS: string;
}

function getAllowedOrigins(env: Env): string[] {
  return env.ALLOWED_ORIGINS.split(',').map((o) => o.trim());
}

function corsHeaders(origin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') ?? '';
    const allowed = getAllowedOrigins(env);

    if (!allowed.includes(origin)) {
      return new Response('Forbidden', { status: 403 });
    }

    const headers = corsHeaders(origin);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    if (url.pathname === '/api-key' && request.method === 'GET') {
      return new Response(JSON.stringify({ key: env.GOOGLE_MAPS_API_KEY }), {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    return new Response('Not Found', { status: 404, headers });
  },
};
