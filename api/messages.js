module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    console.log("body type:", typeof req.body, "| body:", JSON.stringify(req.body));

    const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": process.env.ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body,
    });

    const text = await response.text();
    console.log("anthropic status:", response.status, "| body:", text.slice(0, 500));

    const data = JSON.parse(text);
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err.name, err.message);
    res.status(500).json({ error: "Proxy error", detail: err.message });
  }
};
