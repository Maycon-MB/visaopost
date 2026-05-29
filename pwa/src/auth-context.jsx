import { createContext, useContext, useEffect, useState } from 'react';
import { login as apiLogin, logout as apiLogout, fetchMe, getToken } from './api.js';
import { DEMO } from './config.js';

const AuthContext = createContext(null);

const DEMO_USER = { id: 'demo', name: 'Marcelo', email: 'marcelo@oticadilorenzo.com.br', role: 'owner', status: 'active' };

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
    const u = await apiLogin(email, password);
    setUser(u);
    return u;
  }

  function signOut() {
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
