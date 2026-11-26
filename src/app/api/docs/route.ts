import { getForgeOpenApiSpec } from "@/lib/openapi";
import { getRequestId } from "@/lib/problem-details";

export async function GET(request: Request): Promise<Response> {
  const requestId = getRequestId(request);
  const specJson = JSON.stringify(getForgeOpenApiSpec());

  const html = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>ForgeUI API — OpenAPI 3.1.0</title>
    <style>
      body { margin: 0; background: #09090b; color: #f4f4f5; font-family: ui-sans-serif, system-ui, sans-serif; }
      .forge-api-bar { display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; border-bottom: 1px solid #27272a; background: #111114; font-size: 13px; }
      .forge-api-badge { border: 1px solid #27272a; border-radius: 999px; padding: 2px 10px; font-family: ui-monospace, monospace; font-size: 12px; color: #a1a1aa; }
    </style>
  </head>
  <body>
    <header class="forge-api-bar">
      <strong>ForgeUI API</strong>
      <span class="forge-api-badge">OpenAPI 3.1.0</span>
    </header>
    <script id="api-reference" type="application/json">${specJson}</script>
    <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "x-request-id": requestId,
    },
  });
}
