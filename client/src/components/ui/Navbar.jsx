import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export function Navbar(){
    
    const [menu, setMenu] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    const { state, logout, isAuthenticated } = useAuth();
    
    // Debug: แสดงข้อมูล user และ role
    useEffect(() => {
      if (state.user) {
        console.log("👤 Current User:", state.user);
        console.log("🔑 User Role:", state.user.role);
      }
    }, [state.user]);
    
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
      navigate('/profile');
      setUserMenu(false);
    }

    const handleResetPassword = () => {
      navigate('/reset-password');
      setUserMenu(false);
    }

    const handleAdmin = () => {
      navigate('/admin');
      setUserMenu(false);
    }

    // ตรวจสอบว่าผู้ใช้เป็น admin หรือไม่
    const isAdmin = state.user?.role === 'admin';

    return (
      <nav className="bg-[#F9F8F6] border border-[#DAD6D1] w-full h-20 pt-4 pr-8 pb-4 pl-8 flex justify-between items-center relative">
        <div className="ml-23 text-2xl font-bold text-gray-800">
          <a href="/"  className="text-gray-800">hh<span className="text-green-500">.</span></a>
        </div>
        
        {/* Desktop Menu */}
        <div className="flex gap-4 mr-23 items-center">
          {isAuthenticated ? (
            // แสดงข้อมูลผู้ใช้เมื่อล็อกอินแล้ว
            <div className="relative hidden sm:block">
              <div className="flex items-center gap-3 cursor-pointer" onClick={toggleUserMenu}>
                <div className="w-8 h-8 bg-[#26231E] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {state.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <span className="text-[#26231E] font-medium">
                  {state.user?.name || state.user?.username || 'User'}
                </span>
                {isAdmin && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                    Admin
                  </span>
                )}
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
                  {isAdmin && (
                    <>
                      <hr className="my-2" />
                      <button 
                        onClick={handleAdmin}
                        className="w-full text-left px-4 py-2 text-green-600 hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Admin Dashboard
                      </button>
                    </>
                  )}
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
                  {isAdmin && (
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Admin
                    </span>
                  )}
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
                {isAdmin && (
                  <button 
                    onClick={handleAdmin}
                    className="w-full max-w-[327px] h-[48px] bg-green-600 border border-green-600 rounded-full text-white text-base font-medium"
                  >
                    Admin Dashboard
                  </button>
                )}
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