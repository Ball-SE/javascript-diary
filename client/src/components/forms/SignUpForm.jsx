import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { validateSignUp } from '../../utils/validation.js';
import { useAuth } from '../../context/authentication.jsx';

function SignUpForm(){

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nameError, setNameError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    const { register } = useAuth();
    
    const handleLoginClick = (event) => {
        event.preventDefault();
        navigate('/login');
    };

    const handleSignUp = (event) => {
        event.preventDefault();
        const isValid = validateSignUp(
            name, 
            username, 
            email, 
            password, 
            setNameError, 
            setUsernameError, 
            setEmailError, 
            setPasswordError);
        if (isValid) {
            register({name, username, email, password});
        }
    }

    return (
        <div className="bg-[#F9F8F6] min-h-screen flex items-center justify-center px-4">
            <form className="bg-[#EFEEEB] rounded-lg p-8 w-[50%] shadow-lg" onSubmit={handleSignUp}>
                <h2 className="text-4xl font-semibold text-[#26231E] text-center mb-8">Sign up</h2>
                
                <div className="space-y-6 px-20">
                    <div>
                        <label htmlFor="name" className="block text-base font-medium text-[#75716B] mb-2">
                            Name
                        </label>
                        <input 
                            type="text" 
                            id="name" 
                            placeholder="Full name"
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#75716B] text-base font-medium"
                            onChange={(event) => setName(event.target.value)}
                            value={name}
                        />
                        {nameError && <p className="text-[#FF0000] text-[12px] font-medium">{nameError}</p>}
                    </div>
                    
                    <div>
                        <label htmlFor="username" className="block text-base font-medium text-[#75716B] mb-2">
                            Username
                        </label>
                        <input 
                            type="text" 
                            id="username" 
                            placeholder="Username"
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-[#75716B] text-base font-medium"
                            onChange={(event) => setUsername(event.target.value)}
                            value={username}
                        />
                        {usernameError && <p className="text-[#FF0000] text-[12px] font-medium">{usernameError}</p>}
                    </div>
                    
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
                            className="bg-[#26231E] w-[30%] text-white py-3 px-4 rounded-full font-medium"
                        >
                            Sign up
                        </button>
                    </div>
                </div>
                
                <div className="text-center mt-6">
                    <p className="text-[#75716B]">
                        Already have an account?{' '}
                        <button 
                            onClick={handleLoginClick}
                            className="text-[#26231E] underline hover:text-[#1a1a1a] transition-colors duration-200"
                        >
                            Log in
                        </button>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default SignUpForm;