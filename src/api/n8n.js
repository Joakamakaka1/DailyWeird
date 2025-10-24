// ==== Proxy universal para webhooks de n8n. ====

export const config = {
  runtime: "edge",
};

export default async (req) => {
  const url = new URL(req.url);
  const path = url.searchParams.get("path");
  const N8N_BASE_URL = process.env.N8N_BASE_URL;
  const N8N_TOKEN = process.env.N8N_TOKEN;

  if (!N8N_BASE_URL || !N8N_TOKEN)
    return new Response(
      JSON.stringify({ error: "Faltan variables de entorno" }),
      { status: 500 }
    );

  if (req.headers.get("user-agent")?.includes("PostmanRuntime")) {
    return new Response(
      JSON.stringify({ error: "Postman bloqueado por seguridad Vercel" }),
      { status: 403 }
    );
  }
  try {
    const response = await fetch(`${N8N_BASE_URL}${path}`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${N8N_TOKEN}`,
      },
      body: req.method === "GET" ? undefined : await req.text(),
    });

    return new Response(await response.text(), {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Error al conectar con n8n" }),
      { status: 500 }
    );
  }
};
