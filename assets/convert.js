/* ─────────────────────────────────────────────
   convert.js: measurement and the booking bar
   Loaded on every page. Does three things:
   1. Cloudflare Web Analytics (counts at the edge, not blocked by ad blockers)
   2. GA4, loaded late so it never slows the page, with real conversion events
   3. The small "book a call" bar on phones, and the end-of-post nudge on journal articles
   4. Warming Calendly's files after load, so the contact page calendar comes up faster
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

  /* 3a. the booking bar on phones: appears once the first section (the hero) has scrolled away, hides again
     when you scroll back into it or reach the footer. When hidden it is taken out of the page entirely
     (display:none), because iPhone Safari tints its toolbar to match any fixed element at the bottom edge,
     even one slid out of view, which left a bare green strip over the hero. */
  (function () {
    if (document.querySelector(".stickbar") || document.body.classList.contains("no-stickbar")) return;
    if (!document.querySelector('link[rel="stylesheet"][href*="assets/site.css"]')) return; /* pages with their own styles (the colophon) have no bar styles */
    var bar = document.createElement("div");
    bar.className = "stickbar";
    bar.setAttribute("aria-label", "Book a call");
    bar.innerHTML =
      '<div class="sb-in"><a href="' + CAL + '" target="_blank" rel="noopener" class="sb-book">Book a free 30-minute call</a>' +
      '<a href="sms:+17204661013" class="sb-text" aria-label="Text (720) 466-1013">Text</a></div>';
    document.body.appendChild(bar);
    var ft = document.querySelector("footer"), onCal = /calendly/.test(location.hostname);
    var footerIn = false, typing = false, on = false, offT = 0;
    var first = document.querySelector("main > section, main > div, .hero, section");
    function trigger() {
      if (!first) return 520;
      var r = first.getBoundingClientRect(), bottom = r.bottom + (window.scrollY || 0);
      return Math.max(320, bottom - 120);
    }
    var at = 520;
    function measure() { at = trigger(); upd(); }
    function setOn(v) {
      if (v === on) return;
      on = v; clearTimeout(offT);
      if (v) {
        bar.classList.add("is-shown");
        requestAnimationFrame(function () { requestAnimationFrame(function () { if (on) bar.classList.add("is-on"); }); });
      } else {
        bar.classList.remove("is-on");
        offT = setTimeout(function () { if (!on) bar.classList.remove("is-shown"); }, 340);
      }
    }
    function upd() {
      var y = window.scrollY || 0;
      setOn(y > at && !footerIn && !onCal && !typing);
    }
    /* out of the way while someone is typing into a field, so it never sits on the input */
    document.addEventListener("focusin", function (e) { if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) { typing = true; upd(); } });
    document.addEventListener("focusout", function () { setTimeout(function () { var a = document.activeElement; typing = !!a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName); upd(); }, 50); });
    if ("IntersectionObserver" in window && ft) {
      new IntersectionObserver(function (es) { footerIn = es[0].isIntersecting; upd(); }, { threshold: 0.05 }).observe(ft);
    }
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    measure();
  })();

  /* Calendly is slow on a cold cache. Once this page has finished loading, quietly load the booking page
     in a hidden frame so its files are already cached when someone gets to /contact/. Skipped on the contact
     page itself, on Save-Data and slow connections, and at most once a day. */
  if(!PREVIEW&&window.top===window&&!/^\/contact/.test(location.pathname)){
    var CAL_K='twdCalWarm';
    function calWarm(){
      var c=navigator.connection;if(c&&(c.saveData||/(^|-)(2g|3g)$/.test(c.effectiveType||'')))return;
      try{if(Date.now()-(+localStorage.getItem(CAL_K)||0)<864e5)return;localStorage.setItem(CAL_K,Date.now());}catch(e){}
      var f=document.createElement('iframe'),gone=false;
      f.src='https://calendly.com/chad-m-moravec/intro-call?hide_gdpr_banner=1&hide_event_type_details=1&background_color=f1ebe0&text_color=2c2d36&primary_color=2d4a35&embed_domain='+encodeURIComponent(location.host)+'&embed_type=Inline';
      f.tabIndex=-1;f.title='';f.setAttribute('aria-hidden','true');
      /* on screen but invisible: Chrome pauses frames that are off screen or hidden, and a paused frame never fetches Calendly's app */
      f.style.cssText='position:fixed;right:0;bottom:0;width:1px;height:1px;border:0;opacity:0;pointer-events:none';
      function drop(){if(gone)return;gone=true;window.removeEventListener('message',onMsg);f.remove();}
      function onMsg(e){if(e.source===f.contentWindow&&e.data&&e.data.event==='calendly.event_type_viewed')setTimeout(drop,1500);}
      window.addEventListener('message',onMsg);setTimeout(drop,30000);
      document.body.appendChild(f);
    }
    function calWarmSoon(){setTimeout(function(){(window.requestIdleCallback||function(fn){setTimeout(fn,1)})(calWarm,{timeout:3000});},1200);}
    if(document.readyState==='complete')calWarmSoon();else window.addEventListener('load',calWarmSoon);

    /* and let Chrome start loading the contact page itself the moment a contact link is hovered */
    try{if(HTMLScriptElement.supports&&HTMLScriptElement.supports('speculationrules')){
      var sr=document.createElement('script');sr.type='speculationrules';
      sr.textContent=JSON.stringify({prerender:[{where:{href_matches:'/contact/*'},eagerness:'moderate'}]});
      document.head.appendChild(sr);
    }}catch(e){}
  }
})();
