import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/ConfirmarCompra.css';
import '../styles/Carrito.css';
import { useCarrito } from '../context/useCarrito';

function ConfirmarCompra() {

  const [compraConfirmada, setCompraConfirmada] = useState(false);
  const { carrito, total } = useCarrito();


  const confirmarCompra = () => {
    const historialGuardado = localStorage.getItem('historialCompras');
    const historial = historialGuardado ? JSON.parse(historialGuardado) : [];
    const compra = {
      id: `NS-${Date.now()}`,
      fecha: new Date().toISOString(),
      total,
      items: carrito.map((item) => ({
        nombre: item.producto.nombre,
        marca: item.producto.marca,
        cantidad: item.cantidad,
        precio: item.precioUnitario
      }))
    };

    localStorage.setItem(
      'historialCompras',
      JSON.stringify([compra, ...historial])
    );
    setCompraConfirmada(true);
  };


  return (

    <div className="confirmar-compra-page">

      {/* HEADER PRINCIPAL */}
      <Header />


      {/* CONTENIDO PRINCIPAL */}
      <main className="confirmar-compra-shell">


        {/* =========================================
            PROGRESO DE COMPRA
        ========================================= */}

        <div
          className="checkout-progress"
          aria-label="Progreso de compra"
        >


          {/* PASO 1 */}

          <div className="checkout-step checkout-step-completed">

            <span className="checkout-step-circle">
              ✓
            </span>

            <span className="checkout-step-label">
              Carrito
            </span>

          </div>


          <div className="checkout-progress-line checkout-progress-line-active" />


          {/* PASO 2 */}

          <div className="checkout-step checkout-step-completed">

            <span className="checkout-step-circle">
              ✓
            </span>

            <span className="checkout-step-label">
              Datos de envío
            </span>

          </div>


          <div className="checkout-progress-line checkout-progress-line-active" />


          {/* PASO 3 */}

          <div className="checkout-step checkout-step-active">

            <span className="checkout-step-circle">
              3
            </span>

            <span className="checkout-step-label">
              Comprar
            </span>

          </div>

        </div>


        {/* =========================================
            CONTENIDO DE CONFIRMACIÓN
        ========================================= */}

        <section className="confirmar-compra-contenido">


          {/* ENCABEZADO */}

          <div className="confirmar-compra-header">

            <h1>
              Confirmar compra
            </h1>

            <p>
              Revisa que toda la información sea correcta antes de confirmar tu pedido.
            </p>

          </div>


          {/* =========================================
              RESUMEN
          ========================================= */}

          <div className="confirmar-compra-resumen">


            {/* ESTADO */}

            <div className="confirmar-compra-resumen-item">

              <span>
                Estado del pedido
              </span>

              <strong>
                Listo para comprar
              </strong>

            </div>


            {/* MÉTODO DE PAGO */}

            <div className="confirmar-compra-resumen-item">

              <span>
                Método de pago
              </span>

              <strong>
                Pago seleccionado
              </strong>

            </div>


            {/* ENVÍO */}

            <div className="confirmar-compra-resumen-item">

              <span>
                Envío
              </span>

              <strong>
                Dirección registrada
              </strong>

            </div>

          </div>


          {/* =========================================
              BOTONES
          ========================================= */}

          <div className="confirmar-compra-acciones">


            {/* VOLVER */}

            <Link
              to="/datosEnv"
              className="confirmar-compra-volver"
            >
              Volver
            </Link>


            {/* CONFIRMAR */}

            <button
              type="button"
              className="confirmar-compra-boton"
              onClick={confirmarCompra}
            >
              Confirmar compra
            </button>

          </div>

        </section>

      </main>


      {/* =========================================
          POPUP DE COMPRA CONFIRMADA
      ========================================= */}

      {compraConfirmada && (

        <div
          className="compra-confirmada-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="compra-confirmada-titulo"
        >

          <div className="compra-confirmada-modal">


            {/* ICONO DE CONFIRMACIÓN */}

            <div className="compra-confirmada-icon">
              ✓
            </div>


            {/* MENSAJE */}

            <h2 id="compra-confirmada-titulo">
              ¡Compra confirmada!
            </h2>

            <p>
              Tu compra se realizó correctamente.
            </p>

            <p>
              Gracias por comprar con nosotros.
            </p>


            {/* VOLVER A LA TIENDA */}

            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="compra-confirmada-boton"
            >
              Volver a la tienda
            </Link>

          </div>

        </div>

      )}

    </div>
  );
}

export default ConfirmarCompra;