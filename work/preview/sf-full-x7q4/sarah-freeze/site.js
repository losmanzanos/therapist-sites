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
