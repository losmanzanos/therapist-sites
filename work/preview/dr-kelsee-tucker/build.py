#!/usr/bin/env python3
"""Preview for Dr. Kelsee Tucker. Direction: her current site, done better.
Full-bleed golden-hour hero with the sunburst, centered rhythm, her photos
throughout, a live PSYPACT map, tap-to-open services, endorsement carousel."""
import os, json, io

ROOT = os.path.dirname(os.path.abspath(__file__))
BASE = "/work/preview/dr-kelsee-tucker/"
SITE = "https://drkelseetucker.com"
IMG = BASE + "img/"

exec(io.open(os.path.join(ROOT, "_states_block.py"), encoding="utf-8").read())

AB = {"Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA","Colorado":"CO","Connecticut":"CT","Delaware":"DE","District of Columbia":"DC","Florida":"FL","Georgia":"GA","Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC","North Dakota":"ND","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY"}

ENDORSE = [
 ("end-laren.jpg","Laren Conklin, Ph.D.","I worked with Dr. Tucker for multiple years. She is a wonderful clinician and is skilled in a variety of evidence-based treatment for couples and individuals. She is lovely to work with and is very caring and kind."),
 ("end-jenna.jpg","Jenna Renqvist, Ph.D.","Dr. Tucker is an experienced psychologist whose warm, genuine style and evidence-based approaches can help even the most disconnected partners reconnect. I highly recommend Dr. Tucker to anyone wishing to change their relationship for the better."),
 ("end-amanda.jpg","Amanda Shea, Ph.D.","I highly recommend Dr. Tucker for folks looking for an expert in couple and family therapy. She is kind, direct, and creative, using multiple therapy approaches to help couples and families heal from challenging problems and build deeper bonds."),
 ("end-4.jpg","Jessie Boone, LSW","I have heard nothing but fantastic things from Kelsee's clients. She has specialized knowledge for helping couples, veterans, and OCD clients. She is friendly, has a great sense of humor, and has a lot of experience in the field. Highly recommend!"),
 ("end-5.jpg","Derek Ream, Ph.D.","As a former colleague of mine, Dr. Tucker was such a delight to work with. She has a very warm and empathetic approach to her practice that was refreshing to work with. Also, she brings a wealth of experience to working with couples and individuals."),
]

