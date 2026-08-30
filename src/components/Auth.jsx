import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Lock, Mail, User } from 'lucide-react';
import '../styles/Auth.css';
import { useAuth } from './AuthContext';

function Auth() {
  const location = useLocation();
  const [modoRegistro, setModoRegistro] = useState(location.pathname === '/registro');

  // ===== LOGIN =====
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLogin, setErrorLogin] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorLogin('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setErrorLogin('Correo o contraseña incorrectos');
    }
  };

  // ===== REGISTRO =====
  const [nombre, setNombre] = useState('');
  const [emailRegistro, setEmailRegistro] = useState('');
  const [passwordRegistro, setPasswordRegistro] = useState('');
  const [errorRegistro, setErrorRegistro] = useState('');
  const [cargandoRegistro, setCargandoRegistro] = useState(false);

  const handleRegistro = async (event) => {
    event.preventDefault();
    setErrorRegistro('');
    setCargandoRegistro(true);
    try {
      // TODO (backend): reemplazar por el endpoint real, ej:
      // const res = await fetch('/api/registro', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ nombre, email: emailRegistro, password: passwordRegistro }),
      // });
      // if (!res.ok) throw new Error('No se pudo registrar');
      console.log('Registro (pendiente de backend):', { nombre, emailRegistro, passwordRegistro });
    } catch (err) {
      setErrorRegistro('No se pudo completar el registro');
    } finally {
      setCargandoRegistro(false);
    }
  };

  return (
    <div className={`auth-wrapper ${modoRegistro ? 'right-panel-active' : ''}`}>

      <div className="auth-form-container auth-sign-up-container">
        <form className="auth-card" onSubmit={handleRegistro}>
          <h2>Crear Cuenta</h2>

          <div className="auth-input-group">
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre completo" required />
            <User size={18} />
          </div>

          <div className="auth-input-group">
            <input type="email" value={emailRegistro} onChange={(e) => setEmailRegistro(e.target.value)} placeholder="Correo electrónico" required />
            <Mail size={18} />
          </div>

          <div className="auth-input-group">
            <input type="password" value={passwordRegistro} onChange={(e) => setPasswordRegistro(e.target.value)} placeholder="Contraseña" required minLength={6} />
            <Lock size={18} />
          </div>

          {errorRegistro && <p className="auth-error">{errorRegistro}</p>}

          <button type="submit" className="auth-submit" disabled={cargandoRegistro}>
            {cargandoRegistro ? 'Registrando...' : 'Registrarme'}
          </button>

          <p className="auth-mobile-switch">
            ¿Ya tienes cuenta?{' '}
            <button type="button" className="auth-link-button" onClick={() => setModoRegistro(false)}>
              Inicia sesión
            </button>
          </p>
        </form>
      </div>

      <div className="auth-form-container auth-sign-in-container">
        <form className="auth-card" onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>

          <div className="auth-input-group">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo electrónico" required />
            <Mail size={18} />
          </div>

          <div className="auth-input-group">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" required />
            <Lock size={18} />
          </div>

          {errorLogin && <p className="auth-error">{errorLogin}</p>}

          <button type="submit" className="auth-submit">Iniciar Sesión</button>

          <p className="auth-mobile-switch">
            ¿No tienes cuenta?{' '}
            <button type="button" className="auth-link-button" onClick={() => setModoRegistro(true)}>
              Regístrate
            </button>
          </p>
        </form>
      </div>

      <div className="auth-overlay-container">
        <div className="auth-overlay">
          <div className="auth-overlay-panel auth-overlay-left">
            <h1>Welcome Back!</h1>
            <p>Para seguir comprando, inicia sesión con tu cuenta</p>
            <button type="button" className="auth-ghost-button" onClick={() => setModoRegistro(false)}>
              Iniciar Sesión
            </button>
          </div>

          <div className="auth-overlay-panel auth-overlay-right">
            <h1>Hello, Friend!</h1>
            <p>Regístrate y empieza a comprar en NovaShop</p>
            <button type="button" className="auth-ghost-button" onClick={() => setModoRegistro(true)}>
              Registrarme
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Auth;