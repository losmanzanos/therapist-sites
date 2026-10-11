(function(){
  var b=document.getElementById('bgr'), s=document.getElementById('sheet');
  b.addEventListener('click',function(){
    var on=s.classList.toggle('on');
    b.classList.toggle('on',on);
    b.setAttribute('aria-expanded',on?'true':'false');
    document.body.style.overflow=on?'hidden':'';
  });
  s.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){
    s.classList.remove('on');b.classList.remove('on');document.body.style.overflow='';
  });});

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* survey plate: crosshair with a live coordinate readout.
     the plate frames lon -107.383..-105.106, lat 39.83..37.97 */
  var plate = document.getElementById('plate'),
      xh = document.getElementById('xh'),
      read = document.getElementById('read');
  if(plate && xh && read){
    var L0=-107.383, L1=-105.106, T0=39.83, T1=37.97;
    var vx=xh.querySelector('.vx'), hz=xh.querySelector('.hz'), dot=xh.querySelector('b');
    plate.addEventListener('mousemove', function(e){
      var r = plate.getBoundingClientRect();
      var px = (e.clientX - r.left)/r.width, py = (e.clientY - r.top)/r.height;
      px = Math.min(1,Math.max(0,px)); py = Math.min(1,Math.max(0,py));
      vx.style.left = (px*100)+'%'; hz.style.top = (py*100)+'%';
      dot.style.left = (px*100)+'%'; dot.style.top = (py*100)+'%';
      var lon = L0 + px*(L1-L0), lat = T0 + py*(T1-T0);
      read.innerHTML = lat.toFixed(2)+'&deg; N &middot; '+Math.abs(lon).toFixed(2)+'&deg; W';
    });
    plate.addEventListener('mouseleave', function(){
      read.innerHTML = '39.10&deg; N &middot; 106.45&deg; W';
    });
  }

  /* contours drift a little against the scroll */
  if(!reduce){
    var drifters = [].slice.call(document.querySelectorAll('.topo-why,.topo-end'));
    var ticking = false;
    function drift(){
      drifters.forEach(function(el){
        var r = el.parentElement.getBoundingClientRect();
        var p = (r.top + r.height/2 - window.innerHeight/2) / window.innerHeight;
        el.style.setProperty('--dy', (p * -26).toFixed(1)+'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', function(){
      if(!ticking){ ticking = true; requestAnimationFrame(drift); }
    }, {passive:true});
    drift();
  }

  /* only one question open at a time */
  var qs = [].slice.call(document.querySelectorAll('.faq details'));
  qs.forEach(function(d){
    d.addEventListener('toggle', function(){
      if(d.open) qs.forEach(function(o){ if(o!==d) o.open=false; });
    });
  });

  /* contact form, sent through EmailJS */
  var EMAILJS = {
    publicKey:   'EZ1_vPxKEY_JYRq0i',
    serviceId:   'service_clturff',
    templateId:  'template_s3lwtvr',   /* the notification that goes to the practice */
    replyToUser: 'template_68shrs6'    /* the acknowledgment that goes to the sender */
  };
  var form = document.getElementById('contactForm');
  if(form){
    var sdk = document.createElement('script');
    sdk.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    sdk.onload = function(){ if(window.emailjs) emailjs.init({publicKey: EMAILJS.publicKey}); };
    document.head.appendChild(sdk);

    var errBox = document.getElementById('formErr'),
        sentBox = document.getElementById('sent'),
        btn     = form.querySelector('button[type=submit]'),
        label   = btn ? btn.textContent : 'Send a note';

    var esc = function(t){
      return String(t).replace(/[&<>"]/g, function(c){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
      });
    };

    var fail = function(msg){
      if(errBox){ errBox.textContent = msg; errBox.style.display = 'block'; }
      else { alert(msg); }
      if(btn){ btn.disabled = false; btn.textContent = label; }
    };

    /* The confirmation. Built here rather than sitting in the markup so the two
       forms cannot drift apart, and so it can name the address the reply is
       going to, which catches a typo while the person is still on the page. */
    var confirmSent = function(who, reachBack){
      form.querySelectorAll('.fld, .form-row, button, .form-note, .form-err')
          .forEach(function(n){ n.style.display = 'none'; });

      /* first name only, and only if it reads like one */
      var first = String(who || '').split(/\s+/)[0];
      if(!/^[A-Za-z][A-Za-z'\u2019.-]{0,18}$/.test(first)) first = '';

      sentBox.innerHTML =
        '<svg class="sent-mark" viewBox="0 0 100 66.67" width="45.0" height="30" fill="currentColor" aria-hidden="true" focusable="false"><path d="M1.53 59.89L50 2.99L98.47 59.89L93.53 64.11L50 13.01L6.47 64.11Z"/><path d="M23.53 59.88L50 29.01L76.47 59.88L71.53 64.12L50 38.99L28.47 64.12Z"/></svg>' +
        '<span class="sent-lbl">Sent</span>' +
        '<p class="sent-h">Thank you' + (first ? ', ' + esc(first) : '') + '.</p>' +
        '<p class="sent-p">That is with Dr. Reichert now. He reads these himself and ' +
        'usually replies within one business day' +
        (reachBack ? ', to <b>' + esc(reachBack) + '</b>' : '') + '. ' +
        'If it is more urgent than that, calling 720 318 5833 is faster.</p>';
      sentBox.style.display = 'block';

      var still = !window.matchMedia || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      try { sentBox.scrollIntoView({behavior: still ? 'smooth' : 'auto', block: 'start'}); }
      catch(e){ sentBox.scrollIntoView(); }
      try { sentBox.focus({preventScroll: true}); } catch(e){ sentBox.focus(); }
    };

    form.addEventListener('submit', function(e){
      e.preventDefault();
      if(errBox) errBox.style.display = 'none';
      form.querySelectorAll('.fld').forEach(function(f){ f.classList.remove('bad'); });

      var val = function(id){ var el = document.getElementById(id); return el ? el.value.trim() : ''; };
      var name = val('f-name'), email = val('f-email'), phone = val('f-phone');

      if(!name){ document.getElementById('f-name').parentNode.classList.add('bad');
        return fail('Please add your name.'); }
      if(!email && !phone){ document.getElementById('f-email').parentNode.classList.add('bad');
        return fail('Please leave either an email address or a phone number so he can reply.'); }
      if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){
        document.getElementById('f-email').parentNode.classList.add('bad');
        return fail('That email address does not look right. Please check it.'); }
      if(val('f-co')) return;            /* bot filled the hidden field */

      if(!window.emailjs) return fail('The form did not load. Please call ' + '720 318 5833' + ' or email instead.');

      if(btn){ btn.disabled = true; btn.textContent = 'Sending'; }

      emailjs.send(EMAILJS.serviceId, EMAILJS.templateId, {
        from_name: name,
        from_email: email || 'not given',
        reply_to: email || '',
        phone: phone || 'not given',
        preference: val('f-pref'),
        best_time: val('f-when') || 'No preference',   /* the short homepage form does not ask */
        message: val('f-msg') || 'no message',
        sent_at: new Date().toLocaleString('en-US')
      }).then(function(){
        /* Acknowledge to the person who wrote, but only when there is an address to
           send it to. A phone-only inquiry gets the on-page confirmation and nothing
           else, which is correct: an email to nowhere is a bounce, not a courtesy. */
        if(email){
          emailjs.send(EMAILJS.serviceId, EMAILJS.replyToUser, {
            from_name: name,
            reply_to: email,
            sent_at: new Date().toLocaleString('en-US')
          }).catch(function(){});   /* never let this block the confirmation */
        }
        var wantsPhone = /phone|text/i.test(val('f-pref'));
        confirmSent(name, (wantsPhone && phone) ? phone : (email || phone || ''));
      }, function(){
        fail('That did not send. Please call ' + '720 318 5833' + ' or email instead, and it will get through.');
      });
    });
  }
})();