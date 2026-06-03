import { useEffect, useRef, useState } from 'react';
import { createProduct, deleteProduct, listProducts, updateProduct, uploadProductImage } from '../api.js';
import { DEMO } from '../config.js';

const CATEGORIES = ['Solar', 'Grau', 'Premium', 'Lentes', 'Acessórios', 'Outros'];

const EMPTY_FORM = { name: '', category: 'Solar', description: '', price_brl: '', image_file: null };

function formatPrice(v) {
  if (v == null) return '';
  return `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function ProductModal({ product, onClose, onSaved, onDeleted }) {
  const isEdit = !!product;
  const [form, setForm] = useState(
    isEdit
      ? { name: product.name, category: product.category, description: product.description || '', price_brl: product.price_brl != null ? String(product.price_brl) : '', image_file: null }
      : { ...EMPTY_FORM }
  );
  const [preview, setPreview] = useState(isEdit ? product.image_url : null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState(null);
  const fileRef = useRef(null);

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function onFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    set('image_file', f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSave() {
    if (!form.name.trim()) { setError('Nome obrigatório.'); return; }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim() || null,
        price_brl: form.price_brl !== '' ? parseFloat(form.price_brl) : null,
        tags: [],
        is_active: true,
        position: isEdit ? product.position : 9999,
      };
      let saved = isEdit
        ? await updateProduct(product.id, payload)
        : await createProduct(payload);

      if (form.image_file && saved?.id && !DEMO) {
        saved = await uploadProductImage(saved.id, form.image_file);
      }
      onSaved(saved);
    } catch (e) {
      setError(e.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      await deleteProduct(product.id);
      onDeleted(product.id);
    } catch (e) {
      setError(e.message || 'Erro ao excluir.');
      setDeleting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-atelier" style={{ maxWidth: 480 }}>
        <div className="modal-grabber" />
        <div className="modal-head">
          <h2>{isEdit ? 'Editar produto' : 'Novo produto'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Imagem */}
          <div>
            <label className="label-atelier">Foto do produto</label>
            <div
              className="product-upload-area"
              onClick={() => fileRef.current?.click()}
              style={{
                border: '1px dashed var(--champagne)',
                borderRadius: 'var(--r-card)',
                aspectRatio: '4/3',
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--ivory-soft)',
                position: 'relative',
              }}
            >
              {preview
                ? <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span className="muted" style={{ fontSize: 13 }}>Toque para adicionar foto</span>}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            </div>
          </div>

          {/* Nome */}
          <div>
            <label className="label-atelier">Nome *</label>
            <input className="input-atelier" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ex.: Aurora Tortoise" maxLength={120} />
          </div>

          {/* Categoria */}
          <div>
            <label className="label-atelier">Categoria</label>
            <select className="input-atelier" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Preço */}
          <div>
            <label className="label-atelier">Preço (opcional)</label>
            <input className="input-atelier" type="number" min="0" step="0.01" value={form.price_brl} onChange={(e) => set('price_brl', e.target.value)} placeholder="Ex.: 890" style={{ maxWidth: 180 }} />
          </div>

          {/* Descrição */}
          <div>
            <label className="label-atelier">Descrição curta (opcional)</label>
            <textarea className="textarea-atelier" value={form.description} onChange={(e) => set('description', e.target.value)} maxLength={500} rows={3} placeholder="Armação de acetato italiano, leve e resistente." />
          </div>

          {error && <div className="alert-atelier">{error}</div>}
        </div>

        <div className="modal-foot" style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          {isEdit && !confirmDelete && (
            <button className="btn-touch btn-ghost-atelier" style={{ minHeight: 44, padding: '0 16px', fontSize: 13, color: 'var(--crimson, #b00020)' }} onClick={() => setConfirmDelete(true)}>
              Excluir
            </button>
          )}
          {isEdit && confirmDelete && (
            <button className="btn-touch btn-ghost-atelier" style={{ minHeight: 44, padding: '0 16px', fontSize: 13, color: 'var(--crimson, #b00020)' }} onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Excluindo…' : 'Confirmar exclusão'}
            </button>
          )}
          {!isEdit && <span />}
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn-touch btn-ghost-atelier" style={{ minHeight: 44, padding: '0 18px' }} onClick={onClose}>Cancelar</button>
            <button className="btn-touch btn-primary-atelier" style={{ minHeight: 44, padding: '0 22px' }} onClick={handleSave} disabled={saving}>
              {saving ? <><span className="spinner" /> Salvando…</> : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Produtos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('Tudo');
  const [modal, setModal] = useState(null); // null | 'new' | product object

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const list = await listProducts({ includeInactive: true });
        if (!cancelled) setProducts(list);
      } catch (e) {
        if (!cancelled) setError('Não foi possível carregar o catálogo.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const cats = ['Tudo', ...CATEGORIES.filter((c) => products.some((p) => p.category === c))];
  const visible = filter === 'Tudo' ? products : products.filter((p) => p.category === filter);

  function onSaved(saved) {
    setProducts((ps) => {
      const exists = ps.find((p) => p.id === saved.id);
      return exists ? ps.map((p) => (p.id === saved.id ? saved : p)) : [...ps, saved];
    });
    setModal(null);
  }

  function onDeleted(id) {
    setProducts((ps) => ps.filter((p) => p.id !== id));
    setModal(null);
  }

  return (
    <>
      <div className="page-header">
        <div>
          <h1 className="dash-hello">Catálogo</h1>
          <p className="dash-sub">As fotos que aparecem no seu site público.</p>
        </div>
        <button className="btn-touch btn-primary-atelier" style={{ minHeight: 44, padding: '0 18px', fontSize: 13 }} onClick={() => setModal('new')}>
          + Adicionar
        </button>
      </div>

      {cats.length > 1 && (
        <div className="toolbar">
          {cats.map((c) => (
            <button key={c} className={`chip ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>
              {c}
              {c !== 'Tudo' && <span className="chip-count">{products.filter((p) => p.category === c).length}</span>}
              {c === 'Tudo' && <span className="chip-count">{products.length}</span>}
            </button>
          ))}
        </div>
      )}

      {error && <div className="alert-atelier" style={{ marginBottom: 16 }}>{error}</div>}

      {loading && (
        <div style={{ padding: 64, textAlign: 'center', color: 'var(--ink-mute)' }}>
          <div className="spinner" style={{ width: 28, height: 28, margin: '0 auto' }} />
        </div>
      )}

      {!loading && visible.length === 0 && (
        <div style={{ padding: '48px 0', textAlign: 'center' }}>
          <div className="eyebrow muted" style={{ marginBottom: 8 }}>catálogo vazio</div>
          <p className="muted" style={{ fontSize: 14, marginBottom: 24 }}>Adicione os produtos que aparecem no site público.</p>
          <button className="btn-touch btn-primary-atelier" style={{ minHeight: 48, padding: '0 28px' }} onClick={() => setModal('new')}>
            + Adicionar primeiro produto
          </button>
        </div>
      )}

      {!loading && visible.length > 0 && (
        <div className="grid-products">
          {visible.map((p) => (
            <article key={p.id} className={`product-card ${!p.is_active ? 'opacity-50' : ''}`} onClick={() => setModal(p)}>
              {p.image_url
                ? <img className="product-card-img" src={p.image_url} alt={p.name} loading="lazy" />
                : (
                  <div className="product-card-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ivory-soft)' }}>
                    <span style={{ fontSize: 32, opacity: 0.25 }}>◻</span>
                  </div>
                )}
              <div className="product-card-body">
                <div className="product-card-cat">{p.category}{!p.is_active && ' · inativo'}</div>
                <div className="product-card-name">{p.name}</div>
                {p.price_brl != null && <div className="product-card-price">{formatPrice(p.price_brl)}</div>}
              </div>
            </article>
          ))}
        </div>
      )}

      {modal && (
        <ProductModal
          product={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={onSaved}
          onDeleted={onDeleted}
        />
      )}
    </>
  );
}
