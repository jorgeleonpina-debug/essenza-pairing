const supabase = require('./_supabase');
const ADMIN_PASSWORD = 'Essenza2025!';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  try {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - 7);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Query orders and customers separately to avoid PostgREST relationship cache dependency
    const [ordersRes, customersRes, customerCountRes, newsletterCountRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('customers').select('id, name, email, phone'),
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true }),
    ]);

    if (ordersRes.error) throw ordersRes.error;
    if (customersRes.error) throw customersRes.error;

    // Build customer lookup map
    const customerMap = {};
    for (const c of (customersRes.data || [])) {
      customerMap[c.id] = c;
    }

    // Attach customer data to each order
    const orders = (ordersRes.data || []).map((o) => ({
      ...o,
      customers: customerMap[o.customer_id] || null,
    }));

    const salesToday = orders
      .filter((o) => new Date(o.created_at) >= todayStart)
      .reduce((s, o) => s + (o.total || 0), 0);

    const salesWeek = orders
      .filter((o) => new Date(o.created_at) >= weekStart)
      .reduce((s, o) => s + (o.total || 0), 0);

    const salesMonth = orders
      .filter((o) => new Date(o.created_at) >= monthStart)
      .reduce((s, o) => s + (o.total || 0), 0);

    res.json({
      orders,
      customerCount: customerCountRes.count || 0,
      newsletterCount: newsletterCountRes.count || 0,
      salesToday,
      salesWeek,
      salesMonth,
    });
  } catch (err) {
    console.error('admin-data error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
