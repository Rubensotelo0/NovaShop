import { Link } from 'react-router-dom';
import { useCarrito } from '../context/useCarrito';
import { useEffect, useRef, useState } from 'react';
import '../styles/Header.css';

function Header() {

  // ==============================
  // CARRITO
  // ==============================

  const { carrito } = useCarrito();

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
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const usuarioRef = useRef(null);


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

}, [menuAbierto, usuarioAbierto]);


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
            onClick={() => setMenuAbierto(!menuAbierto)}
          >
            ☰
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

        <div className="header-buscador">

          <input
            type="text"
            placeholder="Search"
          />

          <button>
            🔍
          </button>

        </div>


        {/* ==============================
            LOGO
        ============================== */}

        <div className="header-logo">

          <Link to="/">

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
          >
            {modoOscuro ? '☀️' : '🌙'}
          </button>


          {/* ==============================
              CARRITO
          ============================== */}

          <Link
            to="/carrito"
            className={`header-carrito ${
              rebote ? 'rebote' : ''
            }`}
          >

            <span aria-hidden="true">
              🛒
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
            >
              👤
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

      </header>


    </>
  );
}

export default Header;