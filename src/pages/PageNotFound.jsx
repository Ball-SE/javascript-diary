import { Link } from "react-router-dom";
import { Navbar } from "../components/ui/Navbar.jsx";
import { Footer } from "../components/ui/Footer.jsx";

function PageNotFound() {
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#26231E] mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-[#26231E] mb-4">
              Page Not Found
            </h2>
          </div>
          
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-[#26231E] text-white rounded-full hover:bg-[#1a1a1a] transition-colors duration-200"
            >
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default PageNotFound;