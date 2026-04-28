// Unified AI client — supports Groq (recommended), OpenRouter, Gemini, Anthropic.
// Subject-aware: the active subject (chemistry/physics/maths) is injected into prompts.
// On a deployed host (Vercel) the client always routes through /api/* serverless
// functions so the user's browser never sees a key.

import { getState } from './storage.js';

export const MENTOR_SYSTEM = `You are a senior JEE mentor with 20 years of teaching experience across Physics, Chemistry, and Mathematics at a top coaching institute. You have prepared thousands of students for JEE Main and JEE Advanced. Your single goal is to help this student earn the highest possible rank — through clarity, not pressure.

Voice:
- Direct, concise, Indian-English. No fluff. Mentor tone — treat the student as capable.
- Use precise JEE vocabulary appropriate to the subject (GOC/CFT for chemistry, FBD/SHM for physics, LIATE/Bayes for maths, etc.).
- When explaining a concept: give the idea, then the trap students fall into, then 1-2 practice pointers.
- Never be condescending. Never be vague. When you're unsure, say so plainly.

Formatting:
- Markdown with short sections. Use headings sparingly (### only for multi-part answers).
- Equations in plain text with Unicode (ΔG, π, H₂O, ∫, √, ∇) or LaTeX-like inline (e.g. K_c, [H+], dy/dx).
- Keep answers under ~250 words unless a derivation is essential.
- End with "Try this:" followed by one short JEE-style question when helpful.

Care about the student:
- If they mention stress, backlog anxiety, phone addiction, lack of sleep, or comparison with peers, address it briefly and practically before answering the academic question.
- Recommend 40–45 min focus blocks with 5–10 min breaks. Discourage >90 min streaks.
- Celebrate small wins. Build confidence through visible progress, not pressure.`;

const SUBJECT_LABEL = { chemistry: 'Chemistry', physics: 'Physics', maths: 'Mathematics' };
export function subjectContext(subjectId){
  const label = SUBJECT_LABEL[subjectId] || 'Chemistry';
  return `\n\nThe student is currently working on JEE ${label}. Frame examples, vocabulary, and trap warnings inside ${label} unless the student explicitly asks about another subject.`;
}

function getCfg(){
  return getState().settings;
}

function isDeployed(){
  if (typeof location === 'undefined') return false;
  const h = location.hostname || '';
  return h && !['localhost', '127.0.0.1', '0.0.0.0'].includes(h);
}

function apiBase(){
  if (isDeployed()) return '/api';
  const { useProxy } = getCfg();
  return useProxy ? '/api' : null;
}

async function postJSON(url, body, headers){
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body)
  });
  const text = await res.text();
  if (!res.ok){
    let detail = text;
    try { detail = JSON.parse(text)?.error?.message || JSON.parse(text)?.message || text; } catch {}
    throw new Error(`${res.status} ${res.statusText} — ${String(detail).slice(0, 500)}`);
  }
  try { return JSON.parse(text); } catch { return text; }
}

