(function(){
  var z=10, active=null, sx, sy, ox, oy;
  var coarse=window.matchMedia('(pointer:coarse)').matches;
  var hint=document.getElementById('loom-hint'); if(coarse && hint) hint.textContent='Tap a swatch to shuffle the stack';
  document.querySelectorAll('.loom').forEach(function(loom){
  loom.querySelectorAll('.sw').forEach(function(el){
    el.addEventListener('pointerdown',function(e){
      if(e.pointerType==='touch') return;
      active=el; el.setPointerCapture(e.pointerId); el.classList.add('drag'); el.style.zIndex=++z;
      var r=el.getBoundingClientRect(), p=loom.getBoundingClientRect();
      sx=e.clientX; sy=e.clientY; ox=r.left-p.left; oy=r.top-p.top;
    });
    el.addEventListener('pointermove',function(e){
      if(active!==el) return;
      var p=loom.getBoundingClientRect();
      var nx=Math.max(-el.offsetWidth*.5,Math.min(p.width-el.offsetWidth*.5,ox+e.clientX-sx));
      var ny=Math.max(-el.offsetHeight*.3,Math.min(p.height-el.offsetHeight*.6,oy+e.clientY-sy));
      el.style.left=(nx/p.width*100)+'%'; el.style.top=(ny/p.height*100)+'%';
    });
    function end(){ if(active===el){ active=null; el.classList.remove('drag'); } }
    el.addEventListener('pointerup',end); el.addEventListener('pointercancel',end);
    el.addEventListener('click',function(){
      if(!coarse) return;
      var p=loom.getBoundingClientRect();
      el.classList.add('hop'); el.style.zIndex=++z;
      var nx=Math.max(0,Math.min(p.width-el.offsetWidth,el.offsetLeft+(Math.random()-.5)*p.width*.16));
      var ny=Math.max(0,Math.min(p.height-el.offsetHeight,el.offsetTop+(Math.random()-.5)*p.height*.14));
      el.style.left=(nx/p.width*100)+'%'; el.style.top=(ny/p.height*100)+'%';
    });
    el.addEventListener('keydown',function(e){
      var d={ArrowLeft:[-2,0],ArrowRight:[2,0],ArrowUp:[0,-2],ArrowDown:[0,2]}[e.key]; if(!d) return;
      e.preventDefault(); el.style.zIndex=++z;
      var p=loom.getBoundingClientRect();
      el.style.left=((el.offsetLeft/p.width*100)+d[0])+'%'; el.style.top=((el.offsetTop/p.height*100)+d[1])+'%';
    });
  });
  });
})();

