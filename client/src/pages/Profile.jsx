import { Navbar } from '../components/ui/Navbar';
import { Footer } from '../components/ui/Footer';
import { ProfileForm } from '../components/forms/ProfileForm';

function Profile() {
    return (
        <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
            <Navbar />
            <ProfileForm />
            <Footer />
        </div>
    )
}

export default Profile;