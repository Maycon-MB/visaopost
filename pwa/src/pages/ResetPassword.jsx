import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api.js';
import { BrandLogo } from '../components/AppShell.jsx';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const navigate = useNavigate();
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (pw.length < 8) return setError('A senha precisa de ao menos 8 caracteres.');
    if (pw !== pw2) return setError('As senhas não batem.');
    setError(null);
    setBusy(true);
    try {
      await resetPassword(token, pw);
      setDone(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setError(err.status === 400 ? 'Link inválido ou expirado. Peça um novo.' : 'Não deu pra redefinir agora.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand"><BrandLogo /></div>
        <h1 className="auth-title">Criar nova senha</h1>

        {!token ? (
          <>
            <div className="alert-atelier" style={{ marginTop: 8 }}>Link sem código. Abra pelo link do email.</div>
            <div className="auth-links" style={{ justifyContent: 'center', marginTop: 18 }}><Link to="/esqueci-senha">Pedir novo link</Link></div>
          </>
        ) : done ? (
          <div className="auth-ok">Senha alterada! Levando você pro login…</div>
        ) : (
          <form onSubmit={submit}>
            {error && <div className="alert-atelier" style={{ marginBottom: 16 }}>{error}</div>}
            <div className="auth-field">
              <label className="label-atelier">Nova senha</label>
              <input className="input-atelier" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="new-password" autoFocus required />
            </div>
            <div className="auth-field">
              <label className="label-atelier">Repita a senha</label>
              <input className="input-atelier" type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} autoComplete="new-password" required />
            </div>
            <button type="submit" className="btn-touch btn-primary-atelier" disabled={busy}>
              {busy ? <><span className="spinner" /> Salvando…</> : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
