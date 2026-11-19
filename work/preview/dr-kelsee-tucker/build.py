#!/usr/bin/env python3
"""Preview for Dr. Kelsee Tucker: homepage concept, online couples therapy hub, six state pages."""
import os, json, io

ROOT = os.path.dirname(os.path.abspath(__file__))
BASE = "/work/preview/dr-kelsee-tucker/"
SITE = "https://drkelseetucker.com"

CSS = r"""
:root{--cream:#faf4ed;--cream-2:#f3eadf;--gold:#cd8e33;--gold-deep:#a86f1f;--ink:#262320;--mute:#7a716a;--olive:#2f3a2d;--olive-2:#3d4a39;--rule:#e2d7c6}
*{box-sizing:border-box}
body{margin:0;background:var(--cream);color:var(--ink);font-family:"Hanken Grotesk",system-ui,sans-serif;font-size:16.5px;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit}
img{display:block;max-width:100%}
h1,h2,h3,blockquote{font-family:"Gilda Display",Georgia,serif;font-weight:400;margin:0;line-height:1.05;letter-spacing:.005em}
.wrap{max-width:1280px;margin:0 auto;padding:0 clamp(18px,4vw,56px)}
.note{background:#fff5c2;border-bottom:1px solid #e6d98a;font-size:13px;padding:8px 0;color:#5a4d00}
header.site{border-bottom:1px solid var(--rule);background:var(--cream)}
.nav{display:flex;align-items:center;justify-content:space-between;gap:28px;padding:16px 0}
.brand{display:flex;align-items:center;gap:14px;text-decoration:none}
.brand img{width:54px;height:auto}
.brand span{font-family:"Gilda Display",serif;font-size:19px;letter-spacing:.12em;text-transform:uppercase;line-height:1.1}
.brand span small{display:block;font-family:"Hanken Grotesk",sans-serif;font-size:11px;letter-spacing:.34em;color:var(--gold-deep);margin-top:4px}
nav ul{list-style:none;margin:0;padding:0;display:flex;gap:26px;font-size:12.5px;letter-spacing:.16em;text-transform:uppercase}
nav a{text-decoration:none}nav a:hover{color:var(--gold-deep)}
.btn{display:inline-block;font-size:12.5px;letter-spacing:.16em;text-transform:uppercase;background:var(--gold);color:#fff;padding:14px 22px;text-decoration:none}
.btn:hover{background:var(--gold-deep)}
.btn.line{background:transparent;color:var(--ink);border:1px solid var(--ink)}
.btn.line:hover{background:var(--ink);color:var(--cream)}
.kicker{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--gold-deep);margin:0 0 18px}
section{padding:88px 0}
.grid{display:grid;grid-template-columns:5fr 7fr;gap:64px;align-items:start}
.grid h2{font-size:clamp(34px,3.8vw,54px);max-width:13ch}
.prose p{margin:0 0 18px;max-width:62ch}
.prose h3{font-size:28px;margin:34px 0 10px}
/* hero: photo right, cream left with the sunburst */
.hero{position:relative;display:grid;grid-template-columns:1fr 1fr;min-height:88svh;overflow:hidden;background:var(--cream)}
.hero .copy{position:relative;z-index:2;padding:clamp(40px,6vw,96px) clamp(18px,4vw,56px) clamp(40px,6vw,96px) max(clamp(18px,4vw,56px),calc((100vw - 1280px)/2 + 56px));display:flex;flex-direction:column;justify-content:center}
.hero .mark{position:absolute;left:-120px;top:-140px;width:560px;opacity:.10;pointer-events:none}
.hero h1{font-size:clamp(40px,4.6vw,66px);max-width:12ch;position:relative}
.hero .lede{font-size:clamp(17px,1.4vw,19px);max-width:42ch;margin:26px 0 0;color:#4a443d}
.hero .cta{display:flex;gap:18px;align-items:center;margin-top:32px;flex-wrap:wrap}
.hero .photo{position:relative;min-height:520px}
.hero .photo img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:62% 50%}
.hero .photo:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,var(--cream) 0%,rgba(250,244,237,0) 18%)}
.hero .tag{position:absolute;z-index:2;right:clamp(18px,4vw,56px);bottom:28px;background:rgba(38,35,32,.72);color:#f6eee2;font-size:12px;letter-spacing:.16em;text-transform:uppercase;padding:10px 14px}
.facts{border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);background:var(--cream-2)}
.facts .wrap{display:grid;grid-template-columns:repeat(4,1fr)}
.facts div{padding:20px 20px 20px 0;border-right:1px solid var(--rule);font-size:15px}
.facts div+div{padding-left:20px}.facts div:last-child{border-right:0}
.facts b{display:block;font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-deep);margin-bottom:4px}
/* methods list */
.list{list-style:none;margin:0;padding:0;border-top:1px solid var(--rule)}
.list li{border-bottom:1px solid var(--rule);padding:20px 0 20px 34px;position:relative;display:grid;grid-template-columns:1fr auto;gap:16px;align-items:baseline}
.list li:before{content:"";position:absolute;left:0;top:30px;width:14px;height:14px;background:url(IMGBASEmark.png) center/contain no-repeat}
.list a{font-family:"Gilda Display",serif;font-size:26px;text-decoration:none}.list a:hover{color:var(--gold-deep)}
.list small{color:var(--mute);font-size:12px;letter-spacing:.14em;text-transform:uppercase}
.list p{grid-column:1/-1;margin:4px 0 0;color:var(--mute);font-size:15px;max-width:60ch}
/* online band: dusk photo */
.dark{position:relative;background:var(--olive);color:#efe7da;overflow:hidden}
.dark .bgimg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.42}
.dark:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(47,58,45,.96) 0%,rgba(47,58,45,.75) 55%,rgba(47,58,45,.35) 100%)}
.dark .wrap{position:relative;z-index:2}
.dark .kicker{color:#e3b76a}.dark a{color:#fff}.dark h2{color:#fff}
.states{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:0 36px;border-top:1px solid rgba(239,231,218,.3)}
.states li{border-bottom:1px solid rgba(239,231,218,.3);padding:14px 0;display:flex;justify-content:space-between;gap:10px;font-size:15px}
.states li a{text-decoration:none;font-family:"Gilda Display",serif;font-size:19px}.states li a:hover{color:#e3b76a}
.states li span{color:#c9c0b1;font-size:12px;letter-spacing:.12em;text-transform:uppercase}

.checker label{display:block;font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#e3b76a;margin-bottom:10px}
.checker-row{position:relative;max-width:520px}
.checker input{width:100%;font:inherit;font-size:18px;padding:14px 16px;background:rgba(250,244,237,.08);border:1px solid rgba(239,231,218,.45);color:#fff;outline:none}
.checker input::placeholder{color:#b9b0a1}
.checker input:focus{border-color:#e3b76a}
.checker-list{position:absolute;left:0;right:0;top:100%;z-index:5;background:#fbf6ef;border:1px solid var(--rule);max-height:300px;overflow:auto}
.checker-list button{display:flex;justify-content:space-between;width:100%;text-align:left;font:inherit;font-size:16px;padding:11px 14px;background:none;border:0;border-bottom:1px solid var(--rule);color:var(--ink);cursor:pointer}
.checker-list button:hover{background:var(--cream-2)}
.checker-list button span{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold-deep)}
.checker-result{margin:18px 0 0;max-width:56ch;font-size:16px;color:#efe7da;min-height:3.2em}
.checker-result a{color:#fff;text-decoration:underline;text-underline-offset:3px}
.own{margin:34px 0 0}
.own p{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#e3b76a;margin:0 0 10px}
.own ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px 22px}
.own a{font-family:"Gilda Display",serif;font-size:19px;text-decoration:none;border-bottom:1px solid rgba(239,231,218,.4)}
.own a:hover{color:#e3b76a;border-color:#e3b76a}

/* about: portrait left */
.about .wrap{display:grid;grid-template-columns:4fr 8fr;gap:64px;align-items:center}
.about figure{margin:0;position:relative}
.about figure img{aspect-ratio:3/4;object-fit:cover;object-position:center 20%;width:100%}
.about figure:after{content:"";position:absolute;right:-18px;bottom:-18px;width:55%;height:55%;border:1px solid var(--gold);z-index:-1}
.about h2{font-size:clamp(34px,3.8vw,54px);max-width:14ch;margin-bottom:18px}
/* gold band */
.gold{background:var(--gold);color:#fff;padding:56px 0}
.gold .wrap{display:grid;grid-template-columns:1fr auto;gap:32px;align-items:center}
.gold h2{font-size:clamp(26px,2.8vw,38px);max-width:26ch}
.gold .btn{background:#fff;color:var(--gold-deep)}
blockquote{font-size:clamp(26px,2.8vw,38px);font-style:italic;max-width:24ch}
dl.spec{display:grid;grid-template-columns:auto 1fr;gap:12px 28px;margin:0;font-size:15.5px}
dl.spec dt{color:var(--gold-deep);font-size:12px;letter-spacing:.16em;text-transform:uppercase;padding-top:3px}
dl.spec dd{margin:0}
.dark dl.spec dt{color:#e3b76a}
.end .wrap{display:grid;grid-template-columns:7fr 5fr;gap:64px;align-items:center}
.end h2{font-size:clamp(34px,4vw,56px)}
.box{border:1px solid var(--rule);background:#fff;padding:30px}.box b{display:block;font-family:"Gilda Display",serif;font-weight:400;font-size:22px;margin-bottom:8px}.box p{margin:0 0 16px;color:var(--mute);font-size:15px}
footer{background:var(--cream-2);border-top:1px solid var(--rule);padding:40px 0 48px;font-size:14px;color:var(--mute)}
footer .wrap{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:32px}
footer b{color:var(--ink);display:block;margin-bottom:8px;font-weight:500;font-size:12px;letter-spacing:.16em;text-transform:uppercase}
footer ul{list-style:none;margin:0;padding:0}footer li{margin:4px 0}footer a{text-decoration:none}footer a:hover{color:var(--gold-deep)}
footer .mark{width:44px;margin-bottom:12px}
.crumb{font-size:12px;letter-spacing:.1em;text-transform:uppercase;color:var(--mute);margin:18px 0 0}.crumb a{text-decoration:none}
/* state hero variant */
.hero.state .photo img{object-position:center 40%}
@media (max-width:980px){.hero{grid-template-columns:1fr}.hero .photo{min-height:360px;order:-1}.hero .photo:after{background:linear-gradient(180deg,rgba(250,244,237,0) 70%,var(--cream) 100%)}.hero .copy{padding-left:clamp(18px,4vw,56px)}.grid,.about .wrap,.end .wrap,.gold .wrap,footer .wrap{grid-template-columns:1fr;gap:28px}.facts .wrap,.states{grid-template-columns:1fr 1fr}.facts div:nth-child(2){border-right:0}.facts div:nth-child(3){padding-left:0}nav{display:none}}
@media (max-width:560px){.states{grid-template-columns:1fr}}
"""

FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Gilda+Display&family=Hanken+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">'

STATES = [
 ("illinois","Illinois","Chicago, the North Shore, Naperville and Oak Park","Central","one hour behind Indiana",
  "Couples therapy online in Illinois, from a psychologist one state east",
  "Chicago has more couples therapists than almost any city in the Midwest, and most of them have a waitlist. If you've been quoted eight weeks for a first appointment, or you'd rather not run into your therapist at the Jewel, there's another way to do this.",
  ["Most Illinois couples I see are in the city or the near suburbs and work schedules that don't leave room for a 4pm drive to Lincoln Park. We meet by video in the evening, from wherever you both are, as long as that's somewhere in Illinois when the session starts.",
   "Illinois is one of the original PSYPACT states, which is what lets me see you without an Illinois license. The compact has been in effect there since July 2020, so your insurer has seen out-of-state psychologists on superbills before."],
  "Illinois PPO plans (Blue Cross Blue Shield of Illinois in particular) tend to reimburse out-of-network psychology at a reasonable rate once the deductible is met. I'll give you a superbill after every session; you submit it."),
 ("texas","Texas","Austin, Dallas, Houston and San Antonio","Central","one hour behind Indiana",
  "Online couples therapy for Texas, with a psychologist who isn't in your neighborhood",
  "Texas is big enough that the right couples therapist is often three hours away. Austin couples drive to Dallas for a specialist. Houston couples give up and pick whoever has an opening. Video takes the distance out of it.",
  ["I see a lot of couples in Texas where one partner travels for work, and video means we don't lose a week every time someone is in Midland or Houston. The only rule is that you're both physically in Texas when we meet.",
   "Texas joined PSYPACT in July 2020. If you've looked at the Texas State Board of Examiners of Psychologists site and gotten lost, the short version: my authority to practice with you comes from the compact, not from a Texas license, and it's verifiable by my APIT number."],
  "Many Texas employer plans are PPOs with out-of-network mental health benefits. Superbills are itemized with CPT 90847 (couples) so your insurer can process them."),
 ("georgia","Georgia","Atlanta, Decatur, Alpharetta and Athens","Eastern","the same time as Indiana",
  "Couples therapy by video for Georgia, on Atlanta time",
  "Atlanta traffic is the reason a lot of couples never make it to a second session. One partner is stuck on 285, the other is parked outside the office, and the hour is gone. Same time zone as my office means evening sessions that actually start on time.",
  ["Georgia and Indiana are both Eastern, so there's no math on scheduling. A 7pm session is 7pm for all three of us.",
   "Georgia has been a PSYPACT member since the compact's first year. A fair number of my Georgia couples found me through a referral from a therapist who doesn't take couples, which is common in Atlanta, where individual therapists outnumber couples specialists by a wide margin."],
  "Georgia PPO plans generally reimburse out-of-network psychologists. Ask your plan for the out-of-network rate for CPT 90847 before we start, and I'll help you read the answer."),
 ("virginia","Virginia","Northern Virginia, Richmond, Charlottesville and Virginia Beach","Eastern","the same time as Indiana",
  "Online couples therapy for Virginia couples who'd rather not sit in a waiting room",
  "A lot of my Virginia couples work in or around Washington and have jobs where discretion matters. Video from your own home, with a psychologist two states away, is the private option.",
  ["Northern Virginia is one of the highest-demand areas in the country for couples therapy and one of the hardest to get into. Evening and lunchtime video sessions are usually available within two weeks.",
   "Virginia joined PSYPACT in January 2021. Note that the District of Columbia and Maryland are also members, so if you live in Virginia and work in DC, we can still meet during your workday as long as you're in a participating jurisdiction at the time."],
  "Federal employee plans (FEP Blue and similar) often have solid out-of-network mental health coverage. I'll provide a superbill with everything your plan needs."),
 ("colorado","Colorado","Denver, Boulder, Fort Collins and Colorado Springs","Mountain","two hours behind Indiana",
  "Couples therapy online in Colorado, with evening sessions that work on Mountain time",
  "Colorado couples tend to have full weekends and early mornings, so most of my Colorado sessions land on weekday evenings. Because I'm two hours ahead, a 6pm session in Denver is 8pm for me, which is a slot I hold specifically for Mountain and Pacific clients.",
  ["Boulder and Denver have strong therapy communities, but private-pay couples specialists with doctoral training are a smaller group, and the ones in Boulder are often booked months out.",
   "Colorado was in the first wave of PSYPACT states, effective July 2020. If you split time between Colorado and a non-member state, we'll plan sessions around where you'll be."],
  "Colorado PPO plans reimburse out-of-network psychology at varying rates. The Colorado Division of Insurance requires plans to tell you the out-of-network rate on request."),
 ("ohio","Ohio","Columbus, Cincinnati, Cleveland and Dayton","Eastern","the same time as Indiana",
  "Couples therapy in Ohio, online, from the psychologist some of you already know",
  "Before Indiana, I practiced in Columbus. A number of my Ohio couples are people who worked with me there and kept going by video, and their referrals are a big part of how new Ohio couples find me.",
  ["Columbus, Cincinnati and Cleveland each have a handful of couples specialists trained in EFT and the Gottman Method, and they fill up fast. Video with someone an hour west, on the same time zone, is often the quicker route.",
   "Ohio joined PSYPACT in July 2021. Nothing about our work changes because I'm across the state line; the compact handles the licensing side."],
  "Ohio plans from Anthem, Medical Mutual and Aetna PPO products typically have out-of-network behavioral health benefits. Superbills go out the same day as your session."),
]


