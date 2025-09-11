import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authentication.jsx";

export function Navbar(){
    
    const [menu, setMenu] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    const { state, logout, isAuthenticated } = useAuth();
    
    const toggleMenu = () => {
      setMenu(!menu);
    };

    const toggleUserMenu = () => {
      setUserMenu(!userMenu);
    };

    const navigate = useNavigate();
    const handleSignUp = () => {
      navigate('/signup');
    }

    const handleLogIn = () => {
      navigate('/login');
    }

    const handleLogout = () => {
      logout();
      setUserMenu(false);
    }

    const handleProfile = () => {
      // Navigate to profile page
      navigate('/profile');
      setUserMenu(false);
    }

    const handleResetPassword = () => {
      // Navigate to reset password page
      navigate('/reset-password');
      setUserMenu(false);
    }

    return (
      <nav className="bg-[#F9F8F6] border border-[#DAD6D1] w-full h-20 pt-4 pr-8 pb-4 pl-8 flex justify-between items-center relative">
        <div className="ml-23 text-2xl font-bold text-gray-800">
          <a href="/"  className="text-gray-800">hh.</a>
        </div>
        
        {/* Desktop Menu */}
        <div className="flex gap-4 mr-23 items-center">
          {isAuthenticated ? (
            // แสดงข้อมูลผู้ใช้เมื่อล็อกอินแล้ว
            <div className="relative">
              <div className="flex items-center gap-3 cursor-pointer" onClick={toggleUserMenu}>
                <div className="w-8 h-8 bg-[#26231E] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {state.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-[#26231E] font-medium">
                  {state.user?.name || state.user?.username || 'User'}
                </span>
                <svg 
                  className={`w-4 h-4 text-[#26231E] transition-transform ${userMenu ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* User Dropdown Menu */}
              {userMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button 
                    onClick={handleProfile}
                    className="w-full text-left px-4 py-2 text-[#26231E] hover:bg-gray-50 transition-colors"
                  >
                    Profile
                  </button>
                  <button 
                    onClick={handleResetPassword}
                    className="w-full text-left px-4 py-2 text-[#26231E] hover:bg-gray-50 transition-colors"
                  >
                    Reset password
                  </button>
                  <hr className="my-2" />
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            // แสดงปุ่ม Log in และ Sign up เมื่อยังไม่ได้ล็อกอิน
            <>
              <button className="hidden sm:block w-[127px] h-[48px] bg-white border border-[#75716B] rounded-full px-4 py-2 text-[#26231E] text-base font-medium"
              onClick={handleLogIn}
              >
                Log in
              </button>
              <button className="hidden sm:block w-[127px] h-[48px] bg-[#26231E] border border-[#26231E] rounded-full px-4 py-2 text-[#FFFFFF] text-base font-medium"
              onClick={handleSignUp}
              >
                Sign up
              </button>
            </>
          )}

          {/* Hamburger Menu */}
          <div className="sm:hidden flex flex-col gap-1 cursor-pointer" onClick={toggleMenu}>
            <div className="bar1 w-6 h-1 bg-black"></div>
            <div className="bar2 w-6 h-1 bg-black"></div>
            <div className="bar3 w-6 h-1 bg-black"></div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {menu ? (
          <div
          id="mobileMenu"
          className="sm:hidden absolute top-full left-0 right-0 bg-[#F9F8F6] drop-shadow-xl pt-8 pb-8 px-6 z-50">
          <div className="flex flex-col gap-4 items-center">
            {isAuthenticated ? (
              // Mobile menu สำหรับผู้ใช้ที่ล็อกอินแล้ว
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-[#26231E] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {state.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-[#26231E] font-medium">
                    {state.user?.name || state.user?.username || 'User'}
                  </span>
                </div>
                <button 
                  onClick={handleProfile}
                  className="w-full max-w-[327px] h-[48px] bg-white border border-[#75716B] rounded-full text-[#26231E] text-base font-medium"
                >
                  Profile
                </button>
                <button 
                  onClick={handleResetPassword}
                  className="w-full max-w-[327px] h-[48px] bg-white border border-[#75716B] rounded-full text-[#26231E] text-base font-medium"
                >
                  Reset password
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full max-w-[327px] h-[48px] bg-red-600 border border-red-600 rounded-full text-white text-base font-medium"
                >
                  Log out
                </button>
              </>
            ) : (
              // Mobile menu สำหรับผู้ใช้ที่ยังไม่ได้ล็อกอิน
              <>
                <button className="w-full max-w-[327px] h-[48px] bg-white border border-[#75716B] rounded-full text-[#26231E] text-base font-medium"
                onClick={handleLogIn}
                >
                  Log in
                </button>
                <button className="w-full max-w-[327px] h-[48px] bg-[#26231E] border border-[#26231E] rounded-full text-[#FFFFFF] text-base font-medium"
                onClick={handleSignUp}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
          </div>
        ) : null}
      </nav>
    )
  }