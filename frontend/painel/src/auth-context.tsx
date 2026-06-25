import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, logout as apiLogout, fetchMe, getToken } from './api';
import { DEMO } from './config';

interface User { name?: string; role?: string; [key: string]: unknown }

const AuthContext = createContext(null);

const DEMO_USER = { id: 'demo', name: 'Marcelo', email: 'marcelo@oticadilorenzo.com.br', role: 'owner', status: 'active' };
// Credenciais de teste para demonstração ao cliente (sem backend)
const TEST_CREDS = [
  { user: 'marcelo', pass: 'dilorenzo2026' },
  { user: 'admin',   pass: 'admin' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(DEMO ? DEMO_USER : null);
  const [loading, setLoading] = useState(!DEMO);

  useEffect(() => {
    if (DEMO) return; // demo não fala com backend
    if (!getToken()) { setLoading(false); return; }
    fetchMe()
      .then(setUser)
      .catch(() => { apiLogout(); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  async function signIn(email, password) {
    const key = email.trim().toLowerCase();
    if (DEMO && TEST_CREDS.some((c) => c.user === key && c.pass === password)) {
      setUser(DEMO_USER);
      return DEMO_USER;
    }
    const u = await apiLogin(email, password);
    setUser(u);
    return u;
  }

  function signOut() {
    if (DEMO) { setUser(DEMO_USER); return; }
    apiLogout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth fora do AuthProvider');
  return ctx;
}
