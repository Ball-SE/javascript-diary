import {useNavigate} from 'react-router-dom';
import { useState } from 'react';
import { validateLogIn } from '../../utils/validation.js';
import { useAuth } from '../../hooks/useAuth';

function LogInForm(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const { login } = useAuth();

    const navigate = useNavigate();

    const handleSignUp = (event) => {
        event.preventDefault();
        navigate('/signup');
    }

    const handleLogIn = (event) => {
        event.preventDefault();
        const isValid = validateLogIn(
            email, 
            password, 
            setEmailError, 
            setPasswordError);
        if (isValid) {
            login({email, password});
        }
    }

    return (
        <div className="bg-[#F9F8F6] min-h-screen flex items-center justify-center px-4">
            <form className="bg-[#EFEEEB] rounded-lg p-8 w-[50%] shadow-lg" onSubmit={handleLogIn}>
                <h2 className="text-4xl font-semibold text-[#26231E] text-center mb-8">Log in</h2>
                
                <div className="space-y-6 px-20">
                    <div>
                        <label htmlFor="email" className="block text-base font-medium text-[#75716B] mb-2">
                            Email
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="Email"
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#75716B] text-base font-medium"
                            onChange={(event) => setEmail(event.target.value)}
                            value={email}
                        />
                        {emailError && <p className="text-[#FF0000] text-[12px] font-medium">{emailError}</p>}
                    </div>
                    
                    <div>
                        <label htmlFor="password" className="block text-base font-medium text-[#75716B] mb-2">
                            Password
                        </label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Password"
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#75716B] text-base font-medium"
                            onChange={(event) => setPassword(event.target.value)}
                            value={password}
                        />
                        {passwordError && <p className="text-[#FF0000] text-[12px] font-medium">{passwordError}</p>}
                    </div>
                    
                    <div className="flex justify-center">
                        <button 
                            type="submit"
                            className="bg-[#26231E] w-[30%] text-white py-3 px-4 rounded-full font-medium cursor-pointer"
                        >
                            Log in
                        </button>
                    </div>
                </div>
                
                <div className="text-center mt-6">
                    <p className="text-[#75716B]">
                        Don't have any account?{' '}
                        <button 
                            onClick={handleSignUp}
                            className="text-[#26231E] underline hover:text-[#1a1a1a] transition-colors duration-200 cursor-pointer"
                        >
                            Sign up
                        </button>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default LogInForm;