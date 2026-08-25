import { Link } from 'react-router-dom';
import { useCarrito } from '../context/useCarrito';

function ProductoCard({ prod, index, favorito, onToggleFavorito }) {
  const { agregarAlCarrito } = useCarrito();

  return (
    <article className="producto-card">
      <Link
        to={`/productos/${prod.id}`}
        className="producto-card-link"
        aria-label={`Ver detalles de ${prod.nombre}`}
      />

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

        <button
        className={`btn-favorito ${favorito ? 'activo' : ''}`}
        aria-label={
            favorito
            ? 'Quitar de favoritos'
            : 'Agregar a favoritos'
        }
        onClick={() => onToggleFavorito(prod.id)}
        >
        <svg
            className="corazon"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
        </button>

      </div>

      <div className="producto-info">

        <span className="producto-categoria">
          COLECCIÓN NOVA
        </span>

        <h2 className="producto-nombre">
          {prod.nombre}
        </h2>

        <p className="producto-desc">
          {prod.desc}
        </p>

        <div className="producto-footer">

          <div>
            <span className="precio-label">
              Precio
            </span>

            <p className="producto-precio">
              {'$' + prod.precio.toFixed(2)}
            </p>
          </div>

          <button
            className="btn-agregar-carrito"
            onClick={() => agregarAlCarrito(prod)}
          >
            🛒
        </button>

        </div>

      </div>

    </article>
  );
}

export default ProductoCard;