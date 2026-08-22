import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth-context.jsx';
import { BrandLogo } from '../components/BrandLogo';

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await signIn(identifier.trim(), password);
      navigate(loc.state?.from || '/admin', { replace: true });
    } catch (err) {
      setError(err.status === 403 ? err.message : 'Usuário ou senha incorretos.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-brand"><BrandLogo /></div>
        <h1 className="auth-title">Entrar no painel</h1>
        <p className="auth-sub">Que bom te ver de novo.</p>

        {error && <div className="alert-atelier" style={{ marginBottom: 16 }}>{error}</div>}

        <div className="auth-field">
          <label className="label-atelier">Usuário ou email</label>
          <input className="input-atelier" type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" placeholder="admin" autoFocus required />
        </div>
        <div className="auth-field">
          <label className="label-atelier">Senha</label>
          <input className="input-atelier" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
        </div>

        <button type="submit" className="btn-touch btn-primary-atelier" disabled={busy}>
          {busy ? <><span className="spinner" /> Entrando…</> : 'Entrar'}
        </button>

        <div className="auth-links">
          <Link to="/esqueci-senha">Esqueci minha senha</Link>
          <Link to="/">Voltar ao início</Link>
        </div>
      </form>
    </div>
  );
}
