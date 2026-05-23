module.exports = async function handler(req, res) {
  if (req.query.key !== 'Essenza2025!') return res.status(403).json({ error: 'Forbidden' });

  const url = process.env.REACT_APP_SUPABASE_URL;
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

  if (!url || !key) return res.status(500).json({ error: 'Supabase env vars not set', url: !!url, key: !!key });

  const results = {};

  for (const table of ['orders', 'customers', 'newsletter_subscribers']) {
    try {
      const r = await fetch(`${url}/rest/v1/${table}?select=count`, {
        method: 'GET',
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          Accept: 'application/json',
          Prefer: 'count=exact',
        },
      });
      const body = await r.text();
      results[table] = { status: r.status, contentRange: r.headers.get('content-range'), body: body.slice(0, 200) };
    } catch (err) {
      results[table] = { error: err.message };
    }
  }

  res.json({ supabaseUrl: url, results });
};
