import { useContext } from 'react';
import CarritoContext from './CarritoContextValue';

export function useCarrito() {
  return useContext(CarritoContext);
}
