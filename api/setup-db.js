const SQL = `
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  items JSONB NOT NULL,
  subtotal INTEGER NOT NULL,
  shipping_cost INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL,
  region TEXT,
  commune TEXT,
  address TEXT,
  document_type TEXT DEFAULT 'boleta',
  rut TEXT,
  razon_social TEXT,
  payment_id TEXT UNIQUE,
  payment_status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  birthdate DATE,
  preference TEXT,
  discount_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
`;

module.exports = async function handler(req, res) {
  if (req.query.setup_key !== 'Essenza2025!') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

  if (!supabaseUrl || !accessToken) {
    return res.status(500).json({
      error: 'Missing env vars: REACT_APP_SUPABASE_URL and SUPABASE_ACCESS_TOKEN required',
    });
  }

  const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

  try {
    const r = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: SQL }),
    });

    if (!r.ok) {
      const err = await r.text();
      return res.status(500).json({ error: err });
    }

    res.json({ ok: true, message: 'Tables created successfully' });
  } catch (err) {
    console.error('setup-db error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
