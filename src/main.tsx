import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, ShoppingCart, ChevronRight, Home, Settings2, Grid2X2, MessageCircle, Instagram, Facebook, ArrowLeft, Plus, Save, Star, Minus, Trash2, X } from 'lucide-react'
import './index.css'
import './cart.css'

type Product = { name: string; price: string; old: string; image: string }
type SocialLinks = { whatsapp: string; instagram: string; facebook: string }
type CartItem = Product & { quantity: number }

const initialProducts: Product[] = [
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
const priceValue = (price: string) => {
  const text = String(price || '').replace(/[^\d,.]/g, '')
  if (text.includes(',')) return Number(text.replace(/\./g, '').replace(',', '.')) || 0
  return Number(text) || 0
}
const formatPrice = (value: string) => {
  const n = priceValue(value)
  return n > 0 ? `R$ ${n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''
}

function App() {
  const [tab, setTab] = useState<'home' | 'search' | 'admin'>('home')
  const [query, setQuery] = useState('')
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('urbanfit-products') || 'null')
      return Array.isArray(saved) && saved.length ? saved : initialProducts
    } catch { return initialProducts }
  })
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try { return JSON.parse(localStorage.getItem('urbanfit-cart') || '[]') || [] } catch { return [] }
  })
  const [cartOpen, setCartOpen] = useState(false)
  const [selected, setSelected] = useState<Product | null>(null)
  const [vitrineOpen, setVitrineOpen] = useState(false)
  const [socials, setSocials] = useState<SocialLinks>(() => {
    try { return JSON.parse(localStorage.getItem('urbanfit-socials') || '') || defaultSocials } catch { return defaultSocials }
  })
  const [featured, setFeatured] = useState<string[]>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('urbanfit-featured') || 'null')
      return Array.isArray(saved) ? saved : initialProducts.slice(0, 4).map(p => p.name)
    } catch { return initialProducts.slice(0, 4).map(p => p.name) }
  })
  const heroRef = useRef<HTMLImageElement>(null)
  const filtered = useMemo(() => products.filter(p => p.name.toLowerCase().includes(query.toLowerCase())), [products, query])
  const featuredProducts = useMemo(() => products.filter(p => featured.includes(p.name)), [products, featured])
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const cartTotal = cartItems.reduce((sum, item) => sum + priceValue(item.price) * item.quantity, 0)

  const addToCart = (product: Product) => setCartItems(current => {
    const found = current.find(item => item.name === product.name)
    return found
      ? current.map(item => item.name === product.name ? { ...item, quantity: item.quantity + 1 } : item)
      : [...current, { ...product, quantity: 1 }]
  })
  const changeQuantity = (name: string, delta: number) => setCartItems(current => current.map(item => item.name === name ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0))
  const removeFromCart = (name: string) => setCartItems(current => current.filter(item => item.name !== name))

  useEffect(() => { localStorage.setItem('urbanfit-products', JSON.stringify(products)) }, [products])
  useEffect(() => { localStorage.setItem('urbanfit-cart', JSON.stringify(cartItems)) }, [cartItems])
  useEffect(() => { localStorage.setItem('urbanfit-socials', JSON.stringify(socials)) }, [socials])
  useEffect(() => { localStorage.setItem('urbanfit-featured', JSON.stringify(featured)) }, [featured])
  useEffect(() => {
    if (heroRef.current) heroRef.current.animate(
      [{ opacity: 0, transform: 'translateY(18px) scale(.98)' }, { opacity: 1, transform: 'translateY(0) scale(1)' }],
      { duration: 650, easing: 'cubic-bezier(.22,1,.36,1)', fill: 'both' }
    )
  }, [])

  if (selected) return <ProductView product={selected} onBack={() => setSelected(null)} onAdd={() => addToCart(selected)} whatsapp={socials.whatsapp} />

  return <div className="app-shell">
    <div className="phone-content">
      <header className="topbar">
        <button className="menu-button" aria-label="menu"><span></span><span></span><span></span></button>
        <div className="brand"><span className="brand-mark"><i></i></span><strong>URBAN FIT</strong></div>
      </header>
      {cartOpen ? <CartPage items={cartItems} total={cartTotal} onBack={() => setCartOpen(false)} onIncrement={name => changeQuantity(name, 1)} onDecrement={name => changeQuantity(name, -1)} onRemove={removeFromCart} />
        : tab === 'search' ? <SearchPage query={query} setQuery={setQuery} products={filtered} onSelect={setSelected} />
        : tab === 'admin' ? <AdminPage products={products} setProducts={setProducts} socials={socials} setSocials={setSocials} featured={featured} setFeatured={setFeatured} />
        : vitrineOpen ? <VitrinePage products={featuredProducts} onBack={() => setVitrineOpen(false)} onSelect={setSelected} />
        : <main>
          <section className="feature-grid">
            <div className="orange-backdrop"></div>
            <div className="hero-image"><img ref={heroRef} src={heroImage} alt="Modelo Urban Fit" /></div>
            <div className="hero-copy"><div className="hero-title">ROUPAS E<br />CALÇADOS<br />PARA O<br />DIA A DIA</div></div>
            <section className="contact-card">
              <h2>Fale com a gente</h2><p>Estamos sempre por perto!</p>
              <Contact icon={<MessageCircle />} title="WhatsApp" detail="Falar no WhatsApp" href={socials.whatsapp} />
              <Contact icon={<Instagram />} title="Instagram" detail="@urbanfit.oficial" href={socials.instagram} />
              <Contact icon={<Facebook />} title="Facebook" detail="/urbanfit.oficial" href={socials.facebook} />
            </section>
            <button className="vitrine" onClick={() => setVitrineOpen(true)}><Grid2X2 size={20} /> Vitrine</button>
          </section>
          <section id="products" className="product-section">
            <div className="section-head"><h2>Produtos</h2><button onClick={() => setTab('search')}>Ver Todos <ChevronRight size={18} /></button></div>
            <div className="product-grid">{products.map(p => <ProductCard key={p.name} product={p} onSelect={setSelected} />)}</div>
          </section>
        </main>}
    </div>
    <nav className="bottom-nav">
      <button className={tab === 'home' && !cartOpen ? 'active' : ''} onClick={() => { setTab('home'); setCartOpen(false); setVitrineOpen(false) }}><Home /><span>Início</span></button>
      <button className={tab === 'search' && !cartOpen ? 'active' : ''} onClick={() => { setTab('search'); setCartOpen(false); setVitrineOpen(false) }}><Search /><span>Busca</span></button>
      <button className={cartOpen ? 'active' : ''} onClick={() => { setCartOpen(true); setVitrineOpen(false) }}><ShoppingCart /><span>Carrinho</span>{cartCount > 0 && <b className="cart-nav-badge">{cartCount}</b>}</button>
      <button className={tab === 'admin' && !cartOpen ? 'active' : ''} onClick={() => { setTab('admin'); setCartOpen(false); setVitrineOpen(false) }}><Settings2 /><span>Painel ADM</span></button>
    </nav>
  </div>
}

function Contact({ icon, title, detail, href }: { icon: React.ReactNode; title: string; detail: string; href: string }) {
  return <a className="contact-row" href={href || '#'} target="_blank" rel="noopener noreferrer"><span className="contact-icon">{icon}</span><div><strong>{title}</strong><small>{detail}</small></div><ChevronRight size={17} /></a>
}

function ProductCard({ product, onSelect }: { product: Product; onSelect: (p: Product) => void }) {
  return <button className="product-card" onClick={() => onSelect(product)}><div className="product-photo"><img src={product.image} loading="lazy" alt={product.name} /></div><div className="product-name">{product.name}</div><div className="prices"><b>{product.price}</b><del>{product.old}</del></div></button>
}

function SearchPage({ query, setQuery, products, onSelect }: { query: string; setQuery: (s: string) => void; products: Product[]; onSelect: (p: Product) => void }) {
  return <main className="search-page"><div className="search-box"><Search /><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Buscar produtos..." /></div><h1>Resultados</h1><div className="product-grid">{products.length ? products.map(p => <ProductCard key={p.name} product={p} onSelect={onSelect} />) : <div className="empty-vitrine">Nenhum produto encontrado.</div>}</div></main>
}

function VitrinePage({ products, onBack, onSelect }: { products: Product[]; onBack: () => void; onSelect: (p: Product) => void }) {
  return <main className="vitrine-page"><button className="back" onClick={onBack}><ArrowLeft /> Voltar</button><div className="vitrine-page-head"><div><span className="detail-label">URBAN FIT</span><h1>Vitrine</h1><p>As melhores peças selecionadas para você.</p></div><Star className="vitrine-page-star" /></div>{products.length ? <div className="product-grid">{products.map(p => <ProductCard key={p.name} product={p} onSelect={onSelect} />)}</div> : <div className="vitrine-empty"><Star /><h2>Vitrine vazia</h2><p>Escolha os produtos no Painel ADM → Vitrine.</p></div>}</main>
}

function CartPage({ items, total, onBack, onIncrement, onDecrement, onRemove }: { items: CartItem[]; total: number; onBack: () => void; onIncrement: (name: string) => void; onDecrement: (name: string) => void; onRemove: (name: string) => void }) {
  return <main className="cart-page"><button className="back cart-back" onClick={onBack}><ArrowLeft /> Voltar</button>{items.length ? <><div className="cart-head"><div><span className="detail-label">URBAN FIT</span><h1>Seu carrinho</h1><p>Guarde produtos e veja o valor de todos juntos.</p></div><div className="cart-icon-wrap"><ShoppingCart /><b className="cart-count">{items.reduce((s, i) => s + i.quantity, 0)}</b></div></div><div className="cart-list">{items.map(item => <article className="cart-item" key={item.name}><div className="cart-item-photo"><img src={item.image} alt={item.name} /></div><div className="cart-item-info"><strong>{item.name}</strong><span className="cart-item-price">{item.price}</span><div className="cart-controls"><button aria-label="diminuir" onClick={() => onDecrement(item.name)}><Minus size={15} /></button><span>{item.quantity}</span><button aria-label="aumentar" onClick={() => onIncrement(item.name)}><Plus size={15} /></button></div></div><button className="cart-remove" onClick={() => onRemove(item.name)} aria-label={`Remover ${item.name}`}><Trash2 size={17} /></button></article>)}</div><div className="cart-summary"><div className="cart-summary-row"><span>Total da seleção</span><strong>R$ {total.toFixed(2).replace('.', ',')}</strong></div><small className="cart-note">Este carrinho serve apenas para organizar os produtos e consultar o valor total. Não há finalização de compra.</small></div></> : <div className="cart-empty"><div className="cart-empty-box"><ShoppingCart /><h2>Carrinho vazio</h2><p>Adicione produtos para guardar suas escolhas e calcular o valor total.</p><button onClick={onBack}>Voltar para a vitrine</button></div></div>}</main>
}

function ProductView({ product, onBack, onAdd, whatsapp }: { product: Product; onBack: () => void; onAdd: () => void; whatsapp: string }) {
  return <main className="detail"><button className="back" onClick={onBack}><ArrowLeft /> Voltar</button><div className="detail-photo"><img src={product.image} alt={product.name} /></div><div className="detail-label">URBAN FIT</div><h1>{product.name}</h1><div className="detail-price">{product.price}<del>{product.old}</del></div><p className="detail-text">Uma peça selecionada para o dia a dia, com visual Urban Fit e foco em conforto e estilo.</p><button className="buy" onClick={onAdd}><ShoppingCart size={18} /> Guardar no carrinho</button><a className="whatsapp-detail" href={whatsapp || '#'} target="_blank" rel="noopener noreferrer"><MessageCircle size={17} /> Falar no WhatsApp</a></main>
}

function AdminPage({ products, setProducts, socials, setSocials, featured, setFeatured }: { products: Product[]; setProducts: React.Dispatch<React.SetStateAction<Product[]>>; socials: SocialLinks; setSocials: React.Dispatch<React.SetStateAction<SocialLinks>>; featured: string[]; setFeatured: React.Dispatch<React.SetStateAction<string[]>> }) {
  const [draft, setDraft] = useState(socials)
  const [socialOpen, setSocialOpen] = useState(false)
  const [vitrineOpen, setVitrineOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)
  const [featuredDraft, setFeaturedDraft] = useState(featured)
  const [newProduct, setNewProduct] = useState<Product>({ name: '', price: '', old: '', image: '' })
  const [addError, setAddError] = useState('')

  useEffect(() => setDraft(socials), [socials])
  useEffect(() => setFeaturedDraft(featured), [featured])

  const save = () => setSocials(draft)
  const saveVitrine = () => setFeatured(featuredDraft.filter(name => products.some(p => p.name === name)))
  const toggleFeatured = (name: string) => setFeaturedDraft(current => current.includes(name) ? current.filter(n => n !== name) : [...current, name])

  const addProduct = () => {
    const name = newProduct.name.trim()
    const image = newProduct.image.trim()
    const value = priceValue(newProduct.price)
    setAddError('')
    if (!name) return setAddError('Digite o nome da roupa.')
    if (!value) return setAddError('Digite um preço válido.')
    if (!image) return setAddError('Cole a URL da imagem da roupa.')
    if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) return setAddError('Já existe um produto com esse nome.')
    const product: Product = { name, price: formatPrice(newProduct.price), old: newProduct.old.trim() ? formatPrice(newProduct.old) : '', image }
    setProducts(current => [...current, product])
    setNewProduct({ name: '', price: '', old: '', image: '' })
    setAddOpen(false)
  }

  const removeProduct = (name: string) => {
    setProducts(current => current.filter(p => p.name !== name))
    setFeatured(current => current.filter(n => n !== name))
    setFeaturedDraft(current => current.filter(n => n !== name))
  }

  return <main className="admin-page">
    <div className="admin-head"><div><span className="detail-label">URBAN FIT</span><h1>Painel ADM</h1><p>Gerencie sua vitrine e seus produtos.</p></div><button className="admin-add" onClick={() => { setAddOpen(v => !v); setSocialOpen(false); setVitrineOpen(false); setAddError('') }}><Plus size={18} /> Adicionar</button></div>

    <div className="admin-stats"><div><PackageIcon /><strong>{products.length}</strong><span>Produtos</span></div><div><Star /><strong>{featured.length}</strong><span>Na vitrine</span></div><div><ShoppingCart /><strong>R$</strong><span>Catálogo</span></div></div>

    {addOpen && <section className="social-settings add-product-settings"><div className="social-settings-head"><div><h2>Nova roupa</h2><p>Cadastre uma peça para aparecer no catálogo.</p></div><button className="admin-close" onClick={() => setAddOpen(false)} aria-label="Fechar"><X size={17} /></button></div><label>Nome da roupa<input value={newProduct.name} onChange={e => setNewProduct(v => ({ ...v, name: e.target.value }))} placeholder="Ex.: Camiseta Oversized" /></label><label>Preço<input inputMode="decimal" value={newProduct.price} onChange={e => setNewProduct(v => ({ ...v, price: e.target.value }))} placeholder="Ex.: 89,90" /></label><label>Preço antigo <span className="optional-label">(opcional)</span><input inputMode="decimal" value={newProduct.old} onChange={e => setNewProduct(v => ({ ...v, old: e.target.value }))} placeholder="Ex.: 119,90" /></label><label>URL da imagem<input type="url" value={newProduct.image} onChange={e => setNewProduct(v => ({ ...v, image: e.target.value }))} placeholder="https://..." /></label>{addError && <small className="add-product-error">{addError}</small>}<button className="social-save add-product-submit" onClick={addProduct}><Plus size={16} /> Adicionar roupa</button><small className="social-help">Use o link direto de uma imagem. Depois de adicionar, a roupa aparece em Produtos, Busca e pode ser colocada na Vitrine.</small></section>}

    <div className="admin-stats admin-actions"><button className="admin-social-button" onClick={() => { setSocialOpen(v => !v); setVitrineOpen(false); setAddOpen(false) }}><MessageCircle /><strong>Redes sociais</strong><span>WhatsApp, Instagram e Facebook</span></button><button className="admin-social-button" onClick={() => { setVitrineOpen(v => !v); setSocialOpen(false); setAddOpen(false) }}><Star /><strong>Vitrine</strong><span>Escolha as peças em destaque</span></button><button className="admin-social-button" onClick={() => setAddOpen(true)}><Plus /><strong>Adicionar roupa</strong><span>Cadastrar nova peça</span></button></div>

    {socialOpen && <section className="social-settings"><div className="social-settings-head"><div><h2>Redes sociais</h2><p>Altere os links exibidos no contato.</p></div><button className="social-save" onClick={save}><Save size={15} /> Salvar</button></div><label>WhatsApp<input value={draft.whatsapp} onChange={e => setDraft(v => ({ ...v, whatsapp: e.target.value }))} placeholder="https://wa.me/..." /></label><label>Instagram<input value={draft.instagram} onChange={e => setDraft(v => ({ ...v, instagram: e.target.value }))} placeholder="https://instagram.com/..." /></label><label>Facebook<input value={draft.facebook} onChange={e => setDraft(v => ({ ...v, facebook: e.target.value }))} placeholder="https://facebook.com/..." /></label></section>}

    {vitrineOpen && <section className="social-settings vitrine-settings"><div className="social-settings-head"><div><h2>Produtos da Vitrine</h2><p>Marque as peças que aparecerão na Vitrine.</p></div><button className="social-save" onClick={saveVitrine}><Save size={15} /> Salvar</button></div><div className="featured-list">{products.map(p => <label className="featured-option" key={p.name}><input type="checkbox" checked={featuredDraft.includes(p.name)} onChange={() => toggleFeatured(p.name)} /><img src={p.image} alt="" /><span><strong>{p.name}</strong><small>{p.price}</small></span></label>)}</div></section>}

    <section className="admin-list"><h2>Produtos cadastrados</h2>{products.map(p => <div className="admin-item" key={p.name}><img src={p.image} alt="" /><div><strong>{p.name}</strong><small>{p.price}</small></div><button onClick={() => removeProduct(p.name)} aria-label={`Excluir ${p.name}`}><Trash2 size={15} /></button></div>)}</section>
  </main>
}

function PackageIcon() { return <div style={{ color: 'var(--orange)' }}><ShoppingCart size={19} /></div> }

createRoot(document.getElementById('root')!).render(<App />)
