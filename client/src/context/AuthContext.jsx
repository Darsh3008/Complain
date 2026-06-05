import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const stored = localStorage.getItem('complainthub_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser(parsed);
          try {
            const { data } = await api.get('/auth/me');
            const refreshed = { ...parsed, ...data, token: parsed.token };
            localStorage.setItem('complainthub_user', JSON.stringify(refreshed));
            setUser(refreshed);
          } catch {
            localStorage.removeItem('complainthub_user');
            setUser(null);
          }
        } catch {
          localStorage.removeItem('complainthub_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const saveUser = (userData) => {
    localStorage.setItem('complainthub_user', JSON.stringify(userData));
    setUser(userData);
  };

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    saveUser(data);
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    saveUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('complainthub_user');
    setUser(null);
  };

  const updateUser = (updates) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    localStorage.setItem('complainthub_user', JSON.stringify(updated));
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
