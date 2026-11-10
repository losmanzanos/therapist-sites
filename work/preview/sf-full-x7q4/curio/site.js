(function(){
  function act(el,fn){ el.addEventListener('click',fn); el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); fn(e); } }); }
  document.querySelectorAll('.onshelf').forEach(function(s){ act(s,function(){ var up=s.classList.toggle('up'); s.setAttribute('aria-expanded',up?'true':'false'); }); });
  document.querySelectorAll('.plamp').forEach(function(l){ act(l,function(){ l.closest('.phead').classList.toggle('lit'); }); });
  document.querySelectorAll('.hang').forEach(function(h){ act(h,function(){ h.classList.toggle('on'); }); });
})();
