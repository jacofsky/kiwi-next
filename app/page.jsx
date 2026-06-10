'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* ============================================================
   PLAN KIWI JOVEN — Landing (Next.js)
   Paleta tomada de las piezas gráficas del TP:
   verde bosque, verde lima, crema y dorado.
   ============================================================ */
const css = `
:root{
  --forest:      #0e2a14;
  --forest-2:    #14351c;
  --leaf:        #2e7d32;
  --lime:        #7ac143;
  --lime-soft:   #a4d65e;
  --cream:       #f5f1e6;
  --cream-2:     #ece6d4;
  --gold:        #f2c94c;
  --ink:         #122416;
  --white:       #ffffff;
  --radius:      22px;
  --font-display:'Sora', sans-serif;
  --font-body:   'Inter', sans-serif;
  --font-hand:   'Caveat', cursive;
}

*{ margin:0; padding:0; box-sizing:border-box; }
html{
  scroll-behavior:smooth;
  scrollbar-color:var(--lime) var(--forest);
}
::-webkit-scrollbar{ width:12px; }
::-webkit-scrollbar-track{ background:var(--forest); }
::-webkit-scrollbar-thumb{
  background:linear-gradient(180deg, var(--lime), var(--leaf));
  border-radius:99px;
  border:3px solid var(--forest);
}
::-webkit-scrollbar-thumb:hover{ background:var(--lime-soft); }
body{
  font-family:var(--font-body);
  background:var(--cream);
  color:var(--ink);
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
::selection{ background:var(--lime); color:var(--forest); }

h1,h2,h3,h4{ font-family:var(--font-display); line-height:1.05; }
img{ max-width:100%; display:block; }
a{ text-decoration:none; color:inherit; }
.container{ width:min(1180px, 92%); margin-inline:auto; }

#scroll-progress{
  position:fixed; top:0; left:0; height:4px; width:0%;
  background:linear-gradient(90deg, var(--lime), var(--gold));
  z-index:1001;
}

.navbar{
  position:fixed; top:0; left:0; right:0; z-index:1000;
  padding:18px 0;
  transition:transform .45s ease, background .35s ease, padding .35s ease, box-shadow .35s ease;
}
.navbar.scrolled{
  background:rgba(14,42,20,.82);
  backdrop-filter:blur(14px);
  -webkit-backdrop-filter:blur(14px);
  padding:12px 0;
  box-shadow:0 8px 30px rgba(0,0,0,.25);
}
.navbar.hidden{ transform:translateY(-110%); }
.nav-inner{ display:flex; align-items:center; justify-content:space-between; gap:24px; }
.nav-logo{
  display:flex; align-items:center; gap:10px;
  font-family:var(--font-display); font-weight:800; font-size:1.25rem; color:var(--white);
  letter-spacing:.5px;
}
.nav-logo .kiwi-dot{
  width:38px; height:38px; border-radius:50%;
  background:var(--lime);
  display:grid; place-items:center; font-size:1.2rem;
  box-shadow:0 0 0 4px rgba(122,193,67,.25);
}
.nav-logo span em{ color:var(--lime); font-style:normal; }
.nav-links{ display:flex; gap:28px; list-style:none; }
.nav-links a{
  color:rgba(255,255,255,.85); font-weight:500; font-size:.95rem;
  position:relative; padding:4px 0; transition:color .25s;
}
.nav-links a::after{
  content:""; position:absolute; left:0; bottom:-2px; height:2px; width:0;
  background:var(--lime); transition:width .3s ease; border-radius:2px;
}
.nav-links a:hover{ color:var(--white); }
.nav-links a:hover::after, .nav-links a.active::after{ width:100%; }
.nav-cta{
  background:var(--lime); color:var(--forest);
  font-weight:700; font-family:var(--font-display);
  padding:11px 22px; border-radius:999px; font-size:.9rem;
  transition:transform .25s, box-shadow .25s, background .25s;
  box-shadow:0 4px 18px rgba(122,193,67,.4);
  white-space:nowrap;
}
.nav-cta:hover{ transform:translateY(-2px) scale(1.03); background:var(--lime-soft); }
.nav-burger{ display:none; background:none; border:none; cursor:pointer; flex-direction:column; gap:5px; }
.nav-burger span{ width:26px; height:3px; background:var(--white); border-radius:3px; transition:.3s; }

.hero{
  position:relative; min-height:100svh;
  background:radial-gradient(1200px 700px at 75% 15%, #1d4a27 0%, var(--forest) 55%, #081a0c 100%);
  color:var(--white);
  display:flex; flex-direction:column; justify-content:center;
  overflow:hidden;
  padding:140px 0 0;
}
#hero-canvas{
  position:absolute; inset:0; width:100%; height:100%;
  pointer-events:none;
  z-index:3;
}
.hero-inner{
  position:relative; z-index:2;
  display:grid; grid-template-columns:1.15fr .85fr; gap:48px; align-items:center;
}
.hero-badge{
  display:inline-flex; align-items:center; gap:8px;
  background:rgba(122,193,67,.15);
  border:1px solid rgba(122,193,67,.5);
  color:var(--lime-soft);
  font-weight:600; font-size:.85rem;
  padding:8px 18px; border-radius:999px; margin-bottom:26px;
  letter-spacing:.5px; text-transform:uppercase;
}
.hero-badge .pulse{
  width:9px; height:9px; border-radius:50%; background:var(--lime);
  animation:pulse 1.8s infinite;
}
@keyframes pulse{
  0%{ box-shadow:0 0 0 0 rgba(122,193,67,.7); }
  70%{ box-shadow:0 0 0 12px rgba(122,193,67,0); }
  100%{ box-shadow:0 0 0 0 rgba(122,193,67,0); }
}
.hero h1{
  font-size:clamp(3rem, 7.2vw, 6.2rem);
  font-weight:800; text-transform:uppercase; letter-spacing:-1px;
}
.hero h1 .line{ display:block; overflow:hidden; }
.hero h1 .line > span{ display:inline-block; }
.hero h1 .lime{ color:var(--lime); }
.hero h1 .outline{
  position:relative;
  color:#0c2412;
}
.hero h1 .outline::before{
  content:attr(data-text);
  position:absolute; left:0; top:0;
  z-index:-1;
  color:transparent;
  -webkit-text-stroke:2.5px rgba(245,241,230,.85);
}
.hero-script{
  font-family:var(--font-hand); color:var(--gold);
  font-size:clamp(1.6rem, 3vw, 2.4rem);
  display:block; margin-top:6px; transform:rotate(-2deg);
}
.hero-sub{
  margin-top:26px; max-width:520px;
  color:rgba(245,241,230,.82); font-size:1.08rem; line-height:1.65;
}
.hero-sub strong{ color:var(--lime-soft); }
.hero-actions{ display:flex; gap:16px; margin-top:36px; flex-wrap:wrap; }
.btn{
  font-family:var(--font-display); font-weight:700; font-size:1rem;
  padding:16px 32px; border-radius:999px; cursor:pointer; border:none;
  display:inline-flex; align-items:center; gap:10px;
  transition:transform .25s, box-shadow .25s, background .25s;
}
.btn-primary{
  background:var(--lime); color:var(--forest);
  box-shadow:0 10px 30px rgba(122,193,67,.45);
}
.btn-primary:hover{ transform:translateY(-3px) scale(1.02); }
.btn-ghost{
  background:transparent; color:var(--cream);
  border:2px solid rgba(245,241,230,.35);
}
.btn-ghost:hover{ border-color:var(--lime); color:var(--lime-soft); transform:translateY(-3px); }
.hero-chips{ display:flex; gap:14px; margin-top:42px; flex-wrap:wrap; }
.chip{
  background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.14);
  backdrop-filter:blur(8px);
  padding:12px 20px; border-radius:16px;
  display:flex; flex-direction:column; gap:2px;
}
.chip b{ font-family:var(--font-display); font-size:1.3rem; color:var(--lime); }
.chip small{ color:rgba(245,241,230,.7); font-size:.78rem; }

.hero-visual{ position:relative; perspective:1200px; }
.hero-card{
  transform-style:preserve-3d;
  border-radius:28px; overflow:hidden;
  box-shadow:0 40px 80px rgba(0,0,0,.45);
  border:1px solid rgba(255,255,255,.15);
  transition:transform .15s ease-out;
}
.hero-rate{
  position:absolute; right:-18px; top:-24px; z-index:4;
  background:var(--gold); color:var(--forest);
  border-radius:20px; padding:16px 22px; text-align:center;
  font-family:var(--font-display);
  box-shadow:0 16px 36px rgba(0,0,0,.35);
  animation:floaty 4.5s ease-in-out infinite;
}
.hero-rate b{ display:block; font-size:2rem; font-weight:800; }
.hero-rate small{ font-size:.72rem; font-weight:600; letter-spacing:.5px; }
.hero-age{
  position:absolute; left:-22px; bottom:36px; z-index:4;
  background:var(--forest-2); color:var(--cream);
  border:1px solid rgba(122,193,67,.5);
  border-radius:18px; padding:14px 20px;
  font-family:var(--font-display); font-size:.9rem;
  box-shadow:0 16px 36px rgba(0,0,0,.35);
  animation:floaty 5.2s ease-in-out infinite reverse;
}
.hero-age b{ color:var(--lime); }
@keyframes floaty{
  0%,100%{ transform:translateY(0) rotate(0deg); }
  50%{ transform:translateY(-12px) rotate(1.5deg); }
}
.hero-scroll{
  position:relative; z-index:2;
  display:flex; justify-content:center; padding:48px 0 28px;
  color:rgba(245,241,230,.6); font-size:.8rem; letter-spacing:2px; text-transform:uppercase;
}
.hero-scroll .mouse{
  width:24px; height:38px; border:2px solid rgba(245,241,230,.5); border-radius:14px;
  margin-right:12px; position:relative;
}
.hero-scroll .mouse::after{
  content:""; position:absolute; top:7px; left:50%; transform:translateX(-50%);
  width:4px; height:8px; background:var(--lime); border-radius:4px;
  animation:wheel 1.6s infinite;
}
@keyframes wheel{
  0%{ opacity:1; top:7px; } 100%{ opacity:0; top:20px; }
}

.marquee{
  background:var(--lime); color:var(--forest);
  padding:16px 0; overflow:hidden; white-space:nowrap;
  transform:rotate(-1.2deg) scale(1.02);
  position:relative; z-index:5; margin-top:-8px;
  border-top:3px solid var(--forest);
  border-bottom:3px solid var(--forest);
}
.marquee-track{
  display:inline-block;
  animation:marquee 26s linear infinite;
  font-family:var(--font-display); font-weight:800; font-size:1.1rem;
  text-transform:uppercase; letter-spacing:1px;
}
.marquee-track span{ margin:0 28px; }
.marquee-track .star{ color:var(--forest-2); opacity:.55; }
@keyframes marquee{ from{ transform:translateX(0); } to{ transform:translateX(-50%); } }

section{ position:relative; }
.section-pad{ padding:110px 0; }
.kicker{
  display:inline-block;
  font-family:var(--font-display); font-weight:700; font-size:.85rem;
  letter-spacing:2.5px; text-transform:uppercase;
  color:var(--leaf); margin-bottom:16px;
  padding:6px 16px; border-radius:999px;
  background:rgba(122,193,67,.16); border:1px solid rgba(122,193,67,.4);
}
.section-title{
  font-size:clamp(2rem, 4.4vw, 3.4rem); font-weight:800;
  letter-spacing:-.5px; max-width:780px;
}
.section-title .hl{
  background:linear-gradient(transparent 62%, var(--gold) 62%);
  padding:0 4px;
}
.section-lead{
  margin-top:20px; max-width:680px;
  font-size:1.1rem; line-height:1.7; color:#3c4a3e;
}

.problema{ background:var(--cream); overflow:hidden; }
.problema-grid{
  display:grid; grid-template-columns:1fr 1fr; gap:56px;
  align-items:center; margin-top:60px;
}
.stat-mega{
  font-family:var(--font-display); font-weight:800;
  font-size:clamp(4rem, 9vw, 7.5rem);
  color:var(--forest); line-height:.95;
}
.stat-mega .pct{ color:var(--lime); }
.stat-mega-label{
  font-size:1.05rem; color:#3c4a3e; margin-top:14px; max-width:420px; line-height:1.6;
}
.causas{ margin-top:80px; }
.causas h3{
  font-size:1.5rem; margin-bottom:34px; color:var(--forest);
}
.causas-grid{
  display:grid; grid-template-columns:repeat(auto-fit, minmax(245px, 1fr)); gap:22px;
}
.causa-card{
  background:var(--white); border-radius:var(--radius);
  padding:30px 26px;
  border:1px solid rgba(18,36,22,.08);
  box-shadow:0 10px 30px rgba(18,36,22,.06);
  transition:transform .15s ease-out, box-shadow .3s;
  transform-style:preserve-3d; will-change:transform;
  position:relative; overflow:hidden;
}
.causa-card::before{
  content:""; position:absolute; top:0; left:0; right:0; height:5px;
  background:linear-gradient(90deg, var(--lime), var(--gold));
  transform:scaleX(0); transform-origin:left; transition:transform .4s ease;
}
.causa-card:hover::before{ transform:scaleX(1); }
.causa-card .icon{
  width:54px; height:54px; border-radius:16px;
  background:rgba(122,193,67,.18);
  display:grid; place-items:center; font-size:1.6rem; margin-bottom:18px;
}
.causa-card h4{ font-size:1.1rem; margin-bottom:10px; color:var(--forest); }
.causa-card p{ font-size:.93rem; line-height:1.6; color:#4a584c; }

.consecuencias{
  background:linear-gradient(180deg, var(--forest) 0%, #0a2010 100%);
  color:var(--cream);
  clip-path:polygon(0 3%, 100% 0, 100% 97%, 0 100%);
  padding:150px 0 160px;
}
.consecuencias .kicker{
  color:var(--lime-soft); background:rgba(122,193,67,.12); border-color:rgba(122,193,67,.35);
}
.consecuencias .section-lead{ color:rgba(245,241,230,.75); }
.conse-list{ margin-top:70px; display:flex; flex-direction:column; gap:26px; }
.conse-item{
  display:grid; grid-template-columns:110px 1fr auto; gap:30px; align-items:center;
  background:rgba(255,255,255,.045);
  border:1px solid rgba(255,255,255,.1);
  border-radius:var(--radius); padding:34px 38px;
  transition:background .3s, border-color .3s, transform .3s;
}
.conse-item:hover{
  background:rgba(122,193,67,.09);
  border-color:rgba(122,193,67,.45);
  transform:translateX(10px);
}
.conse-num{
  font-family:var(--font-display); font-weight:800;
  font-size:3.4rem; color:transparent;
  -webkit-text-stroke:2px var(--lime);
}
.conse-item h4{ font-size:1.3rem; margin-bottom:8px; }
.conse-item p{ color:rgba(245,241,230,.72); line-height:1.65; font-size:.97rem; max-width:640px; }
.conse-icon{ font-size:2.2rem; opacity:.85; }

.solucion{ background:var(--cream); padding-top:130px; }
.solucion-head{ text-align:center; display:flex; flex-direction:column; align-items:center; }
.rate-showcase{
  margin:64px auto 0; max-width:880px;
  background:var(--forest);
  border-radius:34px; padding:64px 48px;
  text-align:center; color:var(--cream);
  position:relative; overflow:hidden;
  box-shadow:0 40px 90px rgba(14,42,20,.35);
}
.rate-showcase::before{
  content:""; position:absolute; inset:-50%;
  background:conic-gradient(from 0deg, transparent 0 70%, rgba(122,193,67,.25) 80%, transparent 90%);
  animation:spin 9s linear infinite;
}
@keyframes spin{ to{ transform:rotate(360deg); } }
.rate-showcase > *{ position:relative; }
.rate-showcase .label{
  text-transform:uppercase; letter-spacing:3px; font-size:.85rem;
  color:var(--lime-soft); font-weight:600;
}
.rate-big{
  font-family:var(--font-display); font-weight:800;
  font-size:clamp(4.5rem, 11vw, 8.5rem); line-height:1;
  color:var(--lime); margin:10px 0 6px;
}
.rate-big sup{ font-size:.35em; color:var(--gold); }
.rate-showcase .cap{ color:rgba(245,241,230,.75); font-size:1rem; }
.rate-showcase .cap b{ color:var(--gold); }
.beneficios-grid{
  display:grid; grid-template-columns:repeat(auto-fit, minmax(250px, 1fr));
  gap:24px; margin-top:80px;
}
.beneficio{
  background:var(--white); border-radius:var(--radius); padding:34px 28px;
  border:1px solid rgba(18,36,22,.08);
  transition:transform .15s ease-out, box-shadow .35s;
  transform-style:preserve-3d; will-change:transform;
}
.beneficio:hover{ box-shadow:0 24px 50px rgba(18,36,22,.13); }
.beneficio .icon{
  width:58px; height:58px; border-radius:50%;
  background:var(--forest); color:var(--lime);
  display:grid; place-items:center; font-size:1.5rem; margin-bottom:20px;
}
.beneficio h4{ font-size:1.12rem; color:var(--forest); margin-bottom:10px; }
.beneficio p{ font-size:.93rem; line-height:1.6; color:#4a584c; }

.bancos{ margin-top:90px; text-align:center; }
.bancos h3{ font-size:1.05rem; color:#5a685c; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-bottom:30px; }
.bancos-row{ display:flex; justify-content:center; gap:20px; flex-wrap:wrap; }
.banco-pill{
  font-family:var(--font-display); font-weight:800; font-size:1.35rem;
  background:var(--white); color:var(--forest);
  border:2px solid rgba(18,36,22,.1);
  padding:18px 42px; border-radius:18px;
  transition:transform .3s, border-color .3s, box-shadow .3s;
}
.banco-pill:hover{
  transform:translateY(-6px) rotate(-1deg);
  border-color:var(--lime); box-shadow:0 18px 36px rgba(122,193,67,.25);
}

.cta-final{
  margin-top:110px;
  background:linear-gradient(135deg, var(--lime) 0%, var(--lime-soft) 100%);
  border-radius:40px; padding:80px 56px;
  display:grid; grid-template-columns:1.2fr .8fr; gap:40px; align-items:center;
  position:relative; overflow:hidden;
}
.cta-final::after{
  content:"🥝"; position:absolute; right:-30px; bottom:-46px;
  font-size:13rem; opacity:.13; transform:rotate(-15deg);
}
.cta-final h2{
  font-size:clamp(1.9rem, 3.6vw, 3rem); color:var(--forest); font-weight:800;
}
.cta-final .script{ font-family:var(--font-hand); font-size:1.5em; display:block; }
.cta-final p{ margin-top:16px; color:#1d3a23; line-height:1.65; max-width:480px; }
.cta-final .btn{ background:var(--forest); color:var(--cream); box-shadow:0 14px 34px rgba(14,42,20,.4); }
.cta-final .btn:hover{ transform:translateY(-3px) scale(1.03); }
.cta-box{ display:flex; justify-content:center; }

.img-fill{ width:100%; height:100%; object-fit:cover; display:block; }
.ratio-45{ aspect-ratio:4/5; border-radius:28px; }
.ratio-169{ aspect-ratio:16/9; border-radius:var(--radius); }
.ratio-11{ aspect-ratio:1/1; border-radius:var(--radius); }

.chat-fab{
  position:fixed; right:22px; bottom:22px; z-index:900;
  display:flex; align-items:center; gap:10px;
  background:var(--forest); color:var(--cream);
  border:1px solid rgba(122,193,67,.5);
  font-family:var(--font-display); font-weight:700; font-size:.9rem;
  padding:14px 22px; border-radius:999px;
  box-shadow:0 16px 40px rgba(8,26,12,.45);
  transition:transform .25s, background .25s;
}
.chat-fab:hover{ transform:translateY(-3px) scale(1.03); background:var(--forest-2); }
.chat-fab .dot{
  width:10px; height:10px; border-radius:50%; background:var(--lime);
  animation:pulse 1.8s infinite;
}

footer{
  background:#081a0c; color:rgba(245,241,230,.75);
  padding:90px 0 36px; margin-top:120px;
  clip-path:polygon(0 6%, 100% 0, 100% 100%, 0 100%);
}
.footer-grid{
  display:grid; grid-template-columns:1.4fr 1fr 1fr 1fr; gap:48px; padding-top:30px;
}
.footer-brand .nav-logo{ margin-bottom:18px; }
.footer-brand p{ font-size:.92rem; line-height:1.65; max-width:300px; }
.footer-tagline{
  font-family:var(--font-hand); color:var(--gold); font-size:1.5rem; margin-top:18px; display:block;
}
footer h5{
  font-family:var(--font-display); color:var(--white);
  font-size:.95rem; letter-spacing:1.5px; text-transform:uppercase; margin-bottom:20px;
}
footer ul{ list-style:none; display:flex; flex-direction:column; gap:12px; }
footer ul a{ font-size:.92rem; transition:color .25s, padding-left .25s; }
footer ul a:hover{ color:var(--lime); padding-left:6px; }
.footer-bottom{
  margin-top:70px; padding-top:26px;
  border-top:1px solid rgba(255,255,255,.1);
  display:flex; justify-content:space-between; gap:16px; flex-wrap:wrap;
  font-size:.8rem; color:rgba(245,241,230,.45);
}

.reveal{ opacity:0; transform:translateY(46px); }

@media (max-width: 980px){
  .hero-inner{ grid-template-columns:1fr; gap:56px; }
  .hero-visual{ max-width:480px; margin-inline:auto; }
  .problema-grid{ grid-template-columns:1fr; }
  .conse-item{ grid-template-columns:70px 1fr; }
  .conse-icon{ display:none; }
  .cta-final{ grid-template-columns:1fr; text-align:center; padding:60px 32px; }
  .cta-final p{ margin-inline:auto; }
  .footer-grid{ grid-template-columns:1fr 1fr; }
}
@media (max-width: 760px){
  .nav-links, .nav-cta{ display:none; }
  .nav-burger{ display:flex; }
  .nav-links.open{
    display:flex; position:fixed; inset:0; background:var(--forest);
    flex-direction:column; justify-content:center; align-items:center; gap:34px;
    font-size:1.3rem; z-index:999;
  }
  .conse-num{ font-size:2.4rem; }
  .conse-item{ padding:26px 24px; gap:18px; }
  .footer-grid{ grid-template-columns:1fr; }
  .hero{ padding-top:110px; }
  .hero h1{ font-size:clamp(2.3rem, 10.5vw, 3rem); }
  .hero h1 .outline::before{ -webkit-text-stroke-width:2px; }
  .hero-rate{ right:-4px; top:-16px; padding:12px 16px; border-radius:16px; }
  .hero-rate b{ font-size:1.45rem; }
  .hero-age{ left:-4px; bottom:22px; padding:10px 14px; font-size:.78rem; }
  .hero-sub{ font-size:1rem; }
  .chip{ padding:10px 14px; }
  .chip b{ font-size:1.1rem; }
}
@media (prefers-reduced-motion: reduce){
  *{ animation:none !important; transition:none !important; }
}
`;

