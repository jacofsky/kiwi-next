import { readFile } from 'fs/promises';
import path from 'path';

/* ============================================================
   API del chatbot "Kiwia"
   Flujo:
     1. Clasificar si la pregunta es del proyecto → si no, cortar.
     2. Responder usando SOLO data/tp.md → si alcanza, listo.
     3. Si el .md no alcanza → búsqueda web (Tavily) y responder.
   Modelo: cualquier API compatible con OpenAI (DeepSeek, Kimi…),
   configurada por variables de entorno.
   ============================================================ */

export const dynamic = 'force-dynamic';

const OFFTOPIC_REPLY =
  'No está relacionado con el proyecto. Preguntame sobre el TP: Nueva Zelanda, su economía, la crisis habitacional o el Plan Kiwi Joven 🥝';

let mdCache = null;
async function getMd() {
  if (!mdCache) {
    mdCache = await readFile(path.join(process.cwd(), 'data', 'tp.md'), 'utf8');
  }
  return mdCache;
}

async function callLLM(messages, { maxTokens = 700, temperature = 0.3 } = {}) {
  const base = (process.env.AI_BASE_URL || 'https://api.deepseek.com/v1').replace(/\/+$/, '');
  const res = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.AI_MODEL || 'deepseek-chat',
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content || '').trim();
}

async function webSearch(query) {
  if (!process.env.TAVILY_API_KEY) return null;
  try {
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: process.env.TAVILY_API_KEY,
        query,
        max_results: 5,
        search_depth: 'basic',
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.results?.length) return null;
    return {
      context: data.results
        .map((r) => `- ${r.title} (${r.url}): ${r.content}`)
        .join('\n'),
      sources: data.results
        .slice(0, 4)
        .map((r) => ({ title: r.title, url: r.url })),
    };
  } catch {
    return null;
  }
}

const CLASSIFIER_PROMPT = `Sos un clasificador binario. Decidí si el mensaje del usuario está relacionado con este proyecto universitario:
- TP de Economía (UADE) sobre Nueva Zelanda: geografía, política, economía, comercio exterior, datos del país.
- La crisis habitacional neozelandesa: causas, COVID, falla de mercado, consecuencias, soluciones.
- El "Plan Kiwi Joven": créditos hipotecarios para jóvenes, bancos, tasas, campaña de difusión.
- El equipo, la materia, la landing page, la presentación o este chatbot (Kiwia).
Los saludos, agradecimientos y preguntas sobre qué puede hacer el asistente también cuentan como relacionados.
Respondé ÚNICAMENTE con una palabra: SI o NO.`;

const TOKEN_INSUFICIENTE = 'NO_ALCANZA';

function answerPrompt(md) {
  return `Sos Kiwia 🥝, el asistente del proyecto "Plan Kiwi Joven" (TP de Economía de UADE sobre Nueva Zelanda y su crisis habitacional).

Reglas:
- Respondé usando ÚNICAMENTE la información del DOCUMENTO de abajo. No inventes datos.
- Sé claro, amable y breve (2 a 6 oraciones, o una lista corta si ayuda). Español rioplatense suave.
- Si te saludan o preguntan qué sabés hacer, presentate brevemente y ofrecé ejemplos de preguntas.
- Si el DOCUMENTO no contiene información suficiente para responder con seguridad, respondé EXACTAMENTE con la palabra ${TOKEN_INSUFICIENTE} y nada más.

DOCUMENTO:
${md}`;
}

function webAnswerPrompt(results) {
  return `Sos Kiwia 🥝, el asistente del proyecto "Plan Kiwi Joven". La pregunta del usuario es sobre el tema del proyecto, pero el documento del TP no tenía la respuesta, así que se buscó en la web.

Reglas:
- Respondé breve y claro usando SOLO estos resultados de búsqueda.
- Aclarà al final: "(Fuente: búsqueda web, no es parte del TP)".
- Si los resultados tampoco alcanzan, decí honestamente que no encontraste la respuesta.

RESULTADOS DE BÚSQUEDA:
${results}`;
}

export async function POST(req) {
  try {
    if (!process.env.AI_API_KEY) {
      return Response.json({
        reply:
          'Kiwia todavía no está configurada: falta la variable AI_API_KEY en .env.local (DeepSeek o Kimi). Mirá el README del proyecto.',
        source: 'error',
      });
    }

    const { messages = [] } = await req.json();
    const history = messages
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
      .slice(-8);
    const question = [...history].reverse().find((m) => m.role === 'user')?.content?.trim();
    if (!question) {
      return Response.json({ reply: 'Mandame una pregunta sobre el proyecto 🥝', source: 'md' });
    }

    /* ---- Paso 1: clasificar ---- */
    const cls = await callLLM(
      [
        { role: 'system', content: CLASSIFIER_PROMPT },
        { role: 'user', content: question },
      ],
      { maxTokens: 4, temperature: 0 }
    );
    if (!/SI/i.test(cls)) {
      return Response.json({ reply: OFFTOPIC_REPLY, source: 'offtopic' });
    }

    /* ---- Paso 2: responder con el .md ---- */
    const md = await getMd();
    const mdAnswer = await callLLM(
      [{ role: 'system', content: answerPrompt(md) }, ...history],
      { maxTokens: 600, temperature: 0.3 }
    );
    if (!mdAnswer.includes(TOKEN_INSUFICIENTE)) {
      return Response.json({ reply: mdAnswer, source: 'md' });
    }

    /* ---- Paso 3: búsqueda web ---- */
    const web = await webSearch(`Nueva Zelanda ${question}`);
    if (!web) {
      return Response.json({
        reply:
          'Esa pregunta es del tema del proyecto, pero el documento del TP no tiene ese dato y no pude buscar en la web (falta configurar TAVILY_API_KEY o no hubo resultados).',
        source: 'md',
      });
    }
    const webAnswer = await callLLM(
      [
        { role: 'system', content: webAnswerPrompt(web.context) },
        { role: 'user', content: question },
      ],
      { maxTokens: 600, temperature: 0.3 }
    );
    return Response.json({ reply: webAnswer, source: 'web', sources: web.sources });
  } catch (err) {
    console.error('Error en /api/chat:', err);
    return Response.json(
      { reply: 'Uy, tuve un problema técnico respondiendo. Probá de nuevo en un momento 🥝', source: 'error' },
      { status: 200 }
    );
  }
}
