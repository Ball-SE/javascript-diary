
function Navbar(){
    return (
      <nav className="bg-[#F9F8F6] border border-[#DAD6D1]  w-full h-20 pt-4 pr-8 pb-4 pl-8 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          <span className="text-gray-800">hh</span>
          <span className="text-green-500">.</span>
        </div>
        
        <div className="flex gap-4">
          <button className="w-[127px] h-[48px] bg-white border border-[#75716B] rounded-full px-4 py-2 text-[#26231E] text-base font-medium">
            Log in
          </button>
          <button className="w-[127px] h-[48px] bg-[#26231E] border border-[#26231E] rounded-full px-4 py-2 text-[#FFFFFF] text-base font-medium">
            Sign up
          </button>
        </div>
      </nav>
    )
  }

export default Navbar;
