import { useState } from 'react';

const SAMPLE = [
  { id: 1, nome: 'Margareth Alencar',    tel: '(31) 99876-5432', exame: '2025-09-12', status: 'ativo',  origem: 'qr_balcao' },
  { id: 2, nome: 'João Pedro Vasconcelos', tel: '(31) 99123-4567', exame: '2024-04-03', status: 'ativo',  origem: 'manual' },
  { id: 3, nome: 'Luiza Mendonça',        tel: '(31) 98123-1122', exame: '2024-11-22', status: 'ativo',  origem: 'csv' },
  { id: 4, nome: 'Renato Cardoso',        tel: '(31) 99800-7777', exame: '2023-02-18', status: 'ativo',  origem: 'manual' },
  { id: 5, nome: 'Beatriz Mello',         tel: '(31) 99500-1234', exame: '2025-12-01', status: 'opt_out', origem: 'qr_balcao' },
  { id: 6, nome: 'Antônio Faria',         tel: '(31) 98700-3322', exame: '2024-01-08', status: 'ativo',  origem: 'csv' },
];

const FILTERS = [
  { id: 'todos', label: 'Todos', count: 6 },
  { id: 'ativos', label: 'Ativos', count: 5 },
  { id: 'recall', label: 'Exame +12m', count: 3 },
  { id: 'novos', label: 'Novos da semana', count: 1 },
  { id: 'opt_out', label: 'Opt-out', count: 1 },
];

export default function Clientes() {
  const [filter, setFilter] = useState('todos');
  const [q, setQ] = useState('');

  const list = SAMPLE.filter((c) => {
    if (filter === 'ativos' && c.status !== 'ativo') return false;
    if (filter === 'opt_out' && c.status !== 'opt_out') return false;
    if (filter === 'recall') {
      const months = (Date.now() - new Date(c.exame).getTime()) / (1000 * 60 * 60 * 24 * 30);
      if (months < 12) return false;
    }
    if (q && !c.nome.toLowerCase().includes(q.toLowerCase()) && !c.tel.includes(q)) return false;
    return true;
  });

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow"><span className="eyebrow-num">03</span> Carteira</div>
          <h1 className="page-title">Seus <em className="text-italic-serif" style={{ color: 'var(--champagne)' }}>clientes</em></h1>
          <p className="page-sub">Quem entra no recall, quem volta sempre, quem precisa de um chamado.</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-touch btn-ghost-atelier" style={{ minHeight: 44, padding: '0 16px', fontSize: 13 }}>
            ⤓ Importar CSV
          </button>
          <button className="btn-touch btn-primary-atelier" style={{ minHeight: 44, padding: '0 18px', fontSize: 13 }}>
            + Cadastrar
          </button>
        </div>
      </div>

      <div className="card-aotelier" style={{ marginBottom: 24, padding: 18 }}>
        <input
          className="input-atelier"
          placeholder="Buscar por nome ou telefone…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="toolbar">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label} <span className="chip-count">{f.count}</span>
          </button>
        ))}
      </div>

      <div className="card-flush">
        <table className="table-atelier">
          <thead>
            <tr>
              <th>Nome</th>
              <th>WhatsApp</th>
              <th>Último exame</th>
              <th>Origem</th>
              <th style={{ textAlign: 'right' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => {
              const examDate = new Date(c.exame);
              const months = Math.round((Date.now() - examDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
              return (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.nome}</td>
                  <td className="muted">{c.tel}</td>
                  <td className="text-italic-serif" style={{ color: months >= 12 ? 'var(--warning)' : 'var(--ink-soft)' }}>
                    {examDate.toLocaleDateString('pt-BR')} <span className="ornament">·</span> {months}m
                  </td>
                  <td>
                    <span className="tag-mute" style={{ fontSize: 11 }}>{c.origem}</span>
                    {c.status === 'opt_out' && <span className="tag-mute" style={{ fontSize: 11, color: 'var(--danger)' }}>opt-out</span>}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-link-atelier">editar</button>
                  </td>
                </tr>
              );
            })}
            {list.length === 0 && (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: 40, color: 'var(--ink-mute)' }}>nenhum cliente nesse filtro.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
