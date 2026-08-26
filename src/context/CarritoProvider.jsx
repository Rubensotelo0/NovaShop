import { useEffect, useState } from 'react';
import CarritoContext from './CarritoContext';

const API_URL = 'http://localhost:3000/api/carrito';

function normalizarCarrito(data) {
  return {
    carrito: Array.isArray(data?.items) ? data.items : [],
    total: Number(data?.total || 0),
    totalArticulos: Number(data?.totalArticulos || 0)
  };
}

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalArticulos, setTotalArticulos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const getErrorMessage = async (response, defaultMessage) => {
    try {
      const data = await response.json();
      return data?.message || defaultMessage;
    } catch {
      return defaultMessage;
    }
  };

  const aplicarCarrito = (data) => {
    const carritoNormalizado = normalizarCarrito(data);
    setCarrito(carritoNormalizado.carrito);
    setTotal(carritoNormalizado.total);
    setTotalArticulos(carritoNormalizado.totalArticulos);
    setError('');
  };

  const cargarCarrito = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error('No se pudo cargar el carrito');
      }

      const data = await response.json();
      aplicarCarrito(data);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarCarrito();
  }, []);

  const agregarAlCarrito = async (producto, cantidad = 1) => {
    try {
      const response = await fetch(`${API_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productoId: Number(producto.id),
          cantidad
        })
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, 'No se pudo agregar el producto al carrito')
        );
      }

      aplicarCarrito(await response.json());
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const cambiarCantidad = async (id, cantidad) => {
    try {
      const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cantidad })
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, 'No se pudo actualizar la cantidad')
        );
      }

      aplicarCarrito(await response.json());
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const quitarDelCarrito = async (id) => {
    try {
      const response = await fetch(`${API_URL}/items/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, 'No se pudo quitar el producto del carrito')
        );
      }

      aplicarCarrito(await response.json());
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const vaciarCarrito = async () => {
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error(
          await getErrorMessage(response, 'No se pudo vaciar el carrito')
        );
      }

      aplicarCarrito(await response.json());
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        cambiarCantidad,
        quitarDelCarrito,
        vaciarCarrito,
        total,
        totalArticulos,
        cargando,
        error,
        recargarCarrito: cargarCarrito
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
