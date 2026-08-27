import { apiRequest } from './api';

export function getCategorias() {
  return apiRequest('/categorias', {}, 'No se pudieron cargar las categorías');
}
