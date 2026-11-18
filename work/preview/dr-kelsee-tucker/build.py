#!/usr/bin/env python3
"""Preview for Dr. Kelsee Tucker: homepage concept, online couples therapy hub, six state pages."""
import os, json, io

ROOT = os.path.dirname(os.path.abspath(__file__))
BASE = "/work/preview/dr-kelsee-tucker/"
SITE = "https://drkelseetucker.com"

CSS = """
:root{--paper:#f7f3ec;--ink:#1f1d1a;--brass:#a07b35;--brass-deep:#7d5e24;--rule:#d9d2c5;--mute:#6b645a;--plum:#2f2a33}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);font-family:"Archivo",system-ui,sans-serif;font-size:16.5px;line-height:1.55;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:underline;text-underline-offset:3px;text-decoration-thickness:1px}
a:hover{color:var(--brass-deep)}
h1,h2,h3,blockquote{font-family:"Crimson Pro",Georgia,serif;font-weight:400;margin:0;line-height:1.06;letter-spacing:-.005em}
.wrap{max-width:1200px;margin:0 auto;padding:0 clamp(18px,4vw,52px)}
.note{background:#fff5c2;border-bottom:1px solid #e6d98a;font-size:13px;padding:8px 0;color:#5a4d00}
header{border-bottom:1px solid var(--rule)}
.nav{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:20px 0}
.brand{text-decoration:none;font-family:"Crimson Pro",serif;font-size:24px;line-height:1}
.brand small{display:block;font-family:"Archivo",sans-serif;font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin-top:6px}
nav ul{list-style:none;margin:0;padding:0;display:flex;gap:24px;font-size:14.5px}
nav a{text-decoration:none}nav a:hover{text-decoration:underline}
.btn{display:inline-block;font-size:14.5px;letter-spacing:.02em;border:1px solid var(--ink);padding:10px 16px;text-decoration:none}
.btn:hover{background:var(--ink);color:var(--paper)}
.btn.inv{border-color:var(--paper);color:var(--paper)}.btn.inv:hover{background:var(--paper);color:var(--ink)}
.kicker{font-size:12.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--brass-deep);margin:0 0 16px}
section{padding:72px 0;border-bottom:1px solid var(--rule)}
.grid{display:grid;grid-template-columns:5fr 7fr;gap:56px;align-items:start}
.grid h2{font-size:clamp(32px,3.6vw,48px);max-width:14ch}
.prose p{margin:0 0 18px;max-width:62ch}
.prose h3{font-size:26px;margin:30px 0 10px}
.hero{padding:72px 0 56px;border-bottom:1px solid var(--rule);display:grid;grid-template-columns:7fr 5fr;gap:56px;align-items:end}
.hero h1{font-size:clamp(42px,5.6vw,76px);max-width:14ch}
.hero .lede{font-size:clamp(18px,1.5vw,20px);max-width:44ch;margin:28px 0 0;color:#3a3630}
.hero .cta{display:flex;gap:26px;align-items:center;margin-top:30px}
.facts{display:grid;grid-template-columns:repeat(4,1fr);font-size:14.5px;border-bottom:1px solid var(--rule)}
.facts div{padding:18px 18px 18px 0;border-right:1px solid var(--rule)}.facts div+div{padding-left:18px}.facts div:last-child{border-right:0}
.facts b{display:block;font-weight:500;margin-bottom:2px}.facts span{color:var(--mute)}
.portrait{aspect-ratio:4/5;background:linear-gradient(165deg,#d9cdb8,#9f8c6a);position:relative}
.portrait:after{content:attr(data-label);position:absolute;inset:auto 0 0 0;padding:12px 16px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#fff;background:rgba(0,0,0,.28)}
.list{list-style:none;margin:0;padding:0;border-top:1px solid var(--rule)}
.list li{border-bottom:1px solid var(--rule);padding:18px 0;display:grid;grid-template-columns:1fr auto;gap:16px;align-items:baseline}
.list a{font-family:"Crimson Pro",serif;font-size:24px;text-decoration:none}.list a:hover{text-decoration:underline}
.list small{color:var(--mute);font-size:14px}
.list p{grid-column:1/-1;margin:4px 0 0;color:var(--mute);font-size:15px;max-width:60ch}
.states{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:0 36px;border-top:1px solid var(--rule)}
.states li{border-bottom:1px solid var(--rule);padding:14px 0;display:flex;justify-content:space-between;gap:10px;font-size:15px}
.states li a{text-decoration:none}.states li a:hover{text-decoration:underline}
.states li span{color:var(--mute);font-size:13.5px}
.dark{background:var(--plum);color:#efe9dc}.dark .kicker{color:#d7b36a}.dark a{color:#fff}.dark .rule{border-color:#5a5260}
blockquote{font-size:clamp(24px,2.6vw,34px);font-style:italic;max-width:26ch}
dl.spec{display:grid;grid-template-columns:auto 1fr;gap:10px 24px;margin:0;font-size:15.5px}
dl.spec dt{color:var(--brass-deep);font-size:12.5px;letter-spacing:.1em;text-transform:uppercase;padding-top:3px}
dl.spec dd{margin:0}
.dark dl.spec dt{color:#d7b36a}
.end{display:grid;grid-template-columns:7fr 5fr;gap:48px;align-items:center}
.end h2{font-size:clamp(32px,3.8vw,52px)}
.box{border:1px solid var(--rule);padding:26px}.box b{display:block;font-size:18px;margin-bottom:8px;font-weight:500}.box p{margin:0 0 14px;color:var(--mute);font-size:15px}
footer{padding:36px 0 48px;font-size:14px;color:var(--mute)}
footer .wrap{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:32px}
footer b{color:var(--ink);display:block;margin-bottom:8px;font-weight:500}
footer ul{list-style:none;margin:0;padding:0}footer li{margin:4px 0}footer a{text-decoration:none}footer a:hover{text-decoration:underline}
.crumb{font-size:13px;color:var(--mute);margin:18px 0 0}.crumb a{text-decoration:none}
@media (max-width:900px){.hero,.grid,.end,footer .wrap{grid-template-columns:1fr;gap:28px}.facts,.states{grid-template-columns:1fr 1fr}.facts div:nth-child(2){border-right:0}.facts div:nth-child(3){padding-left:0}nav{display:none}.portrait{aspect-ratio:16/10}}
@media (max-width:560px){.states{grid-template-columns:1fr}}
"""

FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;1,300;1,400&display=swap" rel="stylesheet">'

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

def chrome(title, desc, body, path_depth, canonical, ld=None, crumb=""):
    pre = "../" * path_depth
    nav = f"""<header><div class="wrap nav">
 <a class="brand" href="{BASE}">Kelsee Tucker, PhD<small>Psychologist, couples specialist</small></a>
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
 <div><b>Kelsee Tucker, PhD</b>Licensed psychologist, couples specialist<br>Elevate Offices, 7230 Arbuckle Commons Ste 241, Brownsburg, IN 46112<br>317-214-0774<br>Online in 40+ PSYPACT states (APIT/E.Passport Mobility #16033)</div>
 <div><b>Couples</b><ul><li><a href="{SITE}/couples-therapy/">Couples therapy</a></li><li><a href="#">Premarital</a></li><li><a href="#">Affair recovery</a></li><li><a href="#">Discernment counseling</a></li><li><a href="#">Intensives</a></li></ul></div>
 <div><b>Online by state</b><ul>{''.join(f'<li><a href="{BASE}online-couples-therapy/{s[0]}/">{s[1]}</a></li>' for s in STATES)}<li><a href="{BASE}online-couples-therapy/">All states</a></li></ul></div>
 <div><b>Practice</b><ul><li><a href="{SITE}/about-us/">About Dr. Tucker</a></li><li><a href="{SITE}/rates/">Rates and insurance</a></li><li><a href="{SITE}/individual-therapy/">Individual therapy</a></li><li><a href="{SITE}/family-therapy/">Family therapy</a></li><li><a href="{SITE}/contact-us/">Contact</a></li></ul></div>
</div></footer>"""
    ldtag = f'<script type="application/ld+json">{json.dumps(ld)}</script>' if ld else ""
    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow">
<title>{title}</title><meta name="description" content="{desc}">{FONTS}<style>{CSS}</style>{ldtag}</head>
<body><div class="note"><div class="wrap">Preview for Dr. Tucker. Structure, copy and search targeting; photos are placeholders. Built to drop into WordPress.</div></div>
{nav}<main>{('<div class="wrap crumb">'+crumb+'</div>') if crumb else ''}{body}</main>{foot}</body></html>"""

def write(rel, html):
    p = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, "w", encoding="utf-8").write(html)

# ---------- homepage ----------
home_body = f"""
<div class="wrap">
<div class="hero">
 <div>
  <p class="kicker">Couples therapy. Brownsburg, Indiana, and online in 40+ states.</p>
  <h1>Most couples wait six years too long to call. Don't be most couples.</h1>
  <p class="lede">I'm Dr. Kelsee Tucker, a licensed psychologist who works almost entirely with couples. Emotionally Focused Therapy, the Gottman Method and IBCT, in a private-pay practice built for people who want it done properly. In person west of Indianapolis, or by video wherever you are in a PSYPACT state.</p>
  <div class="cta"><a class="btn" href="{SITE}/contact-us/">Book a free 15 minute consult</a><a href="#couples">How couples work goes</a></div>
 </div>
 <div class="portrait" data-label="Dr. Tucker, her own photo, not stock"></div>
</div>
<div class="facts">
 <div><b>In person</b><span>Elevate Offices, Brownsburg, IN</span></div>
 <div><b>Online</b><span>40+ states under PSYPACT</span></div>
 <div><b>Sessions</b><span>$350 for 55 minutes, $525 for 90</span></div>
 <div><b>Intensives</b><span>Half and full day</span></div>
</div>
</div>

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

