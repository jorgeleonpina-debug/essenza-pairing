module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const rawBody = Buffer.concat(chunks).toString("utf8");
    console.log("raw body:", rawBody.slice(0, 200));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": (process.env.ANTHROPIC_KEY || "").replace(/^﻿/, "").trim(),
        "anthropic-version": "2023-06-01",
      },
      body: rawBody,
    });

    const text = await response.text();
    console.log("anthropic status:", response.status, "body:", text.slice(0, 300));

    res.status(response.status).setHeader("content-type", "application/json").end(text);
  } catch (err) {
    console.error("Proxy error:", err.name, err.message);
    res.status(500).json({ error: "Proxy error", detail: err.message });
  }
};

module.exports.config = {
  api: { bodyParser: false },
};
