import { apiRequest } from './api';

export function getProductos() {
  return apiRequest('/productos', {}, 'No se pudieron cargar los productos');
}
