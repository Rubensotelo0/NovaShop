import { Link, useSearchParams } from 'react-router-dom';
import '../styles/ListaProductos.css';
import { useEffect, useRef, useState } from 'react';
import ProductoCard from './ProductoCard';
import Header from './Header'
import { useCarrito } from '../context/useCarrito';
import Hero from './hero.jsx';
import { useProductos } from '../context/useProductos';

function HomePage() {

  const { carrito } = useCarrito();
  const { productos, categorias, cargando, error } = useProductos();
  const [searchParams] = useSearchParams();
  const categoriaSeleccionada = searchParams.get('categoria') || 'todas';
  const terminoBusqueda = searchParams.get('q') || '';
  const busquedaActiva = terminoBusqueda.trim().length > 0;
  const filtroActivo = categoriaSeleccionada && categoriaSeleccionada !== 'todas';
  const categoriaActual = categorias.find(
    (categoria) => categoria.slug === categoriaSeleccionada
  );
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

  const productosVisibles = filtroActivo
    ? productos.filter(
      (producto) => producto.categoria === categoriaSeleccionada
    )
    : productos;

  const formatearPrecio = (precio) => `$${precio.toFixed(2)} MXN`;
  const rutaLimpiarBusqueda = filtroActivo
    ? `/?categoria=${categoriaSeleccionada}`
    : '/';

  const redesSociales = [
    {
      nombre: 'Instagram',
      href: 'https://www.instagram.com/',
      icono: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="4.1" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
        </svg>
      )
    },
    {
      nombre: 'Facebook',
      href: 'https://www.facebook.com/',
      icono: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.5c0-.9.3-1.6 1.6-1.6H17V2.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.4v2.6H8v3.2h2.3v8h3.2Z" fill="currentColor" />
        </svg>
      )
    },
    {
      nombre: 'Twitter',
      href: 'https://x.com/',
      icono: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.9 2h3.4l-7.5 8.6L22.6 22h-6.8l-5.3-7.6L4.6 22H1.2l8-9.2L1.2 2h7l4.8 6.8L18.9 2Zm-1.2 18h1.9L7.2 3.9H5.2L17.7 20Z" fill="currentColor" />
        </svg>
      )
    },
    {
      nombre: 'LinkedIn',
      href: 'https://www.linkedin.com/',
      icono: (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8.2 10.1v7.1M8.2 6.8v.1M12.4 17.2v-4.3c0-1.2.9-2.1 2.1-2.1 1.2 0 2.1.9 2.1 2.1v4.3M12.4 10.1v-1.3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <div className="tienda">

      {<Header/>}
      {!busquedaActiva && <Hero/>}

      {/* CONTENIDO */}
      <main className={`lista-container ${busquedaActiva ? 'lista-container-busqueda' : ''}`}>

  {!busquedaActiva && (
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
  )}

  <div id="catalogo" className={`catalogo-header ${busquedaActiva ? 'catalogo-header-busqueda' : ''}`}>

  <h2 className="catalogo-label">
    {busquedaActiva
      ? 'RESULTADOS'
      : filtroActivo
        ? categoriaActual?.nombre?.toUpperCase() || categoriaSeleccionada.toUpperCase()
        : 'NUESTRA'} <span>{busquedaActiva ? 'DE LA BÚSQUEDA' : filtroActivo ? 'CATEGORÍA' : 'COLECCIÓN'}</span>
  </h2>

  {busquedaActiva && (
    <>
      <div className="busqueda-etiquetas">
        <span className="busqueda-pill">
          Buscando: {terminoBusqueda}
        </span>

        <Link to={rutaLimpiarBusqueda} className="busqueda-limpiar">
          Limpiar búsqueda
        </Link>
      </div>

      <p className="catalogo-subtitulo">
        {productosVisibles.length > 0
          ? `${productosVisibles.length} resultado${productosVisibles.length === 1 ? '' : 's'} para "${terminoBusqueda}"`
          : `No encontramos resultados para "${terminoBusqueda}"`}
      </p>

      {filtroActivo && categoriaActual && (
        <p className="catalogo-subtitulo2">
          Filtrando dentro de {categoriaActual.nombre}
        </p>
      )}
    </>
  )}

</div>

        {busquedaActiva ? (
          <section className="busqueda-panel" aria-label="Resultados de la búsqueda">
            {cargando && <p className="busqueda-estado">Cargando resultados...</p>}
            {error && <p className="busqueda-estado">{error}</p>}

            {!cargando && !error && productosVisibles.length > 0 && (
              <div className="busqueda-lista">
                {productosVisibles.map((producto) => {
                  const tieneDescuento = producto.descuento > 0;
                  const precioFinal = tieneDescuento
                    ? producto.precio * (1 - producto.descuento / 100)
                    : producto.precio;

                  return (
                    <Link
                      key={producto.id}
                      to={`/productos/${producto.id}`}
                      className="busqueda-item"
                    >
                      <div className="busqueda-item-imagen">
                        <img
                          src={producto.imagen}
                          alt={producto.nombre}
                        />
                      </div>

                      <div className="busqueda-item-contenido">
                        <p className="busqueda-item-meta">
                          {producto.categoriaNombre || 'Producto'} · {producto.marca}
                        </p>

                        <h3>
                          {producto.nombre}
                        </h3>

                        <p className="busqueda-item-descripcion">
                          {producto.desc}
                        </p>

                        <span className="busqueda-item-cta">
                          Ver detalle del producto
                        </span>

                        <div className="busqueda-item-precio">
                          {tieneDescuento && (
                            <span className="busqueda-item-descuento">
                              -{producto.descuento}%
                            </span>
                          )}

                          {tieneDescuento && (
                            <span className="busqueda-item-precio-anterior">
                              {formatearPrecio(producto.precio)}
                            </span>
                          )}

                          <strong>
                            {formatearPrecio(precioFinal)}
                          </strong>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {!cargando && !error && productosVisibles.length === 0 && (
              <div className="busqueda-vacia">
                <h3>No encontramos coincidencias</h3>
                <p>Prueba con otro nombre, una marca o una categoría distinta.</p>
              </div>
            )}
          </section>
        ) : (
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
        )}

        {!busquedaActiva && (
          <div id="sobre-nosotros" className="catalogo-header">

  <h2 className="catalogo-label">
    SOBRE <span>NOSOTROS</span>
  </h2>

  <p className="catalogo-subtitulo">
    Somos una empresa dirigida a jóvenes y gente en busca de productos de calidad a buen precio, sabemos que conseguir dinero no es fácil y es por eso que ofrecemos los mejores precios del mercado ayudándote a ti y a tu cartera.
  </p>

  <p className="catalogo-subtitulo2">
    No solo compras ofertas, también experiencias.
  </p>

  <h2 className="catalogo-label">
    CONFÍA Y <span>AHORRA</span> EN <span>NOVASHOP</span>
  </h2>

  <p className="catalogo-subtitulo">
    Con 10 años de experiencia preocupandonos por tus gastos, te aseguramos que aquí ahorrarás lo que siempre has deseado.
  </p>

    <p className="catalogo-subtitulo2">
    Te ahorrarás el estrés al tener dinero otra vez.
  </p>

    <h2 className="catalogo-label">
    TODO <span>VENDERÁS</span> EN <span>NOVASHOP</span>
  </h2>

  <p className="catalogo-subtitulo">
    Con nuestra plataforma, olvida el inventario acumulado, vende de manera rápida y segura, sin preocuparte por nada, nosotros nos encargamos de todo.
  </p>

  <p className="catalogo-subtitulo2">
    Vendiendo inventarios, ahorrando en gastos.
  </p>

  <div className="catalogo-linea"></div>
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

        <div>
          <div className="footer-redes" aria-label="Redes sociales">
            {redesSociales.map(({ nombre, href, icono }) => (
              <a
                key={nombre}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={nombre}
                className="footer-red-social"
              >
                {icono}
              </a>
            ))}
          </div>

          <span>
            © 2026 NovaShop. Todos los derechos reservados.
          </span>
        </div>


      </footer>

    </div>
  );
}

export default HomePage;
