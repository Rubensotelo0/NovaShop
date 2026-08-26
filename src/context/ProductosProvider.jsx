import { useEffect, useState } from 'react';
import ProductosContext from './ProductosContext';
import { getProductos } from '../services/productosService';

export function ProductosProvider({ children }) {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const cargarProductos = async () => {
      try {
        const productosActualizados = await getProductos();

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
