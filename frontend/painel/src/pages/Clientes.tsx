import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  listClients,
  createClient,
  updateClient,
  deleteClient,
  markContacted,
  importClientsCsv,
  downloadClientsCsv,
} from '../api.js';

const STATUS_LABEL = { active: 'ativo', opted_out: 'fora do recall', converted: 'cliente fiel' };

function monthsSince(iso) {
  if (!iso) return null;
  return Math.round((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24 * 30));
}

function formatPhone(digits) {
  const d = (digits || '').replace(/\D/g, '');
  const local = d.length > 11 ? d.slice(-11) : d; // tira +55 se vier
  if (local.length === 11) return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7)}`;
  if (local.length === 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return digits;
}

function isThisWeek(iso) {
  if (!iso) return false;
  return Date.now() - new Date(iso).getTime() < 7 * 24 * 60 * 60 * 1000;
}

function mesesTexto(m) {
  if (m == null) return null;
  if (m <= 0) return 'este mês';
  if (m === 1) return 'há 1 mês';
  return `há ${m} meses`;
}

const CI = {
  edit: ['M4 20h4L18 10l-4-4L4 16v4Z', 'M13 7l4 4'],
  chat: ['M4 5h16v11H9l-4 4V5Z'],
  check: ['M5 13l4 4 10-10'],
  ban: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M6 6l12 12'],
  refresh: ['M3.5 12a8.5 8.5 0 0 1 14.5-6L20 8', 'M20 3.5V8h-4.5', 'M20.5 12A8.5 8.5 0 0 1 6 18L4 16', 'M4 20.5V16h4.5'],
};
function CIcon({ p }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {p.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

export default function Clientes() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('todos');
  const [q, setQ] = useState('');
  const [modal, setModal] = useState(null); // null | {} (novo) | client (editar)
  const [toasts, setToasts] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const fileRef = useRef(null);

  const toast = useCallback((msg, kind = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setClients(await listClients({ status: 'all' }));
    } catch (e) {
      setError(e.message || 'falha ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const counts = useMemo(() => {
    const recall = (c) => c.status === 'active' && (monthsSince(c.last_exam_date) ?? -1) >= 12;
    return {
      todos: clients.length,
      ativos: clients.filter((c) => c.status === 'active').length,
      recall: clients.filter(recall).length,
      novos: clients.filter((c) => isThisWeek(c.created_at)).length,
      opt_out: clients.filter((c) => c.status === 'opted_out').length,
    };
  }, [clients]);

  const FILTERS = [
    { id: 'todos', label: 'Todos' },
    { id: 'ativos', label: 'Ativos' },
    { id: 'recall', label: 'Exame +12m' },
    { id: 'novos', label: 'Novos da semana' },
    { id: 'opt_out', label: 'Fora do recall' },
  ];

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return clients.filter((c) => {
      if (filter === 'ativos' && c.status !== 'active') return false;
      if (filter === 'opt_out' && c.status !== 'opted_out') return false;
      if (filter === 'novos' && !isThisWeek(c.created_at)) return false;
      if (filter === 'recall') {
        if (c.status !== 'active' || (monthsSince(c.last_exam_date) ?? -1) < 12) return false;
      }
      if (term && !c.name.toLowerCase().includes(term) && !c.phone.includes(term.replace(/\D/g, ''))) {
        return false;
      }
      return true;
    });
  }, [clients, filter, q]);

  async function rowAction(client, action) {
    setBusyId(client.id);
    try {
      if (action === 'contacted') {
        await markContacted(client.id);
        toast(`${client.name.split(' ')[0]} marcado como contatado.`);
      } else if (action === 'exam') {
        await updateClient(client.id, { last_exam_date: new Date().toISOString().slice(0, 10) });
        toast('Exame de hoje registrado.');
      } else if (action === 'optout') {
        await updateClient(client.id, { status: 'opted_out' });
        toast(`${client.name.split(' ')[0]} saiu do recall.`);
      } else if (action === 'reactivate') {
        await updateClient(client.id, { status: 'active' });
        toast(`${client.name.split(' ')[0]} de volta ao recall.`);
      } else if (action === 'delete') {
        if (!window.confirm(`Apagar ${client.name} de vez? Não dá pra desfazer.`)) return;
        await deleteClient(client.id);
        toast('Cliente removido.');
      }
      await load();
    } catch (e) {
      toast(e.message || 'erro na ação', 'error');
    } finally {
      setBusyId(null);
    }
  }

  async function onImportFile(e) {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const r = await importClientsCsv(file);
      const dup = r.skipped_duplicates ? `, ${r.skipped_duplicates} já existiam` : '';
      const bad = r.failed?.length ? `, ${r.failed.length} com erro` : '';
      toast(`${r.inserted} importados${dup}${bad}.`);
      await load();
    } catch (err) {
      toast(err.message || 'CSV inválido', 'error');
    }
  }

  return (
    <>
      <div className="page-header enter">
        <div>
          <h1 className="dash-hello">Clientes</h1>
          <p className="dash-sub">Quem entra no recall, quem volta sempre, quem precisa de um chamado.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-touch btn-ghost-atelier" style={{ minHeight: 44, padding: '0 14px', fontSize: 13 }} onClick={() => downloadClientsCsv().catch(() => toast('Erro ao exportar', 'error'))}>
            Exportar
          </button>
          <button className="btn-touch btn-ghost-atelier" style={{ minHeight: 44, padding: '0 14px', fontSize: 13 }} onClick={() => fileRef.current?.click()}>
            ⤓ Importar CSV
          </button>
          <button className="btn-touch btn-primary-atelier" style={{ minHeight: 44, padding: '0 18px', fontSize: 13 }} onClick={() => setModal({})}>
            + Cadastrar
          </button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={onImportFile} />
        </div>
      </div>

      <div className="card-aotelier enter enter-1" style={{ marginBottom: 24, padding: 18 }}>
        <input
          className="input-atelier"
          placeholder="Buscar por nome ou telefone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="toolbar enter enter-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label} <span className="chip-count">{counts[f.id]}</span>
          </button>
        ))}
      </div>

      <div className="card-flush enter enter-2">
        <table className="table-atelier">
          <thead>
            <tr>
              <th>Nome</th>
              <th>WhatsApp</th>
              <th>Último exame</th>
              <th>Situação</th>
              <th style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={`sk-${i}`}>
                  {Array.from({ length: 5 }).map((__, j) => (
                    <td key={j}><div className="skeleton-row" style={{ width: j === 4 ? 80 : '70%', marginLeft: j === 4 ? 'auto' : 0 }} /></td>
                  ))}
                </tr>
              ))}

            {!loading && error && (
              <tr><td colSpan="5"><div className="alert-atelier" style={{ margin: 8 }}>{error} — <button className="btn-link-atelier" onClick={load}>tentar de novo</button></div></td></tr>
            )}

            {!loading && !error && list.map((c) => {
              const m = monthsSince(c.last_exam_date);
              const overdue = c.status === 'active' && (m ?? -1) >= 12;
              const busy = busyId === c.id;
              return (
                <tr key={c.id} style={{ opacity: busy ? 0.5 : 1 }}>
                  <td style={{ fontWeight: 500 }}>{c.name}</td>
                  <td className="muted phone-cell">{formatPhone(c.phone)}</td>
                  <td>
                    {c.last_exam_date ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <span>{new Date(c.last_exam_date).toLocaleDateString('pt-BR')}</span>
                        {overdue
                          ? <span className="tag-mute" style={{ fontSize: 11, background: 'rgba(176,119,44,0.16)', color: 'var(--warning)' }}>recall vencido · {mesesTexto(m)}</span>
                          : <span className="muted" style={{ fontSize: 12 }}>{mesesTexto(m)}</span>}
                      </div>
                    ) : <span className="muted">sem registro</span>}
                  </td>
                  <td>
                    <span className="tag-mute" style={{
                      fontSize: 11,
                      background: c.status === 'opted_out' ? 'rgba(155,44,44,0.12)' : c.status === 'converted' ? 'rgba(176,119,44,0.16)' : 'rgba(26,92,61,0.1)',
                      color: c.status === 'opted_out' ? 'var(--danger)' : c.status === 'converted' ? 'var(--warning)' : 'var(--primary)',
                    }}>
                      {STATUS_LABEL[c.status] || c.status}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button className="icon-btn" title="Editar cadastro" aria-label="Editar cadastro" onClick={() => setModal(c)} disabled={busy}><CIcon p={CI.edit} /></button>
                      <button className="icon-btn ok" title="Marcar que você falou com o cliente" aria-label="Marcar contatado" onClick={() => rowAction(c, 'contacted')} disabled={busy}><CIcon p={CI.chat} /></button>
                      <button className="icon-btn ok" title="Registrar exame feito hoje" aria-label="Exame feito hoje" onClick={() => rowAction(c, 'exam')} disabled={busy}><CIcon p={CI.check} /></button>
                      {c.status === 'opted_out'
                        ? <button className="icon-btn" title="Trazer de volta pro recall" aria-label="Reativar recall" onClick={() => rowAction(c, 'reactivate')} disabled={busy}><CIcon p={CI.refresh} /></button>
                        : <button className="icon-btn danger" title="Tirar do recall (cliente não quer receber)" aria-label="Tirar do recall" onClick={() => rowAction(c, 'optout')} disabled={busy}><CIcon p={CI.ban} /></button>}
                    </div>
                  </td>
                </tr>
              );
            })}

            {!loading && !error && list.length === 0 && (
              <tr><td colSpan="5">
                <div className="empty-state">
                  {clients.length === 0
                    ? <>Nenhum cliente ainda. <button className="btn-link-atelier" onClick={() => setModal({})}>cadastre o primeiro</button> ou importe um CSV.</>
                    : 'Nenhum cliente nesse filtro.'}
                </div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {modal && (
        <ClientModal
          client={modal.id ? modal : null}
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

const thS = { padding: '4px 6px', textAlign: 'center', fontWeight: 500, fontSize: 11, color: 'var(--text-muted, #888)', borderBottom: '1px solid var(--border, #e0e0e0)', whiteSpace: 'nowrap' };
const tdS = { padding: '3px 3px', verticalAlign: 'middle' };

const SOURCES = [
  ['manual', 'Cadastro no balcão'],
  ['qr_balcao', 'QR Code do balcão'],
  ['indicacao', 'Indicação'],
  ['instagram', 'Instagram'],
  ['site', 'Site'],
];
const LENS_TYPES = ['Monofocal', 'Multifocal', 'Antirreflexo', 'Transitions', 'Bifocal'];

function ClientModal({ client, onClose, onSaved, onError }) {
  const editing = !!client;
  const emptyOlho = () => ({ esferico: '', cilindrico: '', eixo: '', dp: '', altura: '' });
  const emptyReceita = () => ({
    longe: { od: emptyOlho(), oe: emptyOlho() },
    perto: { od: emptyOlho(), oe: emptyOlho() },
    lente: '', armacao: '', obs: '',
  });
  const fromReceita = (r) => r ? {
    longe: {
      od: { esferico: r.longe?.od?.esferico ?? '', cilindrico: r.longe?.od?.cilindrico ?? '', eixo: r.longe?.od?.eixo ?? '', dp: r.longe?.od?.dp ?? '', altura: r.longe?.od?.altura ?? '' },
      oe: { esferico: r.longe?.oe?.esferico ?? '', cilindrico: r.longe?.oe?.cilindrico ?? '', eixo: r.longe?.oe?.eixo ?? '', dp: r.longe?.oe?.dp ?? '', altura: r.longe?.oe?.altura ?? '' },
    },
    perto: {
      od: { esferico: r.perto?.od?.esferico ?? '', cilindrico: r.perto?.od?.cilindrico ?? '', eixo: r.perto?.od?.eixo ?? '', dp: r.perto?.od?.dp ?? '', altura: r.perto?.od?.altura ?? '' },
      oe: { esferico: r.perto?.oe?.esferico ?? '', cilindrico: r.perto?.oe?.cilindrico ?? '', eixo: r.perto?.oe?.eixo ?? '', dp: r.perto?.oe?.dp ?? '', altura: r.perto?.oe?.altura ?? '' },
    },
    lente: r.lente || '', armacao: r.armacao || '', obs: r.obs || '',
  } : emptyReceita();

  const [form, setForm] = useState({
    name: client?.name || '',
    phone: client?.phone || '',
    email: client?.email || '',
    last_exam_date: client?.last_exam_date || '',
    observations: client?.observations || '',
    birth_date: client?.birth_date || '',
    consent_whatsapp: client?.consent_whatsapp || false,
    source: client?.source || 'manual',
    health_plan: client?.health_plan || '',
    lens_type: client?.lens_type || '',
    frame_brand: client?.frame_brand || '',
    last_purchase_date: client?.last_purchase_date || '',
    last_purchase_value_brl: client?.last_purchase_value_brl ?? '',
    next_return_date: client?.next_return_date || '',
    neighborhood: client?.neighborhood || '',
    receita: fromReceita(client?.receita),
  });
  const [saving, setSaving] = useState(false);
  const [fieldErr, setFieldErr] = useState(null);
  const [showMore, setShowMore] = useState(editing);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setR = (dist, olho, campo) => (e) =>
    setForm((f) => ({
      ...f,
      receita: {
        ...f.receita,
        [dist]: { ...f.receita[dist], [olho]: { ...f.receita[dist][olho], [campo]: e.target.value } },
      },
    }));
  const setRField = (campo) => (e) => setForm((f) => ({ ...f, receita: { ...f.receita, [campo]: e.target.value } }));
  const today = new Date().toISOString().slice(0, 10);

  async function submit(e) {
    e.preventDefault();
    if (form.name.trim().length < 2) return setFieldErr('Nome precisa de ao menos 2 letras.');
    if (form.phone.replace(/\D/g, '').length < 10) return setFieldErr('WhatsApp com DDD, ao menos 10 dígitos.');
    setFieldErr(null);
    setSaving(true);
    try {
      const parseNum = (v) => v === '' || v == null ? null : Number(v);
      const parseOlho = (o) => ({ esferico: parseNum(o.esferico), cilindrico: parseNum(o.cilindrico), eixo: parseNum(o.eixo), dp: parseNum(o.dp), altura: parseNum(o.altura) });
      const rr = form.receita;
      const receitaPayload = (() => {
        const longeOd = parseOlho(rr.longe.od);
        const longeOe = parseOlho(rr.longe.oe);
        const pertoOd = parseOlho(rr.perto.od);
        const pertoOe = parseOlho(rr.perto.oe);
        const hasData = Object.values({ ...longeOd, ...longeOe, ...pertoOd, ...pertoOe }).some((v) => v != null)
          || rr.lente.trim() || rr.armacao.trim() || rr.obs.trim();
        if (!hasData) return null;
        return { longe: { od: longeOd, oe: longeOe }, perto: { od: pertoOd, oe: pertoOe }, lente: rr.lente.trim() || null, armacao: rr.armacao.trim() || null, obs: rr.obs.trim() || null };
      })();
      const payload = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || null,
        last_exam_date: form.last_exam_date || null,
        observations: form.observations.trim() || null,
        birth_date: form.birth_date || null,
        consent_whatsapp: form.consent_whatsapp,
        source: form.source || 'manual',
        health_plan: form.health_plan.trim() || null,
        lens_type: form.lens_type.trim() || null,
        frame_brand: form.frame_brand.trim() || null,
        last_purchase_date: form.last_purchase_date || null,
        last_purchase_value_brl: form.last_purchase_value_brl ? Number(form.last_purchase_value_brl) : null,
        next_return_date: form.next_return_date || null,
        neighborhood: form.neighborhood.trim() || null,
        receita: receitaPayload,
      };
      if (editing) {
        await updateClient(client.id, payload);
        onSaved('Cliente atualizado.');
      } else {
        await createClient(payload);
        onSaved('Cliente cadastrado.');
      }
    } catch (err) {
      if (err.status === 409) setFieldErr('Já existe um cliente com esse WhatsApp.');
      else onError(err.message || 'erro ao salvar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-atelier" role="dialog" aria-modal="true">
        <div className="modal-grabber" />
        <div className="modal-head">
          <div>
            <div className="eyebrow">{editing ? 'Editar cliente' : 'Novo cliente'}</div>
            <h2>{editing ? client.name : 'Quem entra na carteira'}</h2>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Fechar">×</button>
        </div>

        <form onSubmit={submit}>
          <div className="modal-body">
            {fieldErr && <div className="alert-atelier">{fieldErr}</div>}

            <div>
              <label className="label-atelier">Nome completo</label>
              <input className="input-atelier" value={form.name} onChange={set('name')} placeholder="Maria das Graças" autoFocus />
            </div>

            <div className="field-grid two">
              <div>
                <label className="label-atelier">WhatsApp</label>
                <input className="input-atelier" value={form.phone} onChange={set('phone')} placeholder="(31) 99999-9999" inputMode="tel" />
              </div>
              <div>
                <label className="label-atelier">Nascimento <span className="muted" style={{ fontWeight: 400 }}>(opcional)</span></label>
                <input type="date" className="input-atelier" value={form.birth_date} onChange={set('birth_date')} max={today} />
              </div>
            </div>

            <div
              className={`check-row ${form.consent_whatsapp ? 'on' : ''}`}
              onClick={() => setForm((f) => ({ ...f, consent_whatsapp: !f.consent_whatsapp }))}
              role="checkbox" aria-checked={form.consent_whatsapp} tabIndex={0}
              onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && (e.preventDefault(), setForm((f) => ({ ...f, consent_whatsapp: !f.consent_whatsapp })))}
            >
              <span className="check-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4 10-10" /></svg>
              </span>
              <span className="check-main">
                <div className="ct">Autoriza receber mensagens no WhatsApp</div>
                <div className="cd">Necessário pra entrar no recall (LGPD). Marque só se o cliente concordou.</div>
              </span>
            </div>

            <button type="button" className="btn-link-atelier" style={{ alignSelf: 'flex-start' }} onClick={() => setShowMore((s) => !s)}>
              {showMore ? '− Menos detalhes' : '+ Mais detalhes'}
            </button>

            {showMore && (
              <>
                <div className="field-grid two">
                  <div>
                    <label className="label-atelier">Email</label>
                    <input type="email" className="input-atelier" value={form.email} onChange={set('email')} placeholder="maria@email.com" />
                  </div>
                  <div>
                    <label className="label-atelier">Bairro</label>
                    <input className="input-atelier" value={form.neighborhood} onChange={set('neighborhood')} placeholder="Savassi" />
                  </div>
                </div>

                <div className="field-grid two">
                  <div>
                    <label className="label-atelier">Último exame</label>
                    <input type="date" className="input-atelier" value={form.last_exam_date} onChange={set('last_exam_date')} max={today} />
                  </div>
                  <div>
                    <label className="label-atelier">Próximo retorno sugerido</label>
                    <input type="date" className="input-atelier" value={form.next_return_date} onChange={set('next_return_date')} />
                  </div>
                </div>

                <div className="field-grid two">
                  <div>
                    <label className="label-atelier">Convênio</label>
                    <input className="input-atelier" value={form.health_plan} onChange={set('health_plan')} placeholder="Unimed, Bradesco…" />
                  </div>
                  <div>
                    <label className="label-atelier">Tipo de lente</label>
                    <input className="input-atelier" list="lens-types" value={form.lens_type} onChange={set('lens_type')} placeholder="Multifocal" />
                    <datalist id="lens-types">{LENS_TYPES.map((l) => <option key={l} value={l} />)}</datalist>
                  </div>
                </div>

                <div className="field-grid two">
                  <div>
                    <label className="label-atelier">Última compra</label>
                    <input type="date" className="input-atelier" value={form.last_purchase_date} onChange={set('last_purchase_date')} max={today} />
                  </div>
                  <div>
                    <label className="label-atelier">Valor da compra (R$)</label>
                    <input type="number" min="0" step="0.01" className="input-atelier" value={form.last_purchase_value_brl} onChange={set('last_purchase_value_brl')} placeholder="890,00" />
                  </div>
                </div>

                <div className="field-grid two">
                  <div>
                    <label className="label-atelier">Armação preferida</label>
                    <input className="input-atelier" value={form.frame_brand} onChange={set('frame_brand')} placeholder="Ray-Ban, acetato…" />
                  </div>
                  <div>
                    <label className="label-atelier">Como chegou</label>
                    <select className="select-atelier" value={form.source} onChange={set('source')}>
                      {SOURCES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label-atelier">Observações</label>
                  <textarea className="textarea-atelier" style={{ minHeight: 80 }} value={form.observations} onChange={set('observations')} maxLength={500} placeholder="Prefere armação leve, indicada pela irmã…" />
                </div>

                <div>
                  <label className="label-atelier" style={{ marginBottom: 10 }}>Receita ótica</label>
                  <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, minWidth: 420 }}>
                      <thead>
                        <tr>
                          <th style={thS} />
                          {['Esférico', 'Cilíndrico', 'Eixo', 'DP', 'Altura'].map((h) => (
                            <th key={h} style={thS}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[['longe', 'od', 'Longe OD'], ['longe', 'oe', 'Longe OE'], ['perto', 'od', 'Perto OD'], ['perto', 'oe', 'Perto OE']].map(([dist, olho, label]) => (
                          <tr key={`${dist}-${olho}`}>
                            <td style={{ ...tdS, fontWeight: 500, whiteSpace: 'nowrap', paddingRight: 8 }}>{label}</td>
                            {['esferico', 'cilindrico', 'eixo', 'dp', 'altura'].map((campo) => (
                              <td key={campo} style={tdS}>
                                <input
                                  type="number"
                                  step={campo === 'eixo' ? '1' : '0.25'}
                                  className="input-atelier"
                                  style={{ padding: '6px 6px', textAlign: 'center', minWidth: 60 }}
                                  value={form.receita[dist][olho][campo]}
                                  onChange={setR(dist, olho, campo)}
                                  placeholder="—"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="field-grid two" style={{ marginTop: 10 }}>
                    <div>
                      <label className="label-atelier">Lente indicada</label>
                      <input className="input-atelier" value={form.receita.lente} onChange={setRField('lente')} placeholder="Ex: Multifocal antirreflexo" maxLength={100} />
                    </div>
                    <div>
                      <label className="label-atelier">Armação indicada</label>
                      <input className="input-atelier" value={form.receita.armacao} onChange={setRField('armacao')} placeholder="Ex: Ray-Ban acetato" maxLength={100} />
                    </div>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <label className="label-atelier">Obs. da receita</label>
                    <input className="input-atelier" value={form.receita.obs} onChange={setRField('obs')} placeholder="Ex: Pendente conferência com oftalmologista" maxLength={300} />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-foot">
            <button type="button" className="btn-touch btn-ghost-atelier" style={{ minHeight: 48, padding: '0 22px' }} onClick={onClose} disabled={saving}>Cancelar</button>
            <button type="submit" className="btn-touch btn-primary-atelier" style={{ minHeight: 48, padding: '0 26px' }} disabled={saving}>
              {saving ? <><span className="spinner" /> Salvando…</> : editing ? 'Salvar' : 'Cadastrar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
