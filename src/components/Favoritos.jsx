import { Link } from 'react-router-dom';
import { useState } from 'react';

import ProductoCard from './ProductoCard';
import Header from './Header';
import { useProductos } from '../context/useProductos';

import '../styles/ListaProductos.css';

function Favoritos() {
  const { productos, cargando, error } = useProductos();
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('favoritos');

    return guardados ? JSON.parse(guardados) : [];
  });

  const toggleFavorito = (id) => {
    setFavoritos((actuales) => {
      const nuevosFavoritos = actuales.includes(id)
        ? actuales.filter((favoritoId) => favoritoId !== id)
        : [...actuales, id];

      localStorage.setItem(
        'favoritos',
        JSON.stringify(nuevosFavoritos)
      );

      return nuevosFavoritos;
    });
  };

  const productosFavoritos = productos.filter((producto) =>
    favoritos.includes(producto.id)
  );

  return (
    <div className="tienda">

      <Header />

      {/* CONTENIDO */}
      <main className="lista-container">

        <section className="catalogo-header">
          <div>

            <h2 className="catalogo-label">
              MIS FAVORITOS
            </h2>

            <p className="catalogo-subtitulo">
              Productos que has guardado como favoritos.
            </p>

          </div>
        </section>

        {/* PRODUCTOS FAVORITOS */}
        {cargando ? <p>Cargando productos...</p> : error ? <p>{error}</p> : productosFavoritos.length > 0 ? (

          <div className="productos-grid">

            {productosFavoritos.map((prod, index) => (
              <ProductoCard
                key={prod.id}
                prod={prod}
                index={index}
                favorito={true}
                onToggleFavorito={toggleFavorito}
              />
            ))}

          </div>

        ) : (

          <div className="favoritos-vacio">

            <h2>
              No tienes favoritos todavía
            </h2>

            <p>
              Agrega productos a favoritos para verlos aquí.
            </p>

            <Link
              to="/"
              className="btn-ver-detalle"
            >
              Explorar productos →
            </Link>

          </div>

        )}

      </main>

      {/* FOOTER */}
      <footer className="footer-tienda">

        <div>
          <strong>
            NovaShop
          </strong>

          <span>
            Calidad que puedes sentir.
          </span>
        </div>

        <p>
          © 2026 NovaShop. Todos los derechos reservados.
        </p>

      </footer>

    </div>
  );
}

export default Favoritos;