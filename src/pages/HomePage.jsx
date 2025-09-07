import {Navbar} from '../components/ui/Navbar'
import {HeroSection} from '../components/ui/HeroSection'
import ArticleSection from '../components/ui/ArticleSection'
import {Footer} from '../components/ui/Footer'

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