(function(){
  var TAU=Math.PI*2, still=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fit(cv){ var r=cv.getBoundingClientRect(), d=Math.min(window.devicePixelRatio||1,2); cv.width=Math.max(1,Math.round(r.width*d)); cv.height=Math.max(1,Math.round(r.height*d)); var c=cv.getContext('2d'); c.setTransform(d,0,0,d,0,0); return {c:c,w:r.width,h:r.height}; }
  function draw(c,segs,ink,lw,upto){ c.beginPath(); for(var i=0;i<Math.min(upto,segs.length);i++){ var s=segs[i]; c.moveTo(s[0],s[1]); c.lineTo(s[2],s[3]); } c.strokeStyle=ink; c.lineWidth=lw; c.stroke(); }
  // thread layouts: each returns a list of [x1,y1,x2,y2]
  var SEG={
    star:function(w,h){ var o=[],n=30,P=[[0,0,w,h],[w,0,0,h]],x=w*.36,y=h*.64; P.forEach(function(q){ for(var i=0;i<=n;i++){ var t=i/n; o.push([q[0]+(x-q[0])*t,q[1]+(y-q[1])*t,x+(q[2]-x)*t,y+(q[3]-y)*t]); } }); return o; },
    chord:function(w,h){ var o=[],n=120,r=Math.min(w,h)*.42,cx=w/2,cy=h/2; for(var i=0;i<n;i++){ var a=i/n*TAU-TAU/4,b=(i*2)%n/n*TAU-TAU/4; o.push([cx+r*Math.cos(a),cy+r*Math.sin(a),cx+r*Math.cos(b),cy+r*Math.sin(b)]); } return o; },
    pair:function(w,h){ var o=[],n=26,a=[w*.3,h*.38],b=[w*.7,h*.62]; for(var i=0;i<=n;i++){ var t=i/n; o.push([a[0]-w*.22+w*.44*t,a[1]-h*.25,b[0]+w*.22-w*.44*t,b[1]+h*.25]); } return o; },
    stars:function(w,h){ var p=[[.2,.3],[.45,.18],[.78,.28],[.3,.62],[.6,.5],[.82,.7],[.5,.82]].map(function(q){ return [q[0]*w,q[1]*h]; }),o=[]; for(var i=0;i<p.length;i++) for(var j=i+1;j<p.length;j++) o.push([p[i][0],p[i][1],p[j][0],p[j][1]]); return o; },
    fan:function(w,h){ var o=[],n=24,x=w*.5,y=h*.92; for(var i=0;i<=n;i++){ o.push([x,y,i/n*w,0]); } for(var k=1;k<=8;k++){ o.push([x,y,0,k/8*h*.9]); o.push([x,y,w,k/8*h*.9]); } return o; },
    warp:function(w,h){ var o=[],n=34; for(var i=0;i<=n;i++){ o.push([i/n*w,0,w*.5+(i/n-.5)*w*.18,h]); } for(var j=0;j<=n;j++){ o.push([0,j/n*h,w,h-j/n*h]); } return o; },
    rays:function(w,h){ var o=[],n=44; for(var i=0;i<=n;i++){ o.push([w,h*.08,i/n*w,h]); } return o; }
  };
  var queue=[];
  function piece(el){
    var cv=el.querySelector('canvas'), f=SEG[el.getAttribute('data-art')], ink=el.getAttribute('data-ink');
    if(!cv||!f) return;
    var st={done:still?1e9:0};
    function paint(){ var g=fit(cv), segs=f(g.w,g.h); g.c.clearRect(0,0,g.w,g.h); draw(g.c,segs,ink,g.w<120?.6:.8,st.done); return segs.length; }
    el._paint=paint; queue.push(el);
    if(still){ paint(); return; }
    var go=function(){ var n=paint(), t0=performance.now(); (function step(t){ st.done=Math.ceil(Math.min(1,(t-t0)/1100)*n); paint(); if(st.done<n) requestAnimationFrame(step); })(t0); };
    if('IntersectionObserver' in window){ new IntersectionObserver(function(es,o){ es.forEach(function(e){ if(e.isIntersecting){ o.disconnect(); go(); } }); },{threshold:.3}).observe(el); } else go();
    paint();
  }
  document.querySelectorAll('[data-art]').forEach(piece);
  var rt; window.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ queue.forEach(function(el){ el._paint(); }); if(window._artResize) window._artResize.forEach(function(f){ f(); }); },120); });
  window._artResize=[];

  // evergreen: six meetings, one drawing
  var pins=document.getElementById('pins');
  if(pins){
    var pcv=pins.querySelector('canvas'), add=pins.querySelector('.pins-add'), say=pins.querySelector('.pins-say'), met=0;
    var K=[2,3,5,7,11,13], COL=['#1f2f6b','#c8412b','#8f74c9','#f0672f','#121934','#1f2f6b'];
    function pp(){ var g=fit(pcv),c=g.c,n=90,r=Math.min(g.w,g.h)*.42,cx=g.w/2,cy=g.h/2; c.clearRect(0,0,g.w,g.h);
      for(var m=0;m<met;m++){ var s=[]; for(var i=0;i<n;i++){ var a=i/n*TAU-TAU/4,b=(i*K[m])%n/n*TAU-TAU/4; s.push([cx+r*Math.cos(a),cy+r*Math.sin(a),cx+r*Math.cos(b),cy+r*Math.sin(b)]); } draw(c,s,COL[m],.75,1e9); }
      c.fillStyle='#121934'; for(var j=0;j<n;j++){ var t=j/n*TAU; c.beginPath(); c.arc(cx+r*Math.cos(t),cy+r*Math.sin(t),1.6,0,TAU); c.fill(); } }
    pp(); window._artResize.push(pp);
    add.addEventListener('click',function(){
      if(met>=6){ met=0; add.textContent='Add a meeting'; say.textContent='Six meetings, one pin board'; pp(); return; }
      met++; pp();
      say.textContent= met<6 ? 'Meeting '+met+' of 6' : 'Six meetings. That covers the ten hours.';
      if(met>=6) add.textContent='Start over';
    });
  }

  // individual: two pins, threads between them
  var pb=document.getElementById('pairband');
  if(pb){
    var board=pb.querySelector('.pb-board'), bcv=board.querySelector('canvas'), pinsEl=[].slice.call(board.querySelectorAll('.pb-pin')), P=[[.28,.42],[.72,.6]];
    function bp(){ var g=fit(bcv),c=g.c,n=34,s=[]; c.clearRect(0,0,g.w,g.h);
      var a=[P[0][0]*g.w,P[0][1]*g.h], b=[P[1][0]*g.w,P[1][1]*g.h], dx=b[0]-a[0], dy=b[1]-a[1], L=Math.hypot(dx,dy)||1, nx=-dy/L, ny=dx/L, sp=Math.min(g.w,g.h)*.42;
      for(var i=0;i<=n;i++){ var t=i/n-.5; s.push([a[0]+nx*sp*t,a[1]+ny*sp*t,b[0]-nx*sp*t,b[1]-ny*sp*t]); }
      draw(c,s,'#f4efe3',.9,1e9);
      pinsEl.forEach(function(el,k){ el.style.left=(P[k][0]*100)+'%'; el.style.top=(P[k][1]*100)+'%'; }); }
    bp(); window._artResize.push(bp);
    pinsEl.forEach(function(el,k){
      var on=false;
      el.addEventListener('pointerdown',function(e){ on=true; el.setPointerCapture(e.pointerId); el.style.cursor='grabbing'; });
      el.addEventListener('pointermove',function(e){ if(!on) return; var r=board.getBoundingClientRect(); P[k]=[Math.max(.04,Math.min(.96,(e.clientX-r.left)/r.width)),Math.max(.06,Math.min(.94,(e.clientY-r.top)/r.height))]; bp(); });
      function up(){ on=false; el.style.cursor=''; } el.addEventListener('pointerup',up); el.addEventListener('pointercancel',up);
      el.addEventListener('keydown',function(e){ var d={ArrowLeft:[-.03,0],ArrowRight:[.03,0],ArrowUp:[0,-.04],ArrowDown:[0,.04]}[e.key]; if(!d) return; e.preventDefault(); P[k]=[Math.max(.04,Math.min(.96,P[k][0]+d[0])),Math.max(.06,Math.min(.94,P[k][1]+d[1]))]; bp(); });
    });
  }

  // trauma group: point at anyone
  var stb=document.getElementById('stars');
  if(stb){
    var sb=stb.querySelector('.st-board'), scv=sb.querySelector('canvas'), hot=-1;
    var SP=[[.12,.3],[.3,.14],[.52,.22],[.74,.12],[.9,.36],[.8,.7],[.56,.84],[.32,.78],[.16,.62],[.5,.5]];
    function sp(){ var g=fit(scv),c=g.c,pts=SP.map(function(q){ return [q[0]*g.w,q[1]*g.h]; }); c.clearRect(0,0,g.w,g.h);
      var ring=[]; for(var i=0;i<pts.length-1;i++){ var j=(i+1)%(pts.length-1); ring.push([pts[i][0],pts[i][1],pts[j][0],pts[j][1]]); }
      c.globalAlpha=.35; draw(c,ring,'#b9a4dc',.8,1e9); c.globalAlpha=1;
      if(hot>=0){ var s=[]; pts.forEach(function(p,k){ if(k!==hot){ for(var m=-3;m<=3;m++){ s.push([pts[hot][0]+m*2.2,pts[hot][1],p[0],p[1]+m*1.4]); } } }); draw(c,s,'#f4efe3',.6,1e9); }
      pts.forEach(function(p,k){ c.beginPath(); c.arc(p[0],p[1],k===hot?7:4.5,0,TAU); c.fillStyle=k===hot?'#f0672f':'#f4efe3'; c.fill(); }); }
    sp(); window._artResize.push(sp);
    function near(e){ var r=sb.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height,best=-1,bd=.02; SP.forEach(function(q,k){ var d=Math.pow((q[0]-x)*r.width,2)+Math.pow((q[1]-y)*r.height,2); d=Math.sqrt(d)/r.width; if(d<.12 && (best<0||d<bd)){ best=k; bd=d; } }); return best; }
    sb.addEventListener('pointermove',function(e){ var k=near(e); if(k!==hot && k>=0){ hot=k; sp(); } });
    sb.addEventListener('pointerdown',function(e){ var k=near(e); if(k>=0){ hot=k; sp(); } });
  }

  // practice day: chairs
  var ch=document.getElementById('chairs');
  if(ch){
    var SAYC={1:'You run the protocol with a colleague as your client, and I correct as you go.',2:'You play the client, so you know what the protocol feels like from the other chair.'};
    ch.setAttribute('data-c','1');
    var cs=ch.querySelector('.ch-say');
    function seat(n){ ch.setAttribute('data-c',n); ch.querySelectorAll('.ch-ui button').forEach(function(b){ b.setAttribute('aria-selected',b.getAttribute('data-c')==n?'true':'false'); }); cs.textContent=SAYC[n]; }
    ch.querySelectorAll('.ch-ui button').forEach(function(b){ b.addEventListener('click',function(){ seat(b.getAttribute('data-c')); }); });
    ch.querySelectorAll('.ch').forEach(function(b){ b.addEventListener('click',function(){ seat(b.getAttribute('data-c')); }); });
  }

  // training: weave a team
  var lm=document.getElementById('loomer');
  if(lm){
    var lcv=lm.querySelector('canvas'), rng=lm.querySelector('input'), ln=lm.querySelector('.lm-n'), ls=lm.querySelector('.lm-say');
    var C=['#1f2f6b','#c8412b','#b9a4dc','#f0672f','#121934','#f2a36e'];
    function lp(){ var g=fit(lcv),c=g.c,n=+rng.value,cols=Math.ceil(Math.sqrt(n)),rows=Math.ceil(n/cols),pad=g.w*.08,cw=(g.w-2*pad)/cols,chh=(g.h-2*pad)/rows; c.clearRect(0,0,g.w,g.h);
      for(var i=0;i<n;i++){ var x=pad+(i%cols)*cw, y=pad+Math.floor(i/cols)*chh, col=C[(i*7+Math.floor(i/cols))%C.length], k=Math.max(5,Math.round(Math.min(cw,chh)/3.4)); c.strokeStyle=col; c.lineWidth=Math.max(1.2,Math.min(cw,chh)/k*.55); c.beginPath();
        for(var j=0;j<=k;j++){ var t=(j+.5)/(k+1); if((i+Math.floor(i/cols))%2){ c.moveTo(x+t*cw,y); c.lineTo(x+t*cw,y+chh); } else { c.moveTo(x,y+t*chh); c.lineTo(x+cw,y+t*chh); } } c.stroke(); }
      ln.textContent=n;
      ls.textContent = n<=8 ? 'Small enough for a working session. We can go deep on your own cases.' : n<=30 ? 'A full day works well for a team this size, with consultation after.' : 'A series works better here, so everyone gets time to practice.';
    }
    lp(); window._artResize.push(lp); rng.addEventListener('input',lp);
  }

  // courses: a tile follows you down the list
  var list=document.querySelector('.courses');
  if(list && window.matchMedia('(hover:hover)').matches){
    var tile=document.createElement('div'); tile.className='ctile'; tile.setAttribute('aria-hidden','true'); document.body.appendChild(tile);
    var TC=['#c8412b','#1f2f6b','#f0672f','#b9a4dc','#121934','#f2a36e','#1f2f6b'];
    list.querySelectorAll('.course').forEach(function(a,i){
      a.addEventListener('mouseenter',function(){ tile.style.background=TC[i%TC.length]; tile.style.color=(TC[i%TC.length]==='#b9a4dc'||TC[i%TC.length]==='#f2a36e')?'#121934':'#f4efe3'; tile.textContent=(a.querySelector('.mono')||{}).textContent||''; tile.classList.add('on'); });
      a.addEventListener('mouseleave',function(){ tile.classList.remove('on'); });
      a.addEventListener('mousemove',function(e){ tile.style.left=(e.clientX+110)+'px'; tile.style.top=e.clientY+'px'; });
    });
  }
})();

