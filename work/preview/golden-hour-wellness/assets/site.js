/* Golden Hour Wellness: shared behavior (v2, contact, 404) */
(function () {
  'use strict';

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- sticky header + measured height -------------------------------- */
  var header = document.getElementById('header');

  /* --header-h is everything stacked above the hero, not just the header
     itself; the preview version bar sits above it and would otherwise push
     the trust strip below the fold. Measuring the hero's offset from the top
     of the document covers any number of bars without hardcoding them. */
  function measureHeader() {
    if (!header) return;
    var hero = document.querySelector('.hero');
    var above = hero ? hero.offsetTop : header.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--header-h', Math.round(above) + 'px');
  }

  if (header) {
    measureHeader();
    window.addEventListener('load', measureHeader);   // re-measure once webfonts land
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- mobile nav ------------------------------------------------------ */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
    });
  }

  /* ---- Thrizer frame sizing -------------------------------------------
     Thrizer emits no resize event and we can't measure across origins, so
     height is a lookup keyed on the FRAME's measured width; Thrizer's own
     reflow points are 768px and 480px of frame width, which sit close to
     our breakpoints, so keying off the viewport reintroduces a gap.
     BLEED must exceed the ~18px of blank canvas Thrizer pads below its own
     card border: if the iframe is shorter than their document, their page
     scrolls and a scrollbar appears. The wrapper clips the excess.        */
  var benefitsFrame = document.querySelector('.frame-benefits');
  var benefitsClip  = document.querySelector('.benefits-clip');
  var BLEED = 24;

  function sizeBenefitsFrame() {
    if (!benefitsClip || !benefitsFrame) return;
    var w = benefitsClip.getBoundingClientRect().width;
    if (!w) return;                                   // hidden tab
    var h = w >= 768 ? 464 : w >= 480 ? 670 : 882;    // measured against the live widget
    benefitsClip.style.height  = h + 'px';
    benefitsFrame.style.height = (h + BLEED) + 'px';
  }

  var sizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(sizeTimer);
    sizeTimer = setTimeout(function () { measureHeader(); sizeBenefitsFrame(); }, 120);
  });

  /* ---- tabs ------------------------------------------------------------ */
  var tabs = [].slice.call(document.querySelectorAll('[role="tab"]'));

  function hydrate(panel) {
    var frame = panel.querySelector('iframe[data-src]');
    if (frame) { frame.src = frame.getAttribute('data-src'); frame.removeAttribute('data-src'); }
  }

  function selectTab(tab, focus) {
    tabs.forEach(function (t) {
      var panel = document.getElementById(t.getAttribute('aria-controls'));
      var on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      panel.hidden = !on;
      if (on) { hydrate(panel); sizeBenefitsFrame(); }
    });
    if (focus) tab.focus();
  }

  if (tabs.length) {
    hydrate(document.getElementById(tabs[0].getAttribute('aria-controls')));

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        else if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === 'Home') next = tabs[0];
        else if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true); }
      });
    });

    if (/benefits/i.test(location.hash)) selectTab(tabs[1]);

    if (!window.__acuityEmbedLoaded) {
      window.__acuityEmbedLoaded = true;
      var s = document.createElement('script');
      s.src = 'https://embed.acuityscheduling.com/js/embed.js';
      s.async = true;
      document.body.appendChild(s);
    }
  }

  /* ---- today's golden hour, Colorado ----------------------------------
     NOAA solar equations. No API, no key, works offline. Golden hour is
     taken as the hour before sunset, which is the common photographic
     definition and close enough for a footer line.
     Times render via Intl in America/Denver, so DST is handled for us.   */
  var ghEl = document.getElementById('ghTime');

  if (ghEl) {
    var LAT = 39.7392, LON = -104.9903;   // Denver

    function sunsetUTC(d) {
      var start = Date.UTC(d.getUTCFullYear(), 0, 0);
      var day = Math.floor((Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - start) / 86400000);
      var g = (2 * Math.PI / 365) * (day - 1);

      var eq = 229.18 * (0.000075
        + 0.001868 * Math.cos(g)     - 0.032077 * Math.sin(g)
        - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));

      var dec = 0.006918
        - 0.399912 * Math.cos(g)     + 0.070257 * Math.sin(g)
        - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g)
        - 0.002697 * Math.cos(3 * g) + 0.001480 * Math.sin(3 * g);

      var latR = LAT * Math.PI / 180;
      var cosH = Math.cos(90.833 * Math.PI / 180) / (Math.cos(latR) * Math.cos(dec))
               - Math.tan(latR) * Math.tan(dec);
      if (cosH > 1 || cosH < -1) return null;            // no sunset (polar)

      var ha = Math.acos(cosH) * 180 / Math.PI;
      var mins = 720 - 4 * (LON - ha) - eq;              // minutes UTC
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) + mins * 60000);
    }

    var fmt = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric', minute: '2-digit', timeZone: 'America/Denver'
    });

    var sunset = sunsetUTC(new Date());
    if (sunset) {
      var start = new Date(sunset.getTime() - 60 * 60000);
      ghEl.textContent = fmt.format(start).replace(/\s?[AP]M$/i, '') + ' to ' + fmt.format(sunset);
    } else {
      // never leave a dangling ellipsis if the maths bails
      var wrap = ghEl.closest('.goldenhour');
      if (wrap) wrap.style.display = 'none';
    }
  }

  /* ---- scroll reveal --------------------------------------------------- */
  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry, i) {
      if (entry.isIntersecting) {
        setTimeout(function () { entry.target.classList.add('in'); }, i * 70);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
  items.forEach(function (el) { io.observe(el); });
})();
