const formatCLP = (n) => `$${Number(n).toLocaleString("es-CL")}`;

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
    `<tr><td style="padding:7px 0;color:rgba(245,240,232,0.6);">${p.name}${p.quantity > 1 ? ` × ${p.quantity}` : ""}</td><td style="padding:7px 0;text-align:right;">${formatCLP(p.numericPrice * p.quantity)}</td></tr>`
  ).join("");

  const base = `background:#111111;color:#f5f0e8;font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 24px;`;
  const gold = `color:#c9a84c;`;
  const muted = `color:rgba(245,240,232,0.6);`;
  const box = `background:rgba(45,74,30,0.25);border:1px solid rgba(201,168,76,0.25);border-radius:12px;padding:20px 22px;margin:20px 0;`;

  const customerHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="${base}">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="${gold}font-size:28px;margin:0 0 8px;">¡Tu pedido fue confirmado!</h1>
    <p style="${muted}font-size:13px;font-style:italic;margin:0;">Essenza Chile · Extra Virgen · Extracción en Frío</p>
  </div>
  <p style="line-height:1.8;">Hola <strong>${customer.nombre}</strong>,<br>Gracias por tu compra. Tu pago fue procesado exitosamente.</p>
  <div style="${box}">
    <p style="${gold}font-size:12px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 14px;">Resumen del pedido</p>
    <table style="width:100%;border-collapse:collapse;">
      ${productRows}
      <tr><td style="padding:7px 0;${muted}">Despacho — ${shipping.regionName}</td><td style="padding:7px 0;text-align:right;">${formatCLP(shipping.cost)}</td></tr>
      <tr style="border-top:1px solid rgba(201,168,76,0.15);">
        <td style="padding:12px 0;font-weight:bold;${gold}">Total</td>
        <td style="padding:12px 0;text-align:right;font-size:20px;font-weight:bold;color:#e8c46a;">${formatCLP(total)}</td>
      </tr>
    </table>
  </div>
  <div style="${box}">
    <p style="${gold}font-size:12px;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 12px;">Dirección de despacho</p>
    <p style="margin:0;line-height:1.8;">${customer.calle} ${customer.numero}<br>${customer.comuna}<br>${shipping.regionName}</p>
  </div>
  <p style="line-height:1.8;margin-top:24px;">Te contactaremos pronto para coordinar el despacho. Consultas a <a href="mailto:contacto@premiumolivechile.com" style="${gold}">contacto@premiumolivechile.com</a>.</p>
  <div style="margin-top:40px;padding-top:24px;border-top:1px solid rgba(201,168,76,0.12);text-align:center;">
    <p style="color:rgba(201,168,76,0.5);font-size:11px;letter-spacing:0.15em;text-transform:uppercase;margin:0;">Essenza Chile · Premium Olive Chile SPA</p>
  </div>
</body></html>`;

  const storeHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body style="${base}">
  <h1 style="${gold}font-size:22px;margin:0 0 4px;">Nuevo pedido recibido</h1>
  ${paymentId ? `<p style="${muted}font-size:12px;margin:0 0 20px;">Payment ID: ${paymentId}</p>` : ""}
  <div style="${box}">
    <p style="${gold}font-size:10px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 14px;">Cliente</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:5px 0;${muted}width:140px;">Nombre</td><td>${customer.nombre}</td></tr>
      <tr><td style="padding:5px 0;${muted}">Email</td><td>${customer.email}</td></tr>
      <tr><td style="padding:5px 0;${muted}">Teléfono</td><td>${customer.telefono}</td></tr>
      <tr><td style="padding:5px 0;${muted}">Documento</td><td>${customer.tipoDoc === "boleta" ? "Boleta" : "Factura"}</td></tr>
      ${facturaRows}
    </table>
  </div>
  <div style="${box}">
    <p style="${gold}font-size:10px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 12px;">Despacho</p>
    <p style="margin:0;line-height:1.8;">${customer.calle} ${customer.numero}<br>${customer.comuna}<br>${shipping.regionName}</p>
  </div>
  <div style="${box}">
    <p style="${gold}font-size:10px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 14px;">Pedido</p>
    <table style="width:100%;border-collapse:collapse;">
      ${productRows}
      <tr><td style="padding:7px 0;${muted}">Despacho</td><td style="text-align:right;">${formatCLP(shipping.cost)}</td></tr>
      <tr style="border-top:1px solid rgba(201,168,76,0.15);">
        <td style="padding:12px 0;font-weight:bold;${gold}">Total</td>
        <td style="padding:12px 0;text-align:right;font-size:20px;font-weight:bold;color:#e8c46a;">${formatCLP(total)}</td>
      </tr>
    </table>
  </div>
</body></html>`;

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
      sendEmail(customer.email, "¡Tu pedido Essenza Chile fue confirmado!", customerHtml),
      sendEmail("contacto@premiumolivechile.com", `Nuevo pedido — ${customer.nombre}`, storeHtml),
    ]);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("send-order-email error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