(function(){
  document.querySelectorAll('.nywall').forEach(function(w){
    if('IntersectionObserver' in window){ new IntersectionObserver(function(es,o){ es.forEach(function(e){ if(e.isIntersecting){ w.classList.add('seen'); o.disconnect(); } }); },{threshold:.35}).observe(w); } else w.classList.add('seen');
  });
  document.querySelectorAll('.tab').forEach(function(t){
    t.addEventListener('click',function(){ setTimeout(function(){ t.classList.add('torn'); },60); });
  });
})();

(function(){
  // home: tap to see why something is there (hover does it on a mouse)
  var nb=document.getElementById('notes');
  if(nb){ var ps=[].slice.call(nb.querySelectorAll('.piece'));
    var out=document.querySelector('.pn-out');
    ps.forEach(function(p){ p.addEventListener('click',function(e){ var on=!p.classList.contains('on'); ps.forEach(function(q){ q.classList.remove('on'); }); if(on) p.classList.add('on'); if(out) out.innerHTML=on?p.querySelector('.pn').innerHTML:''; e.stopPropagation(); }); });
    document.addEventListener('click',function(){ ps.forEach(function(q){ q.classList.remove('on'); }); });
  }
  // consultation: which one do I need
  var wh=document.getElementById('which');
  if(wh){ var bs=[].slice.call(wh.querySelectorAll('.wh-opts button')), as=[].slice.call(wh.querySelectorAll('.wh-a')), hand=wh.querySelector('.wh-hand');
    bs.forEach(function(b,i){ b.addEventListener('click',function(){
      bs.forEach(function(x){ x.setAttribute('aria-selected','false'); }); b.setAttribute('aria-selected','true');
      as.forEach(function(a){ a.classList.toggle('on',a.getAttribute('data-i')==i); });
      var hr=hand.getBoundingClientRect(), br=b.getBoundingClientRect(), ox=hr.left+hr.width*.85, oy=hr.top+hr.height*.5;
      var ang=Math.atan2((br.top+br.height/2)-oy,(br.right)-ox)*180/Math.PI-180;
      hand.style.setProperty('--rot',Math.max(-60,Math.min(60,ang))+'deg');
    }); });
  }
  // individual: the case in one line becomes an email
  var nf=document.getElementById('nb');
  if(nf) nf.addEventListener('submit',function(e){ e.preventDefault(); var t=nf.querySelector('textarea').value.trim();
    location.href='mailto:sf@sarahfreezelcsw.com?subject='+encodeURIComponent('Individual consultation')+'&body='+encodeURIComponent((t?'The case, in one line: '+t+'\n\n':'')+'A few times that work for me:\n'); });
  // evergreen: tear the stub and the email opens
  var tk=document.getElementById('ticket');
  if(tk) tk.addEventListener('click',function(){ tk.classList.add('torn'); setTimeout(function(){ tk.classList.remove('torn'); },2500); });
  // courses: go through the deck
  var dk=document.getElementById('deck');
  if(dk){ var cs=[].slice.call(dk.querySelectorAll('.dk-card')), top=0;
    function lay(){ cs.forEach(function(c,i){ var p=(i-top+cs.length)%cs.length; c.style.setProperty('--p',Math.min(p,4)); c.style.opacity=p>4?0:1; c.setAttribute('aria-hidden',p?'true':'false'); }); }
    lay();
    dk.querySelector('.dk-next').addEventListener('click',function(){ var c=cs[top]; c.classList.add('gone'); setTimeout(function(){ c.classList.remove('gone'); top=(top+1)%cs.length; lay(); },280); });
  }
})();
