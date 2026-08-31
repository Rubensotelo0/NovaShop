import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from './Header'
import '../styles/Perfil.css';

function Perfil() {
  const navigate = useNavigate();
  const usuarioGuardado = localStorage.getItem('user');
  const usuario = usuarioGuardado
    ? JSON.parse(usuarioGuardado)
    : { name: 'Nova Shop', email: 'usuario@novashop.com' };
  const nombreUsuario = usuario.name || usuario.nombre || 'Nova Shop';
  const [historialCompras, setHistorialCompras] = useState([]);

  useEffect(() => {
    const cargarHistorial = async () => {
      const userId = Number(usuario?.id || 0);
      if (!userId) {
        setHistorialCompras([]);
        return;
      }

      try {
        const respuesta = await fetch(`/api/perfil/${userId}/pedidos`);
        if (!respuesta.ok) {
          setHistorialCompras([]);
          return;
        }

        const data = await respuesta.json();
        setHistorialCompras(Array.isArray(data) ? data : []);
      } catch (error) {
        setHistorialCompras([]);
      }
    };

    cargarHistorial();
  }, [usuario?.id]);

  const cerrarSesion = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="perfil-pagina">
      <Header />

      <main className="perfil-contenido">
        <section className="perfil-encabezado"> 
          <h1>Mi perfil</h1>
          <p className="perfil-etiqueta">Administra tus datos, revisa tu historial y continúa disfrutando NovaShop.</p>
        </section>

        <section className="perfil-panel" aria-label="Información del perfil">
          <div className="perfil-avatar" aria-hidden="true">
            {nombreUsuario.charAt(0).toUpperCase()}
          </div>

          <div className="perfil-datos">
            <p className="perfil-datos-etiqueta">INFORMACIÓN PERSONAL</p>
            <h2>{nombreUsuario}</h2>
            <p>{usuario.email}</p>

            <div className="perfil-acciones">
              <Link to="/favoritos" className="perfil-boton perfil-boton-principal">
                Ver mis favoritos
              </Link>
              <button type="button" className="perfil-boton perfil-boton-secundario" onClick={cerrarSesion}>
                Cerrar sesión
              </button>
            </div>
          </div>
        </section>

        <section className="perfil-historial" aria-labelledby="historial-titulo">
          <div className="perfil-seccion-encabezado">
            <div>
              <p className="perfil-datos-etiqueta">TUS PEDIDOS</p>
              <h2 id="historial-titulo">Historial de compras</h2>
            </div>
            <span>{historialCompras.length} pedido{historialCompras.length === 1 ? '' : 's'}</span>
          </div>

          {historialCompras.length === 0 ? (
            <div className="perfil-historial-vacio">
              <p>Aún no tienes compras registradas.</p>
              <Link to="/" className="perfil-boton perfil-boton-principal">
                Explorar productos
              </Link>
            </div>
          ) : (
            <div className="perfil-pedidos">
              {historialCompras.map((compra) => {
                const marcas = compra.items.map((item) => item.marca || 'N/A');

                return (
                  <article className="perfil-pedido" key={compra.id}>
                    <div className="perfil-pedido-header">
                      <span>Número de compra</span>
                      <span>Producto</span>
                      <span>Marca</span>
                      <span>Cantidad</span>
                      <span>Fecha</span>
                      <span>Total</span>
                    </div>

                    <div className="perfil-pedido-grid">
                      <strong>{compra.id}</strong>

                      <div className="perfil-pedido-productos">
                        {compra.items.map((item, index) => (
                          <div className="perfil-pedido-producto" key={`${compra.id}-${item.nombre}-${index}`}>
                            <strong>{item.nombre}</strong>
                          </div>
                        ))}
                      </div>

                      <div className="perfil-pedido-marcas">
                        {compra.items.map((item, index) => (
                          <div key={`${compra.id}-marca-${index}`}>{item.marca || 'N/A'}</div>
                        ))}
                      </div>

                      <div className="perfil-pedido-cantidades">
                        {compra.items.map((item, index) => (
                          <div key={`${compra.id}-cantidad-${index}`}>{item.cantidad}</div>
                        ))}
                      </div>

                      <span>{new Date(compra.fecha).toLocaleDateString('es-MX')}</span>

                      <strong>${Number(compra.total).toFixed(2)} MXN</strong>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>
      
    </div>
  );
}

export default Perfil;