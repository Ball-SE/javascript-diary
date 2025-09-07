import {Navbar} from '../components/ui/Navbar.jsx'
import {HeroSection} from '../components/ui/HeroSection.jsx'
import ArticleSection from '../components/ui/ArticleSection.jsx'
import {Footer} from '../components/ui/Footer.jsx'

function HomePage(){
    return (
        <div className="min-h-screen bg-[#F9F8F6]">
            <Navbar />
            <main className="flex-grow">
                <HeroSection />
                <ArticleSection />
            </main>
            <Footer />
        </div>
    )
}

export default HomePage;