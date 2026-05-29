import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../api.js';

const GLASSES_IMAGES = [
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=600&q=85',
  'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=600&q=85',
];

function formatBRL(num) {
  if (num == null || isNaN(num)) return 'Sob consulta';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(num);
}

export default function Produtos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Tudo');
  const [modal, setModal] = useState(null); // null | {} (novo) | product (editar)
  const [toasts, setToasts] = useState([]);
  const [draggedIdx, setDraggedIdx] = useState(null);

  const toast = useCallback((msg, kind = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listProducts();
      // Ordenar por position
      const sorted = (data || []).sort((a, b) => (a.position || 0) - (b.position || 0));
      setProducts(sorted);
    } catch (e) {
      setError(e.message || 'falha ao carregar catálogo');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    return {
      Tudo: products.length,
      Solar: products.filter((p) => p.category === 'Solar').length,
      Grau: products.filter((p) => p.category === 'Grau').length,
      Premium: products.filter((p) => p.category === 'Premium').length,
    };
  }, [products]);

  const FILTERS = ['Tudo', 'Solar', 'Grau', 'Premium'];

  const list = useMemo(() => {
    if (filter === 'Tudo') return products;
    return products.filter((p) => p.category === filter);
  }, [products, filter]);

  // ── Drag & Drop handlers ──────────────────────────────────────────
  const handleDragStart = (e, index) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetIdx) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;

    const reordered = [...products];
    const [removed] = reordered.splice(draggedIdx, 1);
    reordered.splice(targetIdx, 0, removed);

    // Ajusta as posições locais de cada um
    const updated = reordered.map((item, idx) => ({ ...item, position: idx + 1 }));
    setProducts(updated);
    setDraggedIdx(null);

    toast('Nova ordem salva no catálogo!');

    // Tentar atualizar em background
    try {
      for (const p of updated) {
        await updateProduct(p.id, { position: p.position });
      }
    } catch (err) {
      console.warn("Erro ao salvar ordem no servidor", err);
    }
  };

  return (
    <>
      <div className="page-header enter">
        <div>
          <h1 className="dash-hello">Catálogo</h1>
          <p className="dash-sub">As fotos que aparecem no seu site público. Arraste pra reordenar.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            className="btn-touch btn-primary-atelier"
            style={{ minHeight: 44, padding: '0 18px', fontSize: 13 }}
            onClick={() => setModal({})}
          >
            + Adicionar produto
          </button>
        </div>
      </div>

      <div className="toolbar enter enter-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} <span className="chip-count">{counts[f] || 0}</span>
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-mute)' }}>
          <div className="ornament" style={{ fontSize: 24, marginBottom: 8 }}>✻</div>
          <p>Carregando fotos do catálogo…</p>
        </div>
      )}

      {!loading && error && (
        <div className="alert-atelier" style={{ margin: '16px 0' }}>
          {error} — <button className="btn-link-atelier" onClick={load}>tentar de novo</button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid-products enter enter-2">
          {list.map((p, index) => (
            <article
              key={p.id}
              className="product-card"
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onClick={() => setModal(p)}
              style={{ cursor: 'grab' }}
              title="Clique para editar · Arraste para reordenar"
            >
              <img className="product-card-img" src={p.image_url} alt={p.name} loading="lazy" />
              <div className="product-card-body">
                <div className="product-card-cat">{p.category}</div>
                <div className="product-card-name">{p.name}</div>
                <div className="product-card-price">{formatBRL(p.price_brl)}</div>
              </div>
            </article>
          ))}

          {list.length === 0 && (
            <div className="empty-state" style={{ gridColumn: '1 / -1', padding: 60 }}>
              Nenhum produto cadastrado nesta categoria. <button className="btn-link-atelier" onClick={() => setModal({})}>Cadastre o primeiro</button>!
            </div>
          )}
        </div>
      )}

      <p className="muted" style={{ marginTop: 32, fontSize: 12.5 }}>
        ✻ <strong>Arraste os cards</strong> acima para mudar a ordem exibida na sua landing page pública. As alterações salvam automaticamente.
      </p>

      {modal && (
        <ProductModal
          product={modal.id ? modal : null}
          onClose={() => setModal(null)}
          onSaved={async (msg) => { setModal(null); toast(msg); await load(); }}
          onError={(m) => toast(m, 'error')}
        />
      )}

      <div className="toast-wrap">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind === 'error' ? 'is-error' : ''}`}>{t.msg}</div>
        ))}
      </div>
    </>
  );
}

function ProductModal({ product, onClose, onSaved, onError }) {
  const editing = !!product;
  const [form, setForm] = useState({
    name: product?.name || '',
    category: product?.category || 'Solar',
    price_brl: product?.price_brl != null ? product.price_brl : '',
    image_url: product?.image_url || '',
    description: product?.description || '',
    tags: product?.tags || '',
  });
  const [saving, setSaving] = useState(false);
  const [fieldErr, setFieldErr] = useState(null);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (form.name.trim().length < 2) return setFieldErr('Nome precisa de ao menos 2 letras.');
    
    setFieldErr(null);
    setSaving(true);
    try {
      // Se não passou imagem, atribui uma randômica de alta qualidade para ficar bonito
      let img = form.image_url.trim();
      if (!img) {
        img = GLASSES_IMAGES[Math.floor(Math.random() * GLASSES_IMAGES.length)];
      }

      const payload = {
        name: form.name.trim(),
        category: form.category,
        price_brl: form.price_brl !== '' ? parseFloat(form.price_brl) : null,
        image_url: img,
        description: form.description.trim() || null,
        tags: form.tags.trim() || null,
      };

      if (editing) {
        await updateProduct(product.id, payload);
        onSaved('Produto atualizado!');
      } else {
        await createProduct(payload);
        onSaved('Produto cadastrado com sucesso!');
      }
    } catch (err) {
      onError(err.message || 'erro ao salvar produto');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Deseja mesmo remover o produto "${product.name}" do catálogo?`)) return;
    setSaving(true);
    try {
      await deleteProduct(product.id);
      onSaved('Produto removido.');
    } catch (err) {
      onError(err.message || 'erro ao remover');
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-atelier" role="dialog" aria-modal="true" style={{ maxWidth: 540 }}>
        <div className="modal-grabber" />
        <div className="modal-head">
          <div>
            <div className="eyebrow"><span className="eyebrow-num">{editing ? '✎' : '+'}</span> {editing ? 'Editar produto' : 'Novo produto'}</div>
            <h2>{editing ? product.name : <>Qual armação entra na <em className="text-italic-serif" style={{ color: 'var(--champagne)' }}>vitrine</em>?</>}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <form onSubmit={submit}>
          <div className="modal-body">
            {fieldErr && <div className="alert-atelier">{fieldErr}</div>}

            <div>
              <label className="label-atelier">Nome do Produto</label>
              <input className="input-atelier" value={form.name} onChange={set('name')} placeholder="Ray-Ban Wayfarer Classic" autoFocus required />
            </div>

            <div className="field-grid two">
              <div>
                <label className="label-atelier">Categoria</label>
                <select className="input-atelier" value={form.category} onChange={set('category')} style={{ appearance: 'none', background: 'var(--bg-card) url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236B7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E") no-repeat right 10px center', backgroundSize: '18px' }}>
                  <option value="Solar">Solar</option>
                  <option value="Grau">Grau</option>
                  <option value="Premium">Premium</option>
                  <option value="Lentes">Lentes</option>
                </select>
              </div>
              <div>
                <label className="label-atelier">Preço (R$) <span className="muted" style={{ fontWeight: 400 }}>(opcional)</span></label>
                <input type="number" className="input-atelier" value={form.price_brl} onChange={set('price_brl')} placeholder="1280" min="0" step="1" />
              </div>
            </div>

            <div>
              <label className="label-atelier">Link da Imagem <span className="muted" style={{ fontWeight: 400 }}>(opcional)</span></label>
              <input className="input-atelier" value={form.image_url} onChange={set('image_url')} placeholder="Deixe em branco para usar uma foto premium aleatória" />
            </div>

            <div>
              <label className="label-atelier">Descrição Curta</label>
              <textarea className="textarea-atelier" style={{ minHeight: 70 }} value={form.description} onChange={set('description')} maxLength={200} placeholder="Modelo aviador clássico, lentes verdes polarizadas G-15, armação em metal dourado." />
            </div>

            <div>
              <label className="label-atelier">Tags / Marca <span className="muted" style={{ fontWeight: 400 }}>(opcional)</span></label>
              <input className="input-atelier" value={form.tags} onChange={set('tags')} placeholder="Ray-Ban, Acetato, Polarizado" />
            </div>
          </div>

          <div className="modal-foot" style={{ justifyContent: editing ? 'space-between' : 'flex-end' }}>
            {editing && (
              <button type="button" className="btn-touch btn-danger-atelier" onClick={handleDelete} disabled={saving} style={{ marginRight: 'auto' }}>
                Excluir produto
              </button>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" className="btn-touch btn-ghost-atelier" style={{ minHeight: 48, padding: '0 22px' }} onClick={onClose} disabled={saving}>Cancelar</button>
              <button type="submit" className="btn-touch btn-primary-atelier" style={{ minHeight: 48, padding: '0 26px' }} disabled={saving}>
                {saving ? <><span className="spinner" /> Salvando…</> : editing ? 'Salvar' : 'Adicionar produto'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
