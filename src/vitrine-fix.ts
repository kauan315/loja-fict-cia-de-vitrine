type StoredProduct={name:string}

const HIDDEN_CLASS='urbanfit-featured-hidden'
const STYLE_ID='urbanfit-featured-filter-style'

function readFeatured():string[]{
  try{
    const raw=localStorage.getItem('urbanfit-featured')
    const parsed=raw?JSON.parse(raw):[]
    return Array.isArray(parsed)?parsed.map(String):[]
  }catch{return []}
}

function addStyles(){
  if(document.getElementById(STYLE_ID))return
  const style=document.createElement('style')
  style.id=STYLE_ID
  style.textContent=`.${HIDDEN_CLASS}{display:none!important}`
  document.head.appendChild(style)
}

function render(){
  const productSection=document.querySelector('#products')
  if(!productSection)return
  addStyles()
  const featured=new Set(readFeatured())
  const cards=Array.from(productSection.querySelectorAll('button.product-card')) as HTMLButtonElement[]
  cards.forEach(card=>{
    const name=card.querySelector('.product-name')?.textContent?.trim()||''
    card.classList.toggle(HIDDEN_CLASS,Boolean(name&&featured.has(name)))
  })
}

let timer:number|undefined
function schedule(){
  window.clearTimeout(timer)
  timer=window.setTimeout(render,80)
}

const observer=new MutationObserver(schedule)
observer.observe(document.body,{childList:true,subtree:true})
window.addEventListener('storage',schedule)
window.addEventListener('urbanfit-vitrine-updated',schedule)
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule)
else schedule()
