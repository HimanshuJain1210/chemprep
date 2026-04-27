// Vercel serverless function — Anthropic proxy
// Client calls POST /api/anthropic with Claude Messages API payload.
// Set env var ANTHROPIC_API_KEY in the Vercel project.

export default async function handler(req, res){
  if (req.method === 'OPTIONS'){
    res.setHeader('access-control-allow-origin', '*');
    res.setHeader('access-control-allow-headers', 'content-type,authorization');
    res.setHeader('access-control-allow-methods', 'POST,OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set on server' });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body || {})
    });
    const text = await r.text();
    res.setHeader('content-type', 'application/json');
    return res.status(r.status).send(text);
  } catch (e){
    return res.status(502).json({ error: 'Proxy error: ' + (e.message || String(e)) });
  }
}
