import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useCarrito } from '../context/useCarrito';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

function ProductoCard({ prod, index, favorito, onToggleFavorito }) {
  const { agregarAlCarrito, carrito } = useCarrito();
  const {user} = useAuth();
  const navigate = useNavigate();

  const itemEnCarrito = carrito.find(
    (item) => String(item.id) === String(prod.id)
  );

  const cantidadEnCarrito = itemEnCarrito?.cantidad || 0;
  const sinStock = cantidadEnCarrito >= prod.stock;

  const [animandoCarrito, setAnimandoCarrito] = useState(false);
  const [ultimoAgregado, setUltimoAgregado] = useState(0);

  const cantidadAnterior = useRef(cantidadEnCarrito);

  useEffect(() => {
    if (cantidadEnCarrito > cantidadAnterior.current) {
      setAnimandoCarrito(true);
      setUltimoAgregado(
        cantidadEnCarrito - cantidadAnterior.current
      );

      const timer = setTimeout(() => {
        setAnimandoCarrito(false);
        setUltimoAgregado(0);
      }, 900);

      cantidadAnterior.current = cantidadEnCarrito;

      return () => clearTimeout(timer);
    }

    cantidadAnterior.current = cantidadEnCarrito;
  }, [cantidadEnCarrito]);

  return (
    <article
      className={`producto-card ${
        animandoCarrito ? 'producto-card-agregado' : ''
      }`}
    >
      {/* LINK PARA VER EL PRODUCTO */}
      <Link
        to={`/productos/${prod.id}`}
        className="producto-card-link"
        aria-label={`Ver detalles de ${prod.nombre}`}
      />

      {/* IMAGEN */}
      <div className="producto-imagen producto-imagen-hover">

        <span className="producto-badge">
          {index < 2 ? 'Nuevo' : 'Popular'}
        </span>

        <div>
          <img
            src={prod.imagen}
            alt={prod.nombre}
            className="producto-placeholder-img"
          />
        </div>

        {/* FAVORITO */}
        <button
          className={`btn-favorito ${
            favorito ? 'activo' : ''
          }${!user ? 'btn-invitado':''}`}
          aria-label={
            favorito
              ? 'Quitar de favoritos'
              : 'Agregar a favoritos'
          }
          onClick={() => {
            if(!user){
              navigate('/login');
              return;
            }
            onToggleFavorito(prod.id)
          }}
        >
          <svg
            className="corazon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>

        {/* RESUMEN DEL CARRITO */}
        {cantidadEnCarrito > 0 && (
          <div
            className={`producto-carrito-resumen ${
              animandoCarrito ? 'activo' : ''
            }`}
          >
            <strong>{cantidadEnCarrito}</strong>
            <span>agregados</span>
          </div>
        )}

        {/* ANIMACIÓN DE PRODUCTO AGREGADO */}
        {ultimoAgregado > 0 && (
          <div className="producto-agregado-burst">
            +{ultimoAgregado}
          </div>
        )}

      </div>

      {/* INFORMACIÓN DEL PRODUCTO */}
      <div className="producto-info">

        {/* DESCUENTO */}
        <div className="producto-descuento-container">
          {prod.descuento > 0 ? (
            <div className="producto-descuento">
              -{prod.descuento}%
            </div>
          ) : (
            <div className="producto-descuento-placeholder"></div>
          )}
        </div>

        {/* MARCA */}
        <span className="producto-categoria">
          {prod.categoriaNombre || 'COLECCIÓN NOVA'}
        </span>

        {/* NOMBRE */}
        <h2 className="producto-nombre">
          {prod.nombre}
        </h2>

        {/* FOOTER DE LA CARD */}
        <div className="producto-footer">

          {/* PRECIOS */}
          <div className="producto-precios">

            {prod.descuento > 0 && (
              <span className="producto-precio-original">
                ${prod.precio.toFixed(2)}
              </span>
            )}

            <p className="producto-precio">
              $
              {(
                prod.precio *
                (1 - prod.descuento / 100)
              ).toFixed(2)}
            </p>

          </div>

          {/* BOTÓN CARRITO */}
          <button
            className={`btn-agregar-carrito ${
              animandoCarrito ? 'agregado' : ''
            }${!user ? 'btn-invitado' :  ''}`}
            onClick={() =>{
              if (!user){
                navigate('/login')
                return;
              }
              agregarAlCarrito(prod)
            }
            }
            disabled={sinStock}
            aria-label={
              sinStock
                ? `${prod.nombre} sin existencias disponibles`
                : `Agregar ${prod.nombre} al carrito`
            }
          >
            {sinStock ? (
              'Agotado'
            ) : (
              <ShoppingCart
                size={21}
                strokeWidth={2}
                aria-hidden="true"
              />
            )}
          </button>

        </div>

      </div>
    </article>
  );
}

export default ProductoCard;