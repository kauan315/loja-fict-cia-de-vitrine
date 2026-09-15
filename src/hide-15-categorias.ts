function remove15Categorias(){
  const elements=document.querySelectorAll('button, a, [role="button"]')
  elements.forEach(el=>{
    const text=(el.textContent||'').trim().toLowerCase()
    if(text.includes('15 categorias')) el.remove()
  })
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',remove15Categorias)
else remove15Categorias()

new MutationObserver(remove15Categorias).observe(document.body,{childList:true,subtree:true})
