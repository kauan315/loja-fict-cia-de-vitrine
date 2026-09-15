import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, ShoppingCart, ChevronRight, Home, Settings2, Grid2X2, MessageCircle, Instagram, Facebook, ArrowLeft, Plus, Package, Pencil, Save } from 'lucide-react'
import './index.css'

type Product = { name: string; price: string; old: string; image: string }
type SocialLinks = { whatsapp: string; instagram: string; facebook: string }

const products: Product[] = [
  { name: 'Moletom Oversized', price: 'R$ 179', old: 'R$ 219', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85' },
  { name: 'Calça Cargo', price: 'R$ 199', old: 'R$ 249', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=85' },
  { name: 'Tênis Esportivo', price: 'R$ 289', old: 'R$ 359', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85' },
  { name: 'Camiseta Básica', price: 'R$ 69', old: 'R$ 89', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=700&q=85' },
  { name: 'Polo Premium', price: 'R$ 89', old: 'R$ 119', image: 'https://images.unsplash.com/photo-1586363104868-3a5e2ab60d99?auto=format&fit=crop&w=700&q=85' },
  { name: 'Boné RS', price: 'R$ 59', old: 'R$ 79', image: 'https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=700&q=85' },
  { name: 'Jaqueta Corta-Vento', price: 'R$ 289', old: 'R$ 359', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=700&q=85' },
  { name: 'Moletom Básico', price: 'R$ 179', old: 'R$ 229', image: 'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=700&q=85' },
  { name: 'Tênis Casual', price: 'R$ 249', old: 'R$ 309', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=85' },
  { name: 'Bermuda Cargo', price: 'R$ 149', old: 'R$ 189', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=700&q=85' },
  { name: 'Shoulder Bag', price: 'R$ 99', old: 'R$ 129', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85' },
  { name: 'Legging Esportiva', price: 'R$ 119', old: 'R$ 149', image: 'https://images.unsplash.com/photo-1506629905607-d9e0a1d0f2b8?auto=format&fit=crop&w=700&q=85' },
]

const heroImage = 'https://cdn.myikas.com/images/8ef8ae14-2b23-422b-b06b-a7afcbd0683a/6adbcf63-691a-4e8b-a9a9-2c0ef1255cdf/3840/du9a0452.webp'
const defaultSocials: SocialLinks = { whatsapp: 'https://wa.me/5511987654321', instagram: 'https://instagram.com/urbanfit.oficial', facebook: 'https://facebook.com/urbanfit.oficial' }

function App() {
  const [tab, setTab] = useState<'home'|'search'|'admin'>('home')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState(0)
  const [selected, setSelected] = useState<Product | null>(null)
  const [socials, setSocials] = useState<SocialLinks>(() => { try { return JSON.parse(localStorage.getItem('urbanfit-socials') || '') || defaultSocials } catch { return defaultSocials } })
  const filtered = useMemo(() => products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())), [query])

  useEffect(() => { localStorage.setItem('urbanfit-socials', JSON.stringify(socials)) }, [socials])

  if (selected) return <ProductView product={selected} onBack={() => setSelected(null)} onAdd={() => setCart(v => v + 1)} whatsapp={socials.whatsapp} />

  return (
    <div className="app-shell">
      <div className="phone-content">
        <header className="topbar">
          <button className="menu-button" aria-label="menu"><span></span><span></span><span></span></button>
          <div className="brand"><span className="brand-mark"><i></i></span><strong>URBAN FIT</strong></div>
          <div className="top-actions"><button aria-label="carrinho" onClick={() => alert(`${cart} item(ns) no carrinho`)}><ShoppingCart size={25}/>{cart > 0 && <b className="cart-badge">{cart}</b>}</button><button aria-label="avançar"><ChevronRight size={22}/></button></div>
        </header>
        {tab === 'search' ? <SearchPage query={query} setQuery={setQuery} products={filtered} onSelect={setSelected} /> : tab === 'admin' ? <AdminPage products={products} socials={socials} setSocials={setSocials} /> : (
          <main>
            <section className="feature-grid">
              <div className="orange-backdrop"></div><div className="hero-image"><img src={heroImage} alt="Modelo Urban Fit"/></div><div className="hero-copy"><div className="hero-title">ROUPAS E<br/>CALÇADOS<br/>PARA O<br/>DIA A DIA</div></div>
              <section className="contact-card"><h2>Fale com a gente</h2><p>Estamos sempre por perto!</p><Contact icon={<MessageCircle/>} title="WhatsApp" detail="Falar no WhatsApp" href={socials.whatsapp}/><Contact icon={<Instagram/>} title="Instagram" detail="@urbanfit.oficial" href={socials.instagram}/><Contact icon={<Facebook/>} title="Facebook" detail="/urbanfit.oficial" href={socials.facebook}/></section>
              <button className="vitrine" onClick={() => document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}><Grid2X2 size={20}/> Vitrine</button>
            </section>
            <section id="products" className="product-section"><div className="section-head"><h2>Products</h2><button onClick={() => setTab('search')}>Ver Todos <ChevronRight size={18}/></button></div><div className="product-grid">{products.map(p => <ProductCard key={p.name} product={p} onSelect={setSelected}/>)}</div></section>
          </main>
        )}
      </div>
      <nav className="bottom-nav"><button className={tab==='home'?'active':''} onClick={() => setTab('home')}><Home/><span>Início</span></button><button className={tab==='search'?'active':''} onClick={() => setTab('search')}><Search/><span>Busca</span></button><button className={tab==='admin'?'active':''} onClick={() => setTab('admin')}><Settings2/><span>Painel ADM</span></button></nav>
    </div>
  )
}

function Contact({icon,title,detail,href}:{icon:React.ReactNode;title:string;detail:string;href:string}) { return <a className="contact-row" href={href || '#'} target="_blank" rel="noopener noreferrer"><span className="contact-icon">{icon}</span><div><strong>{title}</strong><small>{detail}</small></div><ChevronRight size={17}/></a> }
function ProductCard({product,onSelect}:{product:Product;onSelect:(p:Product)=>void}) { return <button className="product-card" onClick={() => onSelect(product)}><div className="product-photo"><img src={product.image} loading="lazy"/></div><div className="product-name">{product.name}</div><div className="prices"><b>{product.price}</b><del>{product.old}</del></div></button> }
function SearchPage({query,setQuery,products,onSelect}:{query:string;setQuery:(s:string)=>void;products:Product[];onSelect:(p:Product)=>void}) { return <main className="search-page"><div className="search-box"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar produtos..."/></div><h1>Resultados</h1><div className="product-grid">{products.map(p=><ProductCard key={p.name} product={p} onSelect={onSelect}/>)}</div></main> }
function AdminPage({products,socials,setSocials}:{products:Product[];socials:SocialLinks;setSocials:React.Dispatch<React.SetStateAction<SocialLinks>>}) {
  const [draft,setDraft] = useState(socials)
  const [socialOpen,setSocialOpen] = useState(false)
  useEffect(() => setDraft(socials), [socials])
  const save = () => setSocials(draft)
  return <main className="admin-page"><div className="admin-head"><div><span className="detail-label">URBAN FIT</span><h1>Painel ADM</h1><p>Gerencie sua vitrine e seus produtos.</p></div><button className="admin-add"><Plus size={18}/> Adicionar</button></div><div className="admin-stats"><div><Package/><strong>{products.length}</strong><span>Produtos</span></div><button className="admin-social-button" onClick={() => setSocialOpen(v => !v)}><Instagram/><strong>Redes sociais</strong><span>{socialOpen ? 'Fechar' : 'Editar informações'}</span></button><div><Pencil/><strong>Editar</strong><span>Vitrine</span></div></div>{socialOpen && <section className="social-settings"><div className="social-settings-head"><div><h2>Redes sociais</h2><p>Preencha ou altere as informações da loja.</p></div><button className="social-save" onClick={save}><Save size={17}/> Salvar</button></div><label>WhatsApp<input value={draft.whatsapp} onChange={e=>setDraft({...draft,whatsapp:e.target.value})} placeholder="https://wa.me/5511999999999" /></label><label>Instagram<input value={draft.instagram} onChange={e=>setDraft({...draft,instagram:e.target.value})} placeholder="https://instagram.com/sualoja" /></label><label>Facebook<input value={draft.facebook} onChange={e=>setDraft({...draft,facebook:e.target.value})} placeholder="https://facebook.com/sualoja" /></label><small className="social-help">Use o link completo. Depois de salvar, os botões da vitrine passam a usar os novos links.</small></section>}<div className="admin-list"><h2>Produtos</h2>{products.slice(0,6).map(p=><div className="admin-item" key={p.name}><img src={p.image}/><div><strong>{p.name}</strong><small>{p.price}</small></div><button aria-label={`Editar ${p.name}`}><Pencil size={17}/></button></div>)}</div></main>
}
function ProductView({product,onBack,onAdd,whatsapp}:{product:Product;onBack:()=>void;onAdd:()=>void;whatsapp:string}) {return <main className="detail"><button className="back" onClick={onBack}><ArrowLeft/> Voltar</button><div className="detail-photo"><img src={product.image}/></div><p className="detail-label">URBAN FIT</p><h1>{product.name}</h1><div className="detail-price">{product.price} <del>{product.old}</del></div><p className="detail-text">Peça selecionada da nossa vitrine. Consulte tamanhos e disponibilidade pelo WhatsApp.</p><button className="buy" onClick={onAdd}>Adicionar ao carrinho</button>{whatsapp && <a className="whatsapp-detail" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/> Falar no WhatsApp</a>}</main>}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
