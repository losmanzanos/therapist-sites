/* Chaos to Clarity | homepage: threads that settle, rows that line up */
(()=>{
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loom = document.querySelector('.loom');
  const stage = document.querySelector('.loom-stage');
  const collage = document.getElementById('collage');
  const copy = document.querySelector('.hero-copy');
  const cv = document.getElementById('threads');
  const ctx = cv.getContext('2d');
  const COLORS = [
    ['229,224,214',.34],['63,90,128',.95],['229,224,214',.22],['201,146,54',.85],
    ['111,148,136',.85],['229,224,214',.3],['160,58,43',.9],['63,90,128',.75],['229,224,214',.18],
    ['63,90,128',.85],['111,148,136',.7]
  ];
  let W=0,H=0,dpr=1,threads=[],p=0,target=0,t0=performance.now();
  // seeded random so the composition is the same on every load
  let seed=7; const rnd=()=>((seed=(seed*16807)%2147483647)-1)/2147483646;
  function build(){
    dpr=Math.min(devicePixelRatio||1,2);
    W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
    const mobile=W<900, N=mobile?30:46; seed=7; threads=[];
    for(let i=0;i<N;i++){
      threads.push({
        x:W*(.03+.94*i/(N-1)),
        a0:rnd()*Math.PI*2, turns:1.2+rnd()*2.4, R:(mobile?.3:.24)*Math.min(W,H*1.3)*(.55+rnd()*.6),
        drift:(rnd()*W*.5-W*.25), sq:.55+rnd()*.5,
        c:COLORS[i%COLORS.length], w:i%7===3?1.6:1, lag:rnd()*.35
      });
    }
  }
  const ease=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
  function draw(now){
    const mobile=W<900;
    const cx=mobile?W*.5:W*.74, cy=mobile?(collage.offsetTop+collage.offsetHeight*.45):H*.55;
    const t=(now-t0)/1000;
    ctx.clearRect(0,0,W,H);
    const SEG=70;
    for(const th of threads){
      const q=ease(Math.min(1,Math.max(0,(p*1.35-th.lag*.5))));
      const live=reduce?0:(1-q)*.35*t;
      ctx.beginPath();
      for(let k=0;k<=SEG;k++){
        const s=k/SEG, env=Math.sin(Math.PI*s)*Math.pow(1-Math.min(1,q*1.6),2);
        const a=th.a0+s*th.turns*Math.PI*2+live*.18;
        const yLine=-.12*H+s*1.24*H;
        const xc=cx+th.drift*(s-.5)+Math.cos(a)*th.R*env;
        const yc=cy+(s-.5)*H*1.25+Math.sin(a)*th.R*th.sq*env;
        const x=xc+(th.x-xc)*q, y=yc+(yLine-yc)*q;
        k?ctx.lineTo(x,y):ctx.moveTo(x,y);
      }
      const al=th.c[1]*(1-q*.62);
      ctx.strokeStyle=`rgba(${th.c[0]},${al})`;ctx.lineWidth=th.w;ctx.stroke();
    }
    // keep the text area calm: erase threads behind the headline column
    ctx.save();ctx.globalCompositeOperation='destination-out';
    let g;
    if(mobile){const tb=Math.min(.95,(copy.offsetTop+copy.offsetHeight+10)/H);g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(0,0,0,.95)');g.addColorStop(tb,'rgba(0,0,0,.9)');g.addColorStop(Math.min(1,tb+.06),'rgba(0,0,0,0)');}
    else{g=ctx.createLinearGradient(0,0,W,0);g.addColorStop(0,'rgba(0,0,0,.82)');g.addColorStop(.42,'rgba(0,0,0,.72)');g.addColorStop(.52,'rgba(0,0,0,0)');}
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    const tg=ctx.createLinearGradient(0,0,0,110);tg.addColorStop(0,'rgba(0,0,0,.9)');tg.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=tg;ctx.fillRect(0,0,W,110);
    ctx.restore();
  }
  function onScroll(){
    const r=loom.getBoundingClientRect(), span=r.height-innerHeight;
    if(innerWidth<=900){const c=collage.getBoundingClientRect();target=Math.min(1,Math.max(0,(innerHeight*.72-c.top)/(innerHeight*.5)));return;}
    target=Math.min(1,Math.max(0,-r.top/span));
  }
  const rows=document.querySelector('.rows'), thrs=[...rows.querySelectorAll('.thr path')], note=document.querySelector('.note');
  let q=0;
  function slack(path,amt,seed){
    if(amt<.002){path.setAttribute('d','M0 12 L100 12');return;}
    let d='M0 12';for(let i=1;i<=40;i++){const x=i*2.5;const y=12+Math.sin(i*.55+seed)*15*amt*Math.sin(Math.PI*i/40)+Math.sin(i*1.7+seed*2)*5*amt;d+=` L${x} ${y.toFixed(2)}`;}
    path.setAttribute('d',d);
  }
  function rowsProgress(){
    const r=rows.getBoundingClientRect();
    return Math.min(1,Math.max(0,(innerHeight*.95-r.top)/(innerHeight*.8)));
  }
  function loop(now){
    const tq=reduce?1:rowsProgress(); q+=(tq-q)*.1;
    rows.style.setProperty('--q',q.toFixed(4)); note.style.setProperty('--q',q.toFixed(4));
    note.style.setProperty('--top',rows.offsetTop+'px');
    thrs.forEach((pth,i)=>slack(pth,1-q,i*1.3));
    p+= (target-p)*.12;
    stage.style.setProperty('--p',p.toFixed(4));
    draw(now);
    requestAnimationFrame(loop);
  }
  addEventListener('resize',()=>{build();onScroll();});
  if('ResizeObserver' in window) new ResizeObserver(()=>build()).observe(stage);
  document.fonts&&document.fonts.ready.then(()=>{build();onScroll();});
  addEventListener('scroll',onScroll,{passive:true});
  build();onScroll();
  if(reduce){p=target=1;stage.style.setProperty('--p',1);draw(0);rows.style.setProperty('--q',1);note.style.setProperty('--q',1);note.style.setProperty('--top',rows.offsetTop+'px');}
  else requestAnimationFrame(loop);
})();
