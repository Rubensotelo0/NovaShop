import { useState } from 'react';
import '../styles/login.css';
import Header from './Header';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="auth-page">
      <Header />

      <main className="auth-shell single-auth-shell">
        <section className="auth-card auth-card--single">
          <div className="auth-card-header">
            <p className="auth-kicker">Iniciar sesión</p>
            <h2>Bienvenido de nuevo</h2>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-button">Iniciar sesión</button>
          </form>

          <p className="auth-footer">
            ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Login;