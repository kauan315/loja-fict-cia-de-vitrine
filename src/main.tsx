import React, { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, ChevronRight, Grid2X2, Instagram, MapPin, Menu, MessageCircle, Search, ShoppingCart, User, Facebook } from 'lucide-react'
import './index.css'

type Product = { name: string; price: string; old: string; image: string }

const products: Product[] = [
  { name: 'Moletom Oversized', price: 'R$ 179', old: 'R$ 219', image: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=600&q=85' },
  { name: 'Calça Cargo', price: 'R$ 199', old: 'R$ 249', image: 'https://images.unsplash.com/photo-1506629905607-d9d4d5d8f6f7?auto=format&fit=crop&w=600&q=85' },
  { name: 'Tênis Esportivo', price: 'R$ 289', old: 'R$ 359', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=85' },
  { name: 'Camiseta Básica', price: 'R$ 69', old: 'R$ 89', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=85' },
  { name: 'Polo Premium', price: 'R$ 89', old: 'R$ 119', image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=600&q=85' },
  { name: 'Boné RS', price: 'R$ 59', old: 'R$ 79', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=600&q=85' },
  { name: 'Jaqueta Corta-Vento', price: 'R$ 289', old: 'R$ 359', image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=600&q=85' },
  { name: 'Moletom Básico', price: 'R$ 179', old: 'R$ 229', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=85' },
  { name: 'Tênis Casual', price: 'R$ 249', old: 'R$ 309', image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=600&q=85' },
  { name: 'Bermuda Cargo', price: 'R$ 149', old: 'R$ 189', image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=600&q=85' },
  { name: 'Shoulder Bag', price: 'R$ 99', old: 'R$ 129', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=85' },
  { name: 'Legging Esportiva', price: 'R$ 119', old: 'R$ 149', image: 'https://images.unsplash.com/photo-1506629905607-d9d4d5d8f6f7?auto=format&fit=crop&w=600&q=85' },
]

function App() {
  const [query, setQuery] = useState('')
  const filtered = products.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="app">
      <header className="topbar">
        <button className="icon-button mobile-only" aria-label="Menu"><Menu size={22} /></button>
        <div className="brand"><span className="brand-mark">◆</span><span>URBAN FIT</span></div>
        <nav className="nav-links"><a href="#inicio">Início</a><a href="#vitrine">Vitrine</a><a href="#contato">Contato</a></nav>
        <div className="top-actions">
          <button className="icon-button" aria-label="Carrinho"><ShoppingCart size={22} /></button>
          <button className="circle-arrow" aria-label="Perfil"><ChevronRight size={19} /></button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-photo">
            <img src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=90" alt="Look Urban Fit" />
          </div>
          <div className="hero-copy">
            <p className="hero-kicker">URBAN FIT</p>
            <h1>ROUPAS E<br />CALÇADOS<br />PARA O<br />DIA A DIA</h1>
            <button className="primary-button" onClick={() => document.getElementById('vitrine')?.scrollIntoView({ behavior: 'smooth' })}>Explorar Agora <ArrowRight size={19} /></button>
          </div>
        </section>

        <section className="contact-card" id="contato">
          <div className="contact-title">Fale com a gente<span>Estamos sempre por perto!</span></div>
          <a href="https://wa.me/5511987654321" className="contact-row"><span className="contact-icon whatsapp"><MessageCircle size={21} /></span><span><b>WhatsApp</b><small>(11) 98765-4321</small></span><ChevronRight /></a>
          <a href="#" className="contact-row"><span className="contact-icon instagram"><Instagram size={21} /></span><span><b>Instagram</b><small>@urbanfit.oficial</small></span><ChevronRight /></a>
          <a href="#" className="contact-row"><span className="contact-icon facebook"><Facebook size={21} /></span><span><b>Facebook</b><small>/urbanfit.oficial</small></span><ChevronRight /></a>
          <a href="#" className="contact-row"><span className="contact-icon tiktok">♪</span><span><b>TikTok</b><small>@urbanfit.oficial</small></span><ChevronRight /></a>
          <a href="#" className="contact-row"><span className="contact-icon location"><MapPin size={21} /></span><span><b>Endereço</b><small>Av. Principal, 123 - Centro</small></span><ChevronRight /></a>
        </section>

        <section className="catalog" id="vitrine">
          <div className="catalog-heading">
            <button className="vitrine-button"><Grid2X2 size={19} /> Vitrine</button>
            <div className="section-title"><h2>Products</h2><button onClick={() => setQuery('')}>Ver Todos <ChevronRight size={18} /></button></div>
          </div>
          <div className="search-box"><Search size={19} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar produtos..." /></div>
          <div className="product-grid">
            {filtered.map((product) => <article className="product-card" key={product.name}>
              <div className="product-image"><img src={product.image} alt={product.name} loading="lazy" /></div>
              <h3>{product.name}</h3>
              <div className="price"><strong>{product.price}</strong><del>{product.old}</del></div>
            </article>)}
          </div>
        </section>
      </main>

      <nav className="bottom-nav">
        <a className="active" href="#inicio"><span><span className="home-shape">◆</span></span>Início</a>
        <a href="#vitrine"><Search size={25} />Busca</a>
        <a href="#contato"><User size={25} />Perfil</a>
      </nav>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>)
