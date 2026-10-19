
document.addEventListener('DOMContentLoaded',()=>{
 const y=document.querySelectorAll('.year'); y.forEach(e=>e.textContent=new Date().getFullYear());
 const btn=document.querySelector('.menu-btn'), nav=document.querySelector('nav.main');
 if(btn&&nav){btn.addEventListener('click',()=>{const o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o)})}
 // search
 const inputs=document.querySelectorAll('[data-search]');
 inputs.forEach(input=>{
   const box=input.parentElement.querySelector('.search-results');
   let idx=[];
   fetch('search-index.json').then(r=>r.json()).then(d=>idx=d).catch(()=>{});
   // also try relative from root pages (all at root)
   input.addEventListener('input',()=>{
     const q=input.value.trim().toLowerCase(); if(!box) return;
     if(q.length<2){box.style.display='none';box.innerHTML='';return}
     const hits=idx.filter(p=>(p.title+' '+p.description+' '+p.content).toLowerCase().includes(q)).slice(0,6);
     box.innerHTML=hits.length?hits.map(h=>`<a href="${h.url}"><strong>${h.title}</strong><br><small>${h.description}</small></a>`).join(''):'<a href="search.html">No quick match — try search page</a>';
     box.style.display='block';
   });
   input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();window.location.href='search.html?q='+encodeURIComponent(input.value)}});
   document.addEventListener('click',e=>{if(box&&!input.parentElement.contains(e.target)) box.style.display='none'});
 });
});

// Scroll reveal
(function(){
  var els=document.querySelectorAll('section, .card, .reveal');
  els.forEach(function(e){e.classList.add('reveal')});
  if(!('IntersectionObserver' in window)||window.matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(function(e){e.classList.add('visible')});return;}
  var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('visible');io.unobserve(en.target)}})},{threshold:.08});
  els.forEach(function(e){io.observe(e)});
})();
// Animated counters + bars
(function(){
  function run(el){
    if(el.dataset.done)return; el.dataset.done=1;
    var target=parseFloat(el.dataset.count||'0'); var suffix=el.dataset.suffix||'';
    var start=null;
    function step(ts){ if(!start)start=ts; var p=Math.min((ts-start)/1400,1); el.textContent=Math.round(target*p)+suffix; if(p<1)requestAnimationFrame(step); }
    requestAnimationFrame(step);
    document.querySelectorAll('.bar-fill').forEach(function(b){b.style.width=b.dataset.width+'%'});
  }
  var counters=document.querySelectorAll('[data-count]');
  if(!counters.length)return;
  if(!('IntersectionObserver' in window)){counters.forEach(run);return;}
  var io2=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){run(en.target);io2.unobserve(en.target)}})},{threshold:.4});
  counters.forEach(function(c){io2.observe(c)});
})();
// Live drift demo (canvas, monochrome)
(function(){
  var c=document.getElementById('driftCanvas'); if(!c)return;
  var ctx=c.getContext('2d'); var alertBox=document.getElementById('driftAlert');
  var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var t=0, data=[];
  function draw(){
    var w=c.width=c.offsetWidth*2, h=c.height=320; ctx.clearRect(0,0,w,h);
    ctx.strokeStyle='#404040'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,h*.72); ctx.lineTo(w,h*.72); ctx.stroke();
    t++; var drift=t>110? (t-110)*0.55 : 0;
    var v=h*.55 - drift*2 + Math.sin(t*.25)*6 + (Math.random()*6-3);
    data.push(v); if(data.length>140)data.shift();
    ctx.strokeStyle='#fff'; ctx.lineWidth=3; ctx.beginPath();
    data.forEach(function(p,i){ var x=i/(140)*w; if(i===0)ctx.moveTo(x,p); else ctx.lineTo(x,p); }); ctx.stroke();
    if(t>150 && alertBox) alertBox.classList.add('show');
    if(t<230 && !reduced) requestAnimationFrame(draw);
  }
  if(reduced){ t=160; for(var i=0;i<140;i++){ var d=i>70?(i-70)*0.55:0; data.push(160-d*2+Math.sin(i*.25)*6);} draw(); if(alertBox)alertBox.classList.add('show'); return; }
  draw();
})();
