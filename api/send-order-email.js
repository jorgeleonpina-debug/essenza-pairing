const formatCLP = (n) => `$${Number(n).toLocaleString("es-CL")}`;

const socialFooter = `
  <div style="background:#0d2214;padding:28px 40px 32px;text-align:center;border-top:1px solid rgba(201,168,76,0.12);">
    <p style="font-family:Georgia,serif;font-size:9px;letter-spacing:0.28em;color:rgba(201,168,76,0.55);text-transform:uppercase;margin:0 0 16px;">Síguenos</p>
    <div style="display:inline-flex;gap:0;margin-bottom:18px;">
      <a href="https://instagram.com/essenzaolive" style="display:inline-block;margin:0 10px;text-decoration:none;">
        <span style="font-family:Georgia,serif;font-size:12px;color:rgba(201,168,76,0.75);letter-spacing:0.08em;">Instagram</span><br>
        <span style="font-family:Georgia,serif;font-size:11px;color:rgba(245,240,232,0.4);">@essenzaolive</span>
      </a>
      <span style="color:rgba(201,168,76,0.2);font-size:18px;line-height:1;align-self:center;">·</span>
      <a href="https://facebook.com/essenzaolive" style="display:inline-block;margin:0 10px;text-decoration:none;">
        <span style="font-family:Georgia,serif;font-size:12px;color:rgba(201,168,76,0.75);letter-spacing:0.08em;">Facebook</span><br>
        <span style="font-family:Georgia,serif;font-size:11px;color:rgba(245,240,232,0.4);">@essenzaolive</span>
      </a>
      <span style="color:rgba(201,168,76,0.2);font-size:18px;line-height:1;align-self:center;">·</span>
      <a href="mailto:contacto@premiumolivechile.com" style="display:inline-block;margin:0 10px;text-decoration:none;">
        <span style="font-family:Georgia,serif;font-size:12px;color:rgba(201,168,76,0.75);letter-spacing:0.08em;">Email</span><br>
        <span style="font-family:Georgia,serif;font-size:11px;color:rgba(245,240,232,0.4);">contacto@premiumolivechile.com</span>
      </a>
    </div>
    <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:0.15em;color:rgba(201,168,76,0.35);text-transform:uppercase;margin:0;">Essenza Chile · Premium Olive Chile SPA</p>
  </div>`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { customer, products, shipping, subtotal, total, paymentId } = req.body;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) { console.error("RESEND_API_KEY not set"); return res.status(500).json({ error: "Email service not configured" }); }

  const facturaRows = customer.tipoDoc === "factura"
    ? `<tr><td style="padding:6px 0;color:rgba(245,240,232,0.6);">RUT</td><td style="padding:6px 0;">${customer.rut}</td></tr>
       <tr><td style="padding:6px 0;color:rgba(245,240,232,0.6);">Razón Social</td><td style="padding:6px 0;">${customer.razonSocial}</td></tr>`
    : "";

  const productRows = (products || []).map((p) =>
    `<tr><td style="padding:7px 0;color:rgba(245,240,232,0.75);">${p.name}${p.quantity > 1 ? ` × ${p.quantity}` : ""}</td><td style="padding:7px 0;text-align:right;color:rgba(245,240,232,0.85);">${formatCLP(p.numericPrice * p.quantity)}</td></tr>`
  ).join("");

  const gold = `color:#c9a84c;`;
  const muted = `color:rgba(245,240,232,0.6);`;
  const box = `background:rgba(45,74,30,0.25);border:1px solid rgba(201,168,76,0.2);border-radius:12px;padding:20px 24px;margin:0 0 20px;`;

  const customerHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#111111;margin:0;padding:0;font-family:Georgia,serif;color:#f5f0e8;">
