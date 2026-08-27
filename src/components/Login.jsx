import { useState } from 'react';
import '../styles/login.css';
import Header from './Header';
import { Link } from 'react-router-dom';

function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="login-page">

      {/* HEADER */}
      <Header />

      {/* CONTENIDO DEL LOGIN */}
      <main className="login-container">

        <div className="login-card">

          <h2>Iniciar Sesion</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">

              <label htmlFor="email">
                Correo electronico
              </label>

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

              <label htmlFor="password">
                Contraseña
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="********"
                required
              />

            </div>

            <button type="submit">
              Iniciar Sesion
            </button>

          </form>

          <Link to={"/registro"}>
          Registrate
          </Link>

        </div>

      </main>

    </div>
  );
}

export default Login;
