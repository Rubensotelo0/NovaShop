import { apiRequest } from './api';

export function getProductos(termino = '') {
  const parametros = new URLSearchParams();

  if (termino.trim()) {
    parametros.set('q', termino.trim());
  }

  const query = parametros.toString();
  const ruta = query ? `/productos?${query}` : '/productos';

  return apiRequest(ruta, {}, 'No se pudieron cargar los productos');
}