MEMBERS = ["Alabama","Alaska","Arizona","Arkansas","Colorado","Connecticut","Delaware","District of Columbia","Florida","Georgia","Idaho","Illinois","Indiana","Kansas","Kentucky","Maine","Maryland","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","North Carolina","North Dakota","Ohio","Oklahoma","Pennsylvania","Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia","Wisconsin","Wyoming","Northern Mariana Islands"]
PENDING = {"Iowa":"July 2027","Louisiana":"January 2028"}
NONMEMBERS = ["California","Hawaii","Massachusetts","New Mexico","New York","Oregon","Puerto Rico","Guam","U.S. Virgin Islands"]

def state_checker():
    pages = {s[1]: f"{BASE}online-couples-therapy/{s[0]}/" for s in STATES}
    data = []
    for n in MEMBERS: data.append({"n":n,"s":"page" if n in pages else "yes","u":pages.get(n,"")})
    for n,d in PENDING.items(): data.append({"n":n,"s":"pending","d":d})
    for n in NONMEMBERS: data.append({"n":n,"s":"no"})
    return f"""
<div class="checker">
 <label for="stateInput">Type your state</label>
 <div class="checker-row"><input id="stateInput" type="text" placeholder="Illinois, Texas, Georgia..." autocomplete="off" aria-label="Check whether video sessions are available in your state"><div id="stateList" class="checker-list" hidden></div></div>
 <p id="stateResult" class="checker-result" aria-live="polite">Start typing. If your state is one of the 44 PSYPACT jurisdictions, we can meet by video.</p>
</div>
<script>
(function(){{
 const D={json.dumps(data)};
 const inp=document.getElementById('stateInput'),list=document.getElementById('stateList'),out=document.getElementById('stateResult');
 function msg(x){{
  if(x.s==='page') return '<strong>'+x.n+'</strong>: yes. There is a page just for '+x.n+' couples: <a href="'+x.u+'">online couples therapy in '+x.n+'</a>.';
  if(x.s==='yes') return '<strong>'+x.n+'</strong>: yes. '+x.n+' is a PSYPACT member, so we can meet by video as long as you are both in the state at session time. <a href="{SITE}/contact-us/">Book a free consult</a>.';
  if(x.s==='pending') return '<strong>'+x.n+'</strong>: not yet. '+x.n+' has passed PSYPACT and joins in '+x.d+'. Reach out closer to then.';
  return '<strong>'+x.n+'</strong>: not yet. '+x.n+' has not joined PSYPACT, so I cannot see you by video there. If you travel to a member state, we can meet while you are there.';
 }}
 function render(q){{
  const v=q.trim().toLowerCase(); if(!v){{list.hidden=true;return}}
  const hits=D.filter(x=>x.n.toLowerCase().includes(v)).slice(0,8);
  list.innerHTML=hits.map(x=>'<button type="button" data-n="'+x.n+'">'+x.n+'<span>'+(x.s==='page'?'own page':x.s==='yes'?'member':x.s==='pending'?'joins '+x.d:'not a member')+'</span></button>').join('');
  list.hidden=!hits.length;
  const exact=hits.find(x=>x.n.toLowerCase()===v); if(exact) out.innerHTML=msg(exact);
 }}
 inp.addEventListener('input',e=>render(e.target.value));
 inp.addEventListener('focus',e=>render(e.target.value));
 list.addEventListener('click',e=>{{const b=e.target.closest('button');if(!b)return;const x=D.find(y=>y.n===b.dataset.n);inp.value=x.n;out.innerHTML=msg(x);list.hidden=true}});
 document.addEventListener('click',e=>{{if(!e.target.closest('.checker'))list.hidden=true}});
}})();
</script>"""

