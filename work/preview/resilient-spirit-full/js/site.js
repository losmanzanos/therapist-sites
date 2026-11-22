(function () {
  // mobile menu
  var mb = document.querySelector('.top .menu'), nv = document.getElementById('nav');
  if (mb && nv) {
    mb.addEventListener('click', function () {
      var open = nv.classList.toggle('open');
      mb.setAttribute('aria-expanded', open ? 'true' : 'false');
      mb.textContent = open ? 'Close' : 'Menu';
    });
  }

  // "Can you relate" checklist (home)
  var qs = document.querySelectorAll('.qs input'), tally = document.getElementById('tally');
  if (qs.length && tally) {
    var contactHref = tally.getAttribute('data-contact') || '#contact';
    var msg = [
      ['Check any that fit.', 'There is no score. One is enough of a reason to reach out.'],
      ['One is enough.', 'You do not have to be in crisis to deserve help. A free consult is fifteen minutes.'],
      ['This is the kind of thing we treat every week.', 'Two or more of these usually means the pattern is costing you more than it looks like from the outside.'],
      ['You have been carrying a lot.', 'Most people who check this many have been holding it together for years. You can set some of it down.']
    ];
    var upd = function () {
      var n = 0;
      qs.forEach(function (c) { if (c.checked) n++; });
      var m = n >= 5 ? msg[3] : n >= 2 ? msg[2] : n === 1 ? msg[1] : msg[0];
      tally.innerHTML = '<b>' + m[0] + '</b>' + m[1] + (n ? ' <a href="' + contactHref + '">Request a consult.</a>' : '');
    };
    qs.forEach(function (c) { c.addEventListener('change', upd); });
  }

  // approach tabs (home)
  var tabs = document.querySelectorAll('#tabs [role=tab]');
  var pick = function (b, focus) {
    tabs.forEach(function (x) { x.setAttribute('aria-selected', 'false'); x.setAttribute('tabindex', '-1'); });
    b.setAttribute('aria-selected', 'true'); b.setAttribute('tabindex', '0');
    document.querySelectorAll('#tabs .pane').forEach(function (p) { p.classList.remove('on'); });
    document.getElementById('p-' + b.getAttribute('data-p')).classList.add('on');
    if (focus) b.focus();
  };
  tabs.forEach(function (b, i) {
    b.addEventListener('click', function () { pick(b); });
    b.addEventListener('keydown', function (e) {
      var d = (e.key === 'ArrowDown' || e.key === 'ArrowRight') ? 1 : (e.key === 'ArrowUp' || e.key === 'ArrowLeft') ? -1 : 0;
      if (!d) return;
      e.preventDefault();
      pick(tabs[(i + d + tabs.length) % tabs.length], true);
    });
  });

  // contact form
  var form = document.getElementById('consult');
  if (form) {
    var PHONE = '(843) 212-6965', EMAIL = 'info@resilientspiritsc.org';
    var err = form.querySelector('.err'), btn = form.querySelector('button[type=submit]');
    var fail = function (text) {
      err.hidden = false;
      err.innerHTML = text + ' Please call or text <a href="tel:+18432126965">' + PHONE + '</a> or email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.';
      btn.disabled = false; btn.textContent = 'Request a free consult';
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      err.hidden = true;
      if (!form.reportValidity()) return;
      // The form only sends from the practice's own domain. On a preview link it stays unconnected.
      var host = location.hostname;
      var live = /(^|\.)resilientspiritsc\.org$/.test(host) || /\.pages\.dev$/.test(host);
      if (!live) { fail('This form is not connected on the preview link yet.'); return; }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      btn.disabled = true; btn.textContent = 'Sending';
      fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok && j.ok !== false }; }); })
        .then(function (res) {
          if (!res.ok) { fail('Something went wrong and your message did not send.'); return; }
          form.innerHTML = '<div class="msg" role="status" tabindex="-1"><h3>Got it. Thank you for reaching out.</h3>' +
            '<p>You will hear back within one business day to set up your free 15 minute call.</p>' +
            '<p>A confirmation email is on its way to you now. Replies sometimes land in spam, so check there too.</p>' +
            '<p>If two business days go by with nothing, call or text <a href="tel:+18432126965">' + PHONE + '</a> or email <a href="mailto:' + EMAIL + '">' + EMAIL + '</a>.</p></div>';
          form.querySelector('.msg').focus();
        })
        .catch(function () { fail('Something went wrong and your message did not send.'); });
    });
  }
})();

(function () {
  // anxiety draft: strike through old drafts once it scrolls into view
  var d = document.querySelector('.draft');
  if (d) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { d.classList.add('go'); io.disconnect(); } }); }, { threshold: .4 });
      io.observe(d);
    } else d.classList.add('go');
  }
  // OCD loop toggle
  var lp = document.querySelector('.loop'), lb = document.querySelector('.loopbtn'), lc = document.querySelector('.loopcap');
  if (lp && lb) {
    lb.addEventListener('click', function () {
      var on = lp.classList.toggle('erp');
      lb.setAttribute('aria-pressed', on ? 'true' : 'false');
      lb.textContent = on ? 'Show the OCD loop again' : 'Now show it with ERP';
      lp.querySelectorAll('[data-a]').forEach(function (el) { el.innerHTML = el.getAttribute(on ? 'data-b' : 'data-a'); });
      if (lc) lc.textContent = on ? lc.getAttribute('data-b') : lc.getAttribute('data-a');
    });
  }
  // eating disorder rules
  document.querySelectorAll('.rules button').forEach(function (b) {
    b.addEventListener('click', function () { b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'); });
  });
})();

(function () {
  var b = document.querySelectorAll('.seg [role=tab]');
  b.forEach(function (x) {
    x.addEventListener('click', function () {
      b.forEach(function (y) { y.setAttribute('aria-selected', 'false'); document.getElementById(y.getAttribute('aria-controls')).classList.remove('on'); });
      x.setAttribute('aria-selected', 'true'); document.getElementById(x.getAttribute('aria-controls')).classList.add('on');
    });
  });
})();
