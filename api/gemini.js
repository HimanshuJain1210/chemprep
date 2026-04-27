// Vercel serverless function — Gemini proxy
// Client calls /api/gemini?model=gemini-2.5-flash with the standard Gemini request body.
// Set env var GEMINI_API_KEY in the Vercel project.

export default async function handler(req, res){
  if (req.method === 'OPTIONS'){
    res.setHeader('access-control-allow-origin', '*');
    res.setHeader('access-control-allow-headers', 'content-type,authorization');
    res.setHeader('access-control-allow-methods', 'POST,OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const key = process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'GEMINI_API_KEY not set on server' });

  const model = (req.query && req.query.model) || 'gemini-2.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(req.body || {})
    });
    const text = await r.text();
    res.setHeader('content-type', 'application/json');
    return res.status(r.status).send(text);
  } catch (e){
    return res.status(502).json({ error: 'Proxy error: ' + (e.message || String(e)) });
  }
}