def chrome(title, desc, body, path_depth, canonical, ld=None, crumb=""):
    pre = "../" * path_depth
    nav = f"""<header class="site"><div class="wrap nav">
 <a class="brand" href="{BASE}"><img src="{BASE}img/mark.png" alt=""><span>Kelsee Tucker, Ph.D.<small>Counseling</small></span></a>
 <nav><ul>
  <li><a href="{BASE}#couples">Couples therapy</a></li>
  <li><a href="{BASE}online-couples-therapy/">Online, by state</a></li>
  <li><a href="{SITE}/about-us/">About</a></li>
  <li><a href="{SITE}/rates/">Rates</a></li>
  <li><a href="{SITE}/blogs/">Writing</a></li>
 </ul></nav>
 <a class="btn" href="{SITE}/contact-us/">Free 15 minute consult</a>
</div></header>"""
    foot = f"""<footer><div class="wrap">
 <div><img class="mark" src="{BASE}img/mark.png" alt=""><b>Kelsee Tucker, Ph.D. Counseling</b>Licensed psychologist, couples specialist<br>Elevate Offices, 7230 Arbuckle Commons Ste 241, Brownsburg, IN 46112<br>317-214-0774<br>Online in 40+ PSYPACT states (APIT/E.Passport Mobility #16033)</div>
 <div><b>Couples</b><ul><li><a href="{SITE}/couples-therapy/">Couples therapy</a></li><li><a href="#">Premarital</a></li><li><a href="#">Affair recovery</a></li><li><a href="#">Discernment counseling</a></li><li><a href="#">Intensives</a></li></ul></div>
 <div><b>Online by state</b><ul>{''.join(f'<li><a href="{BASE}online-couples-therapy/{s[0]}/">{s[1]}</a></li>' for s in STATES)}<li><a href="{BASE}online-couples-therapy/">All states</a></li></ul></div>
 <div><b>Practice</b><ul><li><a href="{SITE}/about-us/">About Dr. Tucker</a></li><li><a href="{SITE}/rates/">Rates and insurance</a></li><li><a href="{SITE}/individual-therapy/">Individual therapy</a></li><li><a href="{SITE}/family-therapy/">Family therapy</a></li><li><a href="{SITE}/contact-us/">Contact</a></li></ul></div>
</div></footer>"""
    ldtag = f'<script type="application/ld+json">{json.dumps(ld)}</script>' if ld else ""
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>{title}</title><meta name="description" content="{desc}">{FONTS}<style>{CSS.replace('IMGBASE',BASE+'img/')}</style>{ldtag}</head>
<body><div class="note"><div class="wrap">Preview for Dr. Tucker. Your photos, your mark, your colors. Copy is a first draft. Built to rebuild in WordPress one to one.</div></div>
{nav}<main>{('<div class="wrap crumb">'+crumb+'</div>') if crumb else ''}{body}</main>{foot}</body></html>"""

def write(rel, html):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, "w", encoding="utf-8").write(html)

# ---------- homepage ----------
home_body = f"""
<div class="hero">
 <div class="copy">
  <img class="mark" src="{BASE}img/mark.png" alt="">
  <p class="kicker">Couples therapy · Brownsburg, Indiana · online in 40+ states</p>
  <h1>Healing hearts, deepening connections.</h1>
  <p class="lede">I'm Dr. Kelsee Tucker, a licensed psychologist who works almost entirely with couples. Emotionally Focused Therapy, the Gottman Method and IBCT, in a private practice built for people who want it done properly. In person west of Indianapolis, or by video wherever you are in a PSYPACT state.</p>
  <div class="cta"><a class="btn" href="{SITE}/contact-us/">Free 15 minute consult</a><a class="btn line" href="#couples">How couples work goes</a></div>
 </div>
 <div class="photo"><img src="{BASE}img/kelsee-boardwalk.jpg" alt="Dr. Kelsee Tucker"><span class="tag">Dr. Tucker · Brownsburg, IN</span></div>
