import { apiRequest } from './api';

export function getCarrito() {
  return apiRequest('/carrito', {}, 'No se pudo cargar el carrito');
}

export function addItemToCarrito(productoId, cantidad) {
  return apiRequest('/carrito/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      productoId: Number(productoId),
      cantidad
    })
  }, 'No se pudo agregar el producto al carrito');
}

export function updateCantidadCarrito(productoId, cantidad) {
  return apiRequest(`/carrito/items/${productoId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ cantidad })
  }, 'No se pudo actualizar la cantidad');
}

export function removeItemFromCarrito(productoId) {
  return apiRequest(`/carrito/items/${productoId}`, {
    method: 'DELETE'
  }, 'No se pudo quitar el producto del carrito');
}

export function clearCarrito() {
  return apiRequest('/carrito', {
    method: 'DELETE'
  }, 'No se pudo vaciar el carrito');
}
