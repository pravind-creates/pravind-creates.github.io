
document.addEventListener('DOMContentLoaded',async()=>{
 const params=new URLSearchParams(location.search); const q=(params.get('q')||'').trim();
 const input=document.getElementById('search-page-input'); const out=document.getElementById('search-page-results');
 if(input) input.value=q;
 const idx=await fetch('search-index.json').then(r=>r.json()).catch(()=>[]);
 function run(query){
   const terms=query.toLowerCase().split(/\s+/).filter(Boolean);
   if(!terms.length){out.innerHTML='<p>Enter a term such as emissions, Modbus, vibration, methane or early access.</p>';return}
   const hits=idx.map(p=>{const text=(p.title+' '+p.description+' '+p.content).toLowerCase(); const score=terms.reduce((s,t)=>s+(text.includes(t)?1:0),0); return {p,score}}).filter(x=>x.score>0);
   out.innerHTML=hits.length?hits.map(({p})=>`<article class="card"><h3><a href="${p.url}">${p.title}</a></h3><p>${p.description}</p></article>`).join(''):'<p>No results found. Try “emissions”, “operations”, “proof” or “contact”.</p>';
 }
 if(input) input.addEventListener('input',()=>run(input.value));
 run(q);
});