</div>
<div class="facts"><div class="wrap">
 <div><b>In person</b><span>Elevate Offices, Brownsburg, IN</span></div>
 <div><b>Online</b><span>40+ states under PSYPACT</span></div>
 <div><b>Sessions</b><span>$350 for 55 minutes, $525 for 90</span></div>
 <div><b>Intensives</b><span>Half and full day</span></div>
</div></div>

<section id="couples"><div class="wrap grid">
 <div><p class="kicker">Couples therapy</p><h2>Three methods with real evidence behind them, chosen for your pattern, not mine.</h2></div>
 <div class="prose">
  <p>Every couple that walks in has a pattern. One pursues, one withdraws. One keeps score, one goes quiet. By the second session I can usually name it, and naming it is the first thing that changes. From there, the method depends on you.</p>
  <p><strong>Emotionally Focused Therapy</strong> for couples whose fights are really about whether the other person will be there. <strong>The Gottman Method</strong> for couples who need to learn to argue without damage. <strong>Integrative Behavioral Couples Therapy</strong> for couples who've been trying to change each other for a decade and are ready to try acceptance instead.</p>
  <ul class="list">
   <li><a href="#">Premarital counseling</a><small>new page</small><p>Six to eight sessions before the wedding, covering the conversations you've been avoiding: money, family, sex, kids, and what happens when one of you wants to move.</p></li>
   <li><a href="#">Affair recovery</a><small>new page</small><p>Whether you stay or go, you need a structured way through the first ninety days. This is that.</p></li>
   <li><a href="#">Discernment counseling</a><small>new page</small><p>One to five sessions for couples where one person is leaning out. Not therapy. A decision process.</p></li>
   <li><a href="#">Half and full day intensives</a><small>new page</small><p>For couples who travel in, or who'd rather do three months of work in a weekend.</p></li>
  </ul>
 </div>