export function extractJSON(text){
  if (typeof text !== 'string') return text;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced ? fenced[1] : text;
  const startObj = candidate.indexOf('{');
  const startArr = candidate.indexOf('[');
  let start = -1;
  if (startObj === -1) start = startArr;
  else if (startArr === -1) start = startObj;
  else start = Math.min(startObj, startArr);
  if (start < 0) throw new Error('No JSON object/array found in AI response.');
  const stack = [];
  const openMap = { '{': '}', '[': ']' };
  let inStr = false, escape = false;
  for (let i = start; i < candidate.length; i++){
    const ch = candidate[i];
    if (inStr){
      if (escape) { escape = false; continue; }
      if (ch === '\\') { escape = true; continue; }
      if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') { inStr = true; continue; }
    if (ch === '{' || ch === '[') stack.push(openMap[ch]);
    else if (ch === '}' || ch === ']'){
      const want = stack.pop();
      if (want !== ch) continue;
      if (!stack.length){
        const slice = candidate.slice(start, i + 1);
        try { return JSON.parse(slice); } catch (e){ throw new Error('JSON parse failed: ' + e.message); }
      }
    }
  }
  try { return JSON.parse(candidate); } catch (e){ throw new Error('Unterminated JSON in AI response.'); }
}

/* ============ GEMINI ============ */
async function callGemini({ system, messages, json=false, maxTokens=1500, imageData }){
  const cfg = getCfg();
  const key = cfg.geminiKey;
  const model = cfg.geminiModel || 'gemini-2.5-flash';
  if (!apiBase() && !key) throw new Error('AI is not configured yet. If running locally, add a Gemini key in Settings (free at aistudio.google.com/apikey). On Vercel, set GEMINI_API_KEY in env vars.');

  const contents = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));
  if (imageData && contents.length){
    const last = contents[contents.length - 1];
    last.parts.push({ inline_data: { mime_type: imageData.mime || 'image/png', data: imageData.base64 } });
  }

  const body = {
    system_instruction: system ? { parts: [{ text: system }] } : undefined,
    contents,
    generationConfig: {
      temperature: json ? 0.2 : 0.6,
      maxOutputTokens: maxTokens,
      ...(json ? { responseMimeType: 'application/json' } : {})
    }
  };

  const url = apiBase()
    ? `${apiBase()}/gemini?model=${encodeURIComponent(model)}`
    : `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;

  const data = await postJSON(url, body);
  const text = data?.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n')?.trim() || '';
  if (!text) throw new Error('Empty response from Gemini.');
  return json ? extractJSON(text) : text;
}

/* ============ GROQ ============ */
async function callGroq({ system, messages, json=false, maxTokens=1500 }){
  const cfg = getCfg();
  const key = cfg.groqKey;
  const model = cfg.groqModel || 'llama-3.3-70b-versatile';
  if (!apiBase() && !key) throw new Error('AI is not configured yet. If running locally, add a Groq key in Settings (free at console.groq.com). On Vercel, set GROQ_API_KEY in env vars.');

  const payload = {
    model,
    messages: [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ],
    max_tokens: maxTokens,
    temperature: json ? 0.2 : 0.6,
    ...(json ? { response_format: { type: 'json_object' } } : {})
  };

  const url = apiBase() ? `${apiBase()}/groq` : 'https://api.groq.com/openai/v1/chat/completions';
  const headers = apiBase() ? {} : { Authorization: `Bearer ${key}` };

  const data = await postJSON(url, payload, headers);
  const text = data?.choices?.[0]?.message?.content?.trim() || '';
  if (!text) throw new Error('Empty response from Groq.');
  return json ? extractJSON(text) : text;
}

/* ============ OPENROUTER ============ */
async function callOpenRouter({ system, messages, json=false, maxTokens=1500 }){
  const cfg = getCfg();
  const key = cfg.openrouterKey;
  const model = cfg.openrouterModel || 'deepseek/deepseek-r1:free';
  if (!apiBase() && !key) throw new Error('AI is not configured yet. If running locally, add an OpenRouter key in Settings (free at openrouter.ai/keys). On Vercel, set OPENROUTER_API_KEY in env vars.');

  const payload = {
    model,
    messages: [
      ...(system ? [{ role: 'system', content: system }] : []),
      ...messages.map(m => ({ role: m.role, content: m.content }))
    ],
    max_tokens: maxTokens,
    temperature: json ? 0.2 : 0.6,
    ...(json ? { response_format: { type: 'json_object' } } : {})
  };

  const url = apiBase() ? `${apiBase()}/openrouter` : 'https://openrouter.ai/api/v1/chat/completions';
  const headers = apiBase() ? {} : {
    Authorization: `Bearer ${key}`,
    'HTTP-Referer': typeof location !== 'undefined' ? location.origin : 'https://chemprep.local',
    'X-Title': 'JEEPrep'
  };

  const data = await postJSON(url, payload, headers);
  const text = data?.choices?.[0]?.message?.content?.trim() || '';
  if (!text) throw new Error('Empty response from OpenRouter.');
  return json ? extractJSON(text) : text;
}

/* ============ ANTHROPIC ============ */
async function callAnthropic({ system, messages, json=false, maxTokens=1500 }){
  const cfg = getCfg();
  const key = cfg.anthropicKey;
  const model = cfg.anthropicModel || 'claude-sonnet-4-6';
  if (!apiBase() && !key) throw new Error('AI is not configured yet. If running locally, add an Anthropic key in Settings. On Vercel, set ANTHROPIC_API_KEY in env vars.');

  const url = apiBase() ? `${apiBase()}/anthropic` : 'https://api.anthropic.com/v1/messages';
  const headers = apiBase() ? {} : {
    'x-api-key': key,
    'anthropic-version': '2023-06-01',
    'anthropic-dangerous-direct-browser-access': 'true'
  };

  const body = {
    model,
    max_tokens: maxTokens,
    system,
    messages: messages.map(m => ({ role: m.role, content: m.content }))
  };
  const data = await postJSON(url, body, headers);
  const text = (data?.content || []).map(p => p.text || '').join('\n').trim();
  if (!text) throw new Error('Empty response from Anthropic.');
  return json ? extractJSON(text) : text;
}

/* ============ Dispatch ============ */
export async function ai(params){
  const cfg = getCfg();
  switch (cfg.provider){
    case 'openrouter': return callOpenRouter(params);
    case 'gemini':     return callGemini(params);
    case 'anthropic':  return callAnthropic(params);
    case 'groq':
    default:           return callGroq(params);
  }
}

/* ============ Higher-level helpers ============ */

export async function chat(userText, { topic, image } = {}){
  const state = getState();
  const subject = state.profile.subject || 'chemistry';
  const history = state.chat.filter(m => m.content && m.content !== '…').slice(-8).map(m => ({ role: m.role, content: m.content }));
  let sys = MENTOR_SYSTEM + subjectContext(subject);
  if (topic){
    sys += `\n\nThe student is asking in the context of: **${topic.name}** (${topic.branch}, ${SUBJECT_LABEL[topic.subject] || 'Chemistry'}). Subtopics: ${topic.subs.join(', ')}. Watch out for this common trap: ${topic.traps}`;
  }
  return ai({ system: sys, messages: [...history, { role: 'user', content: userText }], imageData: image });
}

export async function generateFlashcards(topic, count = 12, level = 'JEE Main'){
  const subject = topic.subject || 'chemistry';
  const sys = MENTOR_SYSTEM + subjectContext(subject) + `

