const supabase = require('./_supabase');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { customer, products, shipping, subtotal, total, paymentId } = req.body;

  if (!customer || !customer.email) {
    return res.status(400).json({ error: 'Customer data required' });
  }

  try {
    // Find or create customer
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .upsert(
        { name: customer.nombre, email: customer.email, phone: customer.telefono || null },
        { onConflict: 'email' }
      )
      .select('id')
      .single();

    if (customerError) throw customerError;

    // Save order (ignore duplicate payment_id)
    const { error: orderError } = await supabase
      .from('orders')
      .upsert(
        {
          customer_id: customerData.id,
          items: products || [],
          subtotal: subtotal || 0,
          shipping_cost: shipping?.cost || 0,
          total: total || 0,
          region: shipping?.regionName || null,
          commune: customer.comuna || null,
          address: customer.calle ? `${customer.calle} ${customer.numero || ''}`.trim() : null,
          document_type: customer.tipoDoc || 'boleta',
          rut: customer.rut || null,
          razon_social: customer.razonSocial || null,
          payment_id: paymentId || null,
          payment_status: 'approved',
        },
        { onConflict: 'payment_id', ignoreDuplicates: true }
      );

    if (orderError) throw orderError;

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('checkout error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