</div></section>

<section class="dark"><img class="bgimg" src="{BASE}img/couple-dusk.jpg" alt=""><div class="wrap grid">
 <div><p class="kicker">Online, by state</p><h2 style="color:#fff">Licensed to see you in 40+ states. Check yours.</h2><p style="color:#c9c2b4;max-width:36ch">PSYPACT lets a psychologist licensed in one member state practice by video in the others. You have to be physically in a member state when we meet. That's the only rule.</p></div>
 <div>
  {state_checker()}
  <div class="own"><p>States with their own page</p><ul>{''.join(f'<li><a href="{BASE}online-couples-therapy/{s[0]}/">{s[1]}</a></li>' for s in STATES)}</ul></div>
  <p style="margin:22px 0 0;color:#c9c2b4;font-size:15px"><a href="{BASE}online-couples-therapy/">How PSYPACT works and the full list</a></p>
 </div>
</div></section>

<section class="about"><div class="wrap">
 <figure><img src="{BASE}img/kelsee-portrait.jpg" alt="Dr. Kelsee Tucker"></figure>
 <div class="prose"><p class="kicker">About Dr. Tucker</p><h2>A psychologist, not a generalist.</h2>
  <p>I am a licensed psychologist with a PhD, and I have spent my career on relationships: couples, families, and the individuals inside them. I practiced in Columbus, Ohio, before moving the practice to Indiana, and many of my Ohio couples came with me by video.</p>
  <p>I don't take insurance, on purpose. It keeps your records yours and keeps our work free of someone else's session limits. I'll give you a superbill after every session, and most PPO plans reimburse about half.</p>
  <p><a href="{SITE}/about-us/">More about me</a> &nbsp;·&nbsp; <a href="{SITE}/rates/">Rates, superbills and FSA/HSA</a></p>
 </div>
</div></section>

<section class="gold"><div class="wrap"><h2>Ready to get started? Schedule a free 15 minute consult or your first session.</h2><a class="btn" href="{SITE}/contact-us/">Let's connect</a></div></section>

