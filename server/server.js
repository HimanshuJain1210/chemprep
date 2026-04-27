// Optional backend proxy — keeps API keys off the browser.
// Deploy to Vercel, Render, Fly.io, or run locally on port 8787.
// Set env vars: GEMINI_API_KEY, GROQ_API_KEY, ANTHROPIC_API_KEY (any subset).

import http from 'node:http';

const PORT = Number(process.env.PORT || 8787);
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const GROQ_KEY = process.env.GROQ_API_KEY || '';
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';

const cors = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type,authorization',
  'access-control-allow-methods': 'POST,OPTIONS'
};

function readJson(req){
  return new Promise((res, rej) => {
    let b = '';
    req.on('data', c => b += c);
    req.on('end', () => { try { res(JSON.parse(b || '{}')); } catch (e) { rej(e); } });
    req.on('error', rej);
  });
}

async function proxy(target, body, headers){
  const r = await fetch(target, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body)
  });
  const text = await r.text();
  return { status: r.status, text };
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS'){ res.writeHead(204, cors); return res.end(); }
  try {
    if (req.method !== 'POST'){ res.writeHead(405, cors); return res.end('Method not allowed'); }
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (url.pathname === '/api/gemini'){
      if (!GEMINI_KEY){ res.writeHead(500, cors); return res.end('GEMINI_API_KEY not set on server'); }
      const model = url.searchParams.get('model') || 'gemini-2.0-flash';
      const body = await readJson(req);
      const target = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(GEMINI_KEY)}`;
      const { status, text } = await proxy(target, body, {});
      res.writeHead(status, { ...cors, 'content-type': 'application/json' });
      return res.end(text);
    }

    if (url.pathname === '/api/groq'){
      if (!GROQ_KEY){ res.writeHead(500, cors); return res.end('GROQ_API_KEY not set on server'); }
      const body = await readJson(req);
      const { status, text } = await proxy('https://api.groq.com/openai/v1/chat/completions', body, {
        authorization: `Bearer ${GROQ_KEY}`
      });
      res.writeHead(status, { ...cors, 'content-type': 'application/json' });
      return res.end(text);
    }

    if (url.pathname === '/api/openrouter'){
      if (!OPENROUTER_KEY){ res.writeHead(500, cors); return res.end('OPENROUTER_API_KEY not set on server'); }
      const body = await readJson(req);
      const { status, text } = await proxy('https://openrouter.ai/api/v1/chat/completions', body, {
        authorization: `Bearer ${OPENROUTER_KEY}`,
        'HTTP-Referer': 'https://chemprep.local',
        'X-Title': 'ChemPrep'
      });
      res.writeHead(status, { ...cors, 'content-type': 'application/json' });
      return res.end(text);
    }

    if (url.pathname === '/api/anthropic'){
      if (!ANTHROPIC_KEY){ res.writeHead(500, cors); return res.end('ANTHROPIC_API_KEY not set on server'); }
      const body = await readJson(req);
      const { status, text } = await proxy('https://api.anthropic.com/v1/messages', body, {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01'
      });
      res.writeHead(status, { ...cors, 'content-type': 'application/json' });
      return res.end(text);
    }

    res.writeHead(404, cors);
    res.end('Not found');
  } catch (e){
    res.writeHead(500, cors);
    res.end('Proxy error: ' + (e.message || e));
  }
});

server.listen(PORT, () => console.log(`ChemPrep proxy listening on :${PORT}`));
