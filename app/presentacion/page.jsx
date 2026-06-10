'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

/* ============================================================
   PRESENTACIÓN — Plan Kiwi Joven (Next.js)
   ← → / espacio / PageUp-PageDown (presentador inalámbrico)
   R reinicia · F pantalla completa · H oculta barra · ESC sale
   ============================================================ */
const css = `
:root{
  --forest:#0e2a14; --forest-2:#14351c; --leaf:#2e7d32;
  --lime:#7ac143; --lime-soft:#a4d65e; --cream:#f5f1e6;
  --gold:#f2c94c; --ink:#122416;
  --font-display:'Sora',sans-serif; --font-body:'Inter',sans-serif; --font-hand:'Caveat',cursive;
}
*{ margin:0; padding:0; box-sizing:border-box; }
html, body{ height:100%; overflow:hidden; }
body{
  font-family:var(--font-body);
  background:var(--forest);
  color:var(--cream);
  -webkit-font-smoothing:antialiased;
}
h1,h2,h3,h4{ font-family:var(--font-display); line-height:1.08; }
img{ max-width:100%; display:block; }

#deck-progress{
  position:fixed; top:0; left:0; height:5px; width:0%;
  background:linear-gradient(90deg, var(--lime), var(--gold));
  z-index:100; transition:width .45s ease;
}

.hud-top{
  position:fixed; top:18px; left:24px; right:24px; z-index:90;
  display:flex; justify-content:space-between; align-items:center;
  pointer-events:none;
}
.hud-logo{
  display:flex; align-items:center; gap:10px;
  font-family:var(--font-display); font-weight:800; font-size:1.05rem;
  color:var(--cream); letter-spacing:.5px;
  background:rgba(14,42,20,.55); backdrop-filter:blur(10px);
  padding:8px 16px 8px 8px; border-radius:999px;
  border:1px solid rgba(122,193,67,.35);
}
.hud-logo .kiwi-dot{
  width:30px; height:30px; border-radius:50%; background:var(--lime);
  display:grid; place-items:center; font-size:1rem;
}
.hud-logo em{ color:var(--lime); font-style:normal; }
.hud-exit{
  pointer-events:auto;
  width:42px; height:42px; border-radius:50%;
  background:rgba(14,42,20,.55); backdrop-filter:blur(10px);
  border:1px solid rgba(245,241,230,.25);
  color:var(--cream); font-size:1.1rem; cursor:pointer;
  display:grid; place-items:center;
  transition:background .25s, border-color .25s, transform .25s;
}
.hud-exit:hover{ background:rgba(122,193,67,.3); border-color:var(--lime); transform:scale(1.08); }

.hud-bottom{
  position:fixed; bottom:18px; left:50%; transform:translateX(-50%);
  z-index:90; display:flex; align-items:center; gap:18px;
  background:rgba(14,42,20,.6); backdrop-filter:blur(12px);
  border:1px solid rgba(122,193,67,.3);
  padding:10px 22px; border-radius:999px;
  font-size:.8rem; color:rgba(245,241,230,.75); white-space:nowrap;
}
.hud-bottom kbd{
  font-family:var(--font-display); font-size:.72rem; font-weight:700;
  background:rgba(245,241,230,.12); border:1px solid rgba(245,241,230,.25);
  border-radius:6px; padding:2px 7px; color:var(--lime-soft);
}
.hud-counter{
  font-family:var(--font-display); font-weight:700; color:var(--cream);
  font-size:.85rem; letter-spacing:1px;
}
.hud-arrows{ display:flex; gap:8px; }
.hud-arrows button{
  width:34px; height:34px; border-radius:50%;
  background:rgba(122,193,67,.18); border:1px solid rgba(122,193,67,.4);
  color:var(--lime-soft); font-size:1rem; cursor:pointer;
  transition:background .2s, transform .2s;
}
.hud-arrows button:hover{ background:rgba(122,193,67,.4); transform:scale(1.1); }
@media (max-width:760px){
  .hud-bottom .hint{ display:none; }
}

.hud-top, .hud-bottom{ transition:opacity .35s ease; }
body.hud-hidden .hud-top,
body.hud-hidden .hud-bottom{ opacity:0; pointer-events:none; }
.hud-toggle{
  position:fixed; right:24px; bottom:18px; z-index:95;
  width:42px; height:42px; border-radius:50%;
  background:rgba(14,42,20,.55); backdrop-filter:blur(10px);
  border:1px solid rgba(122,193,67,.4);
  color:var(--lime-soft); font-family:var(--font-display);
  font-weight:800; font-size:.95rem; cursor:pointer;
  transition:background .25s, transform .25s, opacity .35s;
}
.hud-toggle:hover{ background:rgba(122,193,67,.3); transform:scale(1.08); }
body.hud-hidden .hud-toggle{ opacity:.35; }
body.hud-hidden .hud-toggle:hover{ opacity:1; }

.slide{
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
  padding:90px 6vw 80px;
  visibility:hidden; opacity:0;
  overflow:hidden;
}
.slide.dark{ background:radial-gradient(1100px 700px at 70% 12%, #1d4a27 0%, var(--forest) 55%, #081a0c 100%); color:var(--cream); }
.slide.cream{ background:var(--cream); color:var(--ink); }
.slide.lime{ background:linear-gradient(135deg, var(--lime) 0%, var(--lime-soft) 100%); color:var(--forest); }

.watermark{
  position:absolute; right:-1vw; bottom:-6vh; z-index:0;
  font-family:var(--font-display); font-weight:800;
  font-size:34vh; line-height:1; letter-spacing:-8px;
  color:transparent; -webkit-text-stroke:2px currentColor;
  opacity:.07; pointer-events:none; user-select:none;
}

.blob{
  position:absolute; border-radius:50%; filter:blur(70px);
  opacity:.35; pointer-events:none; z-index:0;
  animation:blobFloat 11s ease-in-out infinite;
}
.blob.b1{ width:420px; height:420px; background:rgba(122,193,67,.35); top:-120px; left:-100px; }
.blob.b2{ width:340px; height:340px; background:rgba(242,201,76,.22); bottom:-100px; right:14vw; animation-delay:-5s; }
.slide.cream .blob.b1{ background:rgba(122,193,67,.3); }
.slide.cream .blob.b2{ background:rgba(46,125,50,.18); }
@keyframes blobFloat{
  0%,100%{ transform:translate(0,0) scale(1); }
  50%{ transform:translate(40px,-30px) scale(1.12); }
}

.wrap{ position:relative; z-index:2; width:min(1180px,100%); }
.split{ display:grid; grid-template-columns:1.15fr .85fr; gap:5vw; align-items:center; }
@media (max-width:900px){
  .split{ grid-template-columns:1fr; gap:32px; }
  .slide{ padding:80px 7vw 90px; overflow-y:auto; align-items:flex-start; }
}

.kicker{
  display:inline-block; font-family:var(--font-display); font-weight:700;
  font-size:.85rem; letter-spacing:2.5px; text-transform:uppercase;
  padding:7px 18px; border-radius:999px; margin-bottom:22px;
  color:var(--lime-soft); background:rgba(122,193,67,.14);
  border:1px solid rgba(122,193,67,.4);
}
.slide.cream .kicker{ color:var(--leaf); background:rgba(122,193,67,.16); }
.slide.lime .kicker{ color:var(--forest); background:rgba(14,42,20,.12); border-color:rgba(14,42,20,.35); }
.slide h2{
  font-size:clamp(2rem, 4.6vw, 3.7rem); font-weight:800; letter-spacing:-.5px;
  max-width:900px;
}
.slide h2 .lime{ color:var(--lime); }
.slide.cream h2 .lime{ color:var(--leaf); }
.slide h2 .gold{ color:var(--gold); }
.slide .lead{
  margin-top:20px; font-size:clamp(1rem, 1.4vw, 1.2rem); line-height:1.65;
  max-width:680px; color:rgba(245,241,230,.8);
}
.slide.cream .lead{ color:#3c4a3e; }
.slide.lime .lead{ color:#1d3a23; }
.hand{ font-family:var(--font-hand); color:var(--gold); transform:rotate(-2deg); display:inline-block; }
.slide.cream .hand{ color:var(--leaf); }

.facts{ list-style:none; margin-top:30px; display:flex; flex-direction:column; gap:14px; }
.facts li{
  position:relative; padding-left:1.6em;
  font-size:clamp(.95rem, 1.3vw, 1.12rem); line-height:1.6;
  color:rgba(245,241,230,.85);
}
.slide.cream .facts li{ color:#33402f; }
.slide.lime .facts li{ color:#1d3a23; }
.facts li b{ font-family:var(--font-display); color:var(--lime); white-space:nowrap; }
.slide.cream .facts li b{ color:var(--leaf); }
.slide.lime .facts li b{ color:var(--forest); }
.facts li::before{
  content:"✦"; position:absolute; left:0; top:.22em;
  color:var(--gold); font-size:.8em;
}

.statgrid{
  display:grid; grid-template-columns:repeat(auto-fit, minmax(212px,1fr));
  gap:18px; margin-top:42px;
}
.stat{
  background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.13);
  border-radius:20px; padding:24px 22px;
}
.slide.cream .stat{ background:#fff; border-color:rgba(18,36,22,.1); box-shadow:0 10px 26px rgba(18,36,22,.07); }
.stat b{
  display:block; font-family:var(--font-display); font-weight:800;
  font-size:clamp(1.35rem, 1.9vw, 1.8rem); letter-spacing:-.5px;
  color:var(--lime); overflow-wrap:break-word;
}
.slide.cream .stat b{ color:var(--forest); }
.stat small{ font-size:.85rem; color:rgba(245,241,230,.65); line-height:1.45; display:block; margin-top:6px; }
.slide.cream .stat small{ color:#5a685c; }

.cardgrid{
  display:grid; grid-template-columns:repeat(auto-fit, minmax(220px,1fr));
  gap:18px; margin-top:42px;
}
.card{
  border-radius:20px; padding:26px 24px;
  background:rgba(255,255,255,.06); border:1px solid rgba(255,255,255,.13);
}
.slide.cream .card{ background:#fff; border-color:rgba(18,36,22,.09); box-shadow:0 12px 28px rgba(18,36,22,.07); }
.card .icon{ font-size:1.9rem; margin-bottom:12px; display:block; }
.card h4{ font-size:1.05rem; margin-bottom:8px; }
.slide.cream .card h4{ color:var(--forest); }
.card p{ font-size:.88rem; line-height:1.55; color:rgba(245,241,230,.7); }
.slide.cream .card p{ color:#4a584c; }
.card .msg{
  margin-top:12px; font-size:.82rem; line-height:1.5; font-style:italic;
  color:var(--lime-soft); border-left:3px solid var(--lime); padding-left:10px;
}
.slide.cream .card .msg{ color:var(--leaf); }

.numlist{ display:flex; flex-direction:column; gap:16px; margin-top:38px; }
.numrow{
  display:grid; grid-template-columns:64px 1fr; gap:20px; align-items:center;
  background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.12);
  border-radius:18px; padding:18px 24px;
}
.numrow .n{
  font-family:var(--font-display); font-weight:800; font-size:2rem;
  color:transparent; -webkit-text-stroke:1.5px var(--lime);
}
.numrow h4{ font-size:1.05rem; margin-bottom:4px; }
.numrow p{ font-size:.88rem; line-height:1.5; color:rgba(245,241,230,.7); }

.visual{ position:relative; }
.visual img{
  width:100%; border-radius:24px;
  box-shadow:0 30px 70px rgba(0,0,0,.4);
}
.slide.cream .visual img{ box-shadow:0 26px 56px rgba(18,36,22,.22); }

.cover{ text-align:center; }
.cover h2, .cover .lead{ margin-inline:auto; }
.cover h1{
  font-size:clamp(3rem, 8.5vw, 7rem); font-weight:800;
  text-transform:uppercase; letter-spacing:-2px;
}
.cover h1 .lime{ color:var(--lime); }
.cover .sub{
  font-size:clamp(1.05rem, 2vw, 1.5rem); color:rgba(245,241,230,.85);
  margin-top:18px;
}
.cover .team{
  margin-top:34px; display:flex; gap:12px; justify-content:center; flex-wrap:wrap;
}
.cover .team span{
  background:rgba(255,255,255,.07); border:1px solid rgba(255,255,255,.15);
  border-radius:999px; padding:9px 20px; font-size:.88rem; color:rgba(245,241,230,.85);
}
.cover .start-hint{
  margin-top:46px; font-size:.85rem; letter-spacing:2px; text-transform:uppercase;
  color:var(--lime-soft); animation:hintPulse 2s ease-in-out infinite;
}
@keyframes hintPulse{ 0%,100%{ opacity:.5; } 50%{ opacity:1; } }
.cover-bg{
  position:absolute; inset:0; z-index:0;
  background-size:cover; background-position:center;
  opacity:.16; filter:saturate(.9);
}
.cover-bg::after{
  content:""; position:absolute; inset:0;
  background:radial-gradient(ellipse at center, transparent 0%, var(--forest) 90%);
}
.closing .tagline{
  font-family:var(--font-hand); font-size:clamp(2.4rem, 6vw, 4.6rem);
  color:var(--gold); display:block; margin-top:10px; transform:rotate(-2deg);
}

.rate-hero{
  font-family:var(--font-display); font-weight:800; line-height:1;
  font-size:clamp(4.5rem, 12vw, 9rem); color:var(--forest);
}
.rate-hero sup{ font-size:.32em; color:var(--forest-2); }
.bank-row{ display:flex; gap:12px; flex-wrap:wrap; margin-top:26px; }
.bank-row span{
  font-family:var(--font-display); font-weight:800; font-size:1.05rem;
  background:rgba(14,42,20,.92); color:var(--cream);
  padding:12px 26px; border-radius:14px;
}

.qr-card{
  background:#fff; border-radius:28px; padding:32px;
  display:flex; flex-direction:column; align-items:center; gap:16px;
  box-shadow:0 30px 70px rgba(14,42,20,.35);
  max-width:360px; margin-inline:auto;
}
.qr-card img{ width:260px; height:260px; border-radius:12px; }
.qr-card span{
  font-family:var(--font-display); font-weight:800;
  color:var(--forest); font-size:.95rem; letter-spacing:1px; text-transform:uppercase;
}

@media (prefers-reduced-motion: reduce){
  *{ animation:none !important; transition:none !important; }
}
`;

