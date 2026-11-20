/* Montclair Therapy Collective */
const PREVIEW = true;
const ROOT = document.body.dataset.root || "";

/* ---- Kit (email list): fill these in once the Kit form exists ---- */
const KIT_FORM_ID = "KIT_FORM_ID";            // e.g. "1234567"
const KIT_TAGS = { "networking": "", "workshops-ce": "", "directory": "" };

/* ---- Where things load from ----
   Preview: events come from a snapshot of the Luma calendar taken when the
   site was built, and the forms show their thank-you without sending.
   Live site: /api/events reads the Luma calendar on every visit and
   /api/contact sends through Resend. */
const EVENTS_URL = PREVIEW ? ROOT + "assets/events.json" : "/api/events";
const FORM_URL = PREVIEW ? "" : "/api/contact";
const LUMA_URL = "https://luma.com/calendar/cal-mo9ZiCFFgd3Eo5t";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

addEventListener("scroll", () => $("header").classList.toggle("scrolled", scrollY > 8), { passive: true });

function toast(m) { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2600); }
document.addEventListener("click", e => { const t = e.target.closest("[data-toast]"); if (t) { e.preventDefault(); toast(t.dataset.toast); } });

/* menu */
const nav = $("#nav"), menuBtn = $("#menuBtn");
menuBtn.addEventListener("click", () => { const o = nav.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); });
$$(".dd").forEach(d => {
  const b = $("button", d);
  b.addEventListener("click", e => { e.stopPropagation(); const o = d.classList.toggle("open"); b.setAttribute("aria-expanded", o); });
  d.addEventListener("keydown", e => { if (e.key === "Escape") { d.classList.remove("open"); b.setAttribute("aria-expanded", false); b.focus(); } });
});
document.addEventListener("click", e => $$(".dd.open").forEach(d => { if (!d.contains(e.target)) { d.classList.remove("open"); $("button", d).setAttribute("aria-expanded", false); } }));

$$("[data-tagpick]").forEach(a => a.addEventListener("click", () => { const b = $("#dirBox"); if (b) b.checked = true; }));

/* ---- events from Luma ---- */
const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function fmt(ev) {
  const tz = ev.tz || "America/New_York", s = new Date(ev.start), e = new Date(ev.end);
  const p = (d, o) => new Intl.DateTimeFormat("en-US", { timeZone: tz, ...o }).format(d);
  const t = d => p(d, { hour: "numeric", minute: "2-digit" }).replace(":00", "").replace(" AM", " am").replace(" PM", " pm");
  return { mon: p(s, { month: "short" }).toUpperCase(), day: p(s, { day: "numeric" }), when: `${p(s, { weekday: "long" })}, ${t(s)} to ${t(e)}` };
}
function price(ev) {
  if (ev.free || !ev.cents) return "Free";
  const d = "$" + (ev.cents % 100 ? (ev.cents / 100).toFixed(2) : ev.cents / 100);
  return ev.flexible ? d + " suggested donation" : d;
}
function kindOf(ev) { return /network/i.test(ev.name) ? "networking" : "workshop"; }
function card(ev) {
  const f = fmt(ev), where = [ev.place, ev.city].filter(Boolean).join(", ");
  let note = "";
  if (ev.sold_out) note = "Full. Join the waitlist on Luma.";
  else if (ev.near && ev.spots) note = ev.spots === 1 ? "1 spot left" : ev.spots + " spots left";
  return `<article class="ev"><div class="date"><small>${f.mon}</small><b>${f.day}</b></div>
    <div><span class="kind k-${kindOf(ev)}">${kindOf(ev) === "networking" ? "Networking night" : "Workshop"}</span>
    <div class="t">${esc(ev.name)}</div><div class="w">${esc(f.when)}${where ? " at " + esc(where) : ""}</div>
    <div class="price">${esc(price(ev))}${note ? ` <span class="left">${esc(note)}</span>` : ""}</div></div>
    <a class="btn" href="${esc(ev.url)}" target="_blank" rel="noopener">${ev.sold_out ? "Join the waitlist" : "Save a seat"}</a></article>`;
}
const boxes = $$("[data-events]");
if (boxes.length) {
  fetch(EVENTS_URL).then(r => { if (!r.ok) throw 0; return r.json(); }).then(all => {
    const now = Date.now();
    all = all.filter(e => new Date(e.end).getTime() > now).sort((a, b) => a.start < b.start ? -1 : 1);
    boxes.forEach(b => {
      let list = b.dataset.kind ? all.filter(e => kindOf(e) === b.dataset.kind) : all;
      if (+b.dataset.limit) list = list.slice(0, +b.dataset.limit);
      b.innerHTML = list.length ? list.map(card).join("")
        : `<p class="ev-wait">Nothing on the calendar right now. <a class="tlink" href="${ROOT}#join">Join the list</a> and you'll hear when the next one is posted.</p>`;
    });
  }).catch(() => boxes.forEach(b => { b.innerHTML = `<p class="ev-wait">The calendar didn't load. <a class="tlink" href="${LUMA_URL}" target="_blank" rel="noopener">See upcoming events on Luma</a>.</p>`; }));
}

