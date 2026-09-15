import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, ShoppingCart, ChevronRight, Home, User, Grid2X2, MapPin, MessageCircle, Instagram, Facebook, Music2, ArrowLeft } from 'lucide-react'
import './index.css'

type Product = { name: string; price: string; old: string; image: string; tag?: string }

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

function App() {
  const [tab, setTab] = useState<'home'|'search'|'profile'>('home')
  const [query, setQuery] = useState('')
  const [cart, setCart] = useState(0)
  const [selected, setSelected] = useState<Product | null>(null)
  const filtered = useMemo(() => products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())), [query])

  if (selected) return <ProductView product={selected} onBack={() => setSelected(null)} onAdd={() => setCart(v => v + 1)} />

  return (
    <div className="app-shell">
      <div className="phone-content">
        <header className="topbar">
          <div className="brand"><span className="brand-mark">◆</span><strong>URBAN FIT</strong></div>
          <div className="top-actions"><button aria-label="carrinho" onClick={() => alert(`${cart} item(ns) no carrinho`)}><ShoppingCart size={25}/>{cart > 0 && <b className="cart-badge">{cart}</b>}</button><button><ChevronRight size={23}/></button></div>
        </header>

        {tab === 'search' ? <SearchPage query={query} setQuery={setQuery} products={filtered} onSelect={setSelected} /> : tab === 'profile' ? <ProfilePage /> : (
          <main>
            <section className="hero-wrap">
              <div className="hero-image"><img src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=90"/><span className="hero-glow"/></div>
              <div className="hero-copy"><div className="hero-title">ROUPAS E<br/>CALÇADOS<br/>PARA O<br/>DIA A DIA</div><button onClick={() => document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}>Explorar Agora <ChevronRight size={20}/></button></div>
            </section>

            <section className="contact-card">
              <h2>Fale com a gente</h2><p>Estamos sempre por perto!</p>
              <Contact icon={<MessageCircle/>} title="WhatsApp" detail="(11) 98765-4321"/><Contact icon={<Instagram/>} title="Instagram" detail="@urbanfit.oficial"/><Contact icon={<Facebook/>} title="Facebook" detail="/urbanfit.oficial"/><Contact icon={<Music2/>} title="TikTok" detail="@urbanfit.oficial"/><Contact icon={<MapPin/>} title="Endereço" detail="Av. Principal, 123 - Centro"/>
            </section>

            <button className="vitrine" onClick={() => document.getElementById('products')?.scrollIntoView({behavior:'smooth'})}><Grid2X2 size={23}/> Vitrine</button>
            <section id="products" className="product-section"><div className="section-head"><h2>Products</h2><button onClick={() => setTab('search')}>Ver Todos <ChevronRight size={18}/></button></div><div className="product-grid">{products.map(p => <ProductCard key={p.name} product={p} onSelect={setSelected}/>)}</div></section>
          </main>
        )}
      </div>
      <nav className="bottom-nav">
        <button className={tab==='home'?'active':''} onClick={() => setTab('home')}><Home/><span>Início</span></button>
        <button className={tab==='search'?'active':''} onClick={() => setTab('search')}><Search/><span>Busca</span></button>
        <button className={tab==='profile'?'active':''} onClick={() => setTab('profile')}><User/><span>Perfil</span></button>
      </nav>
    </div>
  )
}

function Contact({icon,title,detail}:{icon:React.ReactNode;title:string;detail:string}) { return <div className="contact-row"><span className="contact-icon">{icon}</span><div><strong>{title}</strong><small>{detail}</small></div><ChevronRight size={19}/></div> }
function ProductCard({product,onSelect}:{product:Product;onSelect:(p:Product)=>void}) { return <button className="product-card" onClick={() => onSelect(product)}><div className="product-photo"><img src={product.image} loading="lazy"/></div><div className="product-name">{product.name}</div><div className="prices"><b>{product.price}</b><del>{product.old}</del></div></button> }
function SearchPage({query,setQuery,products,onSelect}:{query:string;setQuery:(s:string)=>void;products:Product[];onSelect:(p:Product)=>void}) { return <main className="search-page"><div className="search-box"><Search/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar produtos..."/></div><h1>Resultados</h1><div className="product-grid">{products.map(p=><ProductCard key={p.name} product={p} onSelect={onSelect}/>)}</div></main> }
function ProfilePage(){return <main className="profile-page"><div className="profile-avatar">UF</div><h1>Urban Fit</h1><p>Moda urbana para todos os dias.</p><div className="profile-info"><strong>Atendimento</strong><span>Seg–Sáb • 09:00–18:00</span><span>WhatsApp: (11) 98765-4321</span></div></main>}
function ProductView({product,onBack,onAdd}:{product:Product;onBack:()=>void;onAdd:()=>void}) {return <main className="detail"><button className="back" onClick={onBack}><ArrowLeft/> Voltar</button><div className="detail-photo"><img src={product.image}/></div><p className="detail-label">URBAN FIT</p><h1>{product.name}</h1><div className="detail-price">{product.price} <del>{product.old}</del></div><p className="detail-text">Peça selecionada da nossa vitrine. Consulte tamanhos e disponibilidade pelo WhatsApp.</p><button className="buy" onClick={onAdd}>Adicionar ao carrinho</button></main>}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
