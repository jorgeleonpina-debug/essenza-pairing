module.exports = async function handler(req, res) {
  if (req.query.key !== 'Essenza2025!') return res.status(403).json({ error: 'Forbidden' });

  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  // Decode JWT payload
  let jwtPayload = null;
  try { jwtPayload = JSON.parse(Buffer.from(key.split('.')[1], 'base64').toString()); } catch {}

  const results = {};

  // 1. OpenAPI root — needs valid JWT
  const r1 = await fetch(`${url}/rest/v1/`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  results.openApi = { status: r1.status, body: (await r1.text()).slice(0, 300) };

  // 2. Single table probe — raw GET
  const r2 = await fetch(`${url}/rest/v1/orders?limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
  });
  results.ordersGet = { status: r2.status, body: (await r2.text()).slice(0, 300) };

  // 3. Auth health check
  const r3 = await fetch(`${url}/auth/v1/health`, {
    headers: { apikey: key },
  });
  results.authHealth = { status: r3.status, body: (await r3.text()).slice(0, 200) };

  res.json({ url, jwtPayload, results });
};
