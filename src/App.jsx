import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListaProductos from './components/ListaProductos';
import DetalleProducto from './components/DetalleProducto';
import PageTransition from './components/PageTransition';
import Favoritos from './components/Favoritos';
import Carrito from './components/Carrito';
import { CarritoProvider } from './context/CarritoContext';

function App() {
  return (
    <BrowserRouter>
      <CarritoProvider>
      <PageTransition>
        <Routes>
          <Route path="/" element={<ListaProductos />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/carrito" element={<Carrito />}/>
        </Routes>
      </PageTransition>
      </CarritoProvider>  
    </BrowserRouter>
  );
}

export default App;
