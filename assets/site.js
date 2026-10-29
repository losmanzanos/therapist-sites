/* ─────────────────────────────────────────────
   Shared interactions for subpages
   (the homepage has its own inline script)
   ───────────────────────────────────────────── */
(function () {
  "use strict";

  /* progress bar */
  var prog = document.getElementById("prog");
  if (prog) {
    window.addEventListener("scroll", function () {
      var tot = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.width = (tot > 0 ? (window.scrollY / tot * 100) : 0) + "%";
    }, { passive: true });
  }

  /* subnav sticky shadow */
  var snav = document.getElementById("subnav");
  if (snav) {
    window.addEventListener("scroll", function () {
      snav.classList.toggle("is-stuck", window.scrollY > 10);
    }, { passive: true });
    var ham = document.getElementById("ham");
    if (ham) ham.addEventListener("click", function () { snav.classList.toggle("open"); });
    snav.querySelectorAll(".mob-menu a").forEach(function (a) {
      a.addEventListener("click", function () { snav.classList.remove("open"); });
    });
  }

  /* scroll reveal */
  if ("IntersectionObserver" in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("on"); obs.unobserve(e.target); }
      });
    }, { threshold: 0.09, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll("[data-r]").forEach(function (el) { obs.observe(el); });
  } else {
    document.querySelectorAll("[data-r]").forEach(function (el) { el.classList.add("on"); });
  }


  /* work page channel rail: highlight the project you're looking at */
  var rail=document.querySelector('.rail');
  if(rail&&'IntersectionObserver' in window){
    var links=[].slice.call(rail.querySelectorAll('a')),map={};
    links.forEach(function(a){var t=document.getElementById(a.getAttribute('href').slice(1));if(t)map[a.getAttribute('href').slice(1)]=a;});
    var ro=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(!e.isIntersecting)return;
        links.forEach(function(a){a.classList.remove('is-on');});
        var a=map[e.target.id];if(a)a.classList.add('is-on');
      });
    },{rootMargin:'-40% 0px -50% 0px',threshold:0});
    Object.keys(map).forEach(function(id){ro.observe(document.getElementById(id));});
  }

  /* FAQ accordion (if present) */
  document.querySelectorAll(".fq").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".fitem");
      var wasOpen = item.classList.contains("open");
      document.querySelectorAll(".fitem.open").forEach(function (o) { o.classList.remove("open"); });
      if (!wasOpen) item.classList.add("open");
    });
  });
})();

/* ── footer receipt, on every page, and a note for whoever opens dev tools ── */
(function(){
  var el=document.getElementById('ftSpeed');
  function stamp(){
    var nav=performance.getEntriesByType&&performance.getEntriesByType('navigation')[0];
    var ms=nav?nav.domContentLoadedEventEnd:0;
    if(el&&ms>0)el.textContent=' Ready in '+(ms/1000).toFixed(2)+' seconds on your connection.';
  }
  if(document.readyState==='complete')stamp();else window.addEventListener('load',stamp);
  try{
    console.log('%cHand-written, start to finish.','font:italic 22px Georgia,serif;color:#2d4a35;padding:6px 0');
    console.log('No framework, no page builder, no build step. View source all you like, it reads the way it was typed.\n\nIf you are a therapist and you opened the console: you are already more technical than most of my clients. Say hi.\nhello@therapistweb.design');
  }catch(e){}
})();