Task: generate high-quality flashcards for a JEE student.
Return STRICT JSON with this shape and NOTHING else:
{"cards":[{"front":"concise question/cue","back":"tight answer with the why (markdown allowed, 1-3 sentences)"}, ...]}
Coverage rules:
- Spread across the sub-areas listed. Mix recall, application, and common-trap items.
- Avoid trivia. Prefer concepts that appear in JEE Main/Adv.
- Fronts should be short (under 15 words). Backs may include formulas in Unicode.`;
  const user = `Topic: ${topic.name} (${topic.branch}, ${SUBJECT_LABEL[subject]}). Level: ${level}. Subtopics: ${topic.subs.join(', ')}. Generate exactly ${count} cards.`;
  const out = await ai({ system: sys, messages: [{ role: 'user', content: user }], json: true, maxTokens: 2500 });
  const cards = Array.isArray(out) ? out : (out.cards || out.items || out.flashcards || []);
  if (!Array.isArray(cards) || !cards.length) throw new Error('AI returned no cards. Try regenerating.');
  return cards.filter(c => c?.front && c?.back).map(c => ({ front: String(c.front).trim(), back: String(c.back).trim() }));
}

export async function generateMCQs(topic, count = 10, difficulty = 'JEE Main'){
  const subject = topic.subject || 'chemistry';
  const sys = MENTOR_SYSTEM + subjectContext(subject) + `

