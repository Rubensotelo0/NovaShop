import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ListaProductos from './components/ListaProductos';
import DetalleProducto from './components/DetalleProducto';
import PageTransition from './components/PageTransition';
import Favoritos from './components/Favoritos';
import Carrito from './components/Carrito';
import { CarritoProvider } from './context/CarritoProvider';
import { ProductosProvider } from './context/ProductosProvider';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <ProductosProvider>
      <CarritoProvider>
      <PageTransition>
        <Routes>
          <Route path="/" element={<ListaProductos />} />
          <Route path="/productos/:id" element={<DetalleProducto />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="/carrito" element={<Carrito />}/>
          <Route path="/login" element={<Login />} />
        </Routes>
      </PageTransition>
      </CarritoProvider>  
      </ProductosProvider>
    </BrowserRouter>
  );
}

export default App;
