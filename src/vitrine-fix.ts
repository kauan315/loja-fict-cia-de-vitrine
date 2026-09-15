type StoredProduct={name:string;price:string;old:string;image:string}

const STYLE_ID='urbanfit-vitrine-fix-style'
const SECTION_ID='urbanfit-home-vitrine'

function readProducts():StoredProduct[]{
  try{
    const raw=localStorage.getItem('urbanfit-products')
    const parsed=raw?JSON.parse(raw):[]
    return Array.isArray(parsed)?parsed:[]
  }catch{return []}
}

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
  style.textContent=`
    #${SECTION_ID}{margin:18px 0 8px;padding:0 0 8px}
    #${SECTION_ID} .uf-vitrine-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
    #${SECTION_ID} .uf-vitrine-title{display:flex;align-items:center;gap:8px}
    #${SECTION_ID} .uf-vitrine-title svg{width:19px;height:19px;color:var(--orange,#ff5a1f)}
    #${SECTION_ID} h2{margin:0;font-size:22px}
    #${SECTION_ID} .uf-vitrine-link{border:0;background:transparent;color:var(--orange,#ff5a1f);font-weight:800;font-size:12px;padding:7px 0;cursor:pointer}
    #${SECTION_ID} .uf-vitrine-sub{margin:-5px 0 13px;color:rgba(255,255,255,.52);font-size:12px}
    #${SECTION_ID} .uf-vitrine-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}
    #${SECTION_ID} .uf-vitrine-card{display:block;width:100%;padding:0;border:0;background:transparent;color:inherit;text-align:left;cursor:pointer}
    #${SECTION_ID} .uf-vitrine-photo{aspect-ratio:.82;overflow:hidden;border-radius:15px;background:#151515;border:1px solid rgba(255,255,255,.08)}
    #${SECTION_ID} .uf-vitrine-photo img{width:100%;height:100%;display:block;object-fit:cover}
    #${SECTION_ID} .uf-vitrine-name{margin:8px 2px 3px;font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #${SECTION_ID} .uf-vitrine-prices{display:flex;align-items:center;gap:7px;margin:0 2px}
    #${SECTION_ID} .uf-vitrine-prices b{font-size:13px;color:var(--orange,#ff5a1f)}
    #${SECTION_ID} .uf-vitrine-prices del{font-size:10px;color:rgba(255,255,255,.42)}
    @media(min-width:700px){#${SECTION_ID} .uf-vitrine-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
  `
  document.head.appendChild(style)
}

function render(){
  const main=document.querySelector('main')
  const productSection=document.querySelector('#products')
  if(!main||!productSection)return
  addStyles()

  const products=readProducts()
  const featured=readFeatured()
  const featuredProducts=products.filter(p=>featured.includes(p.name))
  let section=document.getElementById(SECTION_ID)

  if(!featuredProducts.length){section?.remove();return}
  if(!section){
    section=document.createElement('section')
    section.id=SECTION_ID
    productSection.parentElement?.insertBefore(section,productSection)
  }

  section.innerHTML=`<div class="uf-vitrine-head"><div class="uf-vitrine-title"><span aria-hidden="true">★</span><h2>Vitrine</h2></div><button class="uf-vitrine-link" type="button">Ver vitrine</button></div><p class="uf-vitrine-sub">Produtos selecionados especialmente para você.</p><div class="uf-vitrine-grid"></div>`

  const grid=section.querySelector('.uf-vitrine-grid') as HTMLElement
  featuredProducts.forEach(product=>{
    const card=document.createElement('button')
    card.type='button'
    card.className='uf-vitrine-card'
    card.innerHTML=`<div class="uf-vitrine-photo"><img src="${product.image}" alt="${product.name.replace(/"/g,'&quot;')}" loading="lazy"></div><div class="uf-vitrine-name">${product.name}</div><div class="uf-vitrine-prices"><b>${product.price||''}</b><del>${product.old||''}</del></div>`
    card.addEventListener('click',()=>openExistingProduct(product.name))
    grid.appendChild(card)
  })

  section.querySelector('.uf-vitrine-link')?.addEventListener('click',()=>{
    const button=Array.from(document.querySelectorAll('button')).find(b=>b.textContent?.trim()==='Vitrine') as HTMLButtonElement|undefined
    button?.click()
  })
}

function openExistingProduct(name:string){
  const buttons=Array.from(document.querySelectorAll('button.product-card'))
  const target=buttons.find(button=>button.textContent?.includes(name)) as HTMLButtonElement|undefined
  target?.click()
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
