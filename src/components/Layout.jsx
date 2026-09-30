import { Outlet, useLocation } from 'react-router-dom'
import TopBar from './TopBar'
import Header from './Header'
import Footer from './Footer'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Layout() {
  useScrollReveal()
  const location = useLocation()

  return (
    <div id="topo">
      <TopBar />
      <Header />
      <main>
        <div key={location.pathname} className="page-transition">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}
