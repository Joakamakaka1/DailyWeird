// ==== Proxy universal para n8n ====

export const config = {
  runtime: "edge",
};

export default async (req) => {
  const url = new URL(req.url);
  const path = url.searchParams.get("path");

  const N8N_BASE_URL = process.env.N8N_BASE_URL;
  const N8N_TOKEN = process.env.N8N_TOKEN;

  // --- Validación de entorno ---
  if (!N8N_BASE_URL || !N8N_TOKEN) {
    return new Response(
      JSON.stringify({ error: "Faltan variables de entorno en Vercel" }),
      { status: 500 }
    );
  }

  // --- Construcción de URL final ---
  const targetUrl = `${N8N_BASE_URL.replace(/\/$/, "")}/webhook/${path}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${N8N_TOKEN}`,
        "User-Agent": "DailyWeirdFrontend/1.0 (+https://dailyweird.top)",
      },
      body: req.method === "GET" ? undefined : await req.text(),
    });

    const text = await response.text();

    return new Response(text, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err) {
    console.error("Error al conectar con n8n:", err);
    return new Response(
      JSON.stringify({
        error: "Error al conectar con n8n",
        detail: err.message,
      }),
      { status: 500 }
    );
  }
};
