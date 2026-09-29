import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import InstitutionalPage from './pages/InstitutionalPage'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AccountLayout from './components/AccountLayout'
import AccountProfile from './pages/AccountProfile'
import AccountOrders from './pages/AccountOrders'
import AdminLayout from './components/AdminLayout'
import AdminProducts from './pages/AdminProducts'
import AdminProductForm from './pages/AdminProductForm'
import AdminOrders from './pages/AdminOrders'
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
              <Route path="produto/:id" element={<ProductDetail />} />
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
                    <AccountLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AccountProfile />} />
                <Route path="pedidos" element={<AccountOrders />} />
              </Route>
              <Route
                path="admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<AdminProducts />} />
                <Route path="produtos/novo" element={<AdminProductForm />} />
                <Route path="produtos/:id" element={<AdminProductForm />} />
                <Route path="pedidos" element={<AdminOrders />} />
              </Route>
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
