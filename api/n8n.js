// ==== Proxy universal para n8n ====

export default async function handler(req, res) {
  const { path } = req.query;

  if (!path) {
    return res.status(400).json({ error: "Missing 'path' parameter" });
  }

  const N8N_BASE_URL = process.env.N8N_BASE_URL;
  const N8N_TOKEN = process.env.N8N_TOKEN;

  if (!N8N_BASE_URL || !N8N_TOKEN) {
    console.error("⚠️ Faltan variables de entorno N8N_BASE_URL o N8N_TOKEN");
    return res.status(500).json({ error: "Server misconfiguration" });
  }

  console.log("🌐 URL llamada:", `${N8N_BASE_URL}${path}`);
  console.log("🔑 Token enviado:", N8N_TOKEN ? "sí" : "no");

  try {
    const response = await fetch(`${N8N_BASE_URL}/webhook/${path}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${N8N_TOKEN}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ n8n error ${response.status}: ${text}`);
      return res
        .status(response.status)
        .json({ error: "Error al obtener datos de n8n" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("🔥 Error al conectar con n8n:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