CSS = r"""
:root{--cream:#faf4ed;--cream-2:#f3eadf;--gold:#cd8e33;--gold-deep:#a86f1f;--gold-pale:#e9c98a;--ink:#262320;--mute:#756d64;--rule:#e4d9c8;--night:#1f2320}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--cream);color:var(--ink);font-family:"Hanken Grotesk",system-ui,sans-serif;font-size:16.5px;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit}
img{display:block;max-width:100%}
h1,h2,h3{font-family:"Gilda Display",Georgia,serif;font-weight:400;margin:0;line-height:1.08}
.wrap{max-width:1180px;margin:0 auto;padding:0 clamp(18px,4vw,56px)}
.k{font-size:11.5px;letter-spacing:.3em;text-transform:uppercase;color:var(--gold-deep);margin:0 0 14px}
.center{text-align:center}
.btn{display:inline-block;font-size:12px;letter-spacing:.22em;text-transform:uppercase;background:var(--gold);color:#fff;padding:15px 26px;text-decoration:none;transition:background .2s}
.btn:hover{background:var(--gold-deep)}
.btn.ghost{background:transparent;color:#fff;border:1px solid rgba(255,255,255,.7)}
.btn.ghost:hover{background:#fff;color:var(--ink)}
.btn.dark{background:var(--ink)}.btn.dark:hover{background:#000}
/* top bar over hero */
.top{position:absolute;inset:0 0 auto 0;z-index:5;color:#fff}
.top .wrap{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:18px 0}
.top .brand{display:flex;align-items:center;gap:12px;text-decoration:none;font-family:"Gilda Display",serif;font-size:15px;letter-spacing:.16em;text-transform:uppercase}
.top .brand img{width:40px}
.top nav{display:flex;gap:26px;font-size:11.5px;letter-spacing:.22em;text-transform:uppercase}
.top nav a{text-decoration:none;opacity:.92}.top nav a:hover{opacity:1;text-decoration:underline;text-underline-offset:6px}
.top .btn{padding:12px 18px}
/* hero */
.hero{position:relative;min-height:100svh;display:grid;place-items:center;text-align:center;color:#fff;overflow:hidden;background:#3a2a16}
.hero img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 45%}
.hero:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(40,26,10,.38) 0%,rgba(40,26,10,.18) 40%,rgba(40,26,10,.58) 100%)}
.hero .in{position:relative;z-index:2;padding:120px 20px 80px;max-width:820px}
.hero .sun{width:clamp(120px,14vw,180px);margin:0 auto 18px;filter:brightness(0) invert(1) sepia(.5) saturate(3) hue-rotate(-10deg) brightness(1.15);animation:turn 140s linear infinite}
@keyframes turn{to{transform:rotate(360deg)}}
.hero .wm{font-family:"Gilda Display",serif;font-size:clamp(22px,2.6vw,34px);letter-spacing:.22em;text-transform:uppercase;line-height:1.1}
.hero .wm small{display:block;font-family:"Hanken Grotesk",sans-serif;font-size:12px;letter-spacing:.5em;color:#fff;opacity:.9;margin-top:8px;text-shadow:0 1px 10px rgba(0,0,0,.35)}
.hero h1{font-size:clamp(34px,5vw,66px);margin:38px auto 0;max-width:16ch;text-shadow:0 2px 24px rgba(0,0,0,.25)}
.hero p{max-width:50ch;margin:20px auto 0;font-size:clamp(16px,1.4vw,19px);color:#fbf3e6}
.hero .cta{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:30px}
.hero .down{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);z-index:2;font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#fff;text-decoration:none;opacity:.8}
/* facts arc */
.facts{background:var(--cream-2);border-bottom:1px solid var(--rule)}
.facts .wrap{display:grid;grid-template-columns:repeat(4,1fr)}
.facts div{padding:22px 18px;text-align:center;border-right:1px solid var(--rule);font-size:15px}
.facts div:last-child{border-right:0}
.facts b{display:block;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:4px;font-weight:600}
/* sections */
section{padding:88px 0}
.div{width:44px;margin:0 auto 22px;opacity:.9}
h2.t{font-size:clamp(32px,3.6vw,48px);max-width:18ch;margin:0 auto}
.lead{max-width:60ch;margin:18px auto 0;color:#4a443d}
/* intro with round portrait */
.intro .port{width:clamp(200px,24vw,300px);aspect-ratio:1;border-radius:50%;object-fit:cover;object-position:center 15%;margin:28px auto 0;box-shadow:0 0 0 10px var(--cream),0 0 0 11px var(--gold)}
.intro .two{display:grid;grid-template-columns:1fr 1fr;gap:40px;max-width:980px;margin:36px auto 0;text-align:left}
.intro .two p{margin:0 0 14px}
/* services: round photos that open */
.svc{background:var(--cream-2)}
.svc .row{display:grid;grid-template-columns:repeat(3,1fr);gap:32px;margin-top:44px}
.svc details{text-align:center}
.svc summary{list-style:none;cursor:pointer;outline:none}
.svc summary::-webkit-details-marker{display:none}
.svc summary img{width:clamp(150px,16vw,200px);aspect-ratio:1;border-radius:50%;object-fit:cover;margin:0 auto;transition:transform .35s,box-shadow .35s;box-shadow:0 0 0 0 var(--gold)}
.svc summary:hover img,.svc details[open] summary img{transform:scale(1.05);box-shadow:0 0 0 8px var(--cream-2),0 0 0 9px var(--gold)}
.svc summary h3{font-size:24px;margin:20px 0 4px}
.svc summary small{display:block;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold-deep)}
.svc .body{max-width:34ch;margin:16px auto 0;font-size:15.5px;color:#4a443d;animation:fade .4s}
@keyframes fade{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.svc .body a{display:inline-block;margin-top:8px;text-decoration:underline;text-underline-offset:4px}
/* methods strip */
.methods{display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid var(--rule);margin-top:44px;background:#fff}
.methods div{padding:28px 26px;border-right:1px solid var(--rule)}
.methods div:last-child{border-right:0}
.methods h3{font-size:22px;margin-bottom:8px}
.methods p{margin:0;font-size:15px;color:#4a443d}
/* map section */
.map{background:var(--night);color:#efe7da;position:relative;overflow:hidden}
.map .wrap{position:relative;z-index:2}
.map .k{color:var(--gold-pale)}
.map h2.t{color:#fff}
.map .lead{color:#c9c0b1}
.mapgrid{display:grid;grid-template-columns:7fr 5fr;gap:48px;align-items:center;margin-top:40px}
.usmap{width:100%;height:auto;display:block}
.usmap path{fill:#3a3f39;stroke:var(--night);stroke-width:1;cursor:pointer;transition:fill .2s}
.usmap path.yes{fill:#8c6a2a}.usmap path.page{fill:var(--gold)}
.usmap path.pending{fill:#5c5a3e}.usmap path.no{fill:#3a3f39}
.usmap path:hover,.usmap path.sel{fill:#fff}
.legend{display:flex;gap:18px;flex-wrap:wrap;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#c9c0b1;margin-top:12px}
.legend i{display:inline-block;width:12px;height:12px;margin-right:6px;vertical-align:-1px}
.panel{background:rgba(255,255,255,.04);border:1px solid rgba(239,231,218,.2);padding:26px}
.panel label{display:block;font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold-pale);margin-bottom:10px}
.checker-row{position:relative}
.panel input{width:100%;font:inherit;font-size:18px;padding:14px 16px;background:rgba(250,244,237,.06);border:1px solid rgba(239,231,218,.4);color:#fff;outline:none}
.panel input::placeholder{color:#a9a093}.panel input:focus{border-color:var(--gold-pale)}
.checker-list{position:absolute;left:0;right:0;top:100%;z-index:5;background:#fbf6ef;border:1px solid var(--rule);max-height:260px;overflow:auto}
.checker-list button{display:flex;justify-content:space-between;width:100%;text-align:left;font:inherit;font-size:16px;padding:11px 14px;background:none;border:0;border-bottom:1px solid var(--rule);color:var(--ink);cursor:pointer}
.checker-list button:hover{background:var(--cream-2)}
.checker-list button span{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-deep)}
#stateResult{margin:18px 0 0;font-size:16px;color:#efe7da;min-height:4.8em}
#stateResult strong{font-family:"Gilda Display",serif;font-weight:400;font-size:22px;display:block;margin-bottom:4px}
#stateResult a{color:#fff;text-decoration:underline;text-underline-offset:3px}
.own{margin-top:22px;font-size:14px;color:#c9c0b1}
.own a{color:#fff;text-decoration:none;border-bottom:1px solid rgba(255,255,255,.4);margin-right:14px;white-space:nowrap}
.own a:hover{border-color:#fff}
/* gold band */
.gold{background:var(--gold);color:#fff;padding:44px 0}
.gold .wrap{display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap}
.gold h2{font-size:clamp(22px,2.4vw,32px)}
.gold .btn{background:#fff;color:var(--gold-deep)}.gold .btn:hover{background:var(--cream)}
/* blog over photo */
.blog{position:relative;color:#fff;overflow:hidden;background:#2a2114}
.blog img.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center}
.blog:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(30,22,10,.35),rgba(30,22,10,.65))}
.blog .wrap{position:relative;z-index:2}
.blog .k{color:var(--gold-pale)}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;margin-top:36px}
.card{background:var(--cream);color:var(--ink);padding:28px;text-decoration:none;display:flex;flex-direction:column;gap:10px;min-height:220px;transition:transform .25s}
.card:hover{transform:translateY(-4px)}
.card h3{font-size:22px}
.card p{margin:0;color:#4a443d;font-size:15px;flex:1}
.card small{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--gold-deep)}
/* endorsements carousel */
.endo .track{position:relative;max-width:860px;margin:36px auto 0;min-height:300px}
.endo figure{margin:0;position:absolute;inset:0;opacity:0;transition:opacity .6s;pointer-events:none;text-align:center}
.endo figure.on{opacity:1;pointer-events:auto;position:relative}
.endo figure img{width:96px;height:96px;border-radius:50%;object-fit:cover;object-position:center top;margin:0 auto 20px;box-shadow:0 0 0 6px var(--cream),0 0 0 7px var(--gold)}
.endo blockquote{margin:0 auto;max-width:62ch;font-family:"Gilda Display",serif;font-size:clamp(19px,1.8vw,24px);line-height:1.45}
.endo figcaption{margin-top:16px;font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold-deep)}
.endo .dots{display:flex;justify-content:center;gap:10px;margin-top:26px}
.endo .dots button{width:10px;height:10px;border-radius:50%;border:1px solid var(--gold);background:transparent;padding:0;cursor:pointer}
.endo .dots button.on{background:var(--gold)}
.endo .arrows{display:flex;justify-content:center;gap:18px;margin-top:14px}
.endo .arrows button{font:inherit;font-size:12px;letter-spacing:.2em;text-transform:uppercase;background:none;border:0;color:var(--gold-deep);cursor:pointer}
/* photo band */
.band{position:relative;min-height:380px;overflow:hidden;display:grid;place-items:center;text-align:center;color:#fff}
.band img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 60%}
.band:after{content:"";position:absolute;inset:0;background:rgba(30,22,10,.35)}
.band .in{position:relative;z-index:2;padding:40px 20px;max-width:760px}
.band h2{font-size:clamp(30px,3.6vw,50px)}
/* footer */
footer{background:var(--night);color:#cfc8bb;padding:72px 0 36px;font-size:14.5px}
footer .head{display:flex;align-items:center;justify-content:space-between;gap:28px;padding-bottom:40px;border-bottom:1px solid rgba(255,255,255,.12);margin-bottom:44px}
footer .brand{display:flex;align-items:center;gap:18px;text-decoration:none;color:#fff}
footer .brand img{width:64px;filter:brightness(0) invert(1) sepia(.6) saturate(4) hue-rotate(-12deg) brightness(1.05)}
footer .brand span{font-family:"Gilda Display",serif;font-size:clamp(20px,2.2vw,28px);letter-spacing:.2em;text-transform:uppercase;line-height:1.15;display:block}
footer .brand small{display:block;font-family:"Hanken Grotesk",sans-serif;font-size:11px;letter-spacing:.45em;color:var(--gold-pale);margin-top:6px}
footer .cols{display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:36px}
footer b{color:#fff;display:block;margin-bottom:12px;font-weight:600;font-size:11px;letter-spacing:.26em;text-transform:uppercase}
footer ul{list-style:none;margin:0;padding:0}footer li{margin:7px 0}footer a{text-decoration:none;color:#cfc8bb}footer a:hover{color:var(--gold-pale)}
footer .addr a{color:#fff}
footer .vals{display:flex;justify-content:space-between;gap:14px;font-size:11px;letter-spacing:.42em;text-transform:uppercase;color:var(--gold-pale);padding-top:36px;margin-top:48px;border-top:1px solid rgba(255,255,255,.12)}
footer .vals span:before{content:"\2727";margin-right:10px;color:var(--gold)}
.crumb{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#fff;opacity:.85;margin:0 0 14px}.crumb a{text-decoration:none}
/* inner-page hero */
.hero.inner{min-height:72svh}
.hero.inner:after{background:linear-gradient(180deg,rgba(30,22,10,.5),rgba(30,22,10,.62))}
.hero.inner .in{padding-top:130px}
/* prose for state pages */
.prose{max-width:70ch;margin:0 auto}
.prose p{margin:0 0 18px}
.prose h3{font-size:26px;margin:32px 0 10px;text-align:center}
.spec{display:grid;grid-template-columns:repeat(2,1fr);gap:18px 40px;max-width:860px;margin:36px auto 0;border-top:1px solid var(--rule);padding-top:24px}
.spec dt{font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:4px}
.spec dd{margin:0}
@media (max-width:980px){.top nav{display:none}.facts .wrap{grid-template-columns:1fr 1fr}.facts div:nth-child(2){border-right:0}.intro .two,.mapgrid,.methods,.cards{grid-template-columns:1fr}.intro .two{gap:0}.methods div{border-right:0;border-bottom:1px solid var(--rule)}.svc .row{grid-template-columns:1fr;gap:40px}footer .cols{grid-template-columns:1fr 1fr}footer .vals{flex-wrap:wrap;justify-content:center;gap:12px 26px;letter-spacing:.3em}.spec{grid-template-columns:1fr}}
@media (max-width:640px){.top .brand span{display:none}.top .wrap{padding:14px 0}.top .btn{padding:11px 14px;font-size:10.5px;letter-spacing:.16em}.hero .in{padding:92px 18px 64px}.hero .sun{width:84px;margin-bottom:12px}.hero .wm{font-size:17px;letter-spacing:.18em}.hero .wm small{font-size:10px;letter-spacing:.4em;margin-top:5px}.hero h1{font-size:clamp(32px,9.5vw,40px);margin-top:22px}.hero p{font-size:15.5px;margin-top:14px}.hero .cta{margin-top:22px}.hero .down{display:none}footer .head{flex-direction:column;align-items:flex-start;gap:22px}footer .cols{grid-template-columns:1fr 1fr;gap:28px 20px}footer .cols>.addr{grid-column:1/-1;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.1)}footer .vals{display:grid;grid-template-columns:1fr 1fr;gap:14px;justify-items:start;letter-spacing:.3em}}
@media (max-height:840px) and (min-width:981px){.hero .in{padding:96px 20px 64px}.hero .sun{width:110px;margin-bottom:10px}.hero .wm{font-size:26px}.hero h1{font-size:50px;margin-top:22px}.hero p{margin-top:14px}.hero .cta{margin-top:22px}}
@media (max-height:520px) and (orientation:landscape){.top .brand span{display:none}.hero{min-height:auto}.hero .in{padding:76px 20px 48px}.hero .sun{width:64px;margin-bottom:8px}.hero .wm{font-size:16px}.hero h1{font-size:32px;margin-top:14px;max-width:26ch}.hero p{margin-top:10px}.hero .cta{margin-top:16px}.hero .down{display:none}}
"""

FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Gilda+Display&family=Hanken+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">'

def checker_data():
    pages = {s[1]: f"{BASE}online-couples-therapy/{s[0]}/" for s in STATES}
    data = []
    for n in MEMBERS: data.append({"n":n,"ab":AB.get(n,""),"s":"page" if n in pages else "yes","u":pages.get(n,"")})
    for n,d in PENDING.items(): data.append({"n":n,"ab":AB.get(n,""),"s":"pending","d":d})
    for n in NONMEMBERS: data.append({"n":n,"ab":AB.get(n,""),"s":"no"})
    return data

def map_section(kicker="Online, in 40+ states", title="Licensed to see you across the country.", lead="PSYPACT lets a psychologist licensed in one member state practice by video in the others. Tap your state on the map, or type it. You have to be physically in a member state when we meet. That's the only rule."):
    return f"""
<section class="map" id="states"><div class="wrap">
 <div class="center"><p class="k">{kicker}</p><h2 class="t">{title}</h2><p class="lead">{lead}</p></div>
 <div class="mapgrid">
  <div>
   <svg class="usmap" viewBox="0 0 975 610" aria-label="Map of PSYPACT states" role="img"></svg>
   <div class="legend"><span><i style="background:var(--gold)"></i>Own page</span><span><i style="background:#8c6a2a"></i>Member</span><span><i style="background:#5c5a3e"></i>Joining</span><span><i style="background:#3a3f39"></i>Not yet</span></div>
  </div>
  <div class="panel checker">
   <label for="stateInput">Or type your state</label>
   <div class="checker-row"><input id="stateInput" type="text" placeholder="Illinois, Texas, Georgia..." autocomplete="off"><div id="stateList" class="checker-list" hidden></div></div>
   <p id="stateResult" aria-live="polite">Tap a state on the map or start typing.</p>
   <div class="own">Own page: {' '.join(f'<a href="{BASE}online-couples-therapy/{s[0]}/">{s[1]}</a>' for s in STATES)}</div>
  </div>
 </div>
</div>
<script src="{BASE}map-data.js"></script>
<script>
(function(){{
 const D={json.dumps(checker_data())};
 const byAb={{}}; D.forEach(x=>{{if(x.ab)byAb[x.ab]=x}});
 const svg=document.querySelector('.usmap'),inp=document.getElementById('stateInput'),list=document.getElementById('stateList'),out=document.getElementById('stateResult');
 function msg(x){{
  if(x.s==='page') return '<strong>'+x.n+'</strong>Yes. There is a page just for '+x.n+' couples: <a href="'+x.u+'">online couples therapy in '+x.n+'</a>.';
  if(x.s==='yes') return '<strong>'+x.n+'</strong>Yes. '+x.n+' is a PSYPACT member, so we can meet by video as long as you are both in the state at session time. <a href="{SITE}/contact-us/">Book a free consult</a>.';
  if(x.s==='pending') return '<strong>'+x.n+'</strong>Not yet. '+x.n+' has passed PSYPACT and joins in '+x.d+'. Reach out closer to then.';
  return '<strong>'+x.n+'</strong>Not yet. '+x.n+' has not joined PSYPACT, so I cannot see you by video there. If you travel to a member state, we can meet while you are there.';
 }}
 function select(x){{ out.innerHTML=msg(x); inp.value=x.n; list.hidden=true; svg.querySelectorAll('path').forEach(p=>p.classList.toggle('sel',p.dataset.ab===x.ab)); }}
 if(window.US_STATES){{ const ns='http://www.w3.org/2000/svg';
  window.US_STATES.forEach(st=>{{const p=document.createElementNS(ns,'path');p.setAttribute('d',st.d);p.dataset.ab=st.ab;const x=byAb[st.ab];p.classList.add(x?x.s:'no');const t=document.createElementNS(ns,'title');t.textContent=st.name;p.appendChild(t);p.addEventListener('click',()=>{{if(x)select(x)}});svg.appendChild(p)}}); }}
 function render(q){{ const v=q.trim().toLowerCase(); if(!v){{list.hidden=true;return}}
  const hits=D.filter(x=>x.n.toLowerCase().includes(v)).slice(0,8);
  list.innerHTML=hits.map(x=>'<button type="button" data-n="'+x.n+'">'+x.n+'<span>'+(x.s==='page'?'own page':x.s==='yes'?'member':x.s==='pending'?'joins '+x.d:'not a member')+'</span></button>').join('');
  list.hidden=!hits.length; const exact=hits.find(x=>x.n.toLowerCase()===v); if(exact) select(exact); }}
 inp.addEventListener('input',e=>render(e.target.value)); inp.addEventListener('focus',e=>render(e.target.value));
 list.addEventListener('click',e=>{{const b=e.target.closest('button');if(!b)return;select(D.find(y=>y.n===b.dataset.n))}});
 document.addEventListener('click',e=>{{if(!e.target.closest('.checker'))list.hidden=true}});
}})();
</script>
</section>"""

