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
  pending_approval: 'Aguardando',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
  published: 'Publicado',
};

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
    approve: { title: 'Aprovado', sub: 'Vamos publicar no horário programado.', orn: '✓' },
    reject: { title: 'Rejeitado', sub: 'Não vai ao ar. Próximo post chega amanhã.', orn: '✕' },
    regenerate: { title: 'Pedido enviado', sub: 'Geramos outra versão com seu feedback.', orn: '↻' },
  }[action] || { title: 'Pronto.', sub: '', orn: '✻' };

  return (
    <div className="enter" style={{ textAlign: 'center', padding: '48px 16px 32px', maxWidth: 520, margin: '0 auto' }}>
      <div className="ornament" style={{ fontSize: 36, marginBottom: 14 }}>{m.orn}</div>
      <h1 className="page-title" style={{ marginBottom: 10 }}>{m.title}</h1>
      <p className="page-sub" style={{ fontSize: 16, marginBottom: 28 }}>{m.sub}</p>
      {post && (
        <p className="muted" style={{ fontSize: 13 }}>
          {post.tenant_business_name} <span className="ornament">·</span>{' '}
          {new Date(post.scheduled_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      )}
      <hr className="hairline" style={{ margin: '32px auto', maxWidth: 120 }} />
      <Link to="/" className="btn-link-atelier">Voltar ao início</Link>
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
    if (action === 'regenerate' && !feedback.trim()) {
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

  if (loading) {
    return (
      <div className="shell">
        <header className="brand-bar">
          <div className="brand-mark">
            <span className="brand-mark-name">VisãoPost</span>
            <span className="brand-mark-tag">— atelier digital</span>
          </div>
        </header>
        <main className="main"><Spinner label="abrindo o post" /></main>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="shell">
        <header className="brand-bar">
          <div className="brand-mark">
            <span className="brand-mark-name">VisãoPost</span>
          </div>
        </header>
        <main className="main"><ErrorState error={error} onRetry={load} /></main>
      </div>
    );
  }

  if (!post) return null;

  const isFinal = ['approved', 'rejected', 'published'].includes(post.status);
  if (doneAction || isFinal) {
    return (
      <div className="shell">
        <header className="brand-bar">
          <div className="brand-mark">
            <span className="brand-mark-name">VisãoPost</span>
            <span className="brand-mark-tag">— atelier digital</span>
          </div>
        </header>
        <main className="main">
          <FinalState post={post} action={doneAction || (post.status === 'rejected' ? 'reject' : 'approve')} />
        </main>
      </div>
    );
  }

  const scheduled = new Date(post.scheduled_at);
  const dateLabel = scheduled.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' });
  const timeLabel = scheduled.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="shell safe-bottom">
      <header className="brand-bar">
        <div className="brand-mark">
          <span className="brand-mark-name">VisãoPost</span>
          <span className="brand-mark-tag">— atelier digital</span>
        </div>
        <span className={`status-pill ${STATUS_CLASS[post.status] || ''}`}>
          {STATUS_LABEL[post.status] || post.status}
        </span>
      </header>

      <main className="main" style={{ maxWidth: 640, margin: '0 auto' }}>
        <div className="enter enter-1" style={{ marginBottom: 18 }}>
          <div className="eyebrow">
            <span className="eyebrow-num">✻ post nº {String(post.regenerate_count + 1).padStart(2, '0')}</span>
            {post.tenant_business_name}
          </div>
          <h1 className="page-title" style={{ marginTop: 6 }}>
            {dateLabel}<br />
            <em className="text-italic-serif" style={{ color: 'var(--champagne)', fontSize: '0.7em' }}>
              às {timeLabel}
            </em>
          </h1>
        </div>

        <div className="card-flush enter enter-2" style={{ marginBottom: 24 }}>
          {post.image_url ? (
            <img className="post-image" src={imageUrlFor(post)} alt={`Post ${post.theme}`} loading="lazy" />
          ) : (
            <div className="post-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--ink-mute)' }}>
              imagem indisponível
            </div>
          )}
        </div>

        <section className="enter enter-3" style={{ marginBottom: 24 }}>
          <div className="section-label">
            <span className="eyebrow"><span className="eyebrow-num">01</span> Legenda</span>
          </div>
          <p className="caption-text">{post.caption}</p>
        </section>

        {post.cta && (
          <section className="enter enter-3" style={{ marginBottom: 24 }}>
            <div className="section-label">
              <span className="eyebrow"><span className="eyebrow-num">02</span> Chamada</span>
            </div>
            <div className="cta-block">{post.cta}</div>
          </section>
        )}

        {post.hashtags?.length > 0 && (
          <section className="enter enter-3" style={{ marginBottom: 24 }}>
            <div className="section-label">
              <span className="eyebrow"><span className="eyebrow-num">03</span> Tags</span>
            </div>
            <div>
              {post.hashtags.map((tag) => (
                <span key={tag} className="tag-mute">#{tag.replace(/^#/, '')}</span>
              ))}
            </div>
          </section>
        )}

        <hr className="hairline" style={{ margin: '24px 0' }} />

        <p className="muted" style={{ fontSize: 13, marginBottom: 24 }}>
          Tema <span className="ornament">/</span> {post.theme.replace(/_/g, ' ')}
          {post.holiday_name && <> <span className="ornament">/</span> {post.holiday_name}</>}
          {post.regenerate_count > 0 && <> <span className="ornament">/</span> {post.regenerate_count}ª revisão</>}
        </p>

        {error && (
          <div className="alert-atelier" style={{ marginBottom: 16 }}>{error.message}</div>
        )}

        {showFeedbackFor && (
          <div className="enter" style={{ marginBottom: 18 }}>
            <label className="label-atelier">
              {showFeedbackFor === 'regenerate' ? 'O que mudar no próximo?' : 'Por que rejeitar? (opcional)'}
            </label>
            <textarea
              className="textarea-atelier"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              maxLength={500}
              placeholder={showFeedbackFor === 'regenerate'
                ? 'Ex: caption muito formal, troca o ângulo da foto, foca na promoção…'
                : 'Ex: imagem não combina com a identidade da marca…'}
              autoFocus
            />
            <div className="help-atelier" style={{ textAlign: 'right' }}>{feedback.length} / 500</div>
          </div>
        )}

        <div className="action-stack enter enter-4">
          <button
            className="btn-touch btn-primary-atelier"
            onClick={() => submit('approve')}
            disabled={pendingAction !== null}
          >
            {pendingAction === 'approve' ? 'Aprovando…' : 'Aprovar e publicar'}
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
            >
              cancelar
            </button>
          )}
        </div>

        <hr className="hairline" style={{ margin: '32px 0 16px' }} />
        <p className="muted" style={{ textAlign: 'center', fontSize: 12 }}>
          <span className="ornament">✻</span> Link válido por 24h <span className="ornament">·</span> VisãoPost
        </p>
      </main>
    </div>
  );
}
