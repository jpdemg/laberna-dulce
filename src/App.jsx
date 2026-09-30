import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute'
import ProtectedAdminRoute from './components/ProtectedAdminRoute'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const CategoryPage = lazy(() => import('./pages/CategoryPage'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const InstitutionalPage = lazy(() => import('./pages/InstitutionalPage'))
const Faq = lazy(() => import('./pages/Faq'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const AccountLayout = lazy(() => import('./components/AccountLayout'))
const AccountProfile = lazy(() => import('./pages/AccountProfile'))
const AccountOrders = lazy(() => import('./pages/AccountOrders'))
const AdminLayout = lazy(() => import('./components/AdminLayout'))
const AdminProducts = lazy(() => import('./pages/AdminProducts'))
const AdminProductForm = lazy(() => import('./pages/AdminProductForm'))
const AdminOrders = lazy(() => import('./pages/AdminOrders'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderStatus = lazy(() => import('./pages/OrderStatus'))
const NotFound = lazy(() => import('./pages/NotFound'))

function RouteFallback() {
  return <div className="route-fallback">Carregando...</div>
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter basename="/laberna-dulce">
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
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
                <Route path="faq" element={<Faq />} />
                <Route path="login" element={<Login />} />
                <Route path="cadastro" element={<SignUp />} />
                <Route path="esqueci-senha" element={<ForgotPassword />} />
                <Route path="redefinir-senha" element={<ResetPassword />} />
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
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