<section class="dark"><div class="wrap grid">
 <div><p class="kicker">Online, by state</p><h2 style="color:#fff">Licensed to see you in 40+ states. Here are the ones with their own page.</h2><p style="color:#c9c2b4;max-width:36ch">PSYPACT lets a psychologist licensed in one member state practice by video in the others. You have to be physically in a member state when we meet. That's the only rule.</p></div>
 <div>
  <ul class="states">{''.join(f'<li><a href="{BASE}online-couples-therapy/{s[0]}/">{s[1]}</a><span>{s[3]} time</span></li>' for s in STATES)}</ul>
  <p style="margin:22px 0 0;color:#c9c2b4;font-size:15px">Not listed? <a href="{BASE}online-couples-therapy/">See every PSYPACT state</a>, or just ask on the consult call.</p>
 </div>
</div></section>

<section><div class="wrap grid">
 <div><p class="kicker">About Dr. Tucker</p><h2>A psychologist, not a generalist.</h2></div>
 <div class="prose">
  <p>I am a licensed psychologist with a PhD, and I have spent my career on relationships: couples, families, and the individuals inside them. I practiced in Columbus, Ohio, before moving the practice to Indiana, and many of my Ohio couples came with me by video.</p>
  <p>I don't take insurance, on purpose. It keeps your records yours and keeps our work free of someone else's session limits. I'll give you a superbill after every session, and most PPO plans reimburse about half.</p>
  <p><a href="{SITE}/about-us/">More about me</a> &nbsp;·&nbsp; <a href="{SITE}/rates/">Rates, superbills and FSA/HSA</a></p>
 </div>
</div></section>

<section style="border-bottom:0"><div class="wrap end">
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
<div class="wrap">
<div class="hero" style="grid-template-columns:1fr">
 <div>
  <p class="kicker">Online couples therapy</p>
  <h1>Couples therapy by video, with a psychologist, in 40+ states.</h1>
  <p class="lede">Under PSYPACT, a psychologist licensed in one member state can see clients by video in every other member state. I'm licensed in Indiana and hold the compact's APIT/E.Passport credential (Mobility #16033), which is what makes this legal and verifiable. The one rule: you and your partner both have to be physically in a participating state at the time of the session.</p>
 </div>
</div>
</div>
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
<section style="border-bottom:0"><div class="wrap end">
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
<div class="wrap">
<div class="hero">
 <div>
  <p class="kicker">Online couples therapy in {name}</p>
  <h1>{h1}</h1>
  <p class="lede">{lede}</p>
  <div class="cta"><a class="btn" href="{SITE}/contact-us/">Book a free 15 minute consult</a><a href="{BASE}online-couples-therapy/">How PSYPACT works</a></div>
 </div>
 <div class="portrait" data-label="photo: Dr. Tucker on a video call, or a {name} skyline she's taken herself"></div>
</div>
<div class="facts">
 <div><b>Where</b><span>{metros}</span></div>
 <div><b>Time zone</b><span>{tz}, {offset}</span></div>
 <div><b>Format</b><span>Secure video, 55 or 90 minutes</span></div>
 <div><b>Fee</b><span>$350 / $525, superbill provided</span></div>
</div>
</div>
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
<section class="dark"><div class="wrap grid">
 <div><p class="kicker">The one rule</p><blockquote>You both have to be in {name}, or another PSYPACT state, when the session starts.</blockquote></div>
 <dl class="spec">
  <dt>Credential</dt><dd>APIT / E.Passport, Mobility #16033, home license Indiana</dd>
  <dt>{name} joined</dt><dd>See the compact's map for the effective date; {name} is a current member</dd>
  <dt>Platform</dt><dd>HIPAA-compliant video, link sent before each session</dd>
  <dt>Evening slots</dt><dd>Held weekly for {tz} time couples</dd>
 </dl>
</div></section>
<section style="border-bottom:0"><div class="wrap end">
 <div><h2>Ready to stop having the same fight in {metros.split(',')[0]}?</h2></div>
 <div class="box"><b>Free 15 minute consult</b><p>We'll confirm you're in a member state, talk through what's going on, and pick a time that works on {tz} time.</p><a class="btn" href="{SITE}/contact-us/">Book the call</a></div>
</div></section>
"""
    ld = {"@context":"https://schema.org","@type":"MedicalWebPage","name":f"Online Couples Therapy in {name}","url":f"{SITE}/online-couples-therapy/{slug}/","about":{"@type":"MedicalTherapy","name":"Couples therapy"},"provider":{"@type":"Psychologist","name":"Kelsee Tucker, PhD","url":SITE+"/"},"areaServed":{"@type":"State","name":name}}
    write(f"online-couples-therapy/{slug}/index.html", chrome(f"Online Couples Therapy in {name} | Kelsee Tucker, PhD, Psychologist",
      f"Video couples therapy for {name} couples ({metros}) with a licensed psychologist under PSYPACT. EFT, Gottman and IBCT. Evening sessions on {tz} time.",
      body, 2, f"{SITE}/online-couples-therapy/{slug}/", ld, crumb=f'<a href="{BASE}">Home</a> / <a href="{BASE}online-couples-therapy/">Online couples therapy</a> / {name}'))
print("built")
