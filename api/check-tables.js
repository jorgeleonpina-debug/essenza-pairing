const supabase = require('./_supabase');

module.exports = async function handler(req, res) {
  if (req.query.key !== 'Essenza2025!') return res.status(403).json({ error: 'Forbidden' });

  const tables = ['orders', 'customers', 'newsletter_subscribers'];
  const results = {};

  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true });
    results[table] = error ? { exists: false, error: error.message } : { exists: true, count };
  }

  const url = process.env.REACT_APP_SUPABASE_URL || 'NOT SET';
  const keySet = !!process.env.REACT_APP_SUPABASE_ANON_KEY;

  res.json({ supabaseUrl: url, anonKeySet: keySet, tables: results });
};
