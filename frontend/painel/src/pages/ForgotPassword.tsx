import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../api.js';
import { BrandLogo } from '../components/BrandLogo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch {
      setSent(true); // não revela se o email existe
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-brand"><BrandLogo /></div>
        <h1 className="auth-title">Esqueceu a senha?</h1>
        <p className="auth-sub">A gente manda um link pra você criar outra.</p>

        {sent ? (
          <>
            <div className="auth-ok">
              Se houver uma conta com esse email, o link de redefinição já está a caminho.
              Confira sua caixa de entrada.
            </div>
            <div className="auth-links" style={{ justifyContent: 'center', marginTop: 20 }}>
              <Link to="/login">Voltar ao login</Link>
            </div>
          </>
        ) : (
          <form onSubmit={submit}>
            <div className="auth-field">
              <label className="label-atelier">Email</label>
              <input className="input-atelier" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoFocus required />
            </div>
            <button type="submit" className="btn-touch btn-primary-atelier" disabled={busy}>
              {busy ? <><span className="spinner" /> Enviando…</> : 'Enviar link'}
            </button>
            <div className="auth-links" style={{ justifyContent: 'center', marginTop: 18 }}>
              <Link to="/login">Voltar ao login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
