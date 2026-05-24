module.exports = async function handler(req, res) {
  if (req.query.key !== 'Essenza2025!') return res.status(403).json({ error: 'Forbidden' });

  const url = process.env.REACT_APP_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

  const decodeJwt = (k) => {
    try { return JSON.parse(Buffer.from(k.split('.')[1], 'base64').toString()); } catch { return null; }
  };

  const servicePayload = serviceKey ? decodeJwt(serviceKey) : null;
  const anonPayload = anonKey ? decodeJwt(anonKey) : null;

  // Hit PostgREST with service role key
  const results = {};

  for (const table of ['orders', 'customers', 'newsletter_subscribers', 'newsletter']) {
    const r = await fetch(`${url}/rest/v1/${table}?limit=1`, {
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, Accept: 'application/json', Prefer: 'return=representation' },
    });
    results[table] = { status: r.status, body: (await r.text()).slice(0, 400) };
  }

  // Check information_schema via rpc if available
  res.json({
    url,
    serviceKey: { set: !!serviceKey, length: serviceKey?.length, isJwt: serviceKey?.startsWith('eyJ'), role: servicePayload?.role },
    anonKey: { set: !!anonKey, length: anonKey?.length, isJwt: anonKey?.startsWith('eyJ'), role: anonPayload?.role },
    tableAccess: results,
  });
};
