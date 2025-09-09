import {Navbar} from '../components/ui/Navbar'
import {Footer} from '../components/ui/Footer'
import {useNavigate} from 'react-router-dom'
import SignUpForm from '../components/forms/SignUpForm'

function SignUp(){
    const navigate = useNavigate();
    const handleNavigate = () => {
        navigate('/');
    }

    return (
        <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
            <Navbar />
            <main className="flex-grow">
                <SignUpForm />
            </main>
            <Footer />
        </div>
    )
}

export default SignUp;