def endorsements():
    figs = "".join(f'<figure class="{"on" if i==0 else ""}"><img src="{IMG}{p}" alt=""><blockquote>{q}</blockquote><figcaption>{n}</figcaption></figure>' for i,(p,n,q) in enumerate(ENDORSE))
    dots = "".join(f'<button type="button" aria-label="Endorsement {i+1}" class="{"on" if i==0 else ""}"></button>' for i in range(len(ENDORSE)))
    return f"""
<section class="endo"><div class="wrap center">
 <img class="div" src="{IMG}mark.png" alt=""><p class="k">Endorsements</p><h2 class="t">From the clinicians who refer to her.</h2>
 <div class="track">{figs}</div>
 <div class="dots">{dots}</div>
 <div class="arrows"><button type="button" data-d="-1">Previous</button><button type="button" data-d="1">Next</button></div>
</div>
<script>
(function(){{const f=[...document.querySelectorAll('.endo figure')],d=[...document.querySelectorAll('.endo .dots button')];let i=0,t;
function go(n){{i=(n+f.length)%f.length;f.forEach((x,j)=>x.classList.toggle('on',j===i));d.forEach((x,j)=>x.classList.toggle('on',j===i));clearTimeout(t);t=setTimeout(()=>go(i+1),7000)}}
d.forEach((b,j)=>b.addEventListener('click',()=>go(j)));document.querySelectorAll('.endo .arrows button').forEach(b=>b.addEventListener('click',()=>go(i+ +b.dataset.d)));t=setTimeout(()=>go(1),7000)}})();
</script>
</section>"""

