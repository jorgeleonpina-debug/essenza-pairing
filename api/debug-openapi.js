module.exports = async function handler(req, res) {
  if (req.query.key !== 'Essenza2025!') return res.status(403).json({ error: 'Forbidden' });

  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  // Key diagnostics without exposing full value
  const keyInfo = {
    set: !!key,
    length: key ? key.length : 0,
    prefix: key ? key.slice(0, 20) + '...' : 'EMPTY',
    looksLikeJwt: key ? key.startsWith('eyJ') : false,
  };

  // Decode JWT payload (no verification) to see which project it's for
  let jwtPayload = null;
  if (key && key.startsWith('eyJ')) {
    try {
      const parts = key.split('.');
      jwtPayload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    } catch {}
  }

  // Fetch PostgREST OpenAPI spec
  const r = await fetch(`${url}/rest/v1/`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
  });

  const body = await r.json().catch(() => ({}));
  const paths = Object.keys(body.paths || {});
  const tables = paths.filter(p => !p.startsWith('/rpc/')).map(p => p.replace('/', ''));

  res.json({ supabaseUrl: url, keyInfo, jwtPayload, openApiStatus: r.status, exposedTables: tables });
};
