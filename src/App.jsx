import './App.css'
import {Navbar} from './components/ui/Navbar.jsx'
import {HeroSection} from './components/ui/HeroSection.jsx'
import {Footer} from './components/ui/Footer.jsx'
import ArticleSection from './components/ui/ArticleSection.jsx'

function App() {

  return (
    <div className="bg-[#F9F8F6]">
      <Navbar />
      <HeroSection />
      <ArticleSection />
      <Footer />
    </div>

  )
}

export default App
