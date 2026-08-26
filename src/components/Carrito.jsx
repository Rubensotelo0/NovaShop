import { useCarrito } from '../context/useCarrito';
import { useProductos } from '../context/useProductos';
import { Link } from 'react-router-dom';
import '../styles/Carrito.css';
import Header from './Header';

function Carrito() {

  const {
    carrito,
    cambiarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
    total
  } = useCarrito();
  const { productos } = useProductos();


  // Buscar la información completa de cada producto
  // que actualmente está en el carrito.
  const productosCarrito = carrito
    .map((item) => ({
      ...item,
      producto: productos.find(
        (prod) => String(prod.id) === String(item.id)
      )
    }))
    .filter((item) => item.producto);


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

        {productosCarrito.length === 0 ? (

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

              {productosCarrito.map(
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
                        {producto.desc}
                      </p>

                      <p className="carrito-item-precio">
                        ${producto.precio.toFixed(2)} por unidad
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

                <p className="carrito-total-label">
                  Total
                </p>

                <p className="carrito-total">
                  ${total.toFixed(2)}
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