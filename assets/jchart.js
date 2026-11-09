/* Journal charts. Each <figure class="jchart" data-chart='{...}'> is drawn at its real width
   (and redrawn on resize) so the text stays readable on a phone. The numbers also sit in a
   plain table under every chart, so nothing depends on this script running. */
(function(){
  var NS='http://www.w3.org/2000/svg';
  function el(n,a,p){var e=document.createElementNS(NS,n);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e;}
  function txt(p,x,y,s,a){var t=el('text',Object.assign({x:x,y:y},a||{}),p);t.textContent=s;return t;}
  function money(v){return '$'+Math.round(v).toLocaleString('en-US');}

  function tipBox(fig){
    var t=document.createElement('div');t.className='jchart-tip';t.setAttribute('aria-hidden','true');fig.querySelector('.jchart-plot').appendChild(t);
    return {
      show:function(x,y,head,rows){
        t.textContent='';
        if(head){var h=document.createElement('div');h.className='jchart-tip-h';h.textContent=head;t.appendChild(h);}
        rows.forEach(function(r){var d=document.createElement('div');d.className='jchart-tip-r';var k=document.createElement('i');k.style.background=r.color;var b=document.createElement('b');b.textContent=r.value;var s=document.createElement('span');s.textContent=r.name;d.appendChild(k);d.appendChild(b);d.appendChild(s);t.appendChild(d);});
        t.classList.add('is-on');
        var W=fig.querySelector('.jchart-plot').clientWidth,tw=t.offsetWidth;
        t.style.left=Math.max(0,Math.min(W-tw,x-tw/2))+'px';t.style.top=Math.max(0,y-t.offsetHeight-14)+'px';
      },
      hide:function(){t.classList.remove('is-on');}
    };
  }

  /* cumulative cost lines */
  function lines(fig,c){
    var box=fig.querySelector('.jchart-plot');box.textContent='';
    var W=box.clientWidth,narrow=W<520,H=Math.round(Math.max(250,Math.min(360,W*.56)));
    var m={t:16,r:narrow?62:104,b:34,l:narrow?46:56};
    var svg=el('svg',{width:W,height:H,viewBox:'0 0 '+W+' '+H,role:'img','aria-label':c.alt},box);
    var X=function(v){return m.l+(v-c.x.min)/(c.x.max-c.x.min)*(W-m.l-m.r);},Y=function(v){return H-m.b-(v-c.y.min)/(c.y.max-c.y.min)*(H-m.t-m.b);};
    for(var v=c.y.min;v<=c.y.max;v+=c.y.step){el('line',{x1:m.l,x2:W-m.r,y1:Y(v),y2:Y(v),class:'jc-grid'},svg);txt(svg,m.l-8,Y(v)+4,narrow&&v>=1000?'$'+v/1000+'K':money(v),{class:'jc-tick','text-anchor':'end'});}
    c.x.ticks.forEach(function(t){txt(svg,X(t[0]),H-m.b+20,narrow&&t.length>2?t[2]:t[1],{class:'jc-tick','text-anchor':t[0]===c.x.min?'start':'middle'});});
    var val=function(s,x){var p=s.pts;for(var i=1;i<p.length;i++){if(x<=p[i][0]){var a=p[i-1],b=p[i];return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}}return p[p.length-1][1];};
    c.series.forEach(function(s){
      el('polyline',{points:s.pts.map(function(p){return X(p[0])+','+Y(p[1]);}).join(' '),class:'jc-line',stroke:s.color},svg);
      var ex=X(c.x.max),ey=Y(val(s,c.x.max));
      el('circle',{cx:ex,cy:ey,r:4,fill:s.color,class:'jc-dot'},svg);
      var lab=el('text',{x:ex+10,y:ey+4+(s.nudge||0),class:'jc-end'},svg);
      var a=document.createElementNS(NS,'tspan');a.textContent=narrow?s.short:s.label;lab.appendChild(a);
      if(!narrow){var b=document.createElementNS(NS,'tspan');b.setAttribute('class','jc-end-v');b.textContent=' '+money(val(s,c.x.max));lab.appendChild(b);}
    });
    (c.marks||[]).forEach(function(k){
      el('circle',{cx:X(k.x),cy:Y(k.y),r:5,class:'jc-cross'},svg);
      var br=k.pos==='br';txt(svg,X(k.x)+(br?9:-9),Y(k.y)+(br?24:-10),narrow?k.short:k.label,{class:'jc-note','text-anchor':br?'start':'end'});
    });
    var hair=el('line',{y1:m.t,y2:H-m.b,class:'jc-hair'},svg),tip=tipBox(fig);hair.style.display='none';
    var hit=el('rect',{x:m.l,y:m.t,width:W-m.l-m.r,height:H-m.t-m.b,fill:'transparent'},svg);
    var cur=null;
    function at(x){x=Math.max(c.x.min,Math.min(c.x.max,Math.round(x)));cur=x;var px=X(x);hair.setAttribute('x1',px);hair.setAttribute('x2',px);hair.style.display='';
      tip.show(px,Y(c.y.max*.92),c.x.fmt(x),c.series.map(function(s){return {color:s.color,value:money(val(s,x)),name:s.name};}).sort(function(a,b){return parseFloat(b.value.replace(/[$,]/g,''))-parseFloat(a.value.replace(/[$,]/g,''));}));}
    function off(){hair.style.display='none';tip.hide();}
    hit.addEventListener('pointermove',function(e){var r=svg.getBoundingClientRect();at(c.x.min+(e.clientX-r.left-m.l)/(W-m.l-m.r)*(c.x.max-c.x.min));});
    hit.addEventListener('pointerleave',off);
    fig.onkeydown=function(e){if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;e.preventDefault();at((cur==null?c.x.min:cur)+(e.key==='ArrowRight'?c.x.kstep:-c.x.kstep));};
    fig.onblur=off;
  }

  /* price ranges: a band for what others charge, a dot for the old price and one for the new */
  function ranges(fig,c){
    var box=fig.querySelector('.jchart-plot');box.textContent='';
    var W=box.clientWidth,rowH=78,m={t:8,r:18,b:30,l:12},H=m.t+c.rows.length*rowH+m.b;
    var svg=el('svg',{width:W,height:H,viewBox:'0 0 '+W+' '+H,role:'img','aria-label':c.alt},box);
    var X=function(v){return m.l+(v-c.x.min)/(c.x.max-c.x.min)*(W-m.l-m.r);},tip=tipBox(fig);
    c.x.ticks.forEach(function(v){el('line',{x1:X(v),x2:X(v),y1:m.t,y2:H-m.b,class:'jc-grid'},svg);txt(svg,X(v),H-m.b+20,money(v),{class:'jc-tick','text-anchor':v===c.x.min?'start':v===c.x.max?'end':'middle'});});
    c.rows.forEach(function(r,i){
      var y0=m.t+i*rowH,ty=y0+44;
      var h=txt(svg,m.l,y0+18,r.name,{class:'jc-row'});
      var marks=[
        {kind:'band',color:c.colors.range,name:c.names.range,value:money(r.range[0])+' to '+money(r.range[1])},
        {kind:'dot',x:r.old,color:c.colors.old,name:c.names.old,value:money(r.old)},
        {kind:'dot',x:r.now,color:c.colors.now,name:c.names.now,value:money(r.now)}];
      el('line',{x1:X(c.x.min),x2:X(c.x.max),y1:ty,y2:ty,class:'jc-track'},svg);
      marks.forEach(function(k){
        var g=el('g',{class:'jc-mark'},svg),cx;
        if(k.kind==='band'){el('rect',{x:X(r.range[0]),y:ty-6,width:X(r.range[1])-X(r.range[0]),height:12,rx:6,fill:k.color},g);el('rect',{x:X(r.range[0]),y:ty-14,width:X(r.range[1])-X(r.range[0]),height:28,fill:'transparent'},g);cx=(X(r.range[0])+X(r.range[1]))/2;}
        else{el('circle',{cx:X(k.x),cy:ty,r:6,fill:k.color,class:'jc-dot'},g);el('circle',{cx:X(k.x),cy:ty,r:14,fill:'transparent'},g);cx=X(k.x);}
        var show=function(){tip.show(cx,ty-6,r.name,[k]);g.classList.add('is-hot');},hide=function(){tip.hide();g.classList.remove('is-hot');};
        g.addEventListener('pointerenter',show);g.addEventListener('pointerleave',hide);
      });
    });
  }

  var KIND={lines:lines,ranges:ranges},FMT={month:function(x){return x===0?'Day one':x%12===0?'Year '+x/12:'Month '+x;}};
  var figs=[].slice.call(document.querySelectorAll('figure.jchart[data-chart]'));
  function draw(){figs.forEach(function(f){var c=JSON.parse(f.dataset.chart);if(c.x&&c.x.fmt)c.x.fmt=FMT[c.x.fmt];f.classList.add('is-drawn');(KIND[c.type]||function(){})(f,c);});}
  draw();
  var lastW=window.innerWidth,t;window.addEventListener('resize',function(){if(window.innerWidth===lastW)return;lastW=window.innerWidth;clearTimeout(t);t=setTimeout(draw,120);});
})();
