import LogInForm from '../components/forms/LoginForm';
import {Navbar} from '../components/ui/Navbar';
import {Footer} from '../components/ui/Footer';

function LogInPage(){

    return (
        <div className="h-screen bg-[#F9F8F6] flex flex-col">
            <Navbar />
            <main className="flex-grow overflow-y-auto">
                <LogInForm />
            </main>
            <Footer />
        </div>
    )
}

export default LogInPage;