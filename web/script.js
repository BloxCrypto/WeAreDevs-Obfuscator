const owner = 'BloxCrypto';
const repo = 'WeAreDevs-Obfuscator';
const branch = 'master';

document.getElementById('run-local')?.addEventListener('click',()=>{
  const msg = `To run locally:\n
1) cd WeAreDevs-Obfuscator/web\n2) python3 -m http.server 8000\n3) Open http://localhost:8000/`;
  if(navigator && navigator.clipboard){
    navigator.clipboard.writeText("python3 -m http.server 8000").then(()=>{
      alert('Server command copied to clipboard.\nOpen this page after starting the server.');
    }).catch(()=>{ alert(msg); });
  } else { alert(msg); }
});

function rawUrl(path){
  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/doc/${path}`;
}

async function loadDoc(path){
  const viewer = document.getElementById('doc-viewer');
  const content = document.getElementById('doc-content');
  const title = document.getElementById('doc-title');
  try{
    content.innerHTML = 'Loading...';
    viewer.style.display = 'block';
    const res = await fetch(rawUrl(path));
    if(!res.ok) throw new Error('Not found');
    const md = await res.text();
    content.innerHTML = marked.parse(md);
    title.textContent = path.replace(/\//g,' — ');
  }catch(e){
    content.innerHTML = '<p style="color:var(--muted)">Unable to load document.</p>';
  }
}

document.querySelectorAll('.doc-link').forEach(el=>{
  el.addEventListener('click',ev=>{
    ev.preventDefault();
    const path = el.getAttribute('data-doc');
    if(path) loadDoc(path);
  });
});

document.getElementById('close-doc')?.addEventListener('click',()=>{
  document.getElementById('doc-viewer').style.display = 'none';
});