def topbar():
    return f"""<div class="top"><div class="wrap">
 <a class="brand" href="{BASE}"><img src="{IMG}mark.png" alt=""><span>Kelsee Tucker, Ph.D.</span></a>
 <nav><a href="{BASE}#couples">Couples</a><a href="{BASE}#states">Online, by state</a><a href="{SITE}/about-us/">About</a><a href="{SITE}/rates/">Rates</a><a href="{SITE}/blogs/">Blog</a></nav>
 <a class="btn" href="{SITE}/contact-us/">Free 15 min consult</a>
</div></div>"""

def footer():
    return f"""<footer><div class="wrap">
 <div class="head">
  <a class="brand" href="{BASE}"><img src="{IMG}mark.png" alt=""><span>Kelsee Tucker, Ph.D.<small>Counseling</small></span></a>
  <a class="btn" href="{SITE}/contact-us/">Free 15 min consult</a>
 </div>
 <div class="cols">
 <div class="addr"><b>Visit or call</b>Elevate Offices<br>7230 Arbuckle Commons, Suite 241<br>Brownsburg, IN 46112<br><br><a href="tel:+13172140774">317-214-0774</a><br><a href="mailto:kelsee@drtuckercounseling.com">kelsee@drtuckercounseling.com</a><br><br>Licensed psychologist. Online in 40+ PSYPACT states (APIT/E.Passport Mobility #16033).</div>
 <div><b>Couples</b><ul><li><a href="{SITE}/couples-therapy/">Couples therapy</a></li><li><a href="{SITE}/couples-therapy/">Premarital</a></li><li><a href="{SITE}/couples-therapy/">Affair recovery</a></li><li><a href="{SITE}/couples-therapy/">Discernment counseling</a></li><li><a href="{SITE}/couples-therapy/">Intensives</a></li></ul></div>
 <div><b>Online by state</b><ul>{''.join(f'<li><a href="{BASE}online-couples-therapy/{s[0]}/">{s[1]}</a></li>' for s in STATES)}<li><a href="{BASE}online-couples-therapy/">All states</a></li></ul></div>
 <div><b>Practice</b><ul><li><a href="{SITE}/about-us/">About Dr. Tucker</a></li><li><a href="{SITE}/rates/">Rates and insurance</a></li><li><a href="{SITE}/individual-therapy/">Individual therapy</a></li><li><a href="{SITE}/family-therapy/">Family therapy</a></li><li><a href="{SITE}/contact-us/">Contact</a></li></ul></div>
 </div>
 <div class="vals"><span>Renewal</span><span>Hope</span><span>Healing</span><span>Clarity</span></div>
</div></footer>"""

