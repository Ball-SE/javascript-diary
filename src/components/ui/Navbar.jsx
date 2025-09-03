import { useRef, useState } from "react";

export function Navbar(){
    // const menuRef = useRef(null);
    // const toggleHam = (e) => {
    //   e.currentTarget.classList.toggle('change');
    //   menuRef.current.classList.toggle('hidden');
    // };
    
    const [menu, setMenu] = useState(false);
    const toggleMenu = () => {
      setMenu(!menu);
    };

    return (
      <nav className="bg-[#F9F8F6] border border-[#DAD6D1] w-full h-20 pt-4 pr-8 pb-4 pl-8 flex justify-between items-center relative">
        <div className="text-2xl font-bold text-gray-800">
          <span className="text-gray-800">hh</span>
          <span className="text-gray-800">.</span>
        </div>
        {/* Desktop Menu */}
        <div className="flex gap-4">
          <button className="hidden sm:block w-[127px] h-[48px] bg-white border border-[#75716B] rounded-full px-4 py-2 text-[#26231E] text-base font-medium">
            Log in
          </button>
          <button className="hidden sm:block w-[127px] h-[48px] bg-[#26231E] border border-[#26231E] rounded-full px-4 py-2 text-[#FFFFFF] text-base font-medium">
            Sign up
          </button>

          {/* Hamburger Menu */}
          <div className="sm:hidden flex flex-col gap-1 cursor-pointer" onClick={toggleMenu}>
            <div className="bar1 w-6 h-1 bg-black"></div>
            <div className="bar2 w-6 h-1 bg-black"></div>
            <div className="bar3 w-6 h-1 bg-black"></div>
          </div>
        </div>
        {menu ? (
          <div
          id="mobileMenu"
          // ref={menuRef}
          className="sm:hidden absolute top-full left-0 right-0 bg-[#F9F8F6] drop-shadow-xl pt-8 pb-8 px-6 z-50">
          <div className="flex flex-col gap-4 items-center">
            <button className="w-full max-w-[327px] h-[48px] bg-white border border-[#75716B] rounded-full text-[#26231E] text-base font-medium">
              Log in
            </button>
            <button className="w-full max-w-[327px] h-[48px] bg-[#26231E] border border-[#26231E] rounded-full text-[#FFFFFF] text-base font-medium">
              Sign up
            </button>
          </div>
          </div>
        ) : null}
      </nav>
    )
  }
