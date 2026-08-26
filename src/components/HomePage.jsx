import { Link } from 'react-router-dom';
import '../styles/ListaProductos.css';
import { useEffect, useRef, useState } from 'react';
import ProductoCard from './ProductoCard';
import Header from './Header'
import { useCarrito } from '../context/useCarrito';
import Hero from './hero.jsx';
import { useProductos } from '../context/useProductos';

function HomePage() {

  const { carrito } = useCarrito();
  const { productos, cargando, error } = useProductos();
  const cantidadCarrito = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );
  const [rebote, setRebote] = useState(false);
  const cantidadAnterior = useRef(cantidadCarrito);

  useEffect(() => {
    if (cantidadCarrito > cantidadAnterior.current) {
      setRebote(true);
      const timer = setTimeout(() => setRebote(false), 500);
      cantidadAnterior.current = cantidadCarrito;
      return () => clearTimeout(timer);
    }
    cantidadAnterior.current = cantidadCarrito;
  }, [cantidadCarrito]);

  // Cargar favoritos guardados
  const [favoritos, setFavoritos] = useState(() => {
    const guardados = localStorage.getItem('favoritos');

    return guardados ? JSON.parse(guardados) : [];
  });

  // Agregar o quitar favoritos
  const toggleFavorito = (id) => {
    setFavoritos((actuales) => {
      let nuevosFavoritos;

      if (actuales.includes(id)) {
        // Quitar de favoritos
        nuevosFavoritos = actuales.filter(
          (favoritoId) => favoritoId !== id
        );
      } else {
        // Agregar de favoritos
        nuevosFavoritos = [...actuales, id];
      }

      // Guardar en localStorage
      localStorage.setItem(
        'favoritos',
        JSON.stringify(nuevosFavoritos)
      );

      return nuevosFavoritos;
    });
  };

  return (
    <div className="tienda">

      {<Header/>}
      <Hero/>

      {/* CONTENIDO */}
      <main className="lista-container">

<div className="catalogo-header">

  <h2 className="catalogo-label">
    NUESTRA <span>COLECCIÓN</span>
  </h2>

  <p className="catalogo-subtitulo">
    Descubre nuestra selección de productos pensados para ti.
  </p>

  <p className="catalogo-subtitulo2">
    No solo compras ofertas, también experiencias.
  </p>

  <div className="catalogo-linea"></div>
</div>


        {/* PRODUCTOS */}
        <div className="productos-grid">
          {cargando && <p>Cargando productos...</p>}
          {error && <p>{error}</p>}
          {!cargando && !error && productos.map((prod, index) => (
            <ProductoCard
              key={prod.id}
              prod={prod}
              index={index}
              favorito={favoritos.includes(prod.id)}
              onToggleFavorito={toggleFavorito}
            />
          ))}

        </div>

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

export default HomePage;