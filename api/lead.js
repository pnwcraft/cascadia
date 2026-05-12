const RESEND_API_URL = 'https://api.resend.com/emails';

function parseUrlEncoded(body = '') {
  return Object.fromEntries(new URLSearchParams(body));
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatRows(payload) {
  return Object.entries(payload)
    .filter(([key]) => key !== 'form-name')
    .map(([key, value]) => `<tr><th align="left" style="padding:6px 12px 6px 0">${escapeHtml(key)}</th><td style="padding:6px 0">${escapeHtml(value)}</td></tr>`)
    .join('');
}

async function readPayload(request) {
  if (request.headers['content-type']?.includes('application/json')) {
    return request.body || {};
  }
  if (typeof request.body === 'string') {
    return parseUrlEncoded(request.body);
  }
  return request.body || {};
}

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL || process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.LEAD_FROM_EMAIL || 'Cascadia Deck & Fence <onboarding@resend.dev>';

  if (!resendApiKey || !toEmail) {
    return response.status(503).json({
      error: 'Lead delivery is not configured yet. Add RESEND_API_KEY and LEAD_TO_EMAIL in Vercel, then redeploy. Please call or email Cascadia Deck & Fence directly.',
    });
  }

  const payload = await readPayload(request);
  const formName = payload['form-name'] || 'website lead';
  const subject = `New Cascadia Deck & Fence ${formName}`;
  const html = `
    <h1>New Cascadia Deck & Fence request</h1>
    <p>A visitor submitted the ${escapeHtml(formName)} form.</p>
    <table>${formatRows(payload)}</table>
  `;

  const resendResponse = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: fromEmail, to: [toEmail], subject, html }),
  });

  if (!resendResponse.ok) {
    const details = await resendResponse.text();
    return response.status(502).json({ error: `Email delivery failed: ${details}` });
  }

  return response.status(200).json({ message: 'Thank you — your request was sent. Cascadia Deck & Fence will follow up soon.' });
};