const liStyle = { color: '#1d3a23' };
const bStyle = { color: 'var(--forest)' };

export default function Presentacion() {
  const [qrSrc, setQrSrc] = useState(null);

  useEffect(() => {
    const chatUrl = `${window.location.origin}/chat`;
    setQrSrc(
      `https://api.qrserver.com/v1/create-qr-code/?size=420x420&color=0e2a14&bgcolor=ffffff&data=${encodeURIComponent(chatUrl)}`
    );
  }, []);

  useEffect(() => {
    const slides = gsap.utils.toArray('.slide');
    const TOTAL = slides.length;
    const counter = document.getElementById('counter');
    const progress = document.getElementById('deck-progress');
    let current = -1;

    function show(n, dir = 1) {
      n = Math.max(0, Math.min(TOTAL - 1, n));
      if (n === current) return;

      const prev = current >= 0 ? slides[current] : null;
      const next = slides[n];
      current = n;

      counter.textContent = `${n + 1} / ${TOTAL}`;
      progress.style.width = `${((n + 1) / TOTAL) * 100}%`;
      history.replaceState(null, '', '#' + (n + 1));

      if (prev) gsap.killTweensOf(prev);
      gsap.killTweensOf(next);
      gsap.killTweensOf(next.querySelectorAll('.a'));

      if (prev) {
        gsap.to(prev, {
          autoAlpha: 0, xPercent: -5 * dir, duration: 0.3, ease: 'power2.in',
          onComplete: () => gsap.set(prev, { xPercent: 0 }),
        });
      }
      gsap.fromTo(next,
        { autoAlpha: 0, xPercent: 6 * dir },
        { autoAlpha: 1, xPercent: 0, duration: 0.55, ease: 'power3.out', delay: prev ? 0.18 : 0 });
      gsap.fromTo(next.querySelectorAll('.a'),
        { y: 36, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.09, ease: 'power3.out', delay: prev ? 0.3 : 0.15 });
    }

    const nextSlide = () => show(current + 1, 1);
    const prevSlide = () => show(current - 1, -1);
    const restart = () => show(0, -1);
    const exit = () => { window.location.href = '/'; };
    const toggleHud = () => document.body.classList.toggle('hud-hidden');

    const onKey = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
        case 'PageDown': e.preventDefault(); nextSlide(); break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp': e.preventDefault(); prevSlide(); break;
        case 'Home': show(0, -1); break;
        case 'End': show(TOTAL - 1, 1); break;
        case 'r': case 'R': restart(); break;
        case 'h': case 'H': toggleHud(); break;
        case 'f': case 'F':
          document.fullscreenElement
            ? document.exitFullscreen()
            : document.documentElement.requestFullscreen();
          break;
        case 'Escape': exit(); break;
        default: break;
      }
    };
    document.addEventListener('keydown', onKey);

    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const exitBtn = document.getElementById('exitBtn');
    const hudToggle = document.getElementById('hudToggle');
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    exitBtn.addEventListener('click', exit);
    hudToggle.addEventListener('click', toggleHud);

    const fromHash = parseInt(location.hash.slice(1), 10);
    show(isNaN(fromHash) ? 0 : fromHash - 1, 1);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('hud-hidden');
    };
  }, []);

  return (
    <>
      <style jsx global>{css}</style>

      <div id="deck-progress" />

      {/* ---------- HUD ---------- */}
      <div className="hud-top">
        <div className="hud-logo">
          <span className="kiwi-dot">🥝</span> PLAN <em>&nbsp;KIWI</em>
        </div>
        <button className="hud-exit" id="exitBtn" title="Volver a la landing (ESC)">✕</button>
      </div>
      <div className="hud-bottom">
        <div className="hud-arrows">
          <button id="prevBtn" title="Anterior">←</button>
          <button id="nextBtn" title="Siguiente">→</button>
        </div>
        <span className="hud-counter" id="counter">1 / 15</span>
        <span className="hint">
          <kbd>←</kbd> <kbd>→</kbd> navegar · <kbd>R</kbd> reiniciar · <kbd>F</kbd> pantalla
          completa · <kbd>H</kbd> ocultar barra · <kbd>ESC</kbd> salir
        </span>
      </div>
      <button className="hud-toggle" id="hudToggle" title="Mostrar / ocultar barra (H)">H</button>

      {/* ============ 1 · PORTADA ============ */}
      <section className="slide dark">
        <div className="cover-bg" style={{ backgroundImage: "url('/hero.png')" }} />
        <div className="blob b1" /><div className="blob b2" />
        <div className="wrap cover">
          <span className="kicker a">UADE · Economía · 18 de junio de 2026</span>
          <h1 className="a">Plan <span className="lime">Kiwi</span> Joven</h1>
          <p className="sub a">
            Análisis Económico Integral de <strong>Nueva Zelanda</strong>
            <br />y una propuesta para su crisis habitacional
          </p>
          <div className="team a">
            <span>Ana Battaglia</span>
            <span>Valentín Jacofsky</span>
            <span>Valentín Laurenzano</span>
            <span>Juan Cruz Quiroga</span>
          </div>
          <div className="start-hint a">Presioná → para comenzar</div>
        </div>
      </section>

      {/* ============ 2 · EL PAÍS ============ */}
      <section className="slide dark">
        <div className="watermark">01</div>
        <div className="blob b1" />
        <div className="wrap split">
          <div>
            <span className="kicker a">El país</span>
            <h2 className="a">Aotearoa, <span className="lime">la tierra de la nube blanca</span></h2>
            <ul className="facts">
              <li className="a"><b>267.707 km²</b> — dos islas principales y más de 600 menores, en el Pacífico Sur</li>
              <li className="a"><b>5,27 millones</b> de habitantes, apenas 18 por km²</li>
              <li className="a"><b>Wellington</b> es la capital; <b>Auckland</b>, la ciudad más poblada</li>
              <li className="a"><b>Sin fronteras terrestres</b> — su vecino más cercano es Australia, a 2.000 km</li>
              <li className="a"><b>Monarquía constitucional</b> con democracia parlamentaria: Carlos III es jefe de Estado y Christopher Luxon, primer ministro desde 2023</li>
              <li className="a"><b>3 idiomas oficiales</b>: inglés, maorí y lengua de señas neozelandesa</li>
            </ul>
          </div>
          <div className="visual a">
            <img src="/mapa-nz.png" alt="Mapa ilustrado de Nueva Zelanda con Wellington y Auckland destacadas" />
          </div>
        </div>
      </section>

      {/* ============ 3 · LA ECONOMÍA ============ */}
      <section className="slide cream">
        <div className="watermark">02</div>
        <div className="blob b1" /><div className="blob b2" />
        <div className="wrap">
          <span className="kicker a">La economía · 2024</span>
          <h2 className="a">Una economía de servicios <span className="lime">que viene de una recesión</span></h2>
          <div className="statgrid">
            <div className="stat a"><b>USD 260.000M</b><small>PIB — puesto 53 del mundo</small></div>
            <div className="stat a"><b>USD 49.205</b><small>PIB per cápita — puesto 37 por PPA</small></div>
            <div className="stat a"><b>75 / 17 / 8</b><small>% del PIB: servicios / industria / sector primario</small></div>
            <div className="stat a"><b>2,9%</b><small>inflación al cierre de 2024</small></div>
            <div className="stat a"><b>-0,1%</b><small>crecimiento anual: recesión iniciada en 2023 por el endurecimiento de la política monetaria</small></div>
          </div>
          <p className="lead a" style={{ marginTop: 34 }}>
            El dato clave: la recesión nace de la suba de tasas para frenar la inflación — el mismo
            instrumento que está en el corazón del problema habitacional que vamos a ver.
          </p>
        </div>
      </section>

      {/* ============ 4 · COMERCIO Y MUNDO ============ */}
      <section className="slide cream">
        <div className="watermark">03</div>
        <div className="blob b2" />
        <div className="wrap">
          <span className="kicker a">Comercio exterior y perfil global</span>
          <h2 className="a">Abierta al mundo, <span className="lime">con China como socio clave</span></h2>
          <div className="statgrid">
            <div className="stat a"><b>28%</b><small>del PIB son exportaciones</small></div>
            <div className="stat a"><b>USD 4.500M</b><small>exporta en leche en polvo y lácteos — destino principal: China (26,85%)</small></div>
            <div className="stat a"><b>USD 7.000M</b><small>importa en petróleo refinado — origen principal: China (20,73%)</small></div>
            <div className="stat a"><b>4 TLC</b><small>Australia (1983) · China (2008) · CPTPP · Unión Europea (2024)</small></div>
          </div>
          <ul className="facts" style={{ marginTop: 36 }}>
            <li className="a"><b>+80%</b> de su electricidad es renovable; emergencia climática declarada en 2020 y Ley Cero Carbono con meta 2050</li>
            <li className="a"><b>4.º</b> país menos corrupto del mundo y desarrollo humano &quot;Muy Alto&quot;</li>
            <li className="a"><b>1893</b> — primer país en otorgar el sufragio femenino; el 15% de su población es maorí</li>
          </ul>
        </div>
      </section>

      {/* ============ 5 · EL PROBLEMA ============ */}
      <section className="slide dark">
        <div className="watermark">04</div>
        <div className="blob b1" />
        <div className="wrap split">
          <div>
            <span className="kicker a">El problema</span>
            <h2 className="a">La vivienda dejó de ser un derecho <span className="gold">y se volvió un privilegio</span></h2>
            <p className="lead a">
              La vivienda es una necesidad básica que condiciona trabajo, educación y bienestar. En
              Nueva Zelanda se convirtió en uno de los bienes más inaccesibles del mundo
              desarrollado.
            </p>
            <ul className="facts">
              <li className="a"><b>2 décadas</b> de precios creciendo muy por encima de los salarios</li>
              <li className="a"><b>+10 años</b> de salario íntegro necesita una familia promedio para una vivienda en Auckland</li>
              <li className="a"><b>Auckland</b> figura consistentemente entre las ciudades con peor accesibilidad habitacional del mundo</li>
            </ul>
          </div>
          <div className="visual a">
            <img src="/el-problema.png" alt="Auckland: densidad y falta de acceso a la vivienda" />
          </div>
        </div>
      </section>

      {/* ============ 6 · CAUSAS: OFERTA ============ */}
      <section className="slide cream">
        <div className="watermark">05</div>
        <div className="blob b1" />
        <div className="wrap">
          <span className="kicker a">Las causas · Lado de la oferta</span>
          <h2 className="a">Se construyó <span className="lime">muchísimo menos</span> de lo que el país necesitaba</h2>
          <div className="cardgrid">
            <div className="card a"><span className="icon">📋</span><h4>Zonificación estricta</h4><p>Regulaciones que limitaron severamente dónde y cuánto se podía construir.</p></div>
            <div className="card a"><span className="icon">🐌</span><h4>Burocracia lenta</h4><p>Procesos de aprobación de proyectos que demoraban años la incorporación de unidades.</p></div>
            <div className="card a"><span className="icon">👷</span><h4>Escasez de mano de obra</h4><p>Falta de trabajadores calificados en el sector de la construcción.</p></div>
            <div className="card a"><span className="icon">⛰️</span><h4>Geografía acorralada</h4><p>Auckland está rodeada de agua y montañas: la expansión horizontal tiene un límite físico.</p></div>
          </div>
        </div>
      </section>

      {/* ============ 7 · CAUSAS: DEMANDA ============ */}
      <section className="slide cream">
        <div className="watermark">06</div>
        <div className="blob b2" />
        <div className="wrap">
          <span className="kicker a">Las causas · Lado de la demanda</span>
          <h2 className="a">Mientras tanto, la demanda <span className="lime">no paraba de crecer</span></h2>
          <div className="cardgrid">
            <div className="card a"><span className="icon">📈</span><h4>Población y migración</h4><p>Crecimiento poblacional sostenido y migración internacional que sumaron presión año tras año.</p></div>
            <div className="card a"><span className="icon">💳</span><h4>Crédito barato</h4><p>Tasas de interés históricamente bajas que abarataron las hipotecas y estimularon una demanda que la oferta nunca alcanzó.</p></div>
            <div className="card a"><span className="icon">🎰</span><h4>Especulación inmobiliaria</h4><p>Las propiedades dejaron de ser hogares y pasaron a ser instrumentos de inversión: demanda artificial y precios inflados por encima de lo que el mercado real justificaba.</p></div>
          </div>
          <p className="lead a" style={{ marginTop: 34 }}>
            Oferta planchada + demanda imparable = un desequilibrio estructural que se retroalimentó
            durante décadas.
          </p>
        </div>
      </section>

      {/* ============ 8 · COVID ============ */}
      <section className="slide dark">
        <div className="watermark">07</div>
        <div className="blob b1" /><div className="blob b2" />
        <div className="wrap split">
          <div>
            <span className="kicker a">El acelerador</span>
            <h2 className="a">La pandemia: <span className="gold">+45% en dos años</span></h2>
            <p className="lead a">
              Entre 2020 y 2022, los precios subieron uno de los incrementos más pronunciados del
              mundo. Una crisis que ya existía, llevada al extremo.
            </p>
            <ul className="facts">
              <li className="a"><b>Tasas ≈ 0</b> — el Banco Central abarató el crédito para sostener la economía: benefició a quienes ya tenían propiedades</li>
              <li className="a"><b>Construcción paralizada</b> por las medidas sanitarias, justo cuando la demanda se disparaba</li>
              <li className="a"><b>Trabajo remoto</b> — nueva demanda de viviendas más grandes</li>
              <li className="a"><b>Efecto expectativas</b> — &quot;los precios van a seguir subiendo&quot;: miles se apuraron a comprar y realimentaron la espiral</li>
            </ul>
          </div>
          <div className="visual a">
            <img src="/curva-casa.png" alt="Curva de precios de vivienda disparándose entre 2020 y 2022" />
          </div>
        </div>
      </section>

      {/* ============ 9 · FALLA DE MERCADO ============ */}
      <section className="slide dark">
        <div className="watermark">08</div>
        <div className="blob b1" />
        <div className="wrap split">
          <div>
            <span className="kicker a">La lectura económica</span>
            <h2 className="a">El mercado, solo, <span className="lime">no pudo corregirlo</span></h2>
            <ul className="facts">
              <li className="a"><b>Demanda inelástica</b> — la gente necesita un techo sin importar el precio: no existe sustituto. Quien no compra, alquila; quien no alquila, cae en vulnerabilidad</li>
              <li className="a"><b>Oferta rígida</b> — incapaz de expandirse al ritmo necesario</li>
              <li className="a"><b>Especulación</b> — precios distorsionados por encima del mercado real</li>
              <li className="a"><b>Estado tarde y fragmentado</b> — restricciones a extranjeros, subsidios, reformas de zonificación y construcción pública que no atacaron todas las causas a la vez</li>
            </ul>
            <p className="lead a" style={{ marginTop: 26 }}>
              Una <strong>falla de mercado estructural</strong>: cuando las raíces son
              estructurales, las intervenciones parciales no alcanzan.
            </p>
          </div>
          <div className="visual a">
            <img src="/balanza.png" alt="Balanza desequilibrada: mucha demanda contra poca oferta de viviendas" />
          </div>
        </div>
      </section>

      {/* ============ 10 · CONSECUENCIAS ============ */}
      <section className="slide dark">
        <div className="watermark">09</div>
        <div className="blob b2" />
        <div className="wrap split">
          <div>
            <span className="kicker a">Las consecuencias</span>
            <h2 className="a">Cuando una casa es inalcanzable, <span className="lime">todo lo demás se rompe</span></h2>
            <div className="numlist">
              <div className="numrow a"><span className="n">01</span><div><h4>Menos movilidad laboral</h4><p>No podés mudarte a donde hay empleo si no podés pagar el alojamiento.</p></div></div>
              <div className="numrow a"><span className="n">02</span><div><h4>Ahorro pulverizado</h4><p>Una proporción creciente del ingreso se va en alquiler o cuotas.</p></div></div>
              <div className="numrow a"><span className="n">03</span><div><h4>Desigualdad intergeneracional</h4><p>Quien hereda acumula patrimonio; quien no, queda cada vez más rezagado.</p></div></div>
              <div className="numrow a"><span className="n">04</span><div><h4>Fuga de talentos a Australia</h4><p>Médicos, ingenieros, enfermeros y docentes que el país formó se van por salarios más altos y vivienda accesible.</p></div></div>
            </div>
          </div>
          <div className="visual a">
            <img src="/consecuencias.png" alt="Jóvenes emigrando hacia Australia" />
          </div>
        </div>
      </section>

      {/* ============ 11 · LA SOLUCIÓN INTEGRAL ============ */}
      <section className="slide cream">
        <div className="watermark">10</div>
        <div className="blob b1" />
        <div className="wrap">
          <span className="kicker a">La solución</span>
          <h2 className="a">No hay bala de plata: <span className="lime">hay política integral</span></h2>
          <div className="cardgrid">
            <div className="card a"><span className="icon">🏙️</span><h4>Desregular la zonificación</h4><p>Permitir más construcción en altura donde la geografía no deja crecer a lo ancho.</p></div>
            <div className="card a"><span className="icon">🏘️</span><h4>Vivienda pública</h4><p>Inversión masiva del Estado para expandir la oferta.</p></div>
            <div className="card a"><span className="icon">🧾</span><h4>Desincentivar la especulación</h4><p>Impuestos progresivos a quienes acumulan múltiples propiedades.</p></div>
            <div className="card a"><span className="icon">💵</span><h4>Mejorar salarios</h4><p>Reducir la brecha con Australia para que la fuga de talentos pierda atractivo.</p></div>
          </div>
          <p className="lead a" style={{ marginTop: 34 }}>
            <strong>Ninguna medida alcanza sola.</strong> Es la combinación de todas, sostenida en
            el tiempo y con voluntad política real, lo que puede revertir décadas de desequilibrio.
          </p>
        </div>
      </section>

      {/* ============ 12 · PLAN KIWI JOVEN ============ */}
      <section className="slide lime">
        <div className="watermark">11</div>
        <div className="wrap split">
          <div>
            <span className="kicker a">Nuestra propuesta</span>
            <h2 className="a">
              Plan Kiwi Joven: <span className="hand" style={{ fontSize: '1.2em' }}>tu casa, en tu país</span>
            </h2>
            <ul className="facts">
              <li className="a" style={liStyle}><b style={bStyle}>Estado + bancos</b> — articulado con ANZ, ASB, BNZ y Kiwibank: escala con la infraestructura financiera existente</li>
              <li className="a" style={liStyle}><b style={bStyle}>24 a 40 años</b> — el segmento con mayor demanda insatisfecha y mayor riesgo de emigración</li>
              <li className="a" style={liStyle}><b style={bStyle}>Cuotas accesibles</b> y previsibles, adaptadas a la capacidad económica del segmento</li>
              <li className="a" style={liStyle}><b style={bStyle}>Trámites simplificados</b> a través de los bancos participantes</li>
              <li className="a" style={liStyle}><b style={bStyle}>Doble objetivo</b> — acceso a la vivienda y arraigo de la población joven</li>
            </ul>
            <div className="bank-row a">
              <span>ANZ</span><span>ASB</span><span>BNZ</span><span>Kiwibank</span>
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <p
              className="a"
              style={{
                fontFamily: 'var(--font-display)', fontWeight: 700, letterSpacing: 3,
                textTransform: 'uppercase', fontSize: '.85rem', color: '#1d3a23',
              }}
            >
              Tasa preferencial desde
            </p>
            <div className="rate-hero a">2,25<sup>%</sup></div>
            <p className="lead a" style={{ marginInline: 'auto', maxWidth: 320 }}>
              anual, con un <strong>tope máximo garantizado del 4%</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ============ 13 · LA CAMPAÑA ============ */}
      <section className="slide cream">
        <div className="watermark">12</div>
        <div className="blob b2" />
        <div className="wrap">
          <span className="kicker a">Difusión · Concepto: &quot;Tu casa, en tu país&quot;</span>
          <h2 className="a">El insight: el miedo a <span className="lime">no poder nunca</span></h2>
          <p className="lead a">
            Tono aspiracional, directo y patriótico, construido sobre el temor del joven neozelandés
            a jamás acceder a una vivienda propia. Tres canales, cada uno con su rol:
          </p>
          <div className="cardgrid">
            <div className="card a">
              <span className="icon">📺</span><h4>TV y vía pública</h4>
              <p>Spot de 30&quot; con paisajes de Nueva Zelanda y jóvenes accediendo a su primera vivienda.</p>
              <p className="msg">&quot;Cada año, miles de jóvenes se van. Hoy eso cambia. Créditos desde 2,25%. Tu casa, en tu país.&quot;</p>
            </div>
            <div className="card a">
              <span className="icon">📱</span><h4>Redes sociales</h4>
              <p>Pauta y contenido orgánico en Instagram, TikTok y Facebook: reels dinámicos con llamados a la acción.</p>
              <p className="msg">&quot;¿Y si tu próxima dirección fuera acá, no en Sídney?&quot;</p>
            </div>
            <div className="card a">
              <span className="icon">📬</span><h4>Email marketing</h4>
              <p>Envíos segmentados a clientes de los bancos participantes, con botón directo al simulador del plan.</p>
              <p className="msg">Asunto: &quot;Tu primera casa ya no es un sueño imposible.&quot;</p>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 14 · CIERRE ============ */}
      <section className="slide dark closing">
        <div className="cover-bg" style={{ backgroundImage: "url('/cta.png')" }} />
        <div className="blob b1" /><div className="blob b2" />
        <div className="wrap cover">
          <span className="kicker a">Gracias</span>
          <h2 className="a" style={{ fontSize: 'clamp(2.4rem,5.5vw,4.4rem)' }}>
            Resolver la vivienda no es solo política habitacional:{' '}
            <span className="lime">es retener el futuro</span>
          </h2>
          <span className="tagline a">Tu futuro. Tu hogar. Tu decisión.</span>
          <div className="team a" style={{ marginTop: 40 }}>
            <span>Ana Battaglia</span>
            <span>Valentín Jacofsky</span>
            <span>Valentín Laurenzano</span>
            <span>Juan Cruz Quiroga</span>
          </div>
          <div className="start-hint a">¿Preguntas? · <strong>R</strong> reinicia · <strong>ESC</strong> vuelve a la landing</div>
        </div>
      </section>

      {/* ============ 15 · QR A KIWIA ============ */}
      <section className="slide lime">
        <div className="watermark">🥝</div>
        <div className="wrap split">
          <div>
            <span className="kicker a">Kiwia · Asistente con IA</span>
            <h2 className="a">
              ¿Seguís con dudas?{' '}
              <span className="hand" style={{ fontSize: '1.2em' }}>Consultale a Kiwia</span>
            </h2>
            <p className="lead a">
              Kiwia es el chatbot del proyecto: responde cualquier pregunta sobre el TP — Nueva
              Zelanda, la crisis habitacional o el Plan Kiwi Joven — usando el documento del trabajo
              y, si hace falta, búsqueda web.
            </p>
            <ul className="facts">
              <li className="a" style={liStyle}><b style={bStyle}>Escaneá el QR</b> con la cámara del celular</li>
              <li className="a" style={liStyle}><b style={bStyle}>O entrá</b> desde la landing → &quot;🤖 Kiwia&quot;</li>
            </ul>
          </div>
          <div className="qr-card a">
            {qrSrc && <img src={qrSrc} alt="Código QR para abrir el chatbot Kiwia" />}
            <span>Escaneá y preguntá 🥝</span>
          </div>
        </div>
      </section>
    </>
  );
}
