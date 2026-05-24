const supabase = require('./_supabase');
const ADMIN_PASSWORD = 'Essenza2025!';

const socialFooter = `
  <div style="background:#0d2214;padding:28px 40px 32px;text-align:center;border-top:1px solid rgba(201,168,76,0.12);">
    <p style="font-family:Georgia,serif;font-size:9px;letter-spacing:0.28em;color:rgba(201,168,76,0.55);text-transform:uppercase;margin:0 0 16px;">Síguenos</p>
    <div style="margin-bottom:18px;">
      <a href="https://instagram.com/essenzaolive" style="display:inline-block;margin:0 10px;text-decoration:none;">
        <span style="font-family:Georgia,serif;font-size:12px;color:rgba(201,168,76,0.75);letter-spacing:0.08em;">Instagram</span><br>
        <span style="font-family:Georgia,serif;font-size:11px;color:rgba(245,240,232,0.4);">@essenzaolive</span>
      </a>
      <a href="https://facebook.com/essenzaolive" style="display:inline-block;margin:0 10px;text-decoration:none;">
        <span style="font-family:Georgia,serif;font-size:12px;color:rgba(201,168,76,0.75);letter-spacing:0.08em;">Facebook</span><br>
        <span style="font-family:Georgia,serif;font-size:11px;color:rgba(245,240,232,0.4);">@essenzaolive</span>
      </a>
      <a href="mailto:contacto@premiumolivechile.com" style="display:inline-block;margin:0 10px;text-decoration:none;">
        <span style="font-family:Georgia,serif;font-size:12px;color:rgba(201,168,76,0.75);letter-spacing:0.08em;">Email</span><br>
        <span style="font-family:Georgia,serif;font-size:11px;color:rgba(245,240,232,0.4);">contacto@premiumolivechile.com</span>
      </a>
    </div>
    <p style="font-family:Georgia,serif;font-size:10px;letter-spacing:0.15em;color:rgba(201,168,76,0.35);text-transform:uppercase;margin:0;">Essenza Chile · Premium Olive Chile SPA</p>
  </div>`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { orderId, trackingNumber, customerEmail, customerName, password } = req.body;

  if (password !== ADMIN_PASSWORD) return res.status(401).json({ error: 'No autorizado' });
  if (!orderId || !customerEmail) return res.status(400).json({ error: 'Datos requeridos' });

  try {
    const { error: updateError } = await supabase
      .from('orders')
      .update({ estado: 'enviado' })
      .eq('id', orderId);
    if (updateError) throw updateError;

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const gold = 'color:#c9a84c;';
      const muted = 'color:rgba(245,240,232,0.6);';
      const trackingBlock = trackingNumber
        ? `<div style="background:rgba(45,74,30,0.3);border:2px solid rgba(201,168,76,0.35);border-radius:12px;padding:24px;text-align:center;margin:24px 0;">
            <p style="font-size:10px;letter-spacing:0.26em;${gold}text-transform:uppercase;margin:0 0 10px;">Número de tracking</p>
            <p style="font-size:32px;font-weight:700;color:#e8c46a;letter-spacing:0.1em;margin:0 0 10px;font-family:Courier New,monospace;">${trackingNumber}</p>
            <p style="font-size:13px;${muted}margin:0;line-height:1.6;">Usa este número para seguir el estado de tu envío</p>
          </div>`
        : '';

      const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#111111;margin:0;padding:0;font-family:Georgia,serif;color:#f5f0e8;">
<div style="max-width:560px;margin:0 auto;">

  <div style="background:#1a3a2a;padding:44px 40px 36px;text-align:center;border-bottom:1px solid rgba(201,168,76,0.2);">
    <p style="font-size:10px;letter-spacing:0.3em;${gold}text-transform:uppercase;margin:0 0 14px;">Essenza Chile</p>
    <h1 style="font-size:28px;${gold}margin:0 0 10px;line-height:1.2;font-weight:700;">Tu pedido está<br>en camino 🫒</h1>
    <p style="font-size:12px;color:rgba(245,240,232,0.45);font-style:italic;margin:0;">Extra Virgen · Extracción en Frío · Chile</p>
  </div>

  <div style="background:#111111;padding:36px 40px 32px;">
    <p style="font-size:15px;line-height:1.9;color:rgba(245,240,232,0.85);margin:0 0 24px;">
      Hola <strong style="${gold}">${customerName}</strong>,<br>
      Tu pedido está en camino. Pronto llegará a tu dirección.
    </p>

    ${trackingBlock}

    <div style="background:rgba(201,168,76,0.07);border-left:3px solid rgba(201,168,76,0.5);border-radius:0 10px 10px 0;padding:16px 20px;margin:0 0 28px;">
      <p style="font-size:14px;line-height:1.85;color:rgba(245,240,232,0.8);margin:0;">
        Tu pedido fue preparado con mucho cuidado y está siendo despachado. Te avisaremos cuando esté entregado.
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

      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: 'Essenza Chile <noreply@premiumolivechile.com>',
          to: customerEmail,
          subject: 'Tu pedido Essenza está en camino 🫒',
          html,
        }),
      });
      if (!r.ok) console.error('ship email error:', await r.text());
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('ship-order error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
