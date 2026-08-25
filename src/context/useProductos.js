import { useContext } from 'react';
import ProductosContext from './ProductosContext';

export function useProductos() {
  return useContext(ProductosContext);
}