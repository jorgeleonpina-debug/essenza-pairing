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
    const { productId, customer, shippingCost } = JSON.parse(
      Buffer.concat(chunks).toString("utf8")
    );

    const product = CATALOG[productId];
    if (!product) {
      return res.status(400).json({ error: "Producto no encontrado" });
    }

    const siteUrl =
      process.env.SITE_URL || "https://essenza-pairing.vercel.app";

    const items = [
      {
        id: String(productId),
        title: product.title,
        quantity: 1,
        unit_price: product.unit_price,
        currency_id: "CLP",
      },
    ];

    if (shippingCost > 0) {
      items.push({
        id: "shipping",
        title: "Despacho a domicilio",
        quantity: 1,
        unit_price: shippingCost,
        currency_id: "CLP",
      });
    }

    const preference = {
      items,
      back_urls: {
        success: `${siteUrl}?payment=success`,
        failure: `${siteUrl}?payment=failure`,
        pending: `${siteUrl}?payment=pending`,
      },
      auto_return: "approved",
    };

    if (customer) {
      const parts = (customer.nombre || "").trim().split(/\s+/);
      preference.payer = {
        name: parts[0] || "",
        surname: parts.slice(1).join(" ") || parts[0] || "",
        email: customer.email,
        phone: {
          area_code: "56",
          number: customer.telefono?.replace(/\D/g, "").slice(-8) || "",
        },
        address: {
          street_name: customer.calle || "",
          street_number: parseInt(customer.numero, 10) || 0,
          zip_code: "",
        },
      };
    }

    const mpRes = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
        },
        body: JSON.stringify(preference),
      }
    );

    const data = await mpRes.json();
    if (!mpRes.ok) {
      console.error("MP error:", JSON.stringify(data));
      return res
        .status(mpRes.status)
        .json({ error: data.message || "Error al crear preferencia" });
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
