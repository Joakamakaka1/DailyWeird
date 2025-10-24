// ==== Proxy universal para n8n ====

export default async function handler(req, res) {
  console.log("🔵 [Proxy] Nueva petición recibida en /api/n8n");

  // 1️⃣ Obtener parámetro "path"
  const { path } = req.query;
  console.log("Parámetro path:", path);

  if (!path) {
    console.error("Falta el parámetro 'path'");
    return res.status(400).json({ error: "Missing 'path' parameter" });
  }

  // 2️⃣ Leer variables de entorno
  const N8N_BASE_URL = process.env.N8N_BASE_URL;
  const N8N_TOKEN = process.env.N8N_TOKEN;

  console.log("N8N_BASE_URL:", N8N_BASE_URL);
  console.log("N8N_TOKEN presente:", !!N8N_TOKEN);

  if (!N8N_BASE_URL || !N8N_TOKEN) {
    console.error("Faltan variables de entorno");
    return res.status(500).json({
      error: "Server misconfiguration",
      debug: {
        N8N_BASE_URL: !!N8N_BASE_URL,
        N8N_TOKEN: !!N8N_TOKEN,
      },
    });
  }

  // 3️⃣ Construir URL final a n8n
  const finalUrl = `${N8N_BASE_URL}${path}`;
  console.log("URL final a n8n:", finalUrl);

  try {
    // 4️⃣ Preparar cabeceras
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${N8N_TOKEN}`,
    };
    console.log("Cabeceras enviadas a n8n:", headers);

    // 5️⃣ Llamar a n8n
    const response = await fetch(finalUrl, {
      method: req.method,
      headers,
      body: req.method === "GET" ? undefined : await req.text(),
    });

    console.log("Respuesta de n8n:", response.status, response.statusText);

    // 6️⃣ Si la respuesta no es OK, mostrar el cuerpo
    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ Error desde n8n (${response.status}):`, text);
      return res.status(response.status).json({
        error: "Error al obtener datos de n8n",
        status: response.status,
        body: text,
      });
    }

    // 7️⃣ Intentar parsear el JSON (si existe)
    const contentType = response.headers.get("content-type");
    console.log("Content-Type recibido:", contentType);

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      console.log("JSON recibido de n8n:", data);
    } else {
      const text = await response.text();
      console.warn("Respuesta no JSON:", text);
      data = text;
    }

    // 8️⃣ Enviar respuesta al frontend
    console.log("Enviando respuesta final al cliente...");
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error general en proxy n8n:", error);
    return res.status(500).json({
      error: "Internal server error",
      details: error.message || error.toString(),
    });
  }
}
