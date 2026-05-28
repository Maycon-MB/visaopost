import { useState } from 'react';

const DAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

export default function Settings() {
  const [active, setActive] = useState([1, 2, 3, 4, 5, 6]);
  const [sendHour, setSendHour] = useState('06:00');
  const [pubHour, setPubHour] = useState('12:00');
  const [postRules, setPostRules] = useState('Evita usar vermelho. Sempre menciona "ótica em Belo Horizonte" na primeira ou segunda frase. Foco em armações premium nos posts de quinta a sábado.');
  const [botRules, setBotRules] = useState('Horário: seg-sex 9h-19h, sáb 9h-13h, dom fechado. Convênios: Bradesco Saúde, SulAmérica, Unimed. Garantia 12 meses na armação, 6 meses na lente. Transferir pra humano em pedido de desconto acima de 15%.');

  const toggleDay = (i) => setActive((d) => d.includes(i) ? d.filter((x) => x !== i) : [...d, i]);

  return (
    <>
      <div className="page-header">
        <div>
          <div className="eyebrow"><span className="eyebrow-num">05</span> Configurações</div>
          <h1 className="page-title">Como gostamos <em className="text-italic-serif" style={{ color: 'var(--champagne)' }}>de trabalhar</em></h1>
          <p className="page-sub">Horário, dias ativos e instruções pro nosso atendente virtual.</p>
        </div>
      </div>

      <div className="card-aotelier">
        <div className="field-row">
          <div className="field-row-label">
            <h3>Horário de envio</h3>
            <p>A que horas você recebe o post do dia pra aprovar.</p>
          </div>
          <div>
            <input
              type="time"
              className="input-atelier"
              style={{ maxWidth: 180 }}
              value={sendHour}
              onChange={(e) => setSendHour(e.target.value)}
            />
            <div className="help-atelier">Padrão: 06:00</div>
          </div>
        </div>

        <div className="field-row">
          <div className="field-row-label">
            <h3>Horário de publicação</h3>
            <p>Quando o post aprovado vai ao ar no Instagram.</p>
          </div>
          <div>
            <input
              type="time"
              className="input-atelier"
              style={{ maxWidth: 180 }}
              value={pubHour}
              onChange={(e) => setPubHour(e.target.value)}
            />
            <div className="help-atelier">Padrão: 12:00 — pico de visualização</div>
          </div>
        </div>

        <div className="field-row">
          <div className="field-row-label">
            <h3>Dias ativos</h3>
            <p>Em quais dias da semana você quer post.</p>
          </div>
          <div className="day-grid">
            {DAYS.map((d, i) => (
              <button
                key={i}
                className={`day-btn ${active.includes(i) ? 'active' : ''}`}
                onClick={() => toggleDay(i)}
                aria-pressed={active.includes(i)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="field-row">
          <div className="field-row-label">
            <h3>Regras pro post</h3>
            <p>Instruções livres pra inteligência que cria o conteúdo.</p>
          </div>
          <div>
            <textarea
              className="textarea-atelier"
              value={postRules}
              onChange={(e) => setPostRules(e.target.value)}
              maxLength={1000}
            />
            <div className="help-atelier">Quanto mais específico, mais a sua marca aparece.</div>
          </div>
        </div>

        <div className="field-row">
          <div className="field-row-label">
            <h3>Regras pro bot do WhatsApp</h3>
            <p>FAQ que o atendente virtual usa. Quando ele transfere pra humano.</p>
          </div>
          <div>
            <textarea
              className="textarea-atelier"
              value={botRules}
              onChange={(e) => setBotRules(e.target.value)}
              maxLength={2000}
              style={{ minHeight: 180 }}
            />
            <div className="help-atelier">Horários, convênios, política de garantia, gatilho pra escalar.</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
        <button className="btn-touch btn-ghost-atelier" style={{ minHeight: 48, padding: '0 22px' }}>Cancelar</button>
        <button className="btn-touch btn-primary-atelier" style={{ minHeight: 48, padding: '0 28px' }}>Salvar alterações</button>
      </div>

      <p className="muted" style={{ marginTop: 32, fontSize: 13, textAlign: 'center' }}>
        <span className="ornament">✻</span> Persistência real liga endpoint <code style={{ background: 'var(--ivory-soft)', padding: '2px 6px', borderRadius: 4 }}>PATCH /api/settings</code> (Fase 6a backend já pronto).
      </p>
    </>
  );
}
