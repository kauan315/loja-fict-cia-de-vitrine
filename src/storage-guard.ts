const PRODUCT_KEY='urbanfit-products'
const CART_KEY='urbanfit-cart'
const MAX_STORAGE_CHARS=2200000

function compactProducts(value:string){
  try{
    const parsed=JSON.parse(value)
    if(!Array.isArray(parsed))return value
    let products=parsed.map((p:any)=>({...p,images:Array.isArray(p.images)&&p.images.length?p.images:[p.image||'']}))
    let json=JSON.stringify(products)
    if(json.length<=MAX_STORAGE_CHARS)return json
    products=products.map((p:any)=>({...p,images:p.image?[p.image]:[]}))
    json=JSON.stringify(products)
    if(json.length<=MAX_STORAGE_CHARS)return json
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
  const proto=Storage.prototype
  const originalSet=proto.setItem
  const originalGet=proto.getItem
  const storage=window.localStorage
  const existing=originalGet.call(storage,PRODUCT_KEY)
  if(existing){
    const compacted=compactProducts(existing)
    if(compacted!==existing){try{originalSet.call(storage,PRODUCT_KEY,compacted)}catch{}}
  }

  proto.setItem=function(key:string,value:string){
    if(this===storage&&key===PRODUCT_KEY){
      const compacted=compactProducts(value)
      try{originalSet.call(this,key,compacted);return}catch{}
      try{
        const fallback=JSON.parse(compacted).map((p:any)=>({...p,images:[],image:p.image||''}))
        originalSet.call(this,key,JSON.stringify(fallback));return
      }catch{return}
    }
    if(this===storage&&key===CART_KEY){
      try{originalSet.call(this,key,compactCart(value));return}catch{return}
    }
    originalSet.call(this,key,value)
  }
}

install()
