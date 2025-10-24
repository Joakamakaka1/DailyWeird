// ==== Proxy universal para n8n ====

export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  const url = new URL(req.url);
  const path = url.searchParams.get("path");

  const N8N_BASE_URL = process.env.N8N_BASE_URL;
  const N8N_TOKEN = process.env.N8N_TOKEN;

  // --- Validación de entorno ---
  if (!N8N_BASE_URL || !N8N_TOKEN) {
    return new Response(
      JSON.stringify({ error: "Faltan variables de entorno en Vercel" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // --- Construcción de la URL final (n8n) ---
  const targetUrl = `${N8N_BASE_URL.replace(/\/$/, "")}/webhook/${path}`;

  try {
    const n8nResponse = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${N8N_TOKEN}`,
        "User-Agent": "DailyWeirdFrontend/1.0 (+https://dailyweird.top)",
      },
      body: req.method === "GET" ? undefined : await req.text(),
    });

    const contentType =
      n8nResponse.headers.get("content-type") || "application/json";
    const body = await n8nResponse.text();

    return new Response(body, {
      status: n8nResponse.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err) {
    console.error("❌ Error al conectar con n8n:", err);
    return new Response(
      JSON.stringify({
        error: "Error al conectar con n8n",
        detail: err.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
