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
    if (ham) ham.addEventListener("click", function () { snav.classList.toggle("open"); ham.setAttribute("aria-expanded", snav.classList.contains("open") ? "true" : "false"); });
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
    if(/^\/contact/.test(location.pathname))console.log('%cAnything below this from calendly.com or recaptcha.net is Calendly talking to itself inside the booking frame. Their frame, their logs.','color:#6b6d78;font-style:italic');
  }catch(e){}
})();

/* footer: 'Last changed' reads the date the page was last published, so nobody has to type it */
(function(){
  var st=document.getElementById('ftStamp');if(!st)return;
  try{
    var d=new Date(document.lastModified);
    if(!isNaN(d)&&d.getFullYear()>=2025)st.textContent=d.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'America/Denver'});
  }catch(e){}
})();

/* footer sign-off knows what time it is in Denver */
(function(){
  var el=document.querySelector('.ft-tagline span');
  if(!el||!/tonight/i.test(el.textContent))return;
  try{
    var hr=+new Intl.DateTimeFormat('en-US',{hour:'numeric',hour12:false,timeZone:'America/Denver'}).format(new Date());
    var line=hr<5?'You\u2019re up late.<br>So am I, usually.':hr<11?'Good morning.<br>Coffee\u2019s on.':hr<17?'That\u2019s the afternoon lineup.<br>Thanks for watching.':null;
    if(line)el.innerHTML=line;
  }catch(e){}
})();

/* contact: the dial picks the project type */
(function(){
  var dp=document.getElementById('dialpick');if(!dp)return;
  var knob=document.getElementById('dpKnob'),lcd=document.getElementById('dpLcd'),
      ins=[].slice.call(dp.querySelectorAll('input[type=radio]'));
  function sync(){
    var i=ins.map(function(r){return r.checked;}).indexOf(true);if(i<0)i=0;
    knob.style.setProperty('--rot',(20+30*i)+'deg');
    lcd.textContent=ins[i].parentNode.querySelector('.dp-t').textContent;
  }
  ins.forEach(function(r){r.addEventListener('change',sync);});
  knob.addEventListener('click',function(){
    var i=ins.map(function(r){return r.checked;}).indexOf(true);
    ins[(i+1)%ins.length].checked=true;sync();
  });
  sync();
})();

/* ── shared interactive bits ── */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* print one element on its own page (the receipt, the quote sheet) */
  window.twdPrint=function(sel){
    var src=document.querySelector(sel);if(!src)return;
    var box=document.createElement('div');box.id='printArea';box.appendChild(src.cloneNode(true));
    document.body.appendChild(box);document.body.classList.add('is-printing');
    var done=function(){document.body.classList.remove('is-printing');if(box.parentNode)box.parentNode.removeChild(box);window.removeEventListener('afterprint',done);};
    window.addEventListener('afterprint',done);
    setTimeout(function(){window.print();setTimeout(done,2000);},40);
  };
  document.querySelectorAll('[data-print]').forEach(function(b){b.addEventListener('click',function(){window.twdPrint(b.getAttribute('data-print'));});});

  /* changing pages is changing the channel: a blink of static on the way out */
  if(!reduce){
    var ov=document.createElement('div');ov.className='chflip';ov.setAttribute('aria-hidden','true');
    var cv=document.createElement('canvas');cv.width=160;cv.height=120;ov.appendChild(cv);
    var osd=document.createElement('span');osd.className='chflip-osd';ov.appendChild(osd);
    document.body.appendChild(ov);
    var ctx=cv.getContext('2d'),raf=0;
    function noise(){var w=cv.width,h=cv.height,img=ctx.createImageData(w,h),d=img.data;for(var i=0;i<d.length;i+=4){var v=(Math.random()*220)|0;d[i]=v;d[i+1]=v;d[i+2]=v+10;d[i+3]=255;}ctx.putImageData(img,0,0);raf=requestAnimationFrame(noise);}
    document.addEventListener('click',function(e){
      var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
      if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button!==0)return;
      if(a.target&&a.target!=='_self')return;
      var href=a.getAttribute('href');if(!href||href.charAt(0)==='#'||/^(mailto:|tel:|javascript:)/i.test(href))return;
      var u;try{u=new URL(a.href,location.href);}catch(x){return;}
      if(u.origin!==location.origin)return;
      if(u.pathname===location.pathname&&u.hash)return;
      e.preventDefault();
      var label=(a.textContent||'').trim().replace(/\s+/g,' ').slice(0,22);
      osd.textContent=label?'CH · '+label.toUpperCase():'CH';
      ov.classList.add('on');noise();
      setTimeout(function(){location.href=a.href;},300);
      setTimeout(function(){cancelAnimationFrame(raf);ov.classList.remove('on');},1400);
    });
    window.addEventListener('pageshow',function(){cancelAnimationFrame(raf);ov.classList.remove('on');});
  }

  /* Denver clock: is the line open? */
  var dn=document.getElementById('denverNow');
  if(dn){
    function tick(){
      try{
        var now=new Date(),f=new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',hour12:true,timeZone:'America/Denver'}),
            hr=+new Intl.DateTimeFormat('en-US',{hour:'numeric',hour12:false,timeZone:'America/Denver'}).format(now),
            day=new Intl.DateTimeFormat('en-US',{weekday:'short',timeZone:'America/Denver'}).format(now),
            wk=!/Sat|Sun/.test(day),open=wk&&hr>=9&&hr<17,t=f.format(now).replace(' AM',' a.m.').replace(' PM',' p.m.');
        dn.innerHTML='<i class="'+(open?'is-open':'')+'"></i>It’s '+t+' in Denver. '+(open?'The line is open; if I don’t pick up, I’m on a call and I’ll ring back.':wk?'After hours. Leave a note and I’ll call in the morning.':'It’s the weekend. Leave a note and I’ll call Monday.');
      }catch(e){}
    }
    tick();setInterval(tick,30000);
  }

  /* journal: topic chips filter the list */
  var jl=document.querySelector('.jlist');
  if(jl){
    var cards=[].slice.call(jl.querySelectorAll('.jcard')),topics=[];
    cards.forEach(function(c){var t=c.querySelector('.jtopic');if(t&&topics.indexOf(t.textContent.trim())<0)topics.push(t.textContent.trim());});
    if(topics.length>1){
      var bar=document.createElement('div');bar.className='jchips';bar.setAttribute('role','group');bar.setAttribute('aria-label','Filter by topic');
      var mk=function(t){var b=document.createElement('button');b.type='button';b.className='jchip';b.textContent=t;b.setAttribute('aria-pressed',t==='All'?'true':'false');b.addEventListener('click',function(){
        bar.querySelectorAll('.jchip').forEach(function(o){o.setAttribute('aria-pressed',o===b?'true':'false');});
        cards.forEach(function(c){var m=t==='All'||c.querySelector('.jtopic').textContent.trim()===t;c.classList.toggle('is-hid',!m);});
      });return b;};
      bar.appendChild(mk('All'));topics.sort().forEach(function(t){bar.appendChild(mk(t));});
      jl.parentNode.insertBefore(bar,jl);
    }
  }

  /* services: the doors open as they come into view */

})();
