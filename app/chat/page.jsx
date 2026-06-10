'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Markdown from 'react-markdown';

const SUGERENCIAS = [
  '¿Qué es el Plan Kiwi Joven?',
  '¿Por qué hay crisis de vivienda en Nueva Zelanda?',
  '¿Qué tasas ofrece el plan y para quiénes?',
  '¿Qué pasó con los precios durante la pandemia?',
];

function hostname(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const SOURCE_BADGE = {
  md: '📄 Según el TP',
  web: '🌐 Búsqueda web',
  offtopic: '🚫 Fuera de tema',
  error: '⚠️ Error',
};

export default function ChatPage() {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, loading]);

  async function send(text) {
    const question = (text ?? input).trim();
    if (!question || loading) return;
    setInput('');
    const nextMsgs = [...msgs, { role: 'user', content: question }];
    setMsgs(nextMsgs);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMsgs.map(({ role, content }) => ({ role, content })),
        }),
      });
      const data = await res.json();
      setMsgs((m) => [
        ...m,
        { role: 'assistant', content: data.reply, source: data.source, sources: data.sources },
      ]);
    } catch {
      setMsgs((m) => [
        ...m,
        { role: 'assistant', content: 'No pude conectarme con el servidor. Probá de nuevo 🥝', source: 'error' },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style jsx global>{`
        :root{
          --forest:#0e2a14; --forest-2:#14351c; --leaf:#2e7d32;
          --lime:#7ac143; --lime-soft:#a4d65e; --cream:#f5f1e6;
          --gold:#f2c94c; --ink:#122416;
          --font-display:'Sora',sans-serif; --font-body:'Inter',sans-serif;
        }
        *{ margin:0; padding:0; box-sizing:border-box; }
        html, body{ height:100%; }
        body{
          font-family:var(--font-body);
          background:radial-gradient(1100px 700px at 70% 0%, #1d4a27 0%, var(--forest) 55%, #081a0c 100%);
          color:var(--cream); -webkit-font-smoothing:antialiased;
        }
        .chat-shell{
          height:100dvh; display:flex; flex-direction:column;
          width:min(860px,100%); margin-inline:auto;
        }
        .chat-header{
          display:flex; align-items:center; gap:14px;
          padding:18px 22px;
          border-bottom:1px solid rgba(122,193,67,.25);
        }
        .chat-avatar{
          width:46px; height:46px; border-radius:50%;
          background:var(--lime); display:grid; place-items:center;
          font-size:1.4rem; box-shadow:0 0 0 4px rgba(122,193,67,.25);
          flex-shrink:0;
        }
        .chat-header h1{
          font-family:var(--font-display); font-size:1.2rem; font-weight:800;
        }
        .chat-header h1 em{ color:var(--lime); font-style:normal; }
        .chat-header p{ font-size:.8rem; color:rgba(245,241,230,.6); }
        .chat-back{
          margin-left:auto; text-decoration:none;
          font-family:var(--font-display); font-weight:700; font-size:.82rem;
          color:var(--lime-soft); border:1px solid rgba(122,193,67,.4);
          padding:9px 18px; border-radius:999px;
          transition:background .25s, transform .25s;
          white-space:nowrap;
        }
        .chat-back:hover{ background:rgba(122,193,67,.18); transform:translateY(-2px); }

        .chat-scroll{
          flex:1; overflow-y:auto; padding:28px 22px;
          display:flex; flex-direction:column; gap:16px;
          scrollbar-color:var(--lime) transparent;
        }
        .chat-empty{
          margin:auto; text-align:center; max-width:480px;
          display:flex; flex-direction:column; align-items:center; gap:14px;
        }
        .chat-empty .big{ font-size:3.4rem; }
        .chat-empty h2{ font-family:var(--font-display); font-size:1.5rem; }
        .chat-empty h2 span{ color:var(--lime); }
        .chat-empty p{ color:rgba(245,241,230,.7); font-size:.95rem; line-height:1.6; }
        .chips{ display:flex; flex-wrap:wrap; gap:10px; justify-content:center; margin-top:8px; }
        .chips button{
          background:rgba(122,193,67,.12); border:1px solid rgba(122,193,67,.4);
          color:var(--lime-soft); border-radius:999px; padding:9px 16px;
          font-size:.82rem; cursor:pointer; font-family:var(--font-body);
          transition:background .2s, transform .2s;
        }
        .chips button:hover{ background:rgba(122,193,67,.28); transform:translateY(-2px); }

        .bubble{
          max-width:78%; padding:14px 18px; border-radius:18px;
          font-size:.95rem; line-height:1.6; white-space:pre-wrap;
          transform-origin:bottom left;
          animation:bubbleIn .5s cubic-bezier(.21,.85,.3,1.1) both;
        }
        .bubble.user{ transform-origin:bottom right; }
        @keyframes bubbleIn{
          from{ opacity:0; transform:translateY(16px) scale(.96); }
          to{ opacity:1; transform:translateY(0) scale(1); }
        }
        .bubble.user{
          align-self:flex-end; background:var(--lime); color:var(--forest);
          border-bottom-right-radius:6px; font-weight:500;
        }
        .bubble.bot{
          align-self:flex-start; background:rgba(255,255,255,.07);
          border:1px solid rgba(255,255,255,.12);
          border-bottom-left-radius:6px;
          white-space:normal; /* el Markdown maneja sus propios párrafos */
        }
        .bubble.bot p + p{ margin-top:10px; }
        .bubble.bot strong{ color:var(--lime-soft); font-weight:700; }
        .bubble.bot em{ color:var(--gold); }
        .bubble.bot ul, .bubble.bot ol{ margin:10px 0 4px; padding-left:22px; }
        .bubble.bot li{ margin-bottom:6px; }
        .bubble.bot li::marker{ color:var(--lime); }
        .bubble.bot a{ color:var(--lime-soft); text-decoration:underline; }
        .bubble.bot h1, .bubble.bot h2, .bubble.bot h3{
          font-size:1.02rem; margin:12px 0 6px; color:var(--lime-soft);
        }
        .bubble.bot code{
          background:rgba(0,0,0,.35); border-radius:6px;
          padding:2px 7px; font-size:.85em;
        }
        .bubble.bot blockquote{
          border-left:3px solid var(--lime); padding-left:12px;
          margin:10px 0; color:rgba(245,241,230,.75);
        }
        .bubble .sources{
          margin-top:12px; padding-top:10px;
          border-top:1px solid rgba(255,255,255,.12);
          display:flex; flex-direction:column; gap:6px;
        }
        .bubble .sources a{
          color:var(--lime-soft); font-size:.78rem; line-height:1.4;
          text-decoration:none; overflow:hidden; text-overflow:ellipsis;
          white-space:nowrap; max-width:100%;
          transition:color .2s;
        }
        .bubble .sources a:hover{ color:var(--lime); text-decoration:underline; }
        .bubble .src{
          display:block; margin-top:10px; font-size:.68rem;
          letter-spacing:1px; text-transform:uppercase;
          color:rgba(245,241,230,.45); font-family:var(--font-display);
        }
        .typing{
          align-self:flex-start; display:flex; gap:6px; padding:16px 18px;
          animation:bubbleIn .4s ease-out both;
        }
        .typing span{
          width:8px; height:8px; border-radius:50%; background:var(--lime);
          animation:blink 1.2s infinite;
        }
        .typing span:nth-child(2){ animation-delay:.2s; }
        .typing span:nth-child(3){ animation-delay:.4s; }
        @keyframes blink{ 0%,80%,100%{ opacity:.25; } 40%{ opacity:1; } }

        .chat-form{
          display:flex; gap:12px; padding:16px 22px 22px;
          border-top:1px solid rgba(122,193,67,.25);
        }
        .chat-form input{
          flex:1; background:rgba(255,255,255,.07);
          border:1px solid rgba(255,255,255,.15); border-radius:999px;
          padding:14px 22px; color:var(--cream); font-size:.95rem;
          font-family:var(--font-body); outline:none;
          transition:border-color .25s;
        }
        .chat-form input:focus{ border-color:var(--lime); }
        .chat-form input::placeholder{ color:rgba(245,241,230,.4); }
        .chat-form button{
          background:var(--lime); color:var(--forest); border:none;
          font-family:var(--font-display); font-weight:800; font-size:.95rem;
          padding:14px 26px; border-radius:999px; cursor:pointer;
          transition:transform .2s, background .2s;
        }
        .chat-form button:hover{ transform:scale(1.04); background:var(--lime-soft); }
        .chat-form button:disabled{ opacity:.5; cursor:default; transform:none; }

        /* ---------- Mobile ---------- */
        @media (max-width:640px){
          .chat-header{ padding:10px 14px; gap:10px; }
          .chat-avatar{ width:36px; height:36px; font-size:1.05rem; box-shadow:0 0 0 3px rgba(122,193,67,.25); }
          .chat-header h1{ font-size:1.05rem; }
          .chat-header p{ display:none; }       /* la descripción no entra: afuera */
          .chat-back{ padding:8px 13px; font-size:.85rem; }
          .back-label{ display:none; }          /* queda solo la flecha ← */
          .chat-scroll{ padding:18px 14px; gap:12px; }
          .bubble{ max-width:88%; font-size:.92rem; padding:12px 14px; }
          .chat-empty .big{ font-size:2.6rem; }
          .chat-empty h2{ font-size:1.25rem; }
          .chat-empty p{ font-size:.88rem; }
          .chips button{ padding:8px 13px; font-size:.78rem; }
          .chat-form{ padding:10px 12px 14px; gap:8px; }
          .chat-form input{ padding:12px 16px; font-size:16px; } /* 16px: evita el auto-zoom de iOS */
          .chat-form button{ padding:12px 18px; font-size:.88rem; }
        }
      `}</style>

      <div className="chat-shell">
        <header className="chat-header">
          <div className="chat-avatar">🥝</div>
          <div>
            <h1>
              Kiw<em>ia</em>
            </h1>
            <p>Asistente IA del Plan Kiwi Joven · responde con el TP y, si hace falta, busca en la web</p>
          </div>
          <Link className="chat-back" href="/">
            ← <span className="back-label">Volver a la landing</span>
          </Link>
        </header>

        <div className="chat-scroll">
          {msgs.length === 0 && (
            <div className="chat-empty">
              <span className="big">🥝</span>
              <h2>
                ¡Hola! Soy <span>Kiwia</span>
              </h2>
              <p>
                Preguntame lo que quieras sobre el TP: Nueva Zelanda, su economía, la crisis
                habitacional o el Plan Kiwi Joven. Primero busco en el documento del trabajo y, si no
                alcanza, busco en la web.
              </p>
              <div className="chips">
                {SUGERENCIAS.map((s) => (
                  <button key={s} onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {msgs.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="bubble user">
                {m.content}
              </div>
            ) : (
              <div key={i} className="bubble bot">
                <Markdown>{m.content}</Markdown>
                {m.sources?.length > 0 && (
                  <div className="sources">
                    {m.sources.map((s) => (
                      <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer">
                        🔗 {hostname(s.url)} — {s.title}
                      </a>
                    ))}
                  </div>
                )}
                {m.source && SOURCE_BADGE[m.source] && (
                  <span className="src">{SOURCE_BADGE[m.source]}</span>
                )}
              </div>
            )
          )}

          {loading && (
            <div className="typing">
              <span /> <span /> <span />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <form
          className="chat-form"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribí tu pregunta sobre el proyecto…"
            aria-label="Pregunta para Kiwia"
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Enviar
          </button>
        </form>
      </div>
    </>
  );
}
