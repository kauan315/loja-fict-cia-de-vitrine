function hide15Categorias(){
  const styleId='urbanfit-hide-15-categorias'
  if(!document.getElementById(styleId)){
    const style=document.createElement('style')
    style.id=styleId
    style.textContent='.admin-stats > div:nth-child(3){display:none!important}'
    document.head.appendChild(style)
  }
  document.querySelectorAll('.admin-stats > div').forEach((el)=>{
    const text=(el.textContent||'').toLowerCase()
    if(text.includes('categorias')) (el as HTMLElement).style.display='none'
  })
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',hide15Categorias)
else hide15Categorias()

new MutationObserver(hide15Categorias).observe(document.body,{childList:true,subtree:true})
