// Serves product page for /product/:slug (Cloudflare Pages)
export async function onRequest(context) {
  const url = new URL(context.request.url);
  // Keep original path so the browser still shows /product/name
  // Fetch the static product template
  const assetUrl = new URL('/product/index.html', url.origin);
  const response = await context.env.ASSETS.fetch(assetUrl);
  // Return body with 200, preserve HTML content-type
  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  headers.set('cache-control', 'public, max-age=0, must-revalidate');
  return new Response(response.body, {
    status: 200,
    headers,
  });
}
