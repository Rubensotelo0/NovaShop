import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/useCarrito';
import '../styles/ConfirmarCompra.css';

function ConfirmarCompra({ onCancelar }) {

  const { carrito, total } = useCarrito();

  const [compraConfirmada, setCompraConfirmada] = useState(false);
  const [numeroCompra, setNumeroCompra] = useState('');
  useEffect(() => {
  document.body.style.overflow = 'hidden';

  return () => {
    document.body.style.overflow = '';
  };
  }, []);
  const confirmarCompra = () => {

    const idCompra = `NS-${Date.now()}`;

    const historialGuardado = localStorage.getItem('historialCompras');

    const historial = historialGuardado
      ? JSON.parse(historialGuardado)
      : [];

    const compra = {
      id: idCompra,
      fecha: new Date().toISOString(),
      total,
      items: carrito.map((item) => ({
        id: item.id,
        nombre: item.producto.nombre,
        marca: item.producto.marca,
        cantidad: item.cantidad,
        precio: item.producto.precio
      }))
    };

    localStorage.setItem(
      'historialCompras',
      JSON.stringify([compra, ...historial])
    );

    setNumeroCompra(idCompra);
    setCompraConfirmada(true);
  };


  /*
   * =========================================
   * POPUP DE COMPRA CONFIRMADA
   * =========================================
   */

  if (compraConfirmada) {

    return (

      <div
        className="compra-confirmada-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="compra-confirmada-titulo"
      >

        <div className="compra-confirmada-modal">

          {/* ICONO */}

          <div className="compra-confirmada-icon">
            ✓
          </div>


          {/* TÍTULO */}

          <h2 id="compra-confirmada-titulo">
            ¡Compra confirmada!
          </h2>

          <p className="compra-confirmada-mensaje">
            Tu compra se realizó correctamente.
          </p>


          {/* =========================================
              TICKET
          ========================================= */}

          <div className="compra-ticket">

            <div className="compra-ticket-header">

              <span>
                NovaShop
              </span>

              <small>
                Ticket de compra
              </small>

            </div>


            <div className="compra-ticket-numero">

              <span>
                Número de compra
              </span>

              <strong>
                {numeroCompra}
              </strong>

            </div>


            {/* PRODUCTOS */}

            <div className="compra-ticket-productos">

              {carrito.map((item) => (

                <div
                  className="compra-ticket-producto"
                  key={item.id}
                >

                  <div>

                    <strong>
                      {item.producto.nombre}
                    </strong>

                    <span>
                      {item.producto.marca} × {item.cantidad}
                    </span>

                  </div>

                  <strong>
                    ${(item.producto.precio * item.cantidad).toFixed(2)}
                  </strong>

                </div>

              ))}

            </div>


            {/* TOTAL */}

            <div className="compra-ticket-total">

              <span>
                Total
              </span>

              <strong>
                ${total.toFixed(2)}
              </strong>

            </div>

          </div>


          <p className="compra-confirmada-gracias">
            Gracias por comprar con nosotros.
          </p>


          {/* BOTÓN */}

          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="compra-confirmada-boton"
          >
            Volver a la tienda
          </Link>

        </div>

      </div>

    );
  }


  /*
   * =========================================
   * POPUP DE CONFIRMACIÓN
   * =========================================
   */

  return (

    <div
      className="confirmar-compra-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmar-compra-titulo"
    >

      <div className="confirmar-compra-modal">

        {/* ICONO */}

        <div className="confirmar-compra-icon">
          ?
        </div>


        {/* TÍTULO */}

        <h2 id="confirmar-compra-titulo">
          ¿Confirmar compra?
        </h2>


        <p className="confirmar-compra-mensaje">
          ¿Estás seguro de que deseas realizar esta compra?
        </p>


        {/* TOTAL */}

        <div className="confirmar-compra-total">

          <span>
            Total de compra
          </span>

          <strong>
            ${total.toFixed(2)}
          </strong>

        </div>


        {/* BOTONES */}

        <div className="confirmar-compra-acciones">

          <button
            type="button"
            className="confirmar-compra-cancelar"
            onClick={onCancelar}
          >
            Cancelar
          </button>


          <button
            type="button"
            className="confirmar-compra-confirmar"
            onClick={confirmarCompra}
          >
            Sí, comprar
          </button>

        </div>

      </div>

    </div>

  );
}

export default ConfirmarCompra;