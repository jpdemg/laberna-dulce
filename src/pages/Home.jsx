import Hero from '../components/Hero'
import FeatureBanners from '../components/FeatureBanners'
import Categories from '../components/Categories'
import NewIn from '../components/NewIn'
import Seasonal from '../components/Seasonal'
import BestSellers from '../components/BestSellers'
import About from '../components/About'
import Differentials from '../components/Differentials'
import InstagramFeed from '../components/InstagramFeed'

export default function Home() {
  return (
    <>
      <Hero />
      <FeatureBanners />
      <Categories />
      <NewIn />
      <Seasonal />
      <BestSellers />
      <About />
      <Differentials />
      <InstagramFeed />
    </>
  )
}
