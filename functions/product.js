export async function onRequest(context) {
  const url = new URL(context.request.url);
  const assetUrl = new URL('/product/index.html', url.origin);
  const response = await context.env.ASSETS.fetch(assetUrl);
  const headers = new Headers(response.headers);
  headers.set('content-type', 'text/html; charset=utf-8');
  return new Response(response.body, { status: 200, headers });
}
