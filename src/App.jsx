import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import DetalleProducto from './components/DetalleProducto';
import PageTransition from './components/PageTransition';
import Favoritos from './components/Favoritos';
import Carrito from './components/Carrito';
import { CarritoProvider } from './context/CarritoProvider';
import { ProductosProvider } from './context/ProductosProvider';
import DatosEnvio from './components/DatosEnvio';
import Perfil from './components/Perfil';
import  ProtectRoute from './components/ProtectedRoute';
import { AuthProvider } from './components/AuthContext';
import Auth from './components/Auth';


function App() {
  return (
    <BrowserRouter>
    <AuthProvider>
      <ProductosProvider>
        <CarritoProvider>
          <PageTransition>
            <Routes>

              <Route path="/" element={<HomePage />}/>
              <Route path="/perfil" element={
                <ProtectRoute>
                  <Perfil/>
                </ProtectRoute>
              }/>
              <Route path="/datosEnv" element={
                <ProtectRoute><DatosEnvio/></ProtectRoute>}/>
              <Route path="/productos/:id" element={<DetalleProducto />}/>
              <Route path="/favoritos" element={<ProtectRoute><Favoritos/></ProtectRoute>} />
              <Route path="/carrito" element={<ProtectRoute><Carrito /></ProtectRoute>}/>
              <Route path="/login" element={<Auth/>}/>
              <Route path="/registro" element={<Auth/>}/>

            </Routes>
          </PageTransition>
        </CarritoProvider>
      </ProductosProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
