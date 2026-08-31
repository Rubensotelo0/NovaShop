import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCarrito } from '../context/useCarrito';
import '../styles/ConfirmarCompra.css';

function ConfirmarCompra({ onCancelar }) {

  const { carrito, total, recargarCarrito } = useCarrito();

  const [compraConfirmada, setCompraConfirmada] = useState(false);
  const [numeroCompra, setNumeroCompra] = useState('');
  const [resumenCompra, setResumenCompra] = useState(null);
  useEffect(() => {
  document.body.style.overflow = 'hidden';

  return () => {
    document.body.style.overflow = '';
  };
  }, []);
  const confirmarCompra = async () => {
    try {
      const usuarioGuardado = JSON.parse(localStorage.getItem('user') || 'null');

      if (!usuarioGuardado?.id) {
        window.alert('Debes iniciar sesión para completar la compra');
        return;
      }

      const userId = Number(usuarioGuardado.id);

      const respuesta = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data?.message || 'No se pudo completar la compra');
      }

      const idCompra = `NS-${data.pedidoId}`;
      const compraActual = carrito.map((item) => {
        const precioBase = Number(item.producto.precio || 0);
        const descuento = Number(item.producto.descuento || 0);
        const precioConDescuento = precioBase * (1 - descuento / 100);

        return {
          id: item.id,
          nombre: item.producto.nombre,
          marca: item.producto.marca,
          cantidad: item.cantidad,
          precio: Number(precioConDescuento.toFixed(2)),
          descuento,
          subtotal: Number((precioConDescuento * item.cantidad).toFixed(2))
        };
      });

      const historialGuardado = localStorage.getItem('historialCompras');
      const historial = historialGuardado ? JSON.parse(historialGuardado) : [];

      const compra = {
        id: idCompra,
        fecha: new Date().toISOString(),
        total: Number(data.total || total),
        items: compraActual
      };

      localStorage.setItem(
        'historialCompras',
        JSON.stringify([compra, ...historial])
      );

      setNumeroCompra(idCompra);
      setResumenCompra({
        numero: idCompra,
        total: Number(data.total || total),
        items: compraActual
      });
      setCompraConfirmada(true);
      await recargarCarrito();
    } catch (error) {
      window.alert(error.message || 'No se pudo completar la compra');
    }
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

              {(resumenCompra?.items || carrito).map((item) => {
                const nombre = item.producto ? item.producto.nombre : item.nombre;
                const marca = item.producto ? item.producto.marca : item.marca;
                const cantidad = item.cantidad;
                const descuento = item.producto
                  ? Number(item.producto.descuento || 0)
                  : Number(item.descuento || 0);
                const precioUnitario = item.producto
                  ? Number(item.producto.precio || 0) * (1 - (descuento / 100))
                  : Number(item.precio || 0);
                const subtotal = item.producto
                  ? Number((precioUnitario * cantidad).toFixed(2))
                  : Number(item.subtotal || 0);

                return (
                  <div
                    className="compra-ticket-producto"
                    key={item.id}
                  >
                    <div className="compra-ticket-producto-info">
                      <strong>
                        {nombre}
                      </strong>

                      <span>
                        {marca}
                      </span>

                      <span className="compra-ticket-detalle">
                        {cantidad} × ${Number(precioUnitario).toFixed(2)}
                      </span>

                      <span className="compra-ticket-descuento">
                        Descuento: -{Number(descuento).toFixed(2)}%
                      </span>
                    </div>

                    <div className="compra-ticket-producto-total">
                      <span>Subtotal</span>
                      <strong>
                        ${Number(subtotal).toFixed(2)}
                      </strong>
                    </div>
                  </div>
                );
              })}

            </div>


            {/* TOTAL */}

            <div className="compra-ticket-total">

              <span>
                Total
              </span>

              <strong>
                ${Number(resumenCompra?.total ?? total).toFixed(2)}
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