def page(title, desc, body, ld=None):
    ldtag = f'<script type="application/ld+json">{json.dumps(ld)}</script>' if ld else ""
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>{title}</title><meta name="description" content="{desc}">{FONTS}<style>{CSS}</style>{ldtag}</head>
<body>{body}{footer()}</body></html>"""

def write(rel, html):
    p = os.path.join(ROOT, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, "w", encoding="utf-8").write(html)

# ---------------- HOME ----------------
home = f"""
<header class="hero">
 <img class="bg" src="{IMG}hero-couple.jpg" alt="">
 {topbar()}
 <div class="in">
  <img class="sun" src="{IMG}mark.png" alt="">
  <div class="wm">Kelsee Tucker, Ph.D.<small>Counseling</small></div>
  <h1>Healing hearts, deepening connections.</h1>
  <p>Couples therapy with a licensed psychologist. In person in Brownsburg, Indiana, and by video in 40+ states.</p>
  <div class="cta"><a class="btn" href="{SITE}/contact-us/">Free 15 minute consult</a><a class="btn ghost" href="#states">Is my state covered?</a></div>
 </div>
 <a class="down" href="#start">Scroll</a>
</header>
<div class="facts"><div class="wrap">
 <div><b>In person</b>Elevate Offices, Brownsburg</div>
 <div><b>Online</b>40+ states under PSYPACT</div>
 <div><b>Sessions</b>$350 for 55 min, $525 for 90</div>
 <div><b>First step</b>A free 15 minute call</div>
</div></div>

<section class="intro center" id="start"><div class="wrap">
 <img class="div" src="{IMG}mark.png" alt=""><p class="k">Healing starts here</p>
 <h2 class="t">Hi, I'm Dr. Tucker. I work with couples, almost exclusively.</h2>
 <img class="port" src="{IMG}kelsee-portrait.jpg" alt="Dr. Kelsee Tucker">
 <div class="two">
  <div><p>I'm a licensed psychologist and relationship specialist. Every couple that walks in has a pattern. One pursues, one withdraws. One keeps score, one goes quiet. By the second session I can usually name it, and naming it is the first thing that changes.</p><p>From there, the method depends on you: Emotionally Focused Therapy, the Gottman Method, or Integrative Behavioral Couples Therapy. All three have real evidence behind them. I'll explain the choice in plain language.</p></div>
  <div><p>I practiced in Columbus, Ohio, before moving the practice to Indiana, and many of my Ohio couples came with me by video. Under PSYPACT I can see couples in 40+ states, and I do.</p><p>I don't take insurance, on purpose. It keeps your records yours and our work free of someone else's session limits. You get a superbill after every session, and most PPO plans reimburse about half.</p><p><a href="{SITE}/about-us/">More about me</a></p></div>
 </div>
</div></section>

<section class="svc" id="couples"><div class="wrap center">
 <img class="div" src="{IMG}mark.png" alt=""><p class="k">Specialties</p><h2 class="t">Tap one to see how the work goes.</h2>
 <div class="row">
  <details open><summary><img src="{IMG}svc-couples.jpg" alt=""><h3>Couples therapy</h3><small>The specialty</small></summary><div class="body">Weekly or every other week, 55 or 90 minutes. Premarital, affair recovery, discernment counseling for couples where one person is leaning out, and half or full day intensives for couples who travel in.<br><a href="{SITE}/couples-therapy/">Couples therapy</a></div></details>
  <details><summary><img src="{IMG}svc-individual.jpg" alt=""><h3>Individual therapy</h3><small>Adults</small></summary><div class="body">Often one partner from couples work, or someone whose relationship is the thing they want to understand. Anxiety, loss, life transitions, and the patterns you keep repeating.<br><a href="{SITE}/individual-therapy/">Individual therapy</a></div></details>
  <details><summary><img src="{IMG}svc-family.jpg" alt=""><h3>Family therapy</h3><small>Parents and adult children</small></summary><div class="body">For families where the same argument has been running for years. Structured, direct, and focused on the two or three changes that would matter most.<br><a href="{SITE}/family-therapy/">Family therapy</a></div></details>
 </div>
 <div class="methods">
  <div><h3>Emotionally Focused Therapy</h3><p>For couples whose fights are really about whether the other person will be there.</p></div>
  <div><h3>The Gottman Method</h3><p>For couples who need to learn to argue without damage.</p></div>
  <div><h3>IBCT</h3><p>For couples who've spent a decade trying to change each other and are ready to try acceptance.</p></div>
 </div>
