import { createContext, useEffect, useState, useContext } from 'react';
import { apiRequest } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await apiRequest(
      '/login',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      },
      'Credenciales incorrectas'
    );

    const userData = {
      id: data.user.id,
      name: data.user.name || data.user.nombre || 'Usuario',
      nombre: data.user.nombre || data.user.name || 'Usuario',
      email: data.user.email
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const register = async ({ nombre, email, password }) => {
    const data = await apiRequest(
      '/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password })
      },
      'No se pudo completar el registro'
    );

    const userData = {
      id: data.user.id,
      name: data.user.name || data.user.nombre || nombre,
      nombre: data.user.nombre || nombre,
      email: data.user.email
    };

    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}


