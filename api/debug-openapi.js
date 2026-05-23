module.exports = async function handler(req, res) {
  if (req.query.key !== 'Essenza2025!') return res.status(403).json({ error: 'Forbidden' });

  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  // Fetch PostgREST OpenAPI spec — lists every table/function it can see
  const r = await fetch(`${url}/rest/v1/`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Accept: 'application/json' },
  });

  const body = await r.json();

  // Extract table names from paths
  const paths = Object.keys(body.paths || {});
  const tables = paths.filter(p => !p.startsWith('/rpc/')).map(p => p.replace('/', ''));

  res.json({ status: r.status, exposedTables: tables, totalPaths: paths.length });
};
