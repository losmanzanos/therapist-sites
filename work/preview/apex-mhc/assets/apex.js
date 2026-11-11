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

  
  var qs = [].slice.call(document.querySelectorAll('.faq details'));
  qs.forEach(function(d){
    d.addEventListener('toggle', function(){
      if(d.open) qs.forEach(function(o){ if(o!==d) o.open=false; });
    });
  });

  
  var ENDPOINT = '/api/contact';
  var FALLBACK = 'That did not send. Please call <a href="tel:7203185833">720 318 5833</a> or email ' +
                 '<a href="mailto:info@apex-mhc.com">info@apex-mhc.com</a>, and it will get through.';
  var form = document.getElementById('contactForm');
  if(form){
    var errBox = document.getElementById('formErr'),
        sentBox = document.getElementById('sent'),
        btn     = form.querySelector('button[type=submit]'),
        label   = btn ? btn.textContent : 'Send a note';

    var esc = function(t){
      return String(t).replace(/[&<>"]/g, function(c){
        return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
      });
    };

    var fail = function(msg, html){
      if(errBox){
        if(html) errBox.innerHTML = msg; else errBox.textContent = msg;
        errBox.style.display = 'block';
      }
      else { alert(html ? msg.replace(/<[^>]+>/g, '') : msg); }
      if(btn){ btn.disabled = false; btn.textContent = label; }
    };

    
    var confirmSent = function(who, reachBack){
      form.querySelectorAll('.fld, .form-row, button, .form-note, .form-err')
          .forEach(function(n){ n.style.display = 'none'; });

      
      var first = String(who || '').split(/\s+/)[0];
      if(!/^[A-Za-z][A-Za-z'\u2019.-]{0,18}$/.test(first)) first = '';

      sentBox.innerHTML =
        '<svg class="sent-mark" viewBox="0 0 100 66.67" width="45.0" height="30" fill="currentColor" aria-hidden="true" focusable="false"><path d="M1.53 59.89L50 2.99L98.47 59.89L93.53 64.11L50 13.01L6.47 64.11Z"/><path d="M23.53 59.88L50 29.01L76.47 59.88L71.53 64.12L50 38.99L28.47 64.12Z"/></svg>' +
        '<span class="sent-lbl">Sent</span>' +
        '<p class="sent-h">Thank you' + (first ? ', ' + esc(first) : '') + '.</p>' +
        '<p class="sent-p">That is with Dr. Reichert now. He reads these himself and ' +
        'usually replies within one business day' +
        (reachBack ? ', to <b>' + esc(reachBack) + '</b>' : '') + '. ' +
        'If you don&rsquo;t hear back within one business day, please call ' +
        '<a href="tel:7203185833">720 318 5833</a> or email <a href="mailto:info@apex-mhc.com">info@apex-mhc.com</a>.</p>';
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
      if(val('f-co')) return;            

      if(btn){ btn.disabled = true; btn.textContent = 'Sending'; }

      var payload = {
        name: name,
        email: email,
        phone: phone,
        preference: val('f-pref'),
        when: val('f-when') || 'No preference',   
        message: val('f-msg'),
        company: val('f-co')
      };

      fetch(ENDPOINT, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify(payload)
      }).then(function(res){
        return res.json().catch(function(){ return {}; }).then(function(out){
          if(res.ok && out.ok){
            var wantsPhone = /phone|text/i.test(val('f-pref'));
            confirmSent(name, (wantsPhone && phone) ? phone : (email || phone || ''));
            return;
          }
          
          if(res.status === 400 && out.error) fail(out.error);
          else fail(FALLBACK, true);
        });
      }).catch(function(){
        fail(FALLBACK, true);
      });
    });
  }
})();