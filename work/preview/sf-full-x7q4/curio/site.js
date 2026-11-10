(function(){
  function act(el,fn){ el.addEventListener('click',fn); el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); fn(e); } }); }
  var ROOT=document.documentElement.getAttribute('data-root')||'';
  var K='curio-keys', ALL=['quote','candle','loupe','sand','breathe'];
  function got(){ try{ var v=JSON.parse(localStorage.getItem(K)||'[]'); return Array.isArray(v)?v:[]; }catch(e){ return []; } }
  var mem=got();
  function save(){ try{ localStorage.setItem(K,JSON.stringify(mem)); }catch(e){} }
  var toastEl;
  function toast(head,body){
    if(!toastEl){ toastEl=document.createElement('div'); toastEl.className='toast'; toastEl.setAttribute('role','status'); document.body.appendChild(toastEl); }
    toastEl.innerHTML='<img src="'+ROOT+'img/key.webp" alt=""><b>'+head+'</b>'+body;
    toastEl.classList.add('on'); clearTimeout(toastEl.t); toastEl.t=setTimeout(function(){ toastEl.classList.remove('on'); },4800);
  }
  function paint(){
    document.querySelectorAll('.keyrow').forEach(function(r){ r.innerHTML=ALL.map(function(k){ return '<i class="'+(mem.indexOf(k)>-1?'got':'')+'"></i>'; }).join(''); });
    document.querySelectorAll('.keyn').forEach(function(n){ n.textContent=mem.length; });
    var br=document.getElementById('backroom');
    if(br){
      br.classList.toggle('unlocked',mem.length>=ALL.length);
      br.querySelectorAll('.br-hints li').forEach(function(li,i){
        var k=ALL[i], have=mem.indexOf(k)>-1, prevHave=i===0||mem.indexOf(ALL[i-1])>-1;
        li.classList.toggle('got',have); li.classList.toggle('open',have||prevHave);
      });
    }
  }
  function collect(id,btn){
    if(mem.indexOf(id)>-1) return;
    mem.push(id); save(); paint();
    if(btn){ btn.classList.add('found'); }
    var n=mem.length;
    if(n>=ALL.length) toast('All five keys','The back room is open. <a href="'+ROOT+'back-room/">Go and see.</a>');
    else toast('Key '+n+' of '+ALL.length,'An old Roman key, about 2,000 years old. '+(ALL.length-n)+' more are hidden around the house.');
  }
  document.querySelectorAll('.key[data-key]').forEach(function(b){
    if(mem.indexOf(b.getAttribute('data-key'))>-1) b.classList.add('gone');
    act(b,function(e){ e.stopPropagation(); collect(b.getAttribute('data-key'),b); });
  });
  var rl=document.getElementById('relock'); if(rl) rl.addEventListener('click',function(){ mem=[]; save(); paint(); });
  paint();

  // type the name on the sign
  var buf='';
  document.addEventListener('keydown',function(e){
    if(e.target.closest && e.target.closest('input,textarea,select')) return;
    if(!e.key || e.key.length!==1) return;
    buf=(buf+e.key.toLowerCase()).slice(-5);
    if(buf==='curio'){ buf=''; document.body.classList.remove('flicker'); void document.body.offsetWidth; document.body.classList.add('flicker');
      toast('You spelled it','The house noticed. The lights will settle in a second.');
      setTimeout(function(){ document.body.classList.remove('flicker'); },2600); }
  });

  // candle
  var c=document.getElementById('candle');
  if(c){
    function mv(e){ var r=c.getBoundingClientRect(); c.style.setProperty('--mx',(e.clientX-r.left)+'px'); c.style.setProperty('--my',(e.clientY-r.top)+'px'); }
    c.addEventListener('pointermove',function(e){ if(e.pointerType==='mouse') mv(e); });
    c.addEventListener('pointerdown',mv);
  }

  // crooked frame
  document.querySelectorAll('.crooked').forEach(function(w){
    var f=w.querySelector('.c-frame'), n=0;
    f.addEventListener('click',function(){
      f.classList.add('straight'); n++;
      clearTimeout(f.t); f.t=setTimeout(function(){ f.classList.remove('straight'); w.style.setProperty('--tilt',(n%2?3.5:-4.5)+'deg'); if(n>=3) w.classList.add('done'); },1900);
    });
  });

  // loupe
  var L=document.getElementById('loupe');
  if(L){
    var img=L.querySelector('img'), keyImg=L.querySelector('.hidden-key'), lens=L.querySelector('.lens'), inner=lens.querySelector('.lens-in'), Z=3;
    inner.appendChild(img.cloneNode()); inner.appendChild(keyImg.cloneNode());
    function place(e){
      var r=L.getBoundingClientRect(), x=e.clientX-r.left, y=e.clientY-r.top, R=lens.offsetWidth/2;
      lens.style.left=(x-R)+'px'; lens.style.top=(y-R)+'px';
      var ir=img.getBoundingClientRect(), ox=ir.left-r.left, oy=ir.top-r.top;
      var ci=inner.children[0], ck=inner.children[1];
      ci.style.width=(ir.width*Z)+'px'; ci.style.left='0px'; ci.style.top='0px';
      var kr=keyImg.getBoundingClientRect();
      ck.style.width=(kr.width*Z*.62)+'px'; ck.style.left=((kr.left-ir.left)*Z)+'px'; ck.style.top=((kr.top-ir.top)*Z)+'px';
      inner.style.transform='translate('+(R-(x-ox)*Z)+'px,'+(R-(y-oy)*Z)+'px)';
      L.classList.add('on');
      var kx=kr.left+kr.width/2-r.left, ky=kr.top+kr.height/2-r.top, near=Math.hypot(kx-x,ky-y)<34 && mem.indexOf('loupe')<0;
      L.classList.toggle('glint',near); L.near=near;
    }
    L.addEventListener('pointermove',function(e){ if(e.pointerType==='mouse') place(e); });
    L.addEventListener('pointerdown',place);
    L.addEventListener('pointerleave',function(e){ if(e.pointerType==='mouse') L.classList.remove('on'); });
    L.addEventListener('click',function(){ if(L.near){ collect('loupe'); L.classList.remove('glint'); keyImg.style.display='none'; inner.children[1].style.display='none'; } });
    if(mem.indexOf('loupe')>-1){ keyImg.style.display='none'; inner.children[1].style.display='none'; }
  }

  // pace
  var pc=document.getElementById('pace');
  if(pc){ var pic=document.querySelector('.p-pic'), wrap=document.querySelector('.pace');
    function up(){ var v=pc.value/100; pic.style.setProperty('--p',v); wrap.classList.toggle('full',v>=.97); }
    pc.addEventListener('input',up); up(); }

  // pair
  var pr=document.getElementById('pair');
  if(pr){
    var a=pr.querySelector('.pa-a'), b=pr.querySelector('.pa-b'), msg=pr.querySelector('.pa-msg'), drag=false, sx, ax, lx, lt, bl=66;
    function W(){ return pr.clientWidth; }
    function say(t){ msg.textContent=t; }
    a.addEventListener('pointerdown',function(e){ drag=true; a.setPointerCapture(e.pointerId); a.classList.add('drag'); pr.classList.remove('close'); sx=e.clientX; ax=a.offsetLeft; lx=e.clientX; lt=performance.now(); });
    a.addEventListener('pointermove',function(e){
      if(!drag) return;
      var nx=Math.max(0,Math.min(W()-a.offsetWidth,ax+e.clientX-sx)); a.style.left=nx+'px';
      var now=performance.now(), v=Math.abs(e.clientX-lx)/Math.max(1,now-lt); lx=e.clientX; lt=now;
      var gap=b.offsetLeft-(nx+a.offsetWidth);
      if(gap<70 && v>.55 && bl<74){ bl=Math.min(74,bl+5); b.style.left=bl+'%'; b.classList.add('flinch'); setTimeout(function(){ b.classList.remove('flinch'); },400); say('Too fast. She stepped back.'); }
    });
    function end(){ if(!drag) return; drag=false; a.classList.remove('drag');
      var gap=b.offsetLeft-(a.offsetLeft+a.offsetWidth);
      if(gap<40){ a.style.left=(b.offsetLeft-a.offsetWidth*.86)+'px'; pr.classList.add('close'); say('Slowly works better. It usually does.'); bl=66; }
      else if(gap<120){ say('Almost. Take your time.'); }
    }
    a.addEventListener('pointerup',end); a.addEventListener('pointercancel',end);
    a.addEventListener('keydown',function(e){ if(e.key==='ArrowRight'||e.key==='ArrowLeft'){ e.preventDefault(); a.style.left=Math.max(0,Math.min(W()-a.offsetWidth,a.offsetLeft+(e.key==='ArrowRight'?14:-14)))+'px'; drag=true; end(); } });
  }

  // shade
  var sh=document.getElementById('shade');
  if(sh){
    var ring=sh.querySelector('.sh-ring'), pull=false, h=100;
    function set(v){ h=Math.max(0,Math.min(100,v)); sh.style.setProperty('--h',h); ring.setAttribute('aria-valuenow',Math.round(100-h)); sh.classList.toggle('up',h<20); }
    function at(e){ var r=sh.querySelector('img').getBoundingClientRect(); set((e.clientY-r.top)/r.height*100); }
    ring.addEventListener('pointerdown',function(e){ pull=true; ring.setPointerCapture(e.pointerId); });
    ring.addEventListener('pointermove',function(e){ if(pull) at(e); });
    ring.addEventListener('pointerup',function(){ pull=false; }); ring.addEventListener('pointercancel',function(){ pull=false; });
    ring.addEventListener('keydown',function(e){ if(e.key==='ArrowUp'){ e.preventDefault(); set(h-10); } if(e.key==='ArrowDown'){ e.preventDefault(); set(h+10); } });
    ring.addEventListener('click',function(e){ if(e.detail===0) return; });
  }

  // sweep
  var sw=document.getElementById('sweep');
  if(sw){
    var go=sw.querySelector('.sw-go'), dot=sw.querySelector('.sw-dot'), cnt=sw.querySelector('.sw-count'), n=0, MAX=8;
    go.addEventListener('click',function(){
      if(sw.classList.contains('go')){ sw.classList.remove('go'); go.textContent='Follow the light'; return; }
      n=0; sw.style.setProperty('--lit',0); sw.classList.add('go'); go.textContent='That&rsquo;s enough for now'.replace('&rsquo;','’'); cnt.textContent='';
    });
    dot.addEventListener('animationiteration',function(){
      n++; sw.style.setProperty('--lit',Math.min(1,n/MAX)); cnt.textContent='Pass '+n+' of '+MAX;
      if(n>=MAX){ sw.classList.remove('go'); go.textContent='Again'; cnt.textContent='That’s a set. In a session there would be a check-in here.'; }
    });
  }

  // almanac
  var alm=document.getElementById('alm');
  if(alm){
    var SAY=['A consultation, a call with your therapist, and dates you pick together.','You and Sarah map out what you&rsquo;ll work on, and how you&rsquo;ll know when to stop.','Most of the processing happens here, with breaks built in.','Bringing it to a close. Time to settle before you leave, and a plan for going home.','Home, with time set aside to rest, and your own therapist waiting on the other side.'];
    var tabs=[].slice.call(alm.querySelectorAll('.alm-days button')), say=alm.querySelector('.alm-say'), book=alm.querySelector('.alm-book'), ai=0;
    function show(i){ ai=(i+tabs.length)%tabs.length; tabs.forEach(function(t,j){ t.setAttribute('aria-selected',j===ai?'true':'false'); }); say.innerHTML=SAY[ai]; book.classList.remove('turn'); void book.offsetWidth; book.classList.add('turn'); }
    tabs.forEach(function(t,j){ t.addEventListener('click',function(){ show(j); }); });
    book.addEventListener('click',function(){ show(ai+1); });
  }

  // sand tray
  var tr=document.getElementById('tray');
  if(tr){
    var minis=[].slice.call(tr.querySelectorAll('.tmini'));
    function home(m,anim){ if(anim){ m.classList.add('smooth'); setTimeout(function(){ m.classList.remove('smooth'); },750); }
      m.style.left=m.getAttribute('data-x')+'%'; m.style.top=m.getAttribute('data-y')+'%'; m.style.width=(m.getAttribute('data-w')*(tr.offsetWidth<700?1.8:1))+'%'; }
    minis.forEach(function(m){ home(m);
      var d=false, ox, oy;
      m.addEventListener('pointerdown',function(e){ e.preventDefault(); d=true; m.setPointerCapture(e.pointerId); m.classList.add('drag'); var r=m.getBoundingClientRect(); ox=e.clientX-(r.left+r.width/2); oy=e.clientY-r.bottom; });
      m.addEventListener('pointermove',function(e){ if(!d) return; var s=tr.getBoundingClientRect();
        var x=Math.max(2,Math.min(98,(e.clientX-ox-s.left)/s.width*100)), y=Math.max(10,Math.min(100,(e.clientY-oy-s.top)/s.height*100));
        m.style.left=x+'%'; m.style.top=y+'%'; m.style.zIndex=Math.round(y)+5; });
      function up(){ d=false; m.classList.remove('drag'); }
      m.addEventListener('pointerup',up); m.addEventListener('pointercancel',up);
    });
    tr.querySelector('.tr-smooth').addEventListener('click',function(){ minis.forEach(function(m){ home(m,true); m.style.zIndex=''; }); });
  }

  // breathe
  var bz=document.getElementById('breathe');
  if(bz){
    var bgo=bz.querySelector('.br-go'), bs=bz.querySelector('.br-say'), on=false, cnt2=0, tm;
    function stop(t){ on=false; clearTimeout(tm); bz.classList.remove('in','out'); bgo.textContent='Breathe with the lamp'; if(t) bs.textContent=t; }
    function cycle(){
      if(!on) return;
      bz.classList.remove('out'); bz.classList.add('in'); bs.textContent='In';
      tm=setTimeout(function(){ if(!on) return; bz.classList.remove('in'); bz.classList.add('out'); bs.textContent='And out';
        tm=setTimeout(function(){ cnt2++; if(cnt2>=4){ bz.classList.add('done'); stop('That’s most of the skill. The group teaches the rest.'); } else cycle(); },6000); },4000);
    }
    bgo.addEventListener('click',function(){ if(on){ stop('You can stop whenever you like.'); return; } on=true; cnt2=0; bgo.textContent='Stop'; cycle(); });
  }

  // union case
  var uc=document.getElementById('ucase');
  if(uc){
    var ucs=uc.querySelector('.uc-stage');
    if('IntersectionObserver' in window){ new IntersectionObserver(function(es,o){ es.forEach(function(e){ if(e.isIntersecting){ setTimeout(function(){ uc.classList.add('open'); },250); o.disconnect(); } }); },{threshold:.45}).observe(uc); } else uc.classList.add('open');
    ucs.addEventListener('pointermove',function(e){ if(e.pointerType!=='mouse'||!uc.classList.contains('open')) return; var r=ucs.getBoundingClientRect(), f=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)); uc.classList.add('held'); uc.style.setProperty('--lid',(-44-f*22).toFixed(1)+'deg'); });
    ucs.addEventListener('pointerleave',function(){ uc.style.removeProperty('--lid'); });
  }

  // card case
  var ccw=document.getElementById('cardcase');
  if(ccw){
    var cc=ccw.querySelector('.cc'), cds=[].slice.call(cc.querySelectorAll('.cc-card')), ci=-1, busy=false;
    cds.forEach(function(c,i){ c.style.zIndex=1+i; c.setAttribute('aria-hidden','true'); });
    function take(){
      if(busy) return; busy=true;
      var prev=ci>=0?cds[ci]:null;
      if(prev){ prev.classList.add('gone'); setTimeout(function(){ prev.classList.remove('out','up','gone'); prev.setAttribute('aria-hidden','true'); },320); }
      cc.classList.add('open'); ci=(ci+1)%cds.length; var c=cds[ci];
      setTimeout(function(){ c.classList.add('up'); c.removeAttribute('aria-hidden'); setTimeout(function(){ c.classList.add('out'); busy=false; },420); }, prev?240:420);
    }
    cc.addEventListener('click',take);
  }

  // plan lookup
  var pl=document.getElementById('plans');
  if(pl){
    var inp=pl.querySelector('input'), plsay=pl.querySelector('.pl-say'), lis=[].slice.call(pl.querySelectorAll('li'));
    var IN=[].slice.call(pl.querySelectorAll('.pl-cols > div:first-child li')).map(function(l){ return l.textContent; });
    function norm(t){ return t.toLowerCase().replace(/[^a-z]/g,''); }
    var ALIAS={uhc:'UnitedHealthcare',united:'UnitedHealthcare',unitedhealth:'UnitedHealthcare',medicaid:'Colorado Medicaid',healthfirst:'Colorado Medicaid',kp:'Kaiser',kaiserpermanente:'Kaiser',bcbs:'Anthem',bluecross:'Anthem',anthembluecross:'Anthem'};
    inp.addEventListener('input',function(){
      var q=norm(inp.value); pl.classList.toggle('looking',q.length>0);
      lis.forEach(function(l){ l.classList.remove('hit'); });
      if(!q){ plsay.textContent=''; return; }
      var name=null;
      Object.keys(ALIAS).forEach(function(k){ if(!name && q.length>=2 && k.indexOf(q)===0) name=ALIAS[k]; });
      lis.forEach(function(l){ var n=norm(l.textContent); if(!name && q.length>=2 && n.indexOf(q)===0) name=l.textContent; });
      lis.forEach(function(l){ if(l.textContent===name) l.classList.add('hit'); });
      if(!name || name==='Any other plan'){ plsay.textContent=q.length<3?'':'Not on the list, so Curio is out of network for that one. You pay the session fee and get a superbill, and many plans pay some of it back.'; if(q.length>=3) lis[lis.length-1].classList.add('hit'); return; }
      plsay.textContent = IN.indexOf(name)>=0 ? name+' is in network. You pay your usual copay or coinsurance, and the office can check your benefits before your first session.' : name+' is out of network. You pay the session fee and get a superbill to send in, and many plans pay some of it back.';
    });
  }
})();