<section class="end"><div class="wrap">
 <div><h2>If you're reading this together, that's already a good sign.</h2></div>
 <div class="box"><b>Start with a free 15 minute call</b><p>We'll talk about what's going on, whether I'm the right fit, and whether in person or video makes more sense. No forms first.</p><a class="btn" href="{SITE}/contact-us/">Book the call</a></div>
</div></section>
"""
home_ld = {"@context":"https://schema.org","@type":["Psychologist","MedicalBusiness"],"name":"Kelsee Tucker, PhD","url":SITE+"/","telephone":"+1-317-214-0774","address":{"@type":"PostalAddress","streetAddress":"7230 Arbuckle Commons Ste 241","addressLocality":"Brownsburg","addressRegion":"IN","postalCode":"46112","addressCountry":"US"},"geo":{"@type":"GeoCoordinates","latitude":39.8489,"longitude":-86.3974},"areaServed":["Brownsburg IN","Indianapolis IN"]+[s[1] for s in STATES],"priceRange":"$350 per 55 minute session","medicalSpecialty":"Psychiatric","founder":{"@type":"Person","name":"Kelsee Tucker","honorificSuffix":"PhD","jobTitle":"Licensed Psychologist"}}
write("index.html", chrome("Couples Therapy in Brownsburg, IN and Online in 40+ States | Kelsee Tucker, PhD",
  "Dr. Kelsee Tucker is a licensed psychologist specializing in couples therapy (EFT, Gottman, IBCT). In person near Indianapolis and online in 40+ PSYPACT states. Private pay, superbills provided.",
  home_body, 0, SITE+"/", home_ld))

# ---------- hub ----------
hub_body = f"""
<div class="hero">
 <div class="copy">
  <img class="mark" src="{BASE}img/mark.png" alt="">
  <p class="kicker">Online couples therapy</p>
  <h1>Couples therapy by video, with a psychologist, in 40+ states.</h1>
  <p class="lede">Under PSYPACT, a psychologist licensed in one member state can see clients by video in every other member state. I'm licensed in Indiana and hold the compact's APIT/E.Passport credential (Mobility #16033), which is what makes this legal and verifiable. The one rule: you and your partner both have to be physically in a participating state at the time of the session.</p>
 </div>
</div>
</div>
<section class="dark"><img class="bgimg" src="{BASE}img/couple-dusk.jpg" alt=""><div class="wrap grid">
 <div><p class="kicker">Check your state</p><h2>Is video an option where you are?</h2><p style="color:#c9c2b4;max-width:34ch">Type it in. The answer covers all 44 PSYPACT jurisdictions, the two that join next, and the ones that have not joined.</p></div>
 <div>{state_checker()}</div>
</div></section>
<section><div class="wrap grid">
 <div><p class="kicker">States with their own page</p><h2>Start with yours.</h2><p style="color:var(--mute);max-width:34ch">These are the states where I see the most couples. Each page covers scheduling across time zones and how reimbursement tends to work there.</p></div>
 <ul class="list">{''.join(f'<li><a href="{BASE}online-couples-therapy/{s[0]}/">{s[1]}</a><small>{s[3]} time</small><p>{s[2]}</p></li>' for s in STATES)}</ul>
</div></section>
<section><div class="wrap grid">
 <div><p class="kicker">Every participating state</p><h2>If yours isn't above, it's probably here.</h2></div>
 <div class="prose">
  <p>Alabama, Alaska, Arizona, Arkansas, Colorado, Connecticut, Delaware, District of Columbia, Florida, Georgia, Idaho, Illinois, Indiana, Kansas, Kentucky, Maine, Maryland, Michigan, Minnesota, Mississippi, Missouri, Montana, Nebraska, Nevada, New Hampshire, New Jersey, North Carolina, North Dakota, Ohio, Oklahoma, Pennsylvania, Rhode Island, South Carolina, South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia, Wisconsin, Wyoming, and the Northern Mariana Islands.</p>
  <p>Not yet: California, New York, Massachusetts, Oregon, Hawaii and New Mexico. Iowa joins in July 2027 and Louisiana in January 2028. Membership changes; I check the compact's map before every new-state intake.</p>
  <h3>How a video session works</h3>
  <p>We meet on a secure, HIPAA-compliant video platform. You can be in the same room or in two different places, as long as both places are in a member state. Sessions are 55 or 90 minutes, same as in person, and the fee is the same: $350 and $525. Superbills go out after each session for out-of-network reimbursement.</p>
  <h3>When in person makes more sense</h3>
  <p>Some couples do better in a room, and intensives are almost always in person. My office is at Elevate Offices in Brownsburg, Indiana, twenty minutes west of downtown Indianapolis. Couples travel in for half-day and full-day intensives from across the Midwest.</p>
 </div>
</div></section>
<section class="end"><div class="wrap">
 <div><h2>Not sure if your state counts? Ask. It takes thirty seconds.</h2></div>
 <div class="box"><b>Free 15 minute consult</b><p>Tell me where you are and what's going on. I'll tell you whether we can work together and how.</p><a class="btn" href="{SITE}/contact-us/">Book the call</a></div>
</div></section>
"""
write("online-couples-therapy/index.html", chrome("Online Couples Therapy in 40+ States (PSYPACT) | Kelsee Tucker, PhD",
  "Video couples therapy with a licensed psychologist, available in 40+ PSYPACT states. EFT, Gottman Method and IBCT. $350 per session, superbills provided.",
  hub_body, 1, SITE+"/online-couples-therapy/", crumb=f'<a href="{BASE}">Home</a> / Online couples therapy'))

# ---------- state pages ----------
for slug, name, metros, tz, offset, h1, lede, paras, ins in STATES:
    body = f"""
<div class="hero state">
 <div class="copy">
  <img class="mark" src="{BASE}img/mark.png" alt="">
  <p class="kicker">Online couples therapy in {name}</p>
  <h1>{h1}</h1>
  <p class="lede">{lede}</p>
  <div class="cta"><a class="btn" href="{SITE}/contact-us/">Book a free 15 minute consult</a><a href="{BASE}online-couples-therapy/">How PSYPACT works</a></div>
 </div>
 <div class="photo"><img src="{BASE}img/kelsee-portrait.jpg" alt="Dr. Kelsee Tucker"><span class="tag">Dr. Tucker, by video in {name}</span></div>
</div>
<div class="facts"><div class="wrap">
 <div><b>Where</b><span>{metros}</span></div>
 <div><b>Time zone</b><span>{tz}, {offset}</span></div>
 <div><b>Format</b><span>Secure video, 55 or 90 minutes</span></div>
 <div><b>Fee</b><span>$350 / $525, superbill provided</span></div>
</div></div>
<section><div class="wrap grid">
 <div><p class="kicker">Working with {name} couples</p><h2>What's different about doing this from {name}.</h2></div>
 <div class="prose">
  <p>{paras[0]}</p>
  <p>{paras[1]}</p>
  <h3>Insurance and reimbursement in {name}</h3>
  <p>I'm a private-pay practice. {ins} FSA and HSA cards work for the full fee.</p>
  <h3>The methods</h3>
  <p>Emotionally Focused Therapy, the Gottman Method and Integrative Behavioral Couples Therapy. Which one we use depends on your pattern, and I'll explain the choice in plain language in the first two sessions. <a href="{BASE}#couples">More on how I work with couples</a>.</p>
 </div>
</div></section>
<section class="dark"><img class="bgimg" src="{BASE}img/couple-dusk.jpg" alt=""><div class="wrap grid">
 <div><p class="kicker">The one rule</p><blockquote>You both have to be in {name}, or another PSYPACT state, when the session starts.</blockquote></div>
 <dl class="spec">
  <dt>Credential</dt><dd>APIT / E.Passport, Mobility #16033, home license Indiana</dd>
  <dt>{name} joined</dt><dd>See the compact's map for the effective date; {name} is a current member</dd>
  <dt>Platform</dt><dd>HIPAA-compliant video, link sent before each session</dd>
  <dt>Evening slots</dt><dd>Held weekly for {tz} time couples</dd>
 </dl>
</div></section>
<section class="end"><div class="wrap">
 <div><h2>Ready to stop having the same fight in {metros.split(',')[0]}?</h2></div>
 <div class="box"><b>Free 15 minute consult</b><p>We'll confirm you're in a member state, talk through what's going on, and pick a time that works on {tz} time.</p><a class="btn" href="{SITE}/contact-us/">Book the call</a></div>
</div></section>
"""
    ld = {"@context":"https://schema.org","@type":"MedicalWebPage","name":f"Online Couples Therapy in {name}","url":f"{SITE}/online-couples-therapy/{slug}/","about":{"@type":"MedicalTherapy","name":"Couples therapy"},"provider":{"@type":"Psychologist","name":"Kelsee Tucker, PhD","url":SITE+"/"},"areaServed":{"@type":"State","name":name}}
    write(f"online-couples-therapy/{slug}/index.html", chrome(f"Online Couples Therapy in {name} | Kelsee Tucker, PhD, Psychologist",
      f"Video couples therapy for {name} couples ({metros}) with a licensed psychologist under PSYPACT. EFT, Gottman and IBCT. Evening sessions on {tz} time.",
      body, 2, f"{SITE}/online-couples-therapy/{slug}/", ld, crumb=f'<a href="{BASE}">Home</a> / <a href="{BASE}online-couples-therapy/">Online couples therapy</a> / {name}'))
print("built")
