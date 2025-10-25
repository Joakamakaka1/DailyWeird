// ==== Proxy universal para n8n ====

export default async function handler(req, res) {
  // Obtener parámetro "path"
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing 'path' parameter" });
  }

  // Leer variables de entorno
  const N8N_BASE_URL = process.env.N8N_BASE_URL;
  const N8N_TOKEN = process.env.N8N_TOKEN;

  if (!N8N_BASE_URL || !N8N_TOKEN) {
    return res.status(500).json({
      error: "Server misconfiguration",
      debug: {
        N8N_BASE_URL: !!N8N_BASE_URL,
        N8N_TOKEN: !!N8N_TOKEN,
      },
    });
  }

  // Construir URL final a n8n
  const finalUrl = `${N8N_BASE_URL}${path}`;

  try {
    // Preparar cabeceras
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${N8N_TOKEN}`,
    };

    // Llamar a n8n
    const response = await fetch(finalUrl, {
      method: req.method,
      headers,
      body:
        req.method === "GET" || req.method === "HEAD"
          ? undefined
          : JSON.stringify(req.body || {}),
    });

    // Si la respuesta no es OK, mostrar el cuerpo
    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: "Error response",
        status: response.status,
        body: text,
      });
    }

    // Intentar parsear el JSON (si existe)
    const contentType = response.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text;
    }

    // Enviar respuesta al frontend
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Internal server error",
      details: error.message || error.toString(),
    });
  }
}
