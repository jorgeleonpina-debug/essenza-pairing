const supabase = require('./_supabase');
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

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

    const [ordersRes, customersRes, customerCountRes, newsletterRes, metaConvRes, metaVisitsRes, whatsappRes] = await Promise.all([
      supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(200),
      supabase.from('customers').select('id, nombre, email, telefono, direccion, comuna, region, documento, rut, razon_social'),
      supabase.from('customers').select('*', { count: 'exact', head: true }),
      supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false }),
      supabase.from('marketing_meta_conversions').select('*').order('created_at', { ascending: false }),
      supabase.from('marketing_meta_visits').select('*').order('created_at', { ascending: false }),
      supabase.from('marketing_whatsapp').select('*').order('created_at', { ascending: false }),
    ]);

    if (ordersRes.error) throw ordersRes.error;
    if (customersRes.error) throw customersRes.error;
    if (customerCountRes.error) throw customerCountRes.error;
    if (newsletterRes.error) throw newsletterRes.error;
    if (metaConvRes.error) throw metaConvRes.error;
    if (metaVisitsRes.error) throw metaVisitsRes.error;
    if (whatsappRes.error) throw whatsappRes.error;

    // Build customer lookup map and normalize to expected field names
    const customerMap = {};
    for (const c of (customersRes.data || [])) {
      customerMap[c.id] = {
        name: c.nombre,
        email: c.email,
        phone: c.telefono,
        address: c.direccion,
        commune: c.comuna,
        region: c.region,
      };
    }

    // Normalize orders to expected field names for dashboard + CSV
    const orders = (ordersRes.data || []).map((o) => {
      const customer = customerMap[o.customer_id] || null;
      let items = [];
      try { items = JSON.parse(o.producto || '[]'); } catch { items = []; }
      return {
        id: o.id,
        created_at: o.created_at,
        customer_id: o.customer_id,
        items,
        subtotal: o.precio || 0,
        shipping_cost: o.envio || 0,
        total: o.total || 0,
        region: customer?.region || null,
        commune: customer?.commune || null,
        address: customer?.address || null,
        document_type: null,
        rut: null,
        razon_social: null,
        payment_id: o.mp_payment_id || o.mp_preference_id || null,
        payment_status: o.estado || 'aprobado',
        customers: customer,
      };
    });

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
      newsletterCount: newsletterRes.data?.length || 0,
      newsletter: newsletterRes.data || [],
      salesToday,
      salesWeek,
      salesMonth,
      metaConversions: metaConvRes.data || [],
      metaVisits: metaVisitsRes.data || [],
      whatsapp: whatsappRes.data || [],
    });
  } catch (err) {
    console.error('admin-data error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
