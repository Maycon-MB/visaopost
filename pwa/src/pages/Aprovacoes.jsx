import { Link } from 'react-router-dom';

const ITEMS = [
  { id: 'demo', dia: 'Hoje · 12:00', tema: 'Dica de estilo', status: 'pending_approval', label: 'Aguardando' },
  { id: '2', dia: 'Ontem · 12:00', tema: 'Solar verão', status: 'published', label: 'Publicado' },
  { id: '3', dia: '2 dias · 12:00', tema: 'Lente antirreflexo', status: 'approved', label: 'Aprovado' },
  { id: '4', dia: '3 dias · 12:00', tema: 'Promo do mês', status: 'rejected', label: 'Rejeitado' },
  { id: '5', dia: '4 dias · 12:00', tema: 'Depoimento cliente', status: 'published', label: 'Publicado' },
];

const STATUS_CLASS = {
  pending_approval: 'is-pending',
  approved: 'is-approved',
  rejected: 'is-rejected',
  published: 'is-published',
};

export default function Aprovacoes() {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow"><span className="eyebrow-num">02</span> Aprovações</div>
          <h1 className="page-title">Posts <em className="text-italic-serif" style={{ color: 'var(--champagne)' }}>recentes</em></h1>
          <p className="page-sub">Aprove pelo email ou direto aqui. Histórico dos últimos 30 dias.</p>
        </div>
      </div>

      <div className="toolbar">
        <button className="chip active">Todos <span className="chip-count">5</span></button>
        <button className="chip">Pendentes <span className="chip-count">1</span></button>
        <button className="chip">Publicados <span className="chip-count">2</span></button>
        <button className="chip">Rejeitados <span className="chip-count">1</span></button>
      </div>

      <div className="card-flush">
        <table className="table-atelier">
          <thead>
            <tr>
              <th>Data</th>
              <th>Tema</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((it) => (
              <tr key={it.id}>
                <td className="text-italic-serif muted">{it.dia}</td>
                <td style={{ fontWeight: 500 }}>{it.tema}</td>
                <td><span className={`status-pill ${STATUS_CLASS[it.status]}`}>{it.label}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <Link to={`/aprovar/${it.id}`} className="btn-link-atelier">abrir</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="muted" style={{ marginTop: 24, fontSize: 13, textAlign: 'center' }}>
        <span className="ornament">✻</span> Tokens reais da Fase 6a já no backend. Lista virá do banco quando ligarmos.
      </p>
    </>
  );
}
