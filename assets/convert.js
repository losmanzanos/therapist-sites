/* ─────────────────────────────────────────────
   convert.js: measurement and the booking bar
   Loaded on every page. Does three things:
   1. Cloudflare Web Analytics (counts at the edge, not blocked by ad blockers)
   2. GA4, loaded late so it never slows the page, with real conversion events
   3. The small "book a call" bar on phones, and the end-of-post nudge on journal articles
   ───────────────────────────────────────────── */
(function () {
  "use strict";

  var PREVIEW = /\/work\/preview\//.test(location.pathname); /* previews are looked at, not measured */
  var CAL = "https://calendly.com/chad-m-moravec/intro-call";
  var root = (function () {
    var s = document.currentScript && document.currentScript.getAttribute("src") || "";
    var m = s.match(/^(.*?)assets\/convert\.js/);
    return m ? m[1] : "/";
  })();

  /* 1. Cloudflare Web Analytics */
  if (!PREVIEW) (function () {
    var s = document.createElement("script");
    s.type = "module";
    s.src = "https://static.cloudflareinsights.com/beacon.min.js";
    s.setAttribute("data-cf-beacon", '{"token":"0ab93cf23af5490989b07acad7acb1d6"}');
    document.head.appendChild(s);
  })();

  /* 2. GA4, after load, so it costs the visitor nothing */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;
  gtag("js", new Date());
  gtag("config", "G-6KSDGGVPW0");
  function loadGa() {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=G-6KSDGGVPW0";
    document.head.appendChild(s);
  }
  if (PREVIEW) { /* no GA on previews */ }
  else if (document.readyState === "complete") setTimeout(loadGa, 1500);
  else window.addEventListener("load", function () { setTimeout(loadGa, 1500); });

  function track(name, params) {
    try { gtag("event", name, params || {}); } catch (e) {}
  }

  /* the events that actually mean something */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var where = a.closest("header") ? "header" : a.closest("footer") ? "footer" : a.closest(".stickbar") ? "sticky_bar" : a.closest(".hero") ? "hero" : a.closest("section") && a.closest("section").id || "body";
    if (/calendly\.com/.test(href)) track("book_call", { placement: where, page: location.pathname });
    else if (/^tel:/.test(href)) track("call_click", { placement: where, page: location.pathname });
    else if (/^sms:/.test(href)) track("text_click", { placement: where, page: location.pathname });
    else if (/^mailto:/.test(href)) track("email_click", { placement: where, page: location.pathname });
    else if (/\/pricing\/?/.test(href) && !/pricing/.test(location.pathname)) track("view_pricing", { placement: where, page: location.pathname });
  }, true);
  document.addEventListener("twd:formsent", function (e) {
    track("form_submit", { project: (e.detail && e.detail.project) || "", page: location.pathname });
  });

  /* 3a. the booking bar on phones: appears after the hero, hides when the footer is in view */
  (function () {
    if (document.querySelector(".stickbar") || document.body.classList.contains("no-stickbar")) return;
    if (!document.querySelector('link[rel="stylesheet"][href*="assets/site.css"]')) return; /* pages with their own styles (the colophon) have no bar styles */
    var bar = document.createElement("div");
    bar.className = "stickbar";
    bar.setAttribute("aria-label", "Book a call");
    bar.innerHTML =
      '<a href="' + CAL + '" target="_blank" rel="noopener" class="sb-book">Book a free 30-minute call</a>' +
      '<a href="sms:+17204661013" class="sb-text" aria-label="Text (720) 466-1013">Text</a>';
    document.body.appendChild(bar);
    var ft = document.querySelector("footer"), onCal = /calendly/.test(location.hostname);
    var footerIn = false;
    function upd() {
      var y = window.scrollY || 0;
      bar.classList.toggle("is-on", y > 520 && !footerIn && !onCal);
    }
    if ("IntersectionObserver" in window && ft) {
      new IntersectionObserver(function (es) { footerIn = es[0].isIntersecting; upd(); }, { threshold: 0.05 }).observe(ft);
    }
    window.addEventListener("scroll", upd, { passive: true });
    upd();
  })();
})();
