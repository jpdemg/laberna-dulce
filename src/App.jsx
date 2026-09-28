import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import InstitutionalPage from './pages/InstitutionalPage'
import NotFound from './pages/NotFound'
import './App.css'

function App() {
  return (
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
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
