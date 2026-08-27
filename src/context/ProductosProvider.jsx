import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductosContext from './ProductosContext';
import { getProductos } from '../services/productosService';
import { getCategorias } from '../services/categoriasService';

export function ProductosProvider({ children }) {
  const [searchParams] = useSearchParams();
  const terminoBusqueda = searchParams.get('q') || '';
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    const cargarProductos = async () => {
      try {
        const productosActualizados = await getProductos(terminoBusqueda);

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
  }, [terminoBusqueda]);

  useEffect(() => {
    let activo = true;

    const cargarCategorias = async () => {
      try {
        const categoriasActualizadas = await getCategorias();

        if (activo) {
          setCategorias(categoriasActualizadas);
        }
      } catch (requestError) {
        if (activo) {
          setError(requestError.message);
        }
      }
    };

    cargarCategorias();

    return () => {
      activo = false;
    };
  }, []);

  return (
    <ProductosContext.Provider value={{ productos, categorias, cargando, error }}>
      {children}
    </ProductosContext.Provider>
  );
}
