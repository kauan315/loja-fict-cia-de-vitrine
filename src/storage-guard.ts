const PRODUCT_KEY='urbanfit-products'
const CART_KEY='urbanfit-cart'
const MAX_STORAGE_CHARS=3800000

function compactProducts(value:string){
  try{
    const parsed=JSON.parse(value)
    if(!Array.isArray(parsed))return value
    let products=parsed.map((p:any)=>({...p,images:Array.isArray(p.images)&&p.images.length?p.images:[p.image||'']}))
    let json=JSON.stringify(products)
    if(json.length<=MAX_STORAGE_CHARS)return json

    // Keep the principal photo first. Extra gallery photos are the main source
    // of quota usage; removing them is safer than losing the entire catalog.
    products=products.map((p:any)=>({...p,images:p.image?[p.image]:[]}))
    json=JSON.stringify(products)
    if(json.length<=MAX_STORAGE_CHARS)return json

    // If even the principal images are too large, keep newer products first
    // and preserve their principal photo. Never throw away the whole catalog.
    for(let i=products.length-1;i>=0&&json.length>MAX_STORAGE_CHARS;i--){
      if(products[i].image){
        products[i]={...products[i],image:'',images:[]}
        json=JSON.stringify(products)
      }
    }
    return json
  }catch{return value}
}

function compactCart(value:string){
  try{
    const parsed=JSON.parse(value)
    if(!Array.isArray(parsed))return value
    return JSON.stringify(parsed.map((item:any)=>({...item,images:item.image?[item.image]:[]})))
  }catch{return value}
}

function install(){
  const storage=window.localStorage
  const originalSet=storage.setItem.bind(storage)
  const originalGet=storage.getItem.bind(storage)

  // Compact the existing catalog before React reads it.
  const existing=originalGet(PRODUCT_KEY)
  if(existing){
    const compacted=compactProducts(existing)
    if(compacted!==existing){
      try{originalSet(PRODUCT_KEY,compacted)}catch{}
    }
  }

  storage.setItem=(key:string,value:string)=>{
    if(key===PRODUCT_KEY){
      const compacted=compactProducts(value)
      try{originalSet(key,compacted);return}catch{}
      try{originalSet(key,compactProducts(JSON.stringify(JSON.parse(compacted).map((p:any)=>({...p,images:[],image:''})))));return}catch{}
      return
    }
    if(key===CART_KEY){
      const compacted=compactCart(value)
      try{originalSet(key,compacted);return}catch{}
      return
    }
    originalSet(key,value)
  }
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true})
else install()
