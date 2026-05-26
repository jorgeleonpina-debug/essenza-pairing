const PIXEL_ID = '1648204836065387';
const ACCESS_TOKEN = process.env.META_CONVERSIONS_TOKEN;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { eventName, eventData, userData } = req.body;

  try {
    const payload = {
      data: [{
        event_name: eventName,
        event_time: Math.floor(Date.now() / 1000),
        event_source_url: 'https://essenzachile.vercel.app',
        action_source: 'website',
        user_data: {
          em: userData?.email ? [hashSHA256(userData.email)] : [],
          ph: userData?.phone ? [hashSHA256(userData.phone)] : [],
          client_ip_address: req.headers['x-forwarded-for'] || req.socket?.remoteAddress,
          client_user_agent: req.headers['user-agent'],
          fbp: userData?.fbp || null,
          fbc: userData?.fbc || null,
        },
        custom_data: eventData || {},
      }],
    };

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(result));

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('meta-conversions error:', err.message);
    res.status(500).json({ error: err.message });
  }
};

function hashSHA256(value) {
  const crypto = require('crypto');
  return crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}
