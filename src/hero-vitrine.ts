type HeroProduct={name:string;image:string}
const STYLE_ID='urbanfit-hero-vitrine-style'
let timer:number|undefined
let index=0
let signature=''

function readProducts():HeroProduct[]{
  try{const p=JSON.parse(localStorage.getItem('urbanfit-products')||'[]');const f=JSON.parse(localStorage.getItem('urbanfit-featured')||'[]');if(!Array.isArray(p)||!Array.isArray(f))return[];return p.filter((x:any)=>f.includes(x.name)&&x.image).map((x:any)=>({name:String(x.name),image:String(x.image)}))}catch{return[]}
}
function setup(){
  const img=document.querySelector('.hero-image img') as HTMLImageElement|null
  if(!img)return
  const products=readProducts()
  if(!products.length){window.clearInterval(timer);timer=undefined;signature='';img.style.opacity='';return}
  const nextSignature=products.map(p=>p.name+':'+p.image).join('|')
  if(nextSignature===signature)return
  signature=nextSignature
  index=0
  if(!img.dataset.heroVitrine){img.dataset.heroVitrine='1';img.style.transition='opacity .35s ease, transform .35s ease'}
  const show=()=>{
    const current=readProducts()
    if(!current.length)return
    if(index>=current.length)index=0
    const item=current[index]
    img.style.opacity='0'
    img.style.transform='translateY(10px) scale(.98)'
    window.setTimeout(()=>{img.src=item.image;img.alt=item.name;img.style.opacity='1';img.style.transform='translateY(0) scale(1)'},220)
    index=(index+1)%current.length
  }
  show()
  window.clearInterval(timer)
  timer=window.setInterval(show,8000)
}
function addStyle(){
 if(document.getElementById(STYLE_ID))return
 const s=document.createElement('style');s.id=STYLE_ID;s.textContent='.hero-image img[data-hero-vitrine]{will-change:opacity,transform}'
 document.head.appendChild(s)
}
function start(){addStyle();setup();window.setInterval(setup,1200)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start()
window.addEventListener('storage',setup)
window.addEventListener('urbanfit-vitrine-updated',setup)
