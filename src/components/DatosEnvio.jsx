import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from './Header';
import { useCarrito } from '../context/useCarrito';
import '../styles/Carrito.css';
import '../styles/DatosEnvio.css';
import ConfirmarCompra from './ConfirmarCompra';
import { CreditCard } from 'lucide-react';

function DatosEnvio() {

  const navigate = useNavigate();
  const { carrito, total, totalArticulos, cargando, error } = useCarrito();

  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  
  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    estado: '',
    codigoPostal: ''
  });

  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    nombre: '',
    vencimiento: '',
    cvv: ''
  });

  const [metodoPago, setMetodoPago] = useState('');

  const manejarCambioEnvio = (e) => {
    const { name, value } = e.target;

    setDatosEnvio({
      ...datosEnvio,
      [name]: value
    });
  };

  const manejarCambioTarjeta = (e) => {
    const { name, value } = e.target;

    setDatosTarjeta({
      ...datosTarjeta,
      [name]: value
    });
  };

  const manejarMetodoPago = (e) => {
    setMetodoPago(e.target.value);
  };

  const manejarEnvio = (e) => {
    e.preventDefault();

    console.log('Datos de envío:', datosEnvio);
    console.log('Método de pago:', metodoPago);

    if (metodoPago === 'tarjeta') {
      console.log('Datos de tarjeta:', datosTarjeta);
    }

    navigate('/confirmCompra');
  };

  const subtotal = carrito.reduce(
    (acumulado, { cantidad, producto }) => acumulado + (
      Number(producto.precio || 0) * cantidad
    ),
    0
  );

  const descuento = Math.max(0, subtotal - total);
  const dinero = (cantidad) => `$${Number(cantidad || 0).toFixed(2)}`;

  return (
    <div className="datos-envio-page">

      <Header />

      <main className="datos-envio-shell">

        {/* =========================================
            PROGRESO
        ========================================= */}

        <div
          className="checkout-progress"
          aria-label="Progreso de compra"
        >

          <div className="checkout-step checkout-step-completed">
            <span className="checkout-step-circle">
              ✓
            </span>

            <span className="checkout-step-label">
              Carrito
            </span>
          </div>

          <div className="checkout-progress-line checkout-progress-line-active" />

          <div className="checkout-step checkout-step-active">
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


        {/* =========================================
            CHECKOUT
        ========================================= */}

        <form
          className="datos-envio-layout"
          onSubmit={manejarEnvio}
        >

          {/* =========================================
              COLUMNA PRINCIPAL
          ========================================= */}

          <div className="datos-envio-main">


            {/* =====================================
                DATOS DE ENVÍO
            ===================================== */}

            <section className="checkout-card">

              <div className="checkout-card-header">

                <div>
                  <h1>
                    Datos de envío
                  </h1>

                  <p>
                    ¿Dónde quieres recibir tu pedido?
                  </p>
                </div>

              </div>


              <div className="datos-envio-form">

                {/* DIRECCIÓN */}

                <div className="form-group form-group-full">

                  <label htmlFor="direccion">
                    Dirección
                  </label>

                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={datosEnvio.direccion}
                    onChange={manejarCambioEnvio}
                    placeholder="Calle, número exterior e interior"
                    required
                  />

                </div>


                {/* CIUDAD */}

                <div className="form-group">

                  <label htmlFor="ciudad">
                    Ciudad
                  </label>

                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    value={datosEnvio.ciudad}
                    onChange={manejarCambioEnvio}
                    placeholder="Ej. Monterrey"
                    required
                  />

                </div>


                {/* ESTADO */}

                <div className="form-group">

                  <label htmlFor="estado">
                    Estado
                  </label>

                  <input
                    type="text"
                    id="estado"
                    name="estado"
                    value={datosEnvio.estado}
                    onChange={manejarCambioEnvio}
                    placeholder="Ej. Nuevo León"
                    required
                  />

                </div>


                {/* CÓDIGO POSTAL */}

                <div className="form-group">

                  <label htmlFor="codigoPostal">
                    Código postal
                  </label>

                  <input
                    type="text"
                    id="codigoPostal"
                    name="codigoPostal"
                    value={datosEnvio.codigoPostal}
                    onChange={manejarCambioEnvio}
                    placeholder="Ej. 64000"
                    maxLength="5"
                    required
                  />

                </div>

              </div>

            </section>


            {/* =====================================
                MÉTODO DE PAGO
            ===================================== */}

            <section className="checkout-card">

              <div className="checkout-card-header">

                <div>
                  <h2>
                    Método de pago
                  </h2>

                  <p>
                    Selecciona cómo quieres realizar tu pago.
                  </p>
                </div>

              </div>


              {/* OPCIONES */}

              <div className="metodos-pago">


                {/* TARJETA */}

                <label
                  className={`metodo-pago-option ${
                    metodoPago === 'tarjeta'
                      ? 'metodo-pago-selected'
                      : ''
                  }`}
                >

                  <input
                    type="radio"
                    name="metodoPago"
                    value="tarjeta"
                    checked={metodoPago === 'tarjeta'}
                    onChange={manejarMetodoPago}
                  />

                  <div className="metodo-pago-icon">
                    <CreditCard size={25} strokeWidth={2} />
                  </div>

                  <div className="metodo-pago-info">

                    <strong>
                      Tarjeta
                    </strong>

                    <span>
                      Crédito o débito
                    </span>

                  </div>

                  <div className="metodo-pago-radio">
                    <span />
                  </div>

                </label>


                {/* TRANSFERENCIA */}

                <label
                  className={`metodo-pago-option ${
                    metodoPago === 'transferencia'
                      ? 'metodo-pago-selected'
                      : ''
                  }`}
                >

                  <input
                    type="radio"
                    name="metodoPago"
                    value="transferencia"
                    checked={metodoPago === 'transferencia'}
                    onChange={manejarMetodoPago}
                  />

                  <div className="metodo-pago-icon">
                    $
                  </div>

                  <div className="metodo-pago-info">

                    <strong>
                      Transferencia bancaria
                    </strong>

                    <span>
                      Realiza una transferencia desde tu banco
                    </span>

                  </div>

                  <div className="metodo-pago-radio">
                    <span />
                  </div>

                </label>

              </div>


              {/* =====================================
                  DATOS DE TARJETA
              ===================================== */}

              {metodoPago === 'tarjeta' && (

                <div className="pago-detalles">

                  <div className="pago-detalles-header">

                    <div>
                      <h3>
                        Información de la tarjeta
                      </h3>

                      <p>
                        Tus datos están protegidos.
                      </p>
                    </div>


                  </div>


                  {/* NÚMERO */}

                  <div className="form-group form-group-full">

                    <label htmlFor="numero">
                      Número de tarjeta
                    </label>

                    <input
                      type="text"
                      id="numero"
                      name="numero"
                      value={datosTarjeta.numero}
                      onChange={manejarCambioTarjeta}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      required
                    />

                  </div>


                  <div className="tarjeta-grid">

                    {/* NOMBRE */}

                    <div className="form-group">

                      <label htmlFor="nombreTarjeta">
                        Nombre en la tarjeta
                      </label>

                      <input
                        type="text"
                        id="nombreTarjeta"
                        name="nombre"
                        value={datosTarjeta.nombre}
                        onChange={manejarCambioTarjeta}
                        placeholder="JUAN PEREZ"
                        required
                      />

                    </div>


                    {/* VENCIMIENTO */}

                    <div className="form-group">

                      <label htmlFor="vencimiento">
                        Vencimiento
                      </label>

                      <input
                        type="text"
                        id="vencimiento"
                        name="vencimiento"
                        value={datosTarjeta.vencimiento}
                        onChange={manejarCambioTarjeta}
                        placeholder="MM/AA"
                        maxLength="5"
                        required
                      />

                    </div>


                    {/* CVV */}

                    <div className="form-group">

                      <label htmlFor="cvv">
                        CVV
                      </label>

                      <input
                        type="password"
                        id="cvv"
                        name="cvv"
                        value={datosTarjeta.cvv}
                        onChange={manejarCambioTarjeta}
                        placeholder="•••"
                        maxLength="4"
                        required
                      />

                    </div>

                  </div>

                </div>

              )}


              {/* =====================================
                  PAYPAL
              ===================================== */}

              {metodoPago === 'paypal' && (

                <div className="pago-mensaje">

                  <div className="pago-mensaje-icon">
                    P
                  </div>

                  <div>

                    <h3>
                      Pago con PayPal
                    </h3>

                    <p>
                      Al continuar serás dirigido a PayPal
                      para completar tu pago de forma segura.
                    </p>

                  </div>

                </div>

              )}


              {/* =====================================
                  TRANSFERENCIA
              ===================================== */}

              {metodoPago === 'transferencia' && (

                <div className="pago-mensaje">

                  <div className="pago-mensaje-icon">
                    $
                  </div>

                  <div>

                    <h3>
                      Transferencia bancaria
                    </h3>

                    <p>
                      Al confirmar tu pedido te mostraremos
                      los datos bancarios necesarios para
                      realizar la transferencia.
                    </p>

                  </div>

                </div>

              )}

            </section>

          </div>


          {/* =========================================
              RESUMEN
          ========================================= */}

          <aside className="checkout-resumen">

            <div className="resumen-header">

              <span>
                TU PEDIDO
              </span>

              <span className="resumen-items">
                {totalArticulos} {totalArticulos === 1 ? 'producto' : 'productos'}
              </span>

            </div>


            <div className="resumen-productos">

              {cargando ? (
                <p>Cargando productos...</p>
              ) : error ? (
                <p>{error}</p>
              ) : carrito.length === 0 ? (
                <p>Tu carrito está vacío.</p>
              ) : (
                carrito.map(({ id, cantidad, producto }) => (
                  <div className="resumen-producto" key={id}>

                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="resumen-producto-imagen"
                    />

                    <div className="resumen-producto-info">
                      <strong>{producto.nombre}</strong>
                      <span>Cantidad: {cantidad}</span>
                    </div>

                    <strong>
                      {dinero(Number(producto.precio) * cantidad * (
                        1 - Number(producto.descuento || 0) / 100
                      ))}
                    </strong>

                  </div>
                ))
              )}

            </div>


            <div className="resumen-totales">

              <div>
                <span>
                  Subtotal
                </span>

                <span>
                  {dinero(subtotal)}
                </span>
              </div>

              <div>
                <span>
                  Descuento
                </span>

                <span>
                  -{dinero(descuento)}
                </span>
              </div>

              <div>
                <span>
                  Envío
                </span>

                <span>
                  Gratis
                </span>
              </div>

            </div>


            <div className="resumen-total">

              <span>
                Total
              </span>

              <strong>
                {dinero(total)}
              </strong>

            </div>


          </aside>

        </form>


        {/* =========================================
            ACCIONES
        ========================================= */}

        <div className="datos-envio-acciones">

          <Link
            to="/carrito"
            className="datos-envio-volver"
          >
            ← Volver al carrito
          </Link>


          <button
            type="button"
            className="datos-envio-continuar"
            onClick={() => setMostrarConfirmacion(true)}
          >
            Confirmar
          </button>

        </div>

      </main>
      {mostrarConfirmacion && (
        <ConfirmarCompra
        onCancelar={() => setMostrarConfirmacion(false)}
        />
      )}
    
    </div>
    
  );
}

export default DatosEnvio;
