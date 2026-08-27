import { Link, useSearchParams } from 'react-router-dom';
import '../styles/ListaProductos.css';
import { useEffect, useRef, useState } from 'react';
import ProductoCard from './ProductoCard';
import Header from './Header'
import { useCarrito } from '../context/useCarrito';
import Hero from './hero.jsx';
import { useProductos } from '../context/useProductos';

const categoriasPorProducto = {
  '1': 'laptop',
  '2': 'teclado',
  '3': 'raton',
  '4': 'monitores',
  '5': 'auriculares',
  '6': 'sillas',
  '7': 'almacenamiento',
  '8': 'camaras',
  '9': 'microfonos'
};

function HomePage() {

  const { carrito } = useCarrito();
  const { productos, cargando, error } = useProductos();
  const [searchParams] = useSearchParams();
  const categoriaSeleccionada = searchParams.get('categoria');
  const filtroActivo = categoriaSeleccionada && categoriaSeleccionada !== 'todas';
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

  const productosConCategoria = productos.map((producto) => ({
    ...producto,
    categoria: producto.categoria || categoriasPorProducto[String(producto.id)]
  }));

  const productosVisibles = filtroActivo
    ? productosConCategoria.filter(
      (producto) => producto.categoria === categoriaSeleccionada
    )
    : productosConCategoria;

  return (
    <div className="tienda">

      {<Header/>}
      <Hero/>

      {/* CONTENIDO */}
      <main className="lista-container">



  <div className="promocion-banner">

    <div className="promocion-imagen">

      <img
        src="/src/assets/tec.png"
        alt="Teclado y mouse inalámbricos HP 650"
      />

    </div>

    <div className="promocion-contenido">

      <span className="promocion-etiqueta">
        OFERTA ESPECIAL
      </span>

      <h2>
        En todas las compras en mouse y teclados
      </h2>

      <p className="promocion-principal">
        Compra uno
        <strong> y recibe su complemento GRATIS.</strong>
      </p>

      <p className="promocion-secundaria">
        ¿Ya tienes teclado? No hay problemazzz.
        <br />
        Compra un mouse y recibe un tecladozzz.
      </p>

      <Link
        to="/"
        className="promocion-boton"
      >
        Aprovechar oferta
      </Link>

    </div>

  </div>

  <div id="catalogo" className="catalogo-header">

  <h2 className="catalogo-label">
    {filtroActivo ? categoriaSeleccionada.toUpperCase() : 'NUESTRA'} <span>{filtroActivo ? 'CATEGORÍA' : 'COLECCIÓN'}</span>
  </h2>

</div>


        {/* PRODUCTOS */}
        <div className="productos-grid">
          {cargando && <p>Cargando productos...</p>}
          {error && <p>{error}</p>}
          {!cargando && !error && productosVisibles.map((prod, index) => (
            <ProductoCard
              key={prod.id}
              prod={prod}
              index={index}
              favorito={favoritos.includes(prod.id)}
              onToggleFavorito={toggleFavorito}
            />
          ))}

          {!cargando && !error && productosVisibles.length === 0 && (
            <p>No hay productos en esta categoría.</p>
          )}

        </div>

        <div id="catalogo" className="catalogo-header">

  <h2 className="catalogo-label">
    SOBRE <span>NOSOTROS</span>
  </h2>

  <p className="catalogo-subtitulo">
    Descubre nuestra selección de productos pensados para ti.
  </p>

  <p className="catalogo-subtitulo2">
    No solo compras ofertas, también experiencias.
  </p>

  <div className="catalogo-linea"></div>
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