const DISCOUNT_CODE = "ESSENZA15";
const supabase = require('./_supabase');

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { nombre, apellido, email, fechaNacimiento, preferencia } = req.body;

  if (!nombre || !email) return res.status(400).json({ error: "Datos requeridos" });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY not set");
    return res.status(500).json({ error: "Email service not configured" });
  }

  const nombreCompleto = apellido ? `${nombre} ${apellido}` : nombre;
  const gold = "color:#c9a84c;";
  const muted = "color:rgba(245,240,232,0.6);";
  const siteUrl = process.env.SITE_URL || "https://essenza-pairing.vercel.app";

  const subscriberHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#111111;margin:0;padding:0;font-family:Georgia,serif;color:#f5f0e8;">
<div style="max-width:560px;margin:0 auto;">

  <div style="background:#0d2214;padding:44px 40px 36px;text-align:center;border-bottom:1px solid rgba(201,168,76,0.18);">
    <p style="font-size:10px;letter-spacing:0.28em;${gold}text-transform:uppercase;margin:0 0 16px;">Essenza Chile</p>
    <h1 style="font-size:30px;${gold}margin:0;line-height:1.1;font-weight:700;text-transform:uppercase;">Bienvenid@ a<br>la familia Essenza</h1>
  </div>

  <div style="background:#111111;padding:40px 40px 32px;">
    <p style="font-size:15px;line-height:1.85;color:rgba(245,240,232,0.85);margin:0 0 30px;">
      Hola <strong>${nombreCompleto}</strong>,<br>
      ¡Gracias por unirte! Como bienvenida, aquí está tu regalo exclusivo:
    </p>

    <div style="background:rgba(45,74,30,0.3);border:2px solid rgba(201,168,76,0.38);border-radius:14px;padding:32px 24px;text-align:center;margin:0 0 36px;">
      <p style="font-size:10px;letter-spacing:0.26em;color:rgba(201,168,76,0.6);text-transform:uppercase;margin:0 0 14px;">Tu código exclusivo</p>
      <p style="font-size:46px;font-weight:700;color:#e8c46a;letter-spacing:0.12em;margin:0 0 14px;font-family:Courier New,monospace;">${DISCOUNT_CODE}</p>
      <p style="font-size:14px;${muted}margin:0;line-height:1.6;">15% de descuento + envío gratis<br>en tu primera compra en Essenza Chile</p>
    </div>

    <p style="font-size:10px;letter-spacing:0.22em;${gold}text-transform:uppercase;margin:0 0 14px;">¿Cómo usarlo?</p>
    <p style="font-size:14px;color:rgba(245,240,232,0.75);line-height:2.1;margin:0 0 32px;">
      <strong style="${gold}">1.</strong>&nbsp; Visita nuestra tienda y elige tu producto favorito<br>
      <strong style="${gold}">2.</strong>&nbsp; Haz clic en <em>Comprar</em> y completa tus datos<br>
      <strong style="${gold}">3.</strong>&nbsp; Tu descuento se aplica automáticamente al pagar
    </p>

    <div style="text-align:center;margin-bottom:8px;">
      <a href="${siteUrl}" style="display:inline-block;background:#c9a84c;color:#111111;font-size:12px;font-weight:700;letter-spacing:0.24em;text-transform:uppercase;text-decoration:none;padding:15px 38px;border-radius:9px;">Ir a la tienda →</a>
    </div>
  </div>

  <div style="background:#0d2214;padding:28px 40px;text-align:center;border-top:1px solid rgba(201,168,76,0.1);">
    <p style="font-size:10px;letter-spacing:0.15em;color:rgba(201,168,76,0.45);text-transform:uppercase;margin:0 0 8px;">Essenza Chile · Premium Olive Chile SPA</p>
    <p style="font-size:11px;color:rgba(245,240,232,0.2);margin:0;line-height:1.7;">Recibiste este email porque te suscribiste en essenza-pairing.vercel.app.<br>Para cancelar, responde con "CANCELAR".</p>
  </div>

</div>
</body>
</html>`;

  const extraRows = [
    fechaNacimiento ? `<tr><td style="padding:5px 0;${muted}width:150px;">Fecha nacimiento</td><td style="padding:5px 0;">${fechaNacimiento}</td></tr>` : "",
    preferencia ? `<tr><td style="padding:5px 0;${muted}">Preferencia</td><td style="padding:5px 0;">${preferencia}</td></tr>` : "",
  ].join("");

  const storeHtml = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background:#111111;color:#f5f0e8;font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:40px 24px;">
  <h1 style="${gold}font-size:22px;margin:0 0 4px;">Nuevo suscriptor</h1>
  <p style="${muted}font-size:12px;margin:0 0 22px;">Newsletter Essenza Chile</p>
  <div style="background:rgba(45,74,30,0.2);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:20px 22px;">
    <p style="${gold}font-size:10px;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 14px;">Datos del suscriptor</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr><td style="padding:5px 0;${muted}width:150px;">Nombre</td><td style="padding:5px 0;">${nombreCompleto}</td></tr>
      <tr><td style="padding:5px 0;${muted}">Email</td><td style="padding:5px 0;">${email}</td></tr>
      ${extraRows}
    </table>
  </div>
</body>
</html>`;

  const sendEmail = async (to, subject, html) => {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Essenza Chile <noreply@premiumolivechile.com>",
        to,
        subject,
        html,
      }),
    });
    if (!r.ok) {
      const err = await r.text();
      throw new Error(`Resend ${r.status}: ${err}`);
    }
    return r.json();
  };

  try {
    await Promise.all([
      sendEmail(email, `Tu código exclusivo ${DISCOUNT_CODE} | Essenza Chile`, subscriberHtml),
      sendEmail("contacto@premiumolivechile.com", `Nuevo suscriptor: ${nombreCompleto}`, storeHtml),
      supabase.from("newsletter_subscribers").upsert(
        {
          name: nombreCompleto,
          email,
          birthdate: fechaNacimiento || null,
          preference: preferencia || null,
        },
        { onConflict: "email", ignoreDuplicates: true }
      ),
    ]);
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("newsletter error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