/* ---- Kit signup ---- */
const kitReady = /^\d+$/.test(KIT_FORM_ID);
function thank(f) {
  if (f.id === "bigForm") { $(".fields", f).style.display = "none"; $(".actions", f).style.display = "none"; $(".form-err", f).style.display = "none"; $(".done", f).style.display = "block"; }
  else { toast("You're on the list. Check your inbox to confirm."); f.reset(); }
}
$$(".kit-form").forEach(f => f.addEventListener("submit", async e => {
  e.preventDefault();
  if (!kitReady) { thank(f); return; }
  const data = new FormData(f);
  $$("[data-tag]", f).forEach(c => { const id = KIT_TAGS[c.dataset.tag]; if (c.checked && id) data.append("tags[]", id); });
  const btn = $("button[type=submit]", f); btn.disabled = true;
  try {
    const r = await fetch(`https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`, { method: "POST", body: data, headers: { Accept: "application/json" } });
    if (!r.ok) throw new Error(r.status);
    thank(f);
  } catch (err) {
    const m = $(".form-err", f); if (m) m.style.display = "block"; else toast("Something went wrong. Please try again.");
  } finally { btn.disabled = false; }
}));

/* ---- contact, get listed, present a workshop (Resend on the live site) ---- */
$$(".send-form").forEach(f => f.addEventListener("submit", async e => {
  e.preventDefault();
  const err = $(".form-err", f); err.style.display = "none";
  const bad = $$("[required]", f).find(i => !i.value.trim() || (i.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(i.value.trim())));
  $$(".field.bad", f).forEach(x => x.classList.remove("bad"));
  if (bad) { bad.closest(".field").classList.add("bad"); bad.focus(); return; }
  const data = Object.fromEntries(new FormData(f)); data.form = f.dataset.form;
  const done = () => { $(".fields", f).style.display = "none"; $(".actions", f).style.display = "none"; $(".done", f).style.display = "block"; $(".done", f).scrollIntoView({ block: "center", behavior: "smooth" }); };
  if (!FORM_URL) { done(); return; }
  const btn = $("button[type=submit]", f); btn.disabled = true;
  try {
    const r = await fetch(FORM_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
    if (!r.ok) throw new Error(r.status);
    done();
  } catch (x) { err.style.display = "block"; } finally { btn.disabled = false; }
}));
const topic = new URLSearchParams(location.search).get("about"), tSel = $("#f-topic");
if (topic && tSel) { const o = [...tSel.options].find(o => o.value.toLowerCase().startsWith(topic.toLowerCase())); if (o) tSel.value = o.value; }

/* ---- preview only: homepage photo switch ---- */
(function () {
  const pick = $(".photo-pick"), h = $(".hero"); if (!pick || !h) return;
  const i = $(".hero-bg", h), b = $$("button", pick);
  const alt = { 1: "Montclair Therapy Collective members together at a networking night", 2: "Clinicians talking at an MTC rooftop networking night", 3: "MTC members gathered in an office after a workshop", 4: "MTC members together at a networking night in Montclair" };
  function set(n) { if (!alt[n]) n = 3; h.dataset.photo = n; i.src = ROOT + "assets/img/hero-" + n + ".jpg"; i.alt = alt[n]; b.forEach(x => x.setAttribute("aria-pressed", x.dataset.p == n)); try { sessionStorage.setItem("mtcPhoto", n); } catch (e) {} }
  b.forEach(x => x.addEventListener("click", () => set(x.dataset.p)));
  let saved = 3; try { saved = sessionStorage.getItem("mtcPhoto") || 3; } catch (e) {}
  set(new URLSearchParams(location.search).get("photo") || saved);
})();
