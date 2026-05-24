const supabase = require('./_supabase');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { customer, products, shipping, subtotal, total, paymentId } = req.body;

  if (!customer || !customer.email) {
    return res.status(400).json({ error: 'Customer data required' });
  }

  try {
    // Insert customer, fall back to select if email already exists
    const customerPayload = {
      nombre: customer.nombre,
      email: customer.email,
      telefono: customer.telefono || null,
      direccion: customer.calle ? `${customer.calle} ${customer.numero || ''}`.trim() : null,
      comuna: customer.comuna || null,
      region: shipping?.regionName || null,
      documento: customer.tipoDoc || 'boleta',
      rut: customer.rut || null,
      razon_social: customer.razonSocial || null,
    };

    let customerData;
    const { data: inserted, error: insertErr } = await supabase
      .from('customers')
      .insert(customerPayload)
      .select('id')
      .single();

    if (insertErr) {
      // On duplicate email, fetch existing record
      const { data: existing, error: selectErr } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customer.email)
        .single();
      if (selectErr) throw selectErr;
      customerData = existing;
    } else {
      customerData = inserted;
    }

    // Save order — plain insert, ignore duplicate payment IDs
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerData.id,
        producto: JSON.stringify(products || []),
        precio: subtotal || 0,
        envio: shipping?.cost || 0,
        total: total || 0,
        estado: 'aprobado',
        mp_payment_id: paymentId || null,
      });

    // Ignore duplicate payment ID errors (idempotent retry)
    if (orderError && !orderError.message.includes('duplicate')) throw orderError;

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('checkout error:', err.message);
    res.status(500).json({ error: err.message });
  }
};
