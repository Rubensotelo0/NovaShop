import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useAuth } from './AuthContext';
import '../styles/registro.css';

function Registro() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormulario((actual) => ({
      ...actual,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const nombre = formulario.nombre.trim();
    const email = formulario.email.trim().toLowerCase();
    const password = formulario.password;

    if (!nombre || !email || !password) {
      setError('Completa todos los campos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== formulario.confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      setCargando(true);
      await register({ nombre, email, password });
      navigate('/');
    } catch (err) {
      setError(err.message || 'No se pudo crear tu cuenta');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />

      <main className="auth-shell single-auth-shell">
        <section className="auth-card auth-card--single">
          <div className="auth-card-header">
            <p className="auth-kicker">Crear cuenta</p>
            <h2>Únete a NovaShop</h2>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="nombre">Nombre completo</label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                value={formulario.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formulario.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formulario.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarPassword">Confirmar contraseña</label>
              <input
                id="confirmarPassword"
                name="confirmarPassword"
                type="password"
                value={formulario.confirmarPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
              />
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-button" disabled={cargando}>
              {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <p className="auth-footer">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </section>
      </main>
    </div>
  );
}

export default Registro;
