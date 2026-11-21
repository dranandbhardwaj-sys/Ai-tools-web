import { generateTemplateOutput } from './templates.js';
import { getRuntimeSessionToken } from './storage.js';

export const AI_PROVIDERS = [
  {
    id: 'custom_proxy',
    label: 'Custom HTTPS Proxy (Recommended)',
    models: ['gemini-2.5-flash', 'gpt-4o-mini', 'claude-3-5-haiku']
  },
  {
    id: 'openai_compatible',
    label: 'OpenAI-Compatible Endpoint',
    models: ['gpt-4o-mini', 'gpt-4.1-mini', 'llama-3.3-70b']
  }
];

function buildPrompt({ tool, topic, context, tone, outLang, length }) {
  return [
    `Tool: ${tool.titleEn} (${tool.descEn})`,
    `Topic / Input: ${topic}`,
    context ? `Audience / Context: ${context}` : null,
    `Tone: ${tone}`,
    `Output Language: ${outLang}`,
    `Length: ${length}`,
    'Return clean, well-formatted creator output ready to copy and publish.'
  ].filter(Boolean).join('\n');
}

export async function generateCreatorContent({ aiConfig, tool, topic, context, tone, outLang, length }) {
  const endpoint = String(aiConfig?.endpointUrl || '').trim();
  if (aiConfig?.mode === 'api' && endpoint.startsWith('https://')) {
    const token = getRuntimeSessionToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: aiConfig.model || 'gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are an expert bilingual English & Hindi content creator assistant.' },
          { role: 'user', content: buildPrompt({ tool, topic, context, tone, outLang, length }) }
        ]
      })
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const data = await res.json();
    const text =
      data?.choices?.[0]?.message?.content ||
      data?.output ||
      data?.text ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error('Empty response from AI endpoint');
    return { text: String(text).trim(), source: `Live AI (${aiConfig.model})` };
  }

  await new Promise((resolve) => setTimeout(resolve, 260));
  return {
    text: generateTemplateOutput({ tool, topic, context, tone, outLang, length }),
    source: 'Demo Mode (Offline Engine)'
  };
}

export async function testAiConnection(aiConfig) {
  if (aiConfig.mode !== 'api') {
    return { ok: true, message: 'Demo Mode active — Offline Creator Engine is ready.' };
  }
  const url = String(aiConfig.endpointUrl || '').trim();
  if (!url.startsWith('https://')) {
    return { ok: false, message: 'Please enter a valid https:// proxy endpoint URL.' };
  }
  try {
    const token = getRuntimeSessionToken();
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, { method: 'OPTIONS', headers });
    return { ok: res.ok || res.status === 204 || res.status === 405, message: `Endpoint reachable (HTTP ${res.status}).` };
  } catch (err) {
    return { ok: false, message: `Connection error: ${err.message}` };
  }
}
