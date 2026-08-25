import { useContext } from 'react';
import CarritoContext from './CarritoContext';

export function useCarrito() {
  return useContext(CarritoContext);
}
