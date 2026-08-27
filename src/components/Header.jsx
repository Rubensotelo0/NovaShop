import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCarrito } from '../context/useCarrito';
import { useEffect, useRef, useState } from 'react';
import '../styles/Header.css';
import { Menu, Moon, Search, ShoppingCart, Sun, UserRound } from 'lucide-react';
import { useProductos } from '../context/useProductos';

function Header() {

  // ==============================
  // CARRITO
  // ==============================

  const { carrito } = useCarrito();
  const { productos } = useProductos();

  const cantidadCarrito = carrito.reduce(
    (total, item) => total + item.cantidad,
    0
  );

  const [rebote, setRebote] = useState(false);
  const cantidadAnterior = useRef(cantidadCarrito);


  // ==============================
  // ESTADOS DEL HEADER
  // ==============================

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [usuarioAbierto, setUsuarioAbierto] = useState(false);
  const [modoOscuro, setModoOscuro] = useState(false);
  const [scrolled, setScrolled] = useState(() => window.scrollY > 0);
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriaActiva = searchParams.get('categoria') || 'todas';
  const terminoBusqueda = searchParams.get('q') || '';
  const [textoBusqueda, setTextoBusqueda] = useState(terminoBusqueda);
  const [sugerenciasAbiertas, setSugerenciasAbiertas] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const usuarioRef = useRef(null);
  const buscadorRef = useRef(null);

  const sugerencias = productos
    .filter((producto) => {
      const termino = textoBusqueda.trim().toLowerCase();
      return termino && producto.nombre.toLowerCase().includes(termino);
    })
    .slice(0, 5);

  const abrirDetalle = (producto) => {
    setSugerenciasAbiertas(false);
    setTextoBusqueda(producto.nombre);
    navigate(`/productos/${producto.id}`);
  };

  const buscarProductos = (event) => {
    event.preventDefault();
    const productoSeleccionado = sugerencias[0];

    if (productoSeleccionado) {
      abrirDetalle(productoSeleccionado);
      return;
    }

    const nuevosParametros = new URLSearchParams(searchParams);
    const termino = textoBusqueda.trim();

    if (termino) {
      nuevosParametros.set('q', termino);
    } else {
      nuevosParametros.delete('q');
    }

    setSearchParams(nuevosParametros);
  };


  // ==============================
  // ANIMACIÓN DEL CARRITO
  // ==============================

  useEffect(() => {

    if (cantidadCarrito > cantidadAnterior.current) {

      setRebote(true);

      const timer = setTimeout(() => {
        setRebote(false);
      }, 500);

      cantidadAnterior.current = cantidadCarrito;

      return () => clearTimeout(timer);
    }

    cantidadAnterior.current = cantidadCarrito;

  }, [cantidadCarrito]);


  useEffect(() => {

  const handleClickFuera = (event) => {

    // Cerrar menú hamburguesa
    if (
      menuAbierto &&
      menuRef.current &&
      !menuRef.current.contains(event.target)
    ) {
      setMenuAbierto(false);
    }


    // Cerrar tarjeta de usuario
    if (
      usuarioAbierto &&
      usuarioRef.current &&
      !usuarioRef.current.contains(event.target)
    ) {
      setUsuarioAbierto(false);
    }

    if (
      sugerenciasAbiertas &&
      buscadorRef.current &&
      !buscadorRef.current.contains(event.target)
    ) {
      setSugerenciasAbiertas(false);
    }

  };

  document.addEventListener(
    'mousedown',
    handleClickFuera
  );

  return () => {
    document.removeEventListener(
      'mousedown',
      handleClickFuera
    );
  };

}, [menuAbierto, usuarioAbierto, sugerenciasAbiertas]);


  // ==============================
  // SCROLL DEL HEADER
  // ==============================

  useEffect(() => {

    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };

  }, []);

  const volverAlInicio = (event) => {
    event.preventDefault();
    navigate('/');
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const irAlTopCategoria = () => {
    window.scrollTo({
      top: 620,
      behavior: 'smooth'
    });
  };


  return (
    <>

      {/* ==============================
          HEADER
      ============================== */}

      <header
        className={`header-tienda ${
          scrolled ? 'header-scrolled' : ''
        }`}
      >

        {/* ==============================
            MENÚ HAMBURGUESA
        ============================== */}

        <div className="header-menu" ref={menuRef}>

          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            aria-label={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
            title={menuAbierto ? 'Cerrar menú' : 'Abrir menú'}
          >
            <Menu size={22} strokeWidth={2} aria-hidden="true" />
          </button>
                
                {/* ==============================
            MENÚ HAMBURGUESA
          ============================== */}

          {menuAbierto && (

          <div className="menu-hamburguesa">

            <nav>

            <Link to="/">
              Inicio
            </Link>
            
            <Link to="/perfil">
              Mi perfil
            </Link>

            <Link to="/favoritos">
              Favoritos
            </Link>

            <Link to="/">
              Contactanos
            </Link>


            </nav>
          </div>
          )}
      </div>


        {/* ==============================
            BUSCADOR
        ============================== */}

        <form className="header-buscador" onSubmit={buscarProductos} ref={buscadorRef}>

          <input
            type="text"
            value={textoBusqueda}
            onChange={(event) => {
              setTextoBusqueda(event.target.value);
              setSugerenciasAbiertas(true);
            }}
            onFocus={() => setSugerenciasAbiertas(true)}
            placeholder="Buscar productos"
            aria-label="Buscar productos"
          />

          <button type="submit" aria-label="Buscar" title="Buscar">
            <Search size={19} strokeWidth={2} aria-hidden="true" />
          </button>

          {sugerenciasAbiertas && textoBusqueda.trim() && (
            <div className="buscador-sugerencias" role="listbox" aria-label="Sugerencias de productos">
              {sugerencias.length > 0 ? sugerencias.map((producto) => (
                <button
                  type="button"
                  className="buscador-sugerencia"
                  key={producto.id}
                  onClick={() => abrirDetalle(producto)}
                >
                  <strong>{producto.nombre}</strong>
                </button>
              )) : (
                <p className="buscador-sin-resultados">No encontramos ese producto.</p>
              )}
            </div>
          )}

        </form>


        {/* ==============================
            LOGO
        ============================== */}

        <div className="header-logo">

          <Link to="/" onClick={volverAlInicio}>

            <span className="header-logo-dark">
              Nova
            </span>

            Shop

          </Link>

        </div>


        {/* ==============================
            ACCIONES
        ============================== */}

        <div className="header-acciones">


          {/* ==============================
              MODO OSCURO
          ============================== */}

          <button
            onClick={() => setModoOscuro(!modoOscuro)}
            aria-label={modoOscuro ? 'Activar modo claro' : 'Activar modo oscuro'}
            title={modoOscuro ? 'Modo claro' : 'Modo oscuro'}
          >
            {modoOscuro ? (
              <Sun size={20} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Moon size={20} strokeWidth={2} aria-hidden="true" />
            )}
          </button>


          {/* ==============================
              CARRITO
          ============================== */}

          <Link
            to="/carrito"
            className={`header-carrito ${
              rebote ? 'rebote' : ''
            }`}
            aria-label="Abrir carrito"
            title="Carrito"
          >

            <span aria-hidden="true">
              <ShoppingCart size={21} strokeWidth={2} />
            </span>

            {cantidadCarrito > 0 && (
              <strong className="carrito-cantidad">
                {cantidadCarrito}
              </strong>
            )}

          </Link>


          {/* ==============================
              USUARIO
          ============================== */}

          <div className="usuario-container" ref={usuarioRef}>

            <button
              onClick={() => setUsuarioAbierto(!usuarioAbierto)}
              aria-label="Abrir menú de usuario"
              title="Menú de usuario"
            >
              <UserRound size={20} strokeWidth={2} aria-hidden="true" />
            </button>


            {usuarioAbierto && (

              <div className="usuario-card">

                <h3>
                  Mi cuenta
                </h3>

                <p>
                  Usuario: Manuel
                </p>

                <button>
                  Mi perfil
                </button>

                <button>
                  Cerrar sesión
                </button>

              </div>

            )}

          </div>

        </div>

        <nav className="header-categorias" aria-label="Categorías de productos">
          <Link
            className={categoriaActiva === 'todas' ? 'categoria-activa' : ''}
            to="/?categoria=todas"
            onClick={irAlTopCategoria}
          >
            Todas
          </Link>
          <Link
            className={categoriaActiva === 'laptop' ? 'categoria-activa' : ''}
            to="/?categoria=laptop"
            onClick={irAlTopCategoria}
          >
            Laptop
          </Link>
          <Link
            className={categoriaActiva === 'teclado' ? 'categoria-activa' : ''}
            to="/?categoria=teclado"
            onClick={irAlTopCategoria}
          >
            Teclado
          </Link>
          <Link
            className={categoriaActiva === 'raton' ? 'categoria-activa' : ''}
            to="/?categoria=raton"
            onClick={irAlTopCategoria}
          >
            Ratón
          </Link>
        </nav>

      </header>


    </>
  );
}

export default Header;