</div></section>

{map_section()}

<section class="gold"><div class="wrap"><h2>Ready to get started? Schedule a free 15 minute consult or your first session.</h2><a class="btn" href="{SITE}/contact-us/">Let's connect</a></div></section>

<section class="blog"><img class="bg" src="{IMG}lily.jpg" alt=""><div class="wrap">
 <p class="k">From the blog</p><h2 class="t" style="color:#fff">Writing on couples, anxiety and the work.</h2>
 <div class="cards">
  <a class="card" href="{SITE}/blogs/"><small>Couples</small><h3>Why most couples wait six years too long to call</h3><p>The average couple is unhappy for six years before the first appointment. What that costs, and why the first call is easier than it looks.</p></a>
  <a class="card" href="{SITE}/overcoming-depression-empowering-strategies-for-renewed-hope/"><small>Mood</small><h3>Overcoming depression: strategies for renewed hope</h3><p>What tends to help, what tends not to, and when it's time to bring a partner into the room.</p></a>
  <a class="card" href="{SITE}/blogs/"><small>Anxiety</small><h3>Practical strategies for finding calm</h3><p>A short, honest list. No breathing app required.</p></a>
 </div>
</div></section>

{endorsements()}

<div class="band"><img src="{IMG}sunrise-field.jpg" alt=""><div class="in"><h2>If you're reading this together, that's already a good sign.</h2><p style="margin:18px 0 26px;font-size:18px">Start with a free 15 minute call. We'll talk about what's going on, whether I'm the right fit, and whether in person or video makes more sense.</p><a class="btn" href="{SITE}/contact-us/">Book the call</a></div></div>
"""
home_ld = {"@context":"https://schema.org","@type":["Psychologist","MedicalBusiness"],"name":"Kelsee Tucker, PhD","url":SITE+"/","telephone":"+1-317-214-0774","address":{"@type":"PostalAddress","streetAddress":"7230 Arbuckle Commons Ste 241","addressLocality":"Brownsburg","addressRegion":"IN","postalCode":"46112","addressCountry":"US"},"geo":{"@type":"GeoCoordinates","latitude":39.8489,"longitude":-86.3974},"areaServed":["Brownsburg IN","Indianapolis IN"]+[s[1] for s in STATES],"priceRange":"$350 per 55 minute session","founder":{"@type":"Person","name":"Kelsee Tucker","honorificSuffix":"PhD","jobTitle":"Licensed Psychologist"}}
write("index.html", page("Couples Therapy in Brownsburg, IN and Online in 40+ States | Kelsee Tucker, PhD",
 "Dr. Kelsee Tucker is a licensed psychologist specializing in couples therapy (EFT, Gottman, IBCT). In person near Indianapolis and online in 40+ PSYPACT states. Private pay, superbills provided.", home, home_ld))

# ---------------- HUB ----------------
hub = f"""
<header class="hero inner">
 <img class="bg" src="{IMG}couple-dusk.jpg" alt="">
 {topbar()}
 <div class="in">
  <p class="crumb"><a href="{BASE}">Home</a> / Online couples therapy</p>
  <h1>Couples therapy by video, with a psychologist, in 40+ states.</h1>
  <p>Under PSYPACT, a psychologist licensed in one member state can see clients by video in every other member state. I'm licensed in Indiana and hold the compact's APIT/E.Passport credential (Mobility #16033). The one rule: you and your partner both have to be physically in a participating state at the time of the session.</p>
 </div>
</header>
{map_section("Check your state","Is video an option where you are?","Tap the map or type your state. The answer covers all 44 PSYPACT jurisdictions, the two that join next, and the ones that have not joined.")}
<section><div class="wrap center">
 <img class="div" src="{IMG}mark.png" alt=""><p class="k">States with their own page</p><h2 class="t">Start with yours.</h2>
 <div class="cards">{''.join(f'<a class="card" href="{BASE}online-couples-therapy/{s[0]}/" style="background:var(--cream-2)"><small>{s[3]} time</small><h3>{s[1]}</h3><p>{s[2]}</p></a>' for s in STATES)}</div>
</div></section>
<section style="background:var(--cream-2)"><div class="wrap">
 <div class="prose">
  <h3>Every participating state</h3>
  <p>Alabama, Alaska, Arizona, Arkansas, Colorado, Connecticut, Delaware, District of Columbia, Florida, Georgia, Idaho, Illinois, Indiana, Kansas, Kentucky, Maine, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Hampshire, New Jersey, North Carolina, North Dakota, Ohio, Oklahoma, Pennsylvania, Rhode Island, South Carolina, South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming, and the Northern Mariana Islands.</p>
  <p>Not yet: California, New York, Massachusetts, Oregon, Hawaii and New Mexico. Iowa joins in July 2027 and Louisiana in January 2028. Membership changes; I check the compact's map before every new-state intake.</p>
  <h3>How a video session works</h3>
  <p>We meet on a secure, HIPAA-compliant video platform. You can be in the same room or in two different places, as long as both places are in a member state. Sessions are 55 or 90 minutes, same as in person, and the fee is the same: $350 and $525. Superbills go out after each session for out-of-network reimbursement.</p>
  <h3>When in person makes more sense</h3>
  <p>Some couples do better in a room, and intensives are almost always in person. My office is at Elevate Offices in Brownsburg, Indiana, twenty minutes west of downtown Indianapolis. Couples travel in for half-day and full-day intensives from across the Midwest.</p>
 </div>
</div></section>
<div class="band"><img src="{IMG}rooftop.jpg" alt=""><div class="in"><h2>Not sure if your state counts? Ask. It takes thirty seconds.</h2><p style="margin:18px 0 26px;font-size:18px">Tell me where you are and what's going on. I'll tell you whether we can work together and how.</p><a class="btn" href="{SITE}/contact-us/">Free 15 minute consult</a></div></div>
"""
write("online-couples-therapy/index.html", page("Online Couples Therapy in 40+ States (PSYPACT) | Kelsee Tucker, PhD",
 "Video couples therapy with a licensed psychologist, available in 40+ PSYPACT states. EFT, Gottman Method and IBCT. $350 per session, superbills provided.", hub))

# ---------------- STATE PAGES ----------------
HEROES = ["sunrise-field.jpg","rooftop.jpg","couple-dusk.jpg","lily.jpg","bonsai.jpg","kelsee-boardwalk.jpg"]
for i,(slug, name, metros, tz, offset, h1, lede, paras, ins) in enumerate(STATES):
    body = f"""
<header class="hero inner">
 <img class="bg" src="{IMG}{HEROES[i%len(HEROES)]}" alt="">
 {topbar()}
 <div class="in">
  <p class="crumb"><a href="{BASE}">Home</a> / <a href="{BASE}online-couples-therapy/">Online couples therapy</a> / {name}</p>
  <h1>{h1}</h1>
  <p>{lede}</p>
  <div class="cta"><a class="btn" href="{SITE}/contact-us/">Free 15 minute consult</a><a class="btn ghost" href="{BASE}online-couples-therapy/">How PSYPACT works</a></div>
 </div>
</header>
<div class="facts"><div class="wrap">
 <div><b>Where</b>{metros}</div>
 <div><b>Time zone</b>{tz}, {offset}</div>
 <div><b>Format</b>Secure video, 55 or 90 minutes</div>
 <div><b>Fee</b>$350 / $525, superbill provided</div>
</div></div>
<section><div class="wrap">
 <div class="center"><img class="div" src="{IMG}mark.png" alt=""><p class="k">Working with {name} couples</p><h2 class="t">What's different about doing this from {name}.</h2></div>
 <div class="prose" style="margin-top:30px">
  <p>{paras[0]}</p>
  <p>{paras[1]}</p>
  <h3>Insurance and reimbursement in {name}</h3>
  <p>I'm a private-pay practice. {ins} FSA and HSA cards work for the full fee.</p>
  <h3>The methods</h3>
  <p>Emotionally Focused Therapy, the Gottman Method and Integrative Behavioral Couples Therapy. Which one we use depends on your pattern, and I'll explain the choice in plain language in the first two sessions. <a href="{BASE}#couples">More on how I work with couples</a>.</p>
 </div>
 <dl class="spec">
  <div><dt>The one rule</dt><dd>You both have to be in {name}, or another PSYPACT state, when the session starts.</dd></div>
  <div><dt>Credential</dt><dd>APIT / E.Passport, Mobility #16033, home license Indiana</dd></div>
  <div><dt>Platform</dt><dd>HIPAA-compliant video, link sent before each session</dd></div>
  <div><dt>Evening slots</dt><dd>Held weekly for {tz} time couples</dd></div>
 </dl>
</div></section>
<section class="intro center" style="background:var(--cream-2)"><div class="wrap">
 <img class="port" src="{IMG}kelsee-portrait.jpg" alt="Dr. Kelsee Tucker" style="margin-top:0;box-shadow:0 0 0 10px var(--cream-2),0 0 0 11px var(--gold)">
 <h2 class="t" style="margin-top:28px">Dr. Kelsee Tucker</h2>
 <p class="lead">Licensed psychologist, couples specialist. Brownsburg, Indiana, and online wherever PSYPACT reaches.</p>
 <p style="margin-top:22px"><a class="btn dark" href="{SITE}/about-us/">About Dr. Tucker</a></p>
</div></section>
<div class="band"><img src="{IMG}{HEROES[(i+2)%len(HEROES)]}" alt=""><div class="in"><h2>Ready to stop having the same fight in {metros.split(',')[0]}?</h2><p style="margin:18px 0 26px;font-size:18px">We'll confirm you're in a member state, talk through what's going on, and pick a time that works on {tz} time.</p><a class="btn" href="{SITE}/contact-us/">Book the call</a></div></div>
"""
    ld = {"@context":"https://schema.org","@type":"MedicalWebPage","name":f"Online Couples Therapy in {name}","url":f"{SITE}/online-couples-therapy/{slug}/","about":{"@type":"MedicalTherapy","name":"Couples therapy"},"provider":{"@type":"Psychologist","name":"Kelsee Tucker, PhD","url":SITE+"/"},"areaServed":{"@type":"State","name":name}}
    write(f"online-couples-therapy/{slug}/index.html", page(f"Online Couples Therapy in {name} | Kelsee Tucker, PhD, Psychologist",
      f"Video couples therapy for {name} couples ({metros}) with a licensed psychologist under PSYPACT. EFT, Gottman and IBCT. Evening sessions on {tz} time.", body, ld))
print("built")