export default function Landing() {
  /* ---------- Escena 3D del hero ---------- */
  useEffect(() => {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    function resize() {
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    // Casa wireframe de respaldo (queda mientras carga el .glb)
    const house = new THREE.Group();
    const matLime = new THREE.LineBasicMaterial({ color: 0x7ac143 });
    const matGold = new THREE.LineBasicMaterial({ color: 0xf2c94c });

    const body = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.2, 1.6, 2.2));
    house.add(new THREE.LineSegments(body, matLime));
    const roof = new THREE.EdgesGeometry(new THREE.ConeGeometry(1.85, 1.3, 4));
    const roofMesh = new THREE.LineSegments(roof, matGold);
    roofMesh.position.y = 1.45;
    roofMesh.rotation.y = Math.PI / 4;
    house.add(roofMesh);
    const door = new THREE.EdgesGeometry(new THREE.PlaneGeometry(0.55, 0.85));
    const doorMesh = new THREE.LineSegments(door, matGold);
    doorMesh.position.set(0, -0.38, 1.11);
    house.add(doorMesh);

    const HOUSE_Z = 1.2;
    scene.add(house);

    // Luces (el wireframe no las necesita, el modelo glb sí)
    scene.add(new THREE.HemisphereLight(0xf5f1e6, 0x0e2a14, 2.2));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(4, 6, 6);
    scene.add(sun);

    // Modelo house.glb: reemplaza al wireframe cuando carga
    new GLTFLoader().load(
      '/house.glb',
      (gltf) => {
        const model = gltf.scene;
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const s = 3 / Math.max(size.x, size.y, size.z);
        model.scale.setScalar(s);
        model.position.copy(center).multiplyScalar(-s);
        house.clear();
        house.add(model);
      },
      undefined,
      (err) => console.warn('No se pudo cargar house.glb. Queda la casa wireframe.', err)
    );

    // Partículas
    const COUNT = 700;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ color: 0x7ac143, size: 0.05, transparent: true, opacity: 0.7 });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Anclaje: esquina inferior derecha de la foto del hero
    const cardEl = document.querySelector('.hero-card');
    let hx = 0, hy = 0;
    function anchorHouse() {
      if (!cardEl) return;
      const c = canvas.getBoundingClientRect();
      const r = cardEl.getBoundingClientRect();
      if (!c.width || !c.height) return;
      const px = r.right - r.width * 0.12 - c.left;
      const py = r.bottom - r.height * 0.06 - c.top;
      const d = 9 - HOUSE_Z;
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * d;
      const halfW = halfH * camera.aspect;
      hx = ((px / c.width) * 2 - 1) * halfW;
      hy = -((py / c.height) * 2 - 1) * halfH;
      const SIZE_TUNE = 0.8;
      const s = Math.min(0.7, Math.max(0.42, r.width / 640)) * SIZE_TUNE;
      house.scale.setScalar(s);
    }

    // Parallax con el mouse (smx/smy se interpolan para suavizar)
    let mx = 0, my = 0, smx = 0, smy = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    const clock = new THREE.Clock();
    let raf;
    (function animate() {
      raf = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      anchorHouse();
      smx += (mx - smx) * 0.04;
      smy += (my - smy) * 0.04;
      house.rotation.y = t * 0.16 + smx * 0.3;
      house.rotation.x = Math.sin(t * 0.4) * 0.05 + smy * 0.12;
      house.position.set(hx, hy + Math.sin(t * 0.7) * 0.14, HOUSE_Z);

      particles.rotation.y = t * 0.03;
      particles.position.x = mx * 0.6;
      particles.position.y = -my * 0.4;

      camera.position.x += (mx * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (-my * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    })();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      renderer.dispose();
    };
  }, []);

  /* ---------- Animaciones GSAP + interacciones ---------- */
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from('.hero h1 .line > span', {
        yPercent: 110, duration: 1.1, stagger: 0.14, ease: 'power4.out', delay: 0.2,
      });
      gsap.from('.hero-script', { opacity: 0, y: 20, duration: 0.9, delay: 1, ease: 'power3.out' });
      gsap.from('.hero-badge, .hero-sub, .hero-actions, .hero-chips', {
        opacity: 0, y: 34, duration: 0.9, stagger: 0.12, delay: 0.55, ease: 'power3.out',
      });
      gsap.from('.hero-visual', { opacity: 0, x: 80, duration: 1.2, delay: 0.5, ease: 'power3.out' });

      document.querySelectorAll('.reveal').forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 86%' },
        });
      });

      document.querySelectorAll('.counter').forEach((el) => {
        const target = +el.dataset.target;
        ScrollTrigger.create({
          trigger: el, start: 'top 85%', once: true,
          onEnter: () =>
            gsap.fromTo(el, { innerText: 0 }, {
              innerText: target, duration: 2, ease: 'power2.out',
              snap: { innerText: 1 },
              onUpdate: function () { el.innerText = Math.round(this.targets()[0].innerText); },
            }),
        });
      });

      const rateEl = document.getElementById('rateCounter');
      if (rateEl) {
        const obj = { v: 8.0 };
        ScrollTrigger.create({
          trigger: '.rate-showcase', start: 'top 75%', once: true,
          onEnter: () =>
            gsap.to(obj, {
              v: 2.25, duration: 2.4, ease: 'power3.inOut',
              onUpdate: () => { rateEl.textContent = obj.v.toFixed(2).replace('.', ','); },
            }),
        });
      }

      gsap.utils.toArray('.conse-item').forEach((item, i) => {
        gsap.from(item, {
          x: i % 2 === 0 ? -60 : 60, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: item, start: 'top 88%' },
        });
      });

      // Link activo según sección visible
      const sections = ['inicio', 'problema', 'consecuencias', 'solucion'];
      const navAnchors = document.querySelectorAll('.nav-links a');
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el, start: 'top 50%', end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) {
              navAnchors.forEach((a) =>
                a.classList.toggle('active', a.getAttribute('href') === '#' + id)
              );
            }
          },
        });
      });
    });

    // Tilt 3D en tarjetas
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = 'rotateY(0) rotateX(0)'; });
    });

    // Navbar + barra de progreso
    const navbar = document.getElementById('navbar');
    const progress = document.getElementById('scroll-progress');
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 60);
      navbar.classList.toggle('hidden', y > 400 && y > lastY);
      lastY = y;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (y / h) * 100 + '%';
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Menú mobile
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('navLinks');
    const toggleMenu = () => navLinks.classList.toggle('open');
    const closeMenu = () => navLinks.classList.remove('open');
    burger.addEventListener('click', toggleMenu);
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

    return () => {
      ctx.revert();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <>
      <style jsx global>{css}</style>

      <div id="scroll-progress" />

      {/* ================= NAVBAR ================= */}
      <nav className="navbar" id="navbar">
        <div className="container nav-inner">
          <a href="#inicio" className="nav-logo">
            <span className="kiwi-dot">🥝</span>
            <span>
              PLAN <em>KIWI</em>
            </span>
          </a>
          <ul className="nav-links" id="navLinks">
            <li><a href="#inicio" className="active">Inicio</a></li>
            <li><a href="#problema">El problema</a></li>
            <li><a href="#consecuencias">Consecuencias</a></li>
            <li><a href="#solucion">La solución</a></li>
            <li><Link href="/presentacion">🎬 Presentación</Link></li>
            <li><Link href="/chat">🤖 Kiwia</Link></li>
          </ul>
          <a href="#solucion" className="nav-cta">Quiero mi casa →</a>
          <button className="nav-burger" id="navBurger" aria-label="Menú">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <header className="hero" id="inicio">
        <canvas id="hero-canvas" />

        <div className="container hero-inner">
          <div className="hero-copy">
            <span className="hero-badge">
              <span className="pulse"></span> Pensado para tu futuro
            </span>
            <h1>
              <span className="line"><span>Tu casa</span></span>
              <span className="line">
                <span className="outline" data-text="ya no es un">ya no es un</span>
              </span>
              <span className="line"><span className="lime">sueño imposible</span></span>
              <span className="hero-script">Plan Kiwi Joven · Tu casa, en tu país</span>
            </h1>
            <p className="hero-sub">
              Cada año, miles de jóvenes neozelandeses se van del país porque una vivienda propia
              quedó fuera de su alcance. <strong>Hoy eso cambia.</strong> El Estado y los
              principales bancos de Nueva Zelanda lanzan el plan de créditos hipotecarios que
              devuelve el futuro a su lugar: acá.
            </p>
            <div className="hero-actions">
              <a href="#solucion" className="btn btn-primary">Conocé el plan 🏡</a>
              <a href="#problema" className="btn btn-ghost">¿Por qué existe?</a>
            </div>
            <div className="hero-chips">
              <div className="chip"><b>2,25%</b><small>tasa anual desde</small></div>
              <div className="chip"><b>24–40</b><small>años · segmento del plan</small></div>
              <div className="chip"><b>4 bancos</b><small>ANZ · ASB · BNZ · Kiwibank</small></div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-rate">
              <small>TASAS DESDE</small>
              <b>2,25%</b>
              <small>HASTA 4% TOPE</small>
            </div>
            <div className="hero-card tilt ratio-45">
              <img
                className="img-fill"
                src="/hero.png"
                alt="Pareja joven mostrando las llaves de su primera casa en Nueva Zelanda"
              />
            </div>
            <div className="hero-age">
              Para jóvenes de <b>24 a 40 años</b> 🇳🇿
            </div>
          </div>
        </div>

        <div className="hero-scroll">
          <span className="mouse"></span> Deslizá para ver la historia
        </div>
      </header>

      {/* ================= MARQUEE ================= */}
      <div className="marquee">
        <div className="marquee-track">
          <span>Tu futuro</span><span className="star">✦</span>
          <span>Tu hogar</span><span className="star">✦</span>
          <span>Tu decisión</span><span className="star">✦</span>
          <span>Tasas desde 2,25%</span><span className="star">✦</span>
          <span>Tu casa, en tu país</span><span className="star">✦</span>
          <span>Tu futuro</span><span className="star">✦</span>
          <span>Tu hogar</span><span className="star">✦</span>
          <span>Tu decisión</span><span className="star">✦</span>
          <span>Tasas desde 2,25%</span><span className="star">✦</span>
          <span>Tu casa, en tu país</span><span className="star">✦</span>
        </div>
      </div>

      {/* ================= EL PROBLEMA ================= */}
      <section className="problema section-pad" id="problema">
        <div className="container">
          <span className="kicker reveal">El problema</span>
          <h2 className="section-title reveal">
            La vivienda dejó de ser un derecho y se volvió <span className="hl">un privilegio</span>
          </h2>
          <p className="section-lead reveal">
            Una casa no es un lujo: es una necesidad básica que condiciona el trabajo, la educación
            y el bienestar de toda una sociedad. Sin embargo, en Nueva Zelanda se convirtió en uno
            de los bienes más inaccesibles del mundo desarrollado. Durante dos décadas los precios
            crecieron muchísimo más rápido que los salarios, y lo que antes era alcanzable para una
            familia de ingresos medios hoy es una meta casi imposible para las nuevas generaciones.
          </p>

          <div className="problema-grid">
            <div>
              <div className="stat-mega reveal">
                <span className="counter" data-target="45">0</span>
                <span className="pct">%</span>
              </div>
              <p className="stat-mega-label reveal">
                aumentaron los precios de las viviendas entre 2020 y 2022. La pandemia actuó como
                un acelerador brutal: tasas cercanas a cero, construcción paralizada y una espiral
                de expectativas que realimentó la suba. Uno de los incrementos más pronunciados del
                mundo.
              </p>
              <div className="stat-mega reveal" style={{ marginTop: 48 }}>
                <span className="counter" data-target="10">0</span>
                <span className="pct">+ años</span>
              </div>
              <p className="stat-mega-label reveal">
                de salario íntegro necesita una familia promedio para acceder a una vivienda propia
                en Auckland, una de las ciudades con peor accesibilidad habitacional del planeta.
              </p>
            </div>

            <div className="reveal">
              <img
                className="img-fill ratio-45"
                src="/el-problema.png"
                alt="Vista aérea de Auckland: cientos de casas apretadas entre el mar y las colinas"
                style={{ boxShadow: '0 30px 60px rgba(18,36,22,.25)' }}
              />
            </div>
          </div>

          <div className="causas">
            <h3 className="reveal">
              No fue una sola causa. Fue una tormenta perfecta que se retroalimentó durante décadas:
            </h3>
            <div className="causas-grid">
              <div className="causa-card tilt reveal">
                <div className="icon">🏗️</div>
                <h4>Oferta planchada</h4>
                <p>
                  Durante años se construyeron muy pocas viviendas en relación a lo que la
                  población demandaba. Zonificación estricta, burocracia lenta y escasez de
                  trabajadores calificados frenaron al sector.
                </p>
              </div>
              <div className="causa-card tilt reveal">
                <div className="icon">🗺️</div>
                <h4>Geografía acorralada</h4>
                <p>
                  Ciudades como Auckland están físicamente rodeadas por el agua y el terreno
                  montañoso: la expansión horizontal de la construcción tiene un límite natural.
                </p>
              </div>
              <div className="causa-card tilt reveal">
                <div className="icon">📈</div>
                <h4>Demanda imparable</h4>
                <p>
                  Crecimiento poblacional sostenido, migración internacional y tasas de interés
                  históricamente bajas que abarataron el crédito y dispararon una demanda que la
                  oferta nunca alcanzó.
                </p>
              </div>
              <div className="causa-card tilt reveal">
                <div className="icon">💸</div>
                <h4>Especulación inmobiliaria</h4>
                <p>
                  Las propiedades dejaron de ser hogares para convertirse en instrumentos de
                  inversión, inflando los precios por encima de lo que el mercado real justificaba.
                </p>
              </div>
            </div>
            <p className="section-lead reveal" style={{ marginTop: 50 }}>
              El resultado es una <strong>falla de mercado estructural</strong>: la vivienda tiene
              demanda altamente inelástica —la gente la necesita sin importar el precio, porque no
              existe sustituto para un techo— y el sistema de precios, por sí solo, fue incapaz de
              corregir el desequilibrio. Las intervenciones del Estado llegaron tarde y
              fragmentadas.
            </p>
          </div>
        </div>
      </section>

      {/* ================= CONSECUENCIAS ================= */}
      <section className="consecuencias" id="consecuencias">
        <div className="container">
          <span className="kicker reveal">Las consecuencias</span>
          <h2 className="section-title reveal" style={{ color: 'var(--cream)' }}>
            Cuando una casa es inalcanzable,{' '}
            <span style={{ color: 'var(--lime)' }}>todo lo demás se rompe</span>
          </h2>
          <p className="section-lead reveal">
            La crisis trasciende ampliamente el mercado inmobiliario. Afecta la equidad, la
            movilidad, el desarrollo y la cohesión de toda la sociedad neozelandesa.
          </p>

          <div className="conse-list">
            <div className="conse-item">
              <div className="conse-num">01</div>
              <div>
                <h4>Menos movilidad laboral</h4>
                <p>
                  Los trabajadores no pueden mudarse a donde hay empleo si no pueden pagar el
                  alojamiento. El mercado de trabajo se vuelve más rígido y menos eficiente.
                </p>
              </div>
              <div className="conse-icon">🚧</div>
            </div>
            <div className="conse-item">
              <div className="conse-num">02</div>
              <div>
                <h4>Ahorro familiar pulverizado</h4>
                <p>
                  Las familias destinan una proporción cada vez mayor de sus ingresos al alquiler o
                  a las cuotas hipotecarias, deteriorando su capacidad de ahorrar y proyectar.
                </p>
              </div>
              <div className="conse-icon">🪙</div>
            </div>
            <div className="conse-item">
              <div className="conse-num">03</div>
              <div>
                <h4>Desigualdad intergeneracional</h4>
                <p>
                  Quienes heredan propiedades acumulan un patrimonio creciente; quienes no, quedan
                  cada vez más rezagados. La brecha se profundiza generación tras generación.
                </p>
              </div>
              <div className="conse-icon">⚖️</div>
            </div>
            <div className="conse-item">
              <div className="conse-num">04</div>
              <div>
                <h4>Fuga de talentos a Australia</h4>
                <p>
                  Médicos, ingenieros, enfermeros, docentes y técnicos que el país formó se van en
                  busca de salarios más altos y viviendas más accesibles. Nueva Zelanda pierde el
                  capital humano que más necesita para sostener su desarrollo.
                </p>
              </div>
              <div className="conse-icon">✈️</div>
            </div>
          </div>

          <div className="reveal" style={{ marginTop: 70 }}>
            <img
              className="img-fill ratio-169"
              src="/consecuencias.png"
              alt="Joven profesional en el aeropuerto, partiendo hacia Australia"
              style={{ boxShadow: '0 30px 70px rgba(0,0,0,.45)' }}
            />
          </div>
        </div>
      </section>

      {/* ================= LA SOLUCIÓN ================= */}
      <section className="solucion section-pad" id="solucion">
        <div className="container">
          <div className="solucion-head">
            <span className="kicker reveal">La gran solución</span>
            <h2 className="section-title reveal">
              Llegó el <span className="hl">Plan Kiwi Joven</span>
            </h2>
            <p className="section-lead reveal" style={{ marginInline: 'auto' }}>
              Un programa impulsado por el Estado de Nueva Zelanda junto a los principales bancos
              del país, diseñado para el segmento que concentra la mayor demanda habitacional
              insatisfecha — y el mayor riesgo de emigración: los jóvenes de 24 a 40 años. Porque
              irse no puede ser la única opción.
            </p>
          </div>

          <div className="rate-showcase reveal">
            <span className="label">Tasa de interés preferencial anual</span>
            <div className="rate-big">
              <span id="rateCounter">8,00</span>
              <sup>%</sup>
            </div>
            <p className="cap">
              desde <b>2,25%</b> con un tope máximo garantizado del <b>4%</b> · cuotas accesibles y
              previsibles
            </p>
          </div>

          <div className="beneficios-grid">
            <div className="beneficio tilt reveal">
              <div className="icon">📉</div>
              <h4>Tasas que sí podés pagar</h4>
              <p>
                Interés preferencial desde 2,25% anual con tope del 4%, muy por debajo de las tasas
                hipotecarias elevadas que hoy expulsan a los jóvenes del mercado.
              </p>
            </div>
            <div className="beneficio tilt reveal">
              <div className="icon">📅</div>
              <h4>Cuotas previsibles</h4>
              <p>
                Esquema de pagos accesible y adaptado a la capacidad económica real del segmento
                joven, para que la cuota no se devore el ingreso.
              </p>
            </div>
            <div className="beneficio tilt reveal">
              <div className="icon">⚡</div>
              <h4>Trámites simplificados</h4>
              <p>
                La implementación se canaliza por los bancos participantes con procesos ágiles,
                escalando con la infraestructura financiera que ya existe.
              </p>
            </div>
            <div className="beneficio tilt reveal">
              <div className="icon">🌱</div>
              <h4>Arraigo, no éxodo</h4>
              <p>
                El plan no solo facilita el acceso a la vivienda: fomenta que la población joven
                construya su proyecto de vida en el territorio nacional.
              </p>
            </div>
          </div>

          <div className="bancos reveal">
            <h3>Con el respaldo del Estado y los bancos líderes de Nueva Zelanda</h3>
            <div className="bancos-row">
              <div className="banco-pill">ANZ</div>
              <div className="banco-pill">ASB</div>
              <div className="banco-pill">BNZ</div>
              <div className="banco-pill">Kiwibank</div>
            </div>
          </div>

          <div className="cta-final reveal">
            <div>
              <h2>
                <span className="script">El momento es ahora.</span> Tu casa, tu historia, nuestro
                apoyo.
              </h2>
              <p>
                ¿Y si tu próxima dirección fuera acá, y no en Sídney? Empezá hoy el camino a tu
                primera vivienda con el Plan Kiwi Joven y construí el futuro que siempre imaginaste
                — en tu país.
              </p>
              <a href="#" className="btn" style={{ marginTop: 28 }}>
                Quiero conocer el plan →
              </a>
            </div>
            <div className="cta-box">
              <img
                className="img-fill ratio-11"
                src="/cta.png"
                alt="Familia joven celebrando frente a su casa nueva"
                style={{ maxWidth: 380, boxShadow: '0 24px 50px rgba(14,42,20,.35)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="#inicio" className="nav-logo">
                <span className="kiwi-dot">🥝</span>
                <span>
                  PLAN <em>KIWI</em>
                </span>
              </a>
              <p>
                El programa del Estado de Nueva Zelanda y los bancos líderes del país para que los
                jóvenes de 24 a 40 años accedan a su primera vivienda.
              </p>
              <span className="footer-tagline">Tu futuro. Tu hogar. Tu decisión.</span>
            </div>
            <div>
              <h5>El plan</h5>
              <ul>
                <li><a href="#problema">El problema</a></li>
                <li><a href="#consecuencias">Consecuencias</a></li>
                <li><a href="#solucion">La solución</a></li>
                <li><Link href="/presentacion">🎬 Modo presentación</Link></li>
                <li><Link href="/chat">🤖 Preguntale a Kiwia</Link></li>
              </ul>
            </div>
            <div>
              <h5>Bancos participantes</h5>
              <ul>
                <li><a href="#">ANZ</a></li>
                <li><a href="#">ASB</a></li>
                <li><a href="#">BNZ</a></li>
                <li><a href="#">Kiwibank</a></li>
              </ul>
            </div>
            <div>
              <h5>Contacto</h5>
              <ul>
                <li><a href="#">plankiwijoven.co.nz</a></li>
                <li><a href="#">Preguntas frecuentes</a></li>
                <li><a href="#">Términos y condiciones</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>
              © 2026 Plan Kiwi Joven · Gobierno de Nueva Zelanda. Tasas variables y sujetas a
              aprobación crediticia.
            </span>
            <span>Trabajo Práctico · UADE — Battaglia · Jacofsky · Laurenzano · Quiroga</span>
          </div>
        </div>
      </footer>

      {/* Botón flotante al chatbot */}
      <Link href="/chat" className="chat-fab">
        <span className="dot" /> 💬 ¿Dudas? Preguntale a Kiwia
      </Link>
    </>
  );
}
