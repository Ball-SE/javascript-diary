import LogInForm from '../components/ui/LogInForm';
import {Navbar} from '../components/ui/Navbar';
import {Footer} from '../components/ui/Footer';
import {useNavigate} from 'react-router-dom';

function LogInPage(){
    const navigate = useNavigate();
    const handleSignUp = () => {
        navigate('/signup');
    }

    return (
        <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <LogInForm />
            </main>
            <Footer />
        </div>
    )
}

export default LogInPage;