import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/DetalleProducto.css';
import Header from './Header';
import { useCarrito } from '../context/useCarrito';
import { useProductos } from '../context/useProductos';

function DetalleProducto() {
  const {id} =useParams();
  const { productos, cargando, error } = useProductos();
  const indiceActual= productos.findIndex(
    (item) => item.id ===id);
  const producto = productos.find((item) => String(item.id) === id);
  const productoAnterior= productos[indiceActual-1];
  const productoSiguiente = productos[indiceActual+1];
  const [cantidad, setCantidad] = useState(1);
  const {agregarAlCarrito} = useCarrito();


  if (cargando) {
    return <div className="detalle-error"><h2>Cargando producto...</h2></div>;
  }

  if (error || !producto) {
    return (
      <div className="detalle-error">
        <h2>El producto no existe.</h2>
        <Link to="/" className="btn-volver">
          ← Volver al catálogo
        </Link>
      </div>
    );
  }

  const aumentarCantidad = () => {
    setCantidad(cantidad + 1);
  };

  const disminuirCantidad = () => {
    if (cantidad > 1) {
      setCantidad(cantidad - 1);
    }
  };

  return (
    <div className="detalle-producto">

      {<Header/>}



      {/* =========================
          PRODUCTO
      ========================= */}

      <main className="product-page">

        {/* =========================
            IMAGEN
        ========================= */}
        
        <section className="product-gallery">
          {productoAnterior &&(
          <Link
          to={`/productos/${productoAnterior.id}`}
          className="gallery-arrow left">
            ‹
          </Link>
          )}

          <div className="image-container">

            <img
              src={producto.imagen}
              alt={producto.nombre}
              className="product-image"
            />
          </div>
          {productoSiguiente &&(
            <Link 
            to={`/productos/${productoSiguiente.id}`}
            className="gallery-arrow right"
            >
              ›
            </Link>
          )}
          <button className="zoom-button">
            +
          </button>

        </section>


        {/* =========================
            INFORMACIÓN
        ========================= */}

        <section className="product-info">

          <h1>
            {producto.nombre}
          </h1>


          {/* DESCRIPCIÓN */}

          <p className="description">
            {producto.desc}
          </p>


          {/* MARCA / ARTÍCULO */}

          <div className="brand">

            <span>
              UGREEN
            </span>

            <div></div>

            <small>
              Art: {producto.id}
            </small>

          </div>


          {/* CANTIDAD */}

          <div className="quantity-title">
            Cantidad:
          </div>

          <div className="quantity-control">

            <button
              onClick={disminuirCantidad}
              aria-label="Disminuir cantidad"
            >
              −
            </button>

            <span>
              {cantidad}
            </span>

            <button
              onClick={aumentarCantidad}
              aria-label="Aumentar cantidad"
            >
              +
            </button>

          </div>


          {/* STOCK */}

          <div className="stock">
            En existencia, listo para enviar
          </div>


          {/* PRECIO */}

          <div className="price">
            $ {producto.precio} MXN
          </div>


          {/* CARRITO */}

          <button className="add-cart" onClick={()=> agregarAlCarrito(producto,cantidad)}>

            <span className="cart-small">
              🛒
            </span>

            Añadir al carrito

          </button>


          {/* VOLVER */}

          <Link
            to="/"
            className="btn-volver"
          >
            
            ← Volver al catálogo
          </Link>

        </section>

      </main>


      {/* =========================
          WHATSAPP
      ========================= */}

      <button className="whatsapp">
        <span>
          <img
          src='https://cdn.pixabay.com/photo/2015/08/03/13/58/whatsapp-873316_1280.png'
          alt='whatssap'
          className='whatsapp-img'> 
          </img>
        </span>
      </button>


    </div>
  );
}

export default DetalleProducto;