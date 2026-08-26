import { useEffect, useState } from 'react';
import CarritoContext from './CarritoContext';
import {
  addItemToCarrito,
  clearCarrito,
  getCarrito,
  removeItemFromCarrito,
  updateCantidadCarrito
} from '../services/carritoService';

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

  const aplicarCarrito = (data) => {
    const carritoNormalizado = normalizarCarrito(data);
    setCarrito(carritoNormalizado.carrito);
    setTotal(carritoNormalizado.total);
    setTotalArticulos(carritoNormalizado.totalArticulos);
    setError('');
  };

  const cargarCarrito = async () => {
    try {
      aplicarCarrito(await getCarrito());
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
      aplicarCarrito(await addItemToCarrito(producto.id, cantidad));
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const cambiarCantidad = async (id, cantidad) => {
    try {
      aplicarCarrito(await updateCantidadCarrito(id, cantidad));
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const quitarDelCarrito = async (id) => {
    try {
      aplicarCarrito(await removeItemFromCarrito(id));
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  const vaciarCarrito = async () => {
    try {
      aplicarCarrito(await clearCarrito());
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
