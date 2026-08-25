import { useEffect, useState } from 'react';
import ProductosContext from './ProductosContext';

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const cargarProductos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/productos');

        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos');
        }

        const productosActualizados = await response.json();

        if (activo) {
          setProductos(productosActualizados);
          setError('');
        }
      } catch (requestError) {
        if (activo) {
          setError(requestError.message);
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    };

    cargarProductos();
    const intervalo = setInterval(cargarProductos, 5000);

    return () => {
      activo = false;
      clearInterval(intervalo);
    };
  }, []);

  return (
    <ProductosContext.Provider value={{ productos, cargando, error }}>
      {children}
    </ProductosContext.Provider>
  );
}
