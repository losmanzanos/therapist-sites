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
