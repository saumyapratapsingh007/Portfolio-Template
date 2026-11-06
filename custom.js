
const label=document.createElement('div');label.className='preview-label';label.textContent='CONCEPT PREVIEW / PERSONAL CONTENT PENDING';document.body.append(label);
const ph=document.createElement('p');ph.className='hero-placeholder';ph.textContent='[ YOUR WALKING VIDEO OR PORTRAIT GOES HERE ]';document.querySelector('.stage-wrap').append(ph);
const dlg=document.createElement('dialog');dlg.innerHTML='<h2></h2><p></p><button>Close</button>';document.body.append(dlg);dlg.querySelector('button').onclick=()=>dlg.close();dlg.addEventListener('click',e=>{if(e.target===dlg)dlg.close()});
function show(title,body){dlg.querySelector('h2').textContent=title;dlg.querySelector('p').textContent=body;dlg.showModal()}
const destinations={Home:'.hero-spacer',Work:'#gallery',About:'#chrono',Journal:'#universe',Contact:'#fin'};
document.querySelectorAll('[data-nav]').forEach(a=>{a.href=destinations[a.textContent.trim()]?.replace('.hero-spacer','#top')||'#fin';a.onclick=e=>{e.preventDefault();document.querySelector(destinations[a.textContent.trim()]||'#fin')?.scrollIntoView({behavior:'smooth'})}});
document.querySelectorAll('.fin__soc a').forEach(a=>a.onclick=e=>{e.preventDefault();show('[Your '+a.textContent+' link]','Add your profile URL here. This preview does not link to the original creator’s account.')});
document.addEventListener('click',e=>{const card=e.target.closest('.g-card');if(card)show('[Project '+String(Number(card.dataset.i)+1).padStart(2,'0')+']','Your video, thumbnail, project title, category, credits and watch link will appear here.');});
