import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import InstitutionalPage from './pages/InstitutionalPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Account from './pages/Account'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderStatus from './pages/OrderStatus'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter basename="/laberna-dulce">
          <ScrollToTop />
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="bolos" element={<CategoryPage slug="bolos" />} />
              <Route path="sobremesas" element={<CategoryPage slug="sobremesas" />} />
              <Route path="docinhos" element={<CategoryPage slug="docinhos" />} />
              <Route path="linha-to-go" element={<CategoryPage slug="linha-to-go" />} />
              <Route path="atelie" element={<InstitutionalPage slug="atelie" />} />
              <Route path="festas-e-eventos" element={<InstitutionalPage slug="festas-e-eventos" />} />
              <Route path="personalizados" element={<InstitutionalPage slug="personalizados" />} />
              <Route path="presentes" element={<InstitutionalPage slug="presentes" />} />
              <Route path="login" element={<Login />} />
              <Route path="cadastro" element={<SignUp />} />
              <Route
                path="conta"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route path="carrinho" element={<Cart />} />
              <Route
                path="checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route path="pedido-confirmado" element={<OrderStatus />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
