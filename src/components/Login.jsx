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
      setError('Correo o contraseña incorrectos');
    }
  };

  return (
    <div className="login-page">
      <Header />
      <main className="login-container">
        <div className="login-card">
          <h2>Iniciar Sesion</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Correo electronico</label>
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

            {error && <p className="login-error">{error}</p>}

            <button type="submit">Iniciar Sesion</button>
          </form>

          <Link to={"/registro"}>Registrate</Link>
        </div>
      </main>
    </div>
  );
}

export default Login;