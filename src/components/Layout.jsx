import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Header from './Header'
import Footer from './Footer'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Layout() {
  useScrollReveal()

  return (
    <div id="topo">
      <TopBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
