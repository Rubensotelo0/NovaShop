import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../styles/Carrito.css';
import '../styles/DatosEnvio.css';


function DatosEnvio() {

  const [datosEnvio, setDatosEnvio] = useState({
    nombre: '',
    apellido: '',
    direccion: '',
    ciudad: '',
    estado: '',
    codigoPostal: ''
  });

  const [metodoPago, setMetodoPago] = useState('');


  const manejarCambio = (e) => {
    const { name, value } = e.target;

    setDatosEnvio({
      ...datosEnvio,
      [name]: value
    });
  };


  const manejarEnvio = (e) => {
    e.preventDefault();

    console.log('Datos de envío:', datosEnvio);
    console.log('Método de pago:', metodoPago);
  };


  return (

    <div className="datos-envio-page">

      {/* HEADER PRINCIPAL */}
      <Header />


      {/* CONTENIDO */}
      <main className="datos-envio-shell">


        {/* PROGRESO DE CHECKOUT */}

        <div
          className="checkout-progress"
          aria-label="Progreso de compra"
        >

          {/* PASO 1 */}

          <div className="checkout-step">

            <span className="checkout-step-circle">
              1
            </span>

            <span className="checkout-step-label">
              Carrito
            </span>

          </div>


          <div className="checkout-progress-line" />


          {/* PASO 2 */}

          <div className="checkout-step checkout-step-active">

            <span className="checkout-step-circle">
              2
            </span>

            <span className="checkout-step-label">
              Datos de envío
            </span>

          </div>


          <div className="checkout-progress-line" />


          {/* PASO 3 */}

          <div className="checkout-step">

            <span className="checkout-step-circle">
              3
            </span>

            <span className="checkout-step-label">
              Comprar
            </span>

          </div>

        </div>


        {/* FORMULARIO */}

        <section className="datos-envio-contenido">


          {/* ENCABEZADO */}

          <div className="datos-envio-header">

            <h1>
              Datos de envío
            </h1>

            <p>
              Ingresa los datos donde quieres recibir tu pedido.
            </p>

          </div>


          {/* FORM */}

          <form
            className="datos-envio-form"
            onSubmit={manejarEnvio}
          >


            {/* NOMBRE */}

            <div className="form-group">

              <label htmlFor="nombre">
                Nombre
              </label>

              <input
                type="text"
                id="nombre"
                name="nombre"
                value={datosEnvio.nombre}
                onChange={manejarCambio}
                placeholder="Ingresa tu nombre"
              />

            </div>


            {/* APELLIDO */}

            <div className="form-group">

              <label htmlFor="apellido">
                Apellido
              </label>

              <input
                type="text"
                id="apellido"
                name="apellido"
                value={datosEnvio.apellido}
                onChange={manejarCambio}
                placeholder="Ingresa tu apellido"
              />

            </div>


            {/* DIRECCIÓN */}

            <div className="form-group">

              <label htmlFor="direccion">
                Dirección
              </label>

              <input
                type="text"
                id="direccion"
                name="direccion"
                value={datosEnvio.direccion}
                onChange={manejarCambio}
                placeholder="Calle y número"
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
                onChange={manejarCambio}
                placeholder="Ingresa tu ciudad"
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
                onChange={manejarCambio}
                placeholder="Ingresa tu estado"
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
                onChange={manejarCambio}
                placeholder="Ej. 64000"
              />

            </div>


            {/* MÉTODO DE PAGO */}

            <div className="datos-envio-pago">

              <h2>
                Método de pago
              </h2>


              {/* TARJETA */}

              <label className="metodo-pago-option">

                <input
                  type="radio"
                  name="metodoPago"
                  value="tarjeta"
                  checked={metodoPago === 'tarjeta'}
                  onChange={(e) =>
                    setMetodoPago(e.target.value)
                  }
                />

                <span>
                  Tarjeta
                </span>

              </label>


              {/* PAYPAL */}

              <label className="metodo-pago-option">

                <input
                  type="radio"
                  name="metodoPago"
                  value="paypal"
                  checked={metodoPago === 'paypal'}
                  onChange={(e) =>
                    setMetodoPago(e.target.value)
                  }
                />

                <span>
                  PayPal
                </span>

              </label>


              {/* TRANSFERENCIA */}

              <label className="metodo-pago-option">

                <input
                  type="radio"
                  name="metodoPago"
                  value="transferencia"
                  checked={metodoPago === 'transferencia'}
                  onChange={(e) =>
                    setMetodoPago(e.target.value)
                  }
                />

                <span>
                  Transferencia bancaria
                </span>

              </label>

            </div>


            {/* BOTONES */}

            <div className="datos-envio-acciones">

              <Link
                to="/carrito"
                className="datos-envio-volver"
              >
                Volver al carrito
              </Link>


              <button
                to="/confirmCompra"
                type="submit"
                className="datos-envio-continuar"
              >
                Continuar
              </button>

            </div>

          </form>

        </section>

      </main>

    </div>
  );
}

export default DatosEnvio;