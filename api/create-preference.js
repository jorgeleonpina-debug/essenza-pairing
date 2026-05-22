const CATALOG = {
  1: { title: "Aceite Extra Virgen 250ml", unit_price: 2490 },
  2: { title: "Aceite Extra Virgen 1L", unit_price: 14990 },
  3: { title: "Bidón Extra Virgen 5L", unit_price: 32990 },
  4: { title: "Pack Completo Aceite + Aceto Balsámico", unit_price: 47990 },
};

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const { productId } = JSON.parse(Buffer.concat(chunks).toString("utf8"));

    const product = CATALOG[productId];
    if (!product) {
      return res.status(400).json({ error: "Producto no encontrado" });
    }

    const siteUrl = process.env.SITE_URL || "https://essenza-pairing.vercel.app";

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "authorization": `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        items: [{
          id: String(productId),
          title: product.title,
          quantity: 1,
          unit_price: product.unit_price,
          currency_id: "CLP",
        }],
        back_urls: {
          success: siteUrl,
          failure: siteUrl,
          pending: siteUrl,
        },
        auto_return: "approved",
      }),
    });

    const data = await mpRes.json();
    if (!mpRes.ok) {
      console.error("MP error:", JSON.stringify(data));
      return res.status(mpRes.status).json({ error: data.message || "Error al crear preferencia" });
    }

    res.status(200).json({ init_point: data.init_point, id: data.id });
  } catch (err) {
    console.error("create-preference error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports.config = {
  api: { bodyParser: false },
};
