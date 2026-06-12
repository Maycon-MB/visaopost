import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchPost, sendAction, imageUrlFor } from '../api.js';

const STATUS_CLASS = {
  draft: 'is-pending',
  pending_approval: 'is-pending',
  approved: 'is-approved',
  rejected: 'is-rejected',
  published: 'is-published',
};
const STATUS_LABEL = {
  draft: 'Rascunho',
  pending_approval: 'Aguardando aprovação',
  approved: 'Aprovado ✓',
  rejected: 'Rejeitado',
  published: 'Publicado',
};

function ApproveHeader({ status }) {
  return (
    <header style={{
      background: '#03191E',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '1px solid rgba(193,117,11,0.18)',
      position: 'sticky', top: 0, zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" aria-hidden>
          <circle cx="18" cy="18" r="9" stroke="#C1750B" strokeWidth="2.5" />
          <circle cx="30" cy="18" r="9" stroke="#C1750B" strokeWidth="2.5" />
          <line x1="18" y1="9" x2="18" y2="27" stroke="#C1750B" strokeWidth="2.5" />
          <line x1="27" y1="18" x2="22" y2="30" stroke="#C1750B" strokeWidth="2.5" />
          <line x1="22" y1="30" x2="18" y2="36" stroke="#C1750B" strokeWidth="2.5" />
        </svg>
        <div>
          <div style={{ fontFamily: '"Jost","Corbel",system-ui', fontWeight: 500, fontSize: 17, color: '#fff', letterSpacing: '0.01em' }}>di Lorenzo</div>
          <div style={{ fontFamily: '"Jost","Corbel",system-ui', fontWeight: 300, fontSize: 11, color: '#C1750B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Ótica</div>
        </div>
      </div>
      {status && (
        <span className={`status-pill ${STATUS_CLASS[status] || ''}`} style={{ fontSize: 12 }}>
          {STATUS_LABEL[status] || status}
        </span>
      )}
    </header>
  );
}

function Spinner({ label }) {
  return (
    <div className="enter" style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--ink-mute)' }}>
      <div className="ornament" style={{ fontSize: 28, marginBottom: 12 }}>✻</div>
      <div className="eyebrow">{label || 'Carregando'}</div>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="card-aotelier enter" style={{ margin: '32px auto', maxWidth: 520 }}>
      <div className="eyebrow" style={{ color: 'var(--danger)', marginBottom: 8 }}>
        <span className="eyebrow-num">!</span> Não foi possível abrir
      </div>
      <p style={{ marginBottom: 16 }}>{error.message}</p>
      {error.status === 401 && (
        <p className="help-atelier" style={{ marginBottom: 16 }}>
          Esse link tem validade de 24h. Peça um novo no seu email.
        </p>
      )}
      {onRetry && (
        <button className="btn-touch btn-ghost-atelier" onClick={onRetry}>
          Tentar de novo
        </button>
      )}
    </div>
  );
}

function FinalState({ post, action }) {
  const m = {
    approve: { title: 'Aprovado', sub: 'Vamos publicar no horário programado.', orn: '✓', color: 'var(--primary)' },
    reject:  { title: 'Rejeitado', sub: 'Não vai ao ar. Próximo post chega amanhã.', orn: '✕', color: 'var(--danger)' },
    regenerate: { title: 'Pedido enviado', sub: 'Geramos outra versão com seu feedback.', orn: '↻', color: 'var(--secondary)' },
  }[action] || { title: 'Pronto.', sub: '', orn: '✻', color: 'var(--primary)' };

  return (
    <div className="enter" style={{ textAlign: 'center', padding: '64px 24px 48px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ fontSize: 48, marginBottom: 20, color: m.color }}>{m.orn}</div>
      <h1 style={{ fontFamily: '"Jost","Corbel",system-ui', fontWeight: 600, fontSize: 28, color: 'var(--ink)', marginBottom: 10 }}>{m.title}</h1>
      <p style={{ color: 'var(--ink-soft)', fontSize: 16, marginBottom: 32 }}>{m.sub}</p>
      {post && (
        <p style={{ color: 'var(--ink-mute)', fontSize: 13, marginBottom: 32 }}>
          {post.tenant_business_name} <span className="ornament">·</span>{' '}
          {new Date(post.scheduled_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      )}
      <hr className="hairline" style={{ margin: '0 auto 32px', maxWidth: 80 }} />
      <Link to="/" className="btn-touch btn-ghost-atelier" style={{ display: 'inline-flex' }}>Voltar ao início</Link>
    </div>
  );
}

export default function Approve() {
  const { token } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackFor, setShowFeedbackFor] = useState(null);
  const [doneAction, setDoneAction] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPost(token);
      setPost(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  const submit = useCallback(async (action) => {
    if ((action === 'regenerate' || action === 'reject') && !feedback.trim()) {
      setShowFeedbackFor('regenerate');
      return;
    }
    setPendingAction(action);
    try {
      const result = await sendAction(token, action, feedback.trim() || null);
      setPost(result.post);
      setDoneAction(action);
    } catch (err) {
      setError(err);
    } finally {
      setPendingAction(null);
    }
  }, [token, feedback]);

  if (loading) return (
    <div style={{ minHeight: '100%', background: 'var(--surface)' }}>
      <ApproveHeader />
      <Spinner label="abrindo o post" />
    </div>
  );

  if (error && !post) return (
    <div style={{ minHeight: '100%', background: 'var(--surface)', padding: '0 16px' }}>
      <ApproveHeader />
      <ErrorState error={error} onRetry={load} />
    </div>
  );

  if (!post) return null;

  const isFinal = ['approved', 'rejected', 'published'].includes(post.status);
  if (doneAction || isFinal) return (
    <div style={{ minHeight: '100%', background: 'var(--surface)' }}>
      <ApproveHeader />
      <FinalState post={post} action={doneAction || (post.status === 'rejected' ? 'reject' : 'approve')} />
    </div>
  );

  const scheduled = new Date(post.scheduled_at);
  const dateLabel = scheduled.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  const timeLabel = scheduled.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ minHeight: '100%', background: 'var(--surface)', paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>
      <ApproveHeader status={post.status} />

      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        {/* Post image */}
        <div style={{ background: 'var(--ivory)', borderBottom: '1px solid var(--hairline)' }}>
          {post.image_url ? (
            <img className="post-image enter" src={imageUrlFor(post)} alt={`Post ${post.theme}`} loading="lazy" />
          ) : (
            <div className="post-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-mute)', fontSize: 13 }}>
              imagem indisponível
            </div>
          )}
        </div>

        <div style={{ padding: '20px 20px 0' }}>
          {/* Meta */}
          <div className="enter enter-1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <div style={{ fontFamily: '"Jost","Corbel",system-ui', fontWeight: 600, fontSize: 22, color: 'var(--ink)', lineHeight: 1.1 }}>{dateLabel}</div>
              <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 500, marginTop: 2 }}>às {timeLabel}</div>
            </div>
            <div style={{ textAlign: 'right', color: 'var(--ink-mute)', fontSize: 12 }}>
              <div>{post.tenant_business_name}</div>
              <div style={{ marginTop: 2 }}>post nº {String(post.regenerate_count + 1).padStart(2, '0')}</div>
            </div>
          </div>

          {/* Caption */}
          <div className="enter enter-2" style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mute)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Legenda</div>
            <p className="caption-text">{post.caption}</p>
          </div>

          {post.cta && (
            <div className="enter enter-2" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mute)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Chamada</div>
              <div className="cta-block">{post.cta}</div>
            </div>
          )}

          {post.hashtags?.length > 0 && (
            <div className="enter enter-3" style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ink-mute)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Hashtags</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {post.hashtags.map((tag) => (
                  <span key={tag} className="tag-mute">#{tag.replace(/^#/, '')}</span>
                ))}
              </div>
            </div>
          )}

          <hr className="hairline" style={{ margin: '4px 0 16px' }} />

          {/* Tema */}
          <div style={{ color: 'var(--ink-mute)', fontSize: 12, marginBottom: 24 }}>
            {post.theme.replace(/_/g, ' ')}
            {post.holiday_name && <> · {post.holiday_name}</>}
            {post.regenerate_count > 0 && <> · {post.regenerate_count}ª revisão</>}
          </div>

          {error && (
            <div className="alert-atelier" style={{ marginBottom: 16 }}>{error.message}</div>
          )}

          {showFeedbackFor && (
            <div className="enter" style={{ marginBottom: 18 }}>
              <label className="label-atelier">
                {showFeedbackFor === 'regenerate' ? 'O que mudar no próximo?' : 'O que não gostou?'}
              </label>
              <textarea
                className="textarea-atelier"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                maxLength={500}
                placeholder={showFeedbackFor === 'regenerate'
                  ? 'Ex: caption muito formal, troca o ângulo da foto…'
                  : 'Ex: cor feia, foto muito escura, texto confuso, não tem a ver com a loja…'}
                autoFocus
              />
              <div className="help-atelier" style={{ textAlign: 'right' }}>{feedback.length} / 500</div>
            </div>
          )}

          {/* Actions */}
          <div className="action-stack enter enter-4" style={{ paddingBottom: 8 }}>
            <button
              className="btn-touch btn-primary-atelier"
              style={{ fontSize: 16, fontWeight: 600, letterSpacing: '0.02em' }}
              onClick={() => submit('approve')}
              disabled={pendingAction !== null}
            >
              {pendingAction === 'approve' ? 'Aprovando…' : '✓  Aprovar e publicar'}
            </button>

            <button
              className="btn-touch btn-warn-atelier"
              onClick={() => {
                if (showFeedbackFor !== 'regenerate') {
                  setShowFeedbackFor('regenerate');
                  setFeedback('');
                } else {
                  submit('regenerate');
                }
              }}
              disabled={pendingAction !== null}
            >
              {pendingAction === 'regenerate'
                ? 'Enviando feedback…'
                : showFeedbackFor === 'regenerate' ? 'Enviar e gerar outro' : 'Gerar outro com feedback'}
            </button>

            <button
              className="btn-touch btn-danger-atelier"
              onClick={() => {
                if (showFeedbackFor !== 'reject') {
                  setShowFeedbackFor('reject');
                  setFeedback('');
                } else {
                  submit('reject');
                }
              }}
              disabled={pendingAction !== null}
            >
              {pendingAction === 'reject'
                ? 'Rejeitando…'
                : showFeedbackFor === 'reject' ? 'Confirmar rejeição' : 'Rejeitar'}
            </button>

            {showFeedbackFor && (
              <button
                className="btn-link-atelier"
                onClick={() => { setShowFeedbackFor(null); setFeedback(''); }}
                disabled={pendingAction !== null}
                style={{ textAlign: 'center' }}
              >
                cancelar
              </button>
            )}
          </div>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--ink-mute)', paddingTop: 16, paddingBottom: 8 }}>
            Link válido por 24h · VisãoPost
          </p>
        </div>
      </div>
    </div>
  );
}
