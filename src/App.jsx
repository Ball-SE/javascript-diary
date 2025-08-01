import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/ui/Navbar.jsx'
import HeroSection from './components/ui/HeroSection.jsx'


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-[#F9F8F6] min-h-screen">
      <Navbar />
      <HeroSection />
    </div>

  )
}

export default App
