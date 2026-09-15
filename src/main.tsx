import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

function App() {
  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">URBAN FIT</p>
          <h1>Catálogo</h1>
        </div>
        <span className="status">Online</span>
      </header>

      <section className="hero">
        <p className="eyebrow">NOVA COLEÇÃO</p>
        <h2>Estilo urbano para todos os dias.</h2>
        <p>Explore nossa vitrine e encontre suas próximas peças favoritas.</p>
      </section>

      <section className="products">
        <article className="card"><div className="placeholder">👕</div><h3>Camiseta Urban</h3><p>Peça em destaque</p></article>
        <article className="card"><div className="placeholder">👖</div><h3>Calça Fit</h3><p>Peça em destaque</p></article>
        <article className="card"><div className="placeholder">👗</div><h3>Look Casual</h3><p>Peça em destaque</p></article>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><App /></React.StrictMode>
)
