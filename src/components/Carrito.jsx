import { useCarrito } from '../context/useCarrito';
import { Link } from 'react-router-dom';
import '../styles/Carrito.css';
import Header from './Header';

function Carrito() {

  const {
    carrito,
    cambiarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
    total,
    cargando,
    error
  } = useCarrito();

  const subtotal = carrito.reduce(
    (acumulado, { cantidad, producto }) => {
      return acumulado + cantidad * Number(producto.precio || 0);
    },
    0
  );

  const totalConDescuento = carrito.reduce(
    (acumulado, { cantidad, producto }) => {
      const precio = Number(producto.precio || 0);
      const descuento = Number(producto.descuento || 0);
      const precioRebajado = precio * (1 - descuento / 100);

      return acumulado + cantidad * precioRebajado;
    },
    0
  );

  const descuentoTotal = subtotal - totalConDescuento;


  return (

    <div className="carrito-page">

      {/* HEADER PRINCIPAL */}
      <Header />


      {/* CONTENIDO DEL CARRITO */}
      <main className="carrito-shell">


        <div className="checkout-progress" aria-label="Progreso de compra">

          <div className="checkout-step checkout-step-active">
            <span className="checkout-step-circle">
              1
            </span>

            <span className="checkout-step-label">
              Carrito
            </span>
          </div>

          <div className="checkout-progress-line" />

          <div className="checkout-step">
            <span className="checkout-step-circle">
              2
            </span>

            <span className="checkout-step-label">
              Datos de envío
            </span>
          </div>

          <div className="checkout-progress-line" />

          <div className="checkout-step">
            <span className="checkout-step-circle">
              3
            </span>

            <span className="checkout-step-label">
              Comprar
            </span>
          </div>

        </div>


        {/* ==============================
            CARRITO VACÍO
        ============================== */}

        {cargando ? (

          <section className="carrito-vacio">

            <h2>
              Cargando carrito...
            </h2>

          </section>


        ) : error ? (

          <section className="carrito-vacio">

            <h2>
              No se pudo cargar el carrito
            </h2>

            <p>
              {error}
            </p>

          </section>


        ) : carrito.length === 0 ? (

          <section className="carrito-vacio">

            <div
              className="carrito-vacio-icon"
              aria-hidden="true"
            >
              🛒
            </div>

            <h2>
              Tu carrito está vacío
            </h2>

            <p>
              Agrega un producto para verlo aquí.
            </p>

            <Link
              to="/"
              className="carrito-comprar"
            >
              Ver productos
            </Link>

          </section>


        ) : (


          /* ==============================
             CARRITO CON PRODUCTOS
          ============================== */

          <div className="carrito-layout">


            {/* LISTA DE PRODUCTOS */}
            <div className="carrito-lista">

              {carrito.map(
                ({ id, cantidad, producto }) => (

                  <article
                    className="carrito-item"
                    key={id}
                  >


                    {/* IMAGEN */}
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="carrito-item-imagen"
                    />


                    {/* INFORMACIÓN DEL PRODUCTO */}
                    <div className="carrito-item-info">

                      <h2>
                        {producto.nombre}
                      </h2>

                      <p>
                        Marca: {producto.marca}
                      </p>

                      {Number(producto.descuento || 0) > 0 && (
                        <p>
                          Ahorras $
                          {(
                            Number(producto.precio || 0) * cantidad *
                            Number(producto.descuento || 0) / 100
                          ).toFixed(2)}
                        </p>
                      )}

                      <p className="carrito-item-precio">
                        ${producto.precio.toFixed(2)} por unidad
                      </p>

                      <p>
                        Stock disponible: {producto.stock}
                      </p>

                    </div>


                    {/* CONTROLES */}
                    <div className="carrito-controles">


                      {/* CANTIDAD */}
                      <div>

                        <button
                          type="button"
                          aria-label={`Disminuir cantidad de ${producto.nombre}`}
                          onClick={() =>
                            cambiarCantidad(
                              id,
                              cantidad - 1
                            )
                          }
                        >
                          -
                        </button>

                        <span>
                          {cantidad}
                        </span>

                        <button
                          type="button"
                          aria-label={`Aumentar cantidad de ${producto.nombre}`}
                          disabled={cantidad >= producto.stock}
                          onClick={() =>
                            cambiarCantidad(
                              id,
                              cantidad + 1
                            )
                          }
                        >
                          +
                        </button>

                      </div>


                      {/* QUITAR PRODUCTO */}
                      <button
                        type="button"
                        className="carrito-quitar"
                        onClick={() =>
                          quitarDelCarrito(id)
                        }
                      >
                        Quitar
                      </button>

                    </div>

                  </article>

                )
              )}

            </div>


            {/* ==============================
                RESUMEN
            ============================== */}

            <section className="carrito-resumen">

              <div className="carrito-resumen-info">

                <h2 className="carrito-resumen-titulo">
                  Resumen
                </h2>

                <p className="carrito-total-label">
                  Subtotal
                </p>

                <p className="carrito-total">
                  ${subtotal.toFixed(2)}
                </p>

                <p className="carrito-total-label">
                  Descuento
                </p>

                {descuentoTotal > 0 && (
                  <p className="carrito-total-descuento">
                    -${descuentoTotal.toFixed(2)}
                  </p>

                )}

                <p className="carrito-total-label">
                  Total
                </p>

                <p className="carrito-total">
                  ${totalConDescuento.toFixed(2)}
                </p>

              </div>
    

              <Link
                to="/datosEnv"
                className="carrito-checkout"
              >
                Finalizar compra
              </Link>

              <button
                type="button"
                className="carrito-vaciar"
                onClick={vaciarCarrito}
              >
                Vaciar carrito
              </button>

            </section>

          </div>

        )}

      </main>

    </div>
  );
}

export default Carrito;