Task: generate ${difficulty}-level multiple-choice questions for active recall.
Return STRICT JSON:
{"questions":[{"q":"question stem","options":["A","B","C","D"],"answer":<0-3>,"explanation":"1-2 sentences"}]}
Rules:
- Mix conceptual and numerical. Include at least one trap-based question.
- Options must be plausible; correct index 0-3.
- Avoid questions that require diagrams unless the stem is self-contained.`;
  const user = `Topic: ${topic.name} (${topic.branch}, ${SUBJECT_LABEL[subject]}). Subtopics: ${topic.subs.join(', ')}. Count: ${count}.`;
  const out = await ai({ system: sys, messages: [{ role: 'user', content: user }], json: true, maxTokens: 3000 });
  const qs = Array.isArray(out) ? out : (out.questions || out.items || []);
  if (!Array.isArray(qs) || !qs.length) throw new Error('AI returned no questions.');
  return qs.filter(x => x?.q && Array.isArray(x?.options) && x.options.length === 4 && Number.isInteger(x.answer));
}

export async function suggestWeekPlan({ pending, backlogs, weekTargetMins, cls, schoolStart, schoolEnd, leaveDays, subject }){
  const subjectLabel = SUBJECT_LABEL[subject] || 'Chemistry';
  const sys = MENTOR_SYSTEM + subjectContext(subject) + `

Task: design a balanced, realistic weekly JEE ${subjectLabel} plan that respects the student's school schedule and rest days.
Return STRICT JSON with days Mon..Sun, each an array of blocks:
{"Mon":[{"time":"HH:MM","label":"short label","kind":"study|revision|school|break","topicId":"id-or-null"}], ..., "Sun":[...]}
Rules:
- Use hour-increment slots between 06:00 and 22:00.
- Place "school" blocks during the student's school hours (${schoolStart || '08:00'}-${schoolEnd || '14:00'}) on weekdays — except on the student's leave days [${(leaveDays || []).join(', ') || 'none'}], where school is skipped and that time becomes free study/rest.
- Include short "break" blocks so no study streak exceeds ~90 min. Mention water + a few minutes off-screen in labels when natural.
- Put 2 revision blocks across the week (Wed + Sat recommended).
- Saturday afternoon: one 90-min problem-solving session.
- Sunday: lighter; include a 60-min weekly review block.
- Target total study/revision ≈ ${weekTargetMins} minutes.
- Prioritise backlogs. Match topicId to one of the provided ids (use null otherwise).`;
  const topicList = pending.map(t => `${t.id} — ${t.name} (${t.branch}, weight ${t.weight})`).join('\n');
  const user = `Student: Class ${cls}. Subject focus this week: ${subjectLabel}. Weekly target: ${weekTargetMins} min.
School: ${schoolStart || '08:00'}–${schoolEnd || '14:00'} on weekdays. Leave days (no school): ${(leaveDays || []).join(', ') || 'none'}.
Topics still pending (id — name — branch — weight):
${topicList}
Backlogs (prioritise these): ${backlogs.length ? backlogs.join(', ') : 'none'}
Design the plan now.`;
  return ai({ system: sys, messages: [{ role: 'user', content: user }], json: true, maxTokens: 3000 });
}

export async function solveImageDoubt(imageBase64, mime, extraContext = ''){
  const cfg = getCfg();
  if (cfg.provider !== 'gemini') throw new Error('Image doubt-solving currently requires the Gemini provider (vision). Switch in Settings.');
  const subject = getState().profile.subject || 'chemistry';
  const sys = MENTOR_SYSTEM + subjectContext(subject) + `

The student has uploaded a photo of a JEE problem. Read the question carefully, then:
1. State what the question is asking (1 line).
2. Give the relevant concept (2-3 lines).
3. Solve step-by-step with units.
4. Call out the trap the examiner laid, if any.
5. End with "Similar practice:" and one short variant.`;
  return callGemini({
    system: sys,
    messages: [{ role: 'user', content: 'Please solve this problem. ' + extraContext }],
    imageData: { base64: imageBase64, mime },
    maxTokens: 2000
  });
}
