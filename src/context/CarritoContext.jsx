import { useEffect, useState } from 'react';
import CarritoContext from './CarritoContextValue';

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const guardado = localStorage.getItem('carrito');
    return guardado ? JSON.parse(guardado) : [];
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  const agregarAlCarrito = (producto,cantidad = 1) => {
    setCarrito((carritoActual) => {
      const existe = carritoActual.find(
        (item) => item.id === producto.id
      );

      if (existe) {
        return carritoActual.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }

      return [
        ...carritoActual,
        {
          ...producto,
          id: producto.id,
          cantidad: cantidad
        }
      ];
    });
  };

  const cambiarCantidad = (id, cantidad) => {
    setCarrito((carritoActual) => {
      if (cantidad <= 0) {
        return carritoActual.filter((item) => item.id !== id);
      }

      return carritoActual.map((item) =>
        item.id === id ? { ...item, cantidad } : item
      );
    });
  };

  const quitarDelCarrito = (id) => {
    setCarrito((carritoActual) =>
      carritoActual.filter((item) => item.id !== id)
    );
  };

  const vaciarCarrito = () => setCarrito([]);

  const total = carrito.reduce(
    (acumulado, item) => acumulado + item.precio * item.cantidad,
    0
  );

  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        cambiarCantidad,
        quitarDelCarrito,
        vaciarCarrito,
        total
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
}