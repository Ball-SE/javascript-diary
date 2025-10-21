import {Navbar} from '../components/ui/Navbar'
import {HeroSection} from '../components/ui/HeroSection'
import ArticleSection from '../components/ui/ArticleSection'
import {Footer} from '../components/ui/Footer'

function HomePage(){
    return (
        <div className="h-screen bg-[#F9F8F6] flex flex-col">
            <Navbar />
            <main className="flex-grow overflow-y-auto">
                <HeroSection />
                <ArticleSection />
            </main>
            <Footer />
        </div>
    )
}

export default HomePage;