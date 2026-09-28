import TopBar from './components/TopBar'
import Header from './components/Header'
import Hero from './components/Hero'
import FeatureBanners from './components/FeatureBanners'
import Categories from './components/Categories'
import NewIn from './components/NewIn'
import Seasonal from './components/Seasonal'
import BestSellers from './components/BestSellers'
import About from './components/About'
import Differentials from './components/Differentials'
import InstagramFeed from './components/InstagramFeed'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div id="topo">
      <TopBar />
      <Header />
      <main>
        <Hero />
        <FeatureBanners />
        <Categories />
        <NewIn />
        <Seasonal />
        <BestSellers />
        <About />
        <Differentials />
        <InstagramFeed />
      </main>
      <Footer />
    </div>
  )
}

export default App
