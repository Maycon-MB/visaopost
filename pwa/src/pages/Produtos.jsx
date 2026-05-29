const PRODUCTS = [
  { id: 1, nome: 'Aurora Tortoise', cat: 'Solar',   preco: 'R$ 890', img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=85' },
  { id: 2, nome: 'Lumen Acetato',   cat: 'Grau',    preco: 'R$ 1.140', img: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=85' },
  { id: 3, nome: 'Câmara Gold',     cat: 'Premium', preco: 'R$ 2.380', img: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=600&q=85' },
  { id: 4, nome: 'Linho Mate',      cat: 'Grau',    preco: 'R$ 980', img: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=85' },
  { id: 5, nome: 'Bossa Round',     cat: 'Solar',   preco: 'R$ 1.260', img: 'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=85' },
  { id: 6, nome: 'Vesper Titânio',  cat: 'Premium', preco: 'R$ 2.940', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=85' },
  { id: 7, nome: 'Florença Cat',    cat: 'Solar',   preco: 'R$ 1.080', img: 'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=85' },
  { id: 8, nome: 'Sereno Slim',     cat: 'Grau',    preco: 'R$ 870', img: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=85' },
];

export default function Produtos() {
  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="dash-hello">Catálogo</h1>
          <p className="dash-sub">As fotos que aparecem no seu site público. Arraste pra reordenar.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-touch btn-primary-atelier" style={{ minHeight: 44, padding: '0 18px', fontSize: 13 }}>
            + Adicionar produto
          </button>
        </div>
      </div>

      <div className="toolbar">
        <button className="chip active">Tudo <span className="chip-count">8</span></button>
        <button className="chip">Solar <span className="chip-count">3</span></button>
        <button className="chip">Grau <span className="chip-count">3</span></button>
        <button className="chip">Premium <span className="chip-count">2</span></button>
      </div>

      <div className="grid-products">
        {PRODUCTS.map((p) => (
          <article key={p.id} className="product-card">
            <img className="product-card-img" src={p.img} alt={p.nome} loading="lazy" />
            <div className="product-card-body">
              <div className="product-card-cat">{p.cat}</div>
              <div className="product-card-name">{p.nome}</div>
              <div className="product-card-price">{p.preco}</div>
            </div>
          </article>
        ))}
      </div>

      <p className="muted" style={{ marginTop: 24, fontSize: 12.5 }}>
        Amostra visual. Em breve: subir foto, reordenar arrastando e publicar no site.
      </p>
    </>
  );
}