<div style="max-width:600px;margin:0 auto;">

  <!-- Header -->
  <div style="background:#1a3a2a;padding:44px 40px 36px;text-align:center;border-bottom:1px solid rgba(201,168,76,0.2);">
    <p style="font-size:10px;letter-spacing:0.3em;${gold}text-transform:uppercase;margin:0 0 14px;">Essenza Chile</p>
    <h1 style="font-size:26px;${gold}margin:0 0 10px;line-height:1.2;font-weight:700;">Gracias por ser parte de<br>la familia Essenza 🫒</h1>
    <p style="font-size:12px;color:rgba(245,240,232,0.45);font-style:italic;margin:0;">Extra Virgen · Extracción en Frío · Chile</p>
  </div>

  <!-- Body -->
  <div style="background:#111111;padding:36px 40px;">
    <p style="font-size:15px;line-height:1.9;color:rgba(245,240,232,0.85);margin:0 0 28px;">
      Hola <strong style="${gold}">${customer.nombre}</strong>,<br>
      Tu pago fue procesado exitosamente. A continuación encontrarás el resumen de tu pedido.
    </p>

    <!-- Order summary -->
    <div style="${box}">
      <p style="font-size:9px;letter-spacing:0.28em;${gold}text-transform:uppercase;margin:0 0 16px;">Resumen del pedido</p>
      <table style="width:100%;border-collapse:collapse;">
        ${productRows}
        <tr><td style="padding:7px 0;${muted}">Despacho — ${shipping.regionName}</td><td style="padding:7px 0;text-align:right;${muted}">${shipping.cost > 0 ? formatCLP(shipping.cost) : "Gratis"}</td></tr>
        <tr style="border-top:1px solid rgba(201,168,76,0.18);">
          <td style="padding:12px 0;font-weight:700;${gold}">Total</td>
          <td style="padding:12px 0;text-align:right;font-size:22px;font-weight:700;color:#e8c46a;">${formatCLP(total)}</td>
        </tr>
      </table>
    </div>

    <!-- Shipping address -->
    <div style="${box}">
      <p style="font-size:9px;letter-spacing:0.28em;${gold}text-transform:uppercase;margin:0 0 12px;">Dirección de despacho</p>
      <p style="margin:0;line-height:2;color:rgba(245,240,232,0.8);">${customer.calle} ${customer.numero}<br>${customer.comuna}<br>${shipping.regionName}</p>
    </div>

    <!-- Tracking message -->
    <div style="background:rgba(201,168,76,0.07);border-left:3px solid rgba(201,168,76,0.5);border-radius:0 10px 10px 0;padding:16px 20px;margin:0 0 28px;">
      <p style="font-size:14px;line-height:1.85;color:rgba(245,240,232,0.8);margin:0;">
        Tu pedido está siendo preparado con mucho cuidado. Te enviaremos la información de tracking y seguimiento una vez que tu pedido esté en camino.
      </p>
    </div>

    <p style="font-size:13px;line-height:1.8;color:rgba(245,240,232,0.55);margin:0;">
      ¿Tienes alguna consulta? Escríbenos a <a href="mailto:contacto@premiumolivechile.com" style="${gold}text-decoration:none;">contacto@premiumolivechile.com</a>
    </p>
  </div>

  ${socialFooter}

</div>
</body>
</html>`;

  const storeHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#111111;color:#f5f0e8;font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 24px;">
  <h1 style="${gold}font-size:22px;margin:0 0 4px;">Nuevo pedido recibido</h1>
  ${paymentId ? `<p style="${muted}font-size:12px;margin:0 0 20px;">Payment ID: ${paymentId}</p>` : ""}
  <div style="background:rgba(45,74,30,0.2);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:20px 22px;margin-bottom:16px;">
    <p style="${gold}font-size:10px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 14px;">Cliente</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:5px 0;${muted}width:140px;">Nombre</td><td>${customer.nombre}</td></tr>
      <tr><td style="padding:5px 0;${muted}">Email</td><td>${customer.email}</td></tr>
      <tr><td style="padding:5px 0;${muted}">Teléfono</td><td>${customer.telefono}</td></tr>
      <tr><td style="padding:5px 0;${muted}">Documento</td><td>${customer.tipoDoc === "boleta" ? "Boleta" : "Factura"}</td></tr>
      ${facturaRows}
    </table>
  </div>
  <div style="background:rgba(45,74,30,0.2);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:20px 22px;margin-bottom:16px;">
    <p style="${gold}font-size:10px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 12px;">Despacho</p>
    <p style="margin:0;line-height:1.8;">${customer.calle} ${customer.numero}<br>${customer.comuna}<br>${shipping.regionName}</p>
  </div>
  <div style="background:rgba(45,74,30,0.2);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:20px 22px;">
    <p style="${gold}font-size:10px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 14px;">Pedido</p>
    <table style="width:100%;border-collapse:collapse;">
      ${productRows}
      <tr><td style="padding:7px 0;${muted}">Despacho</td><td style="text-align:right;">${shipping.cost > 0 ? formatCLP(shipping.cost) : "Gratis"}</td></tr>
      <tr style="border-top:1px solid rgba(201,168,76,0.15);">
        <td style="padding:12px 0;font-weight:700;${gold}">Total</td>
        <td style="padding:12px 0;text-align:right;font-size:20px;font-weight:700;color:#e8c46a;">${formatCLP(total)}</td>
      </tr>
    </table>
  </div>
</body>
</html>`;

  const sendEmail = async (to, subject, html) => {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "Essenza Chile <noreply@premiumolivechile.com>", to, subject, html }),
    });
    if (!r.ok) throw new Error(`Resend ${r.status}: ${await r.text()}`);
    return r.json();
  };

  try {
    await Promise.all([
      sendEmail(customer.email, "Gracias por ser parte de la familia Essenza 🫒", customerHtml),
      sendEmail("contacto@premiumolivechile.com", `Nuevo pedido — ${customer.nombre}`, storeHtml),
    ]);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("send-order-email error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
