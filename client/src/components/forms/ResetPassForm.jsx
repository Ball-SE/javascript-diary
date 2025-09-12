import { useNavigate } from "react-router-dom";
import moodeng from "../../assets/images/moodeng.png";
import { Navbar } from "../ui/Navbar";
import { Footer } from "../ui/Footer";

export function ResetPassForm() {
  const navigate = useNavigate();
  const handleProfile = () => {
    navigate("/profile");
  };
  const handleResetPassword = (e) => {
    e.preventDefault();
    navigate("/reset-password");
  };
  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <Navbar />
      <div className="flex flex-col mx-auto max-w-7xl">
        {/* Left Sidebar */}
        <div className="w-[800px] p-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-2">
            <img
              src={moodeng}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-[#75716B] ">
                Moodeng ja
              </span>
              <span className="text-[#DAD6D1]">|</span>
              <span className="text-2xl font-semibold text-[#26231E] ">
                Profile
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-row gap-8">
          <nav className="min-w-auto space-y-2">
            <div className="flex items-center gap-3 p-3 text-gray-400 hover:text-gray-600 transition-colors">
              <svg
                className="w-5 h-5 text-[#26231E]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              <button
                className=" font-medium"
                onClick={handleProfile}
              >
                Profile
              </button>
            </div>
            <div className="flex items-center gap-3 p-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <button
                className="font-medium whitespace-nowrap text-[#26231E]"
                onClick={handleResetPassword}
              >
                Reset password
              </button>
            </div>
          </nav>

          <form className="flex flex-col w-full max-w-2xl bg-[#EFEEEB] gap-4 mb-4 p-8">

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Current password Field */}
              <div>
                <label className="block text-base font-medium text-[#75716B] mb-2">
                  Current password
                </label>
                <input
                  type="password"
                  placeholder="Current password"
                  className="w-full p-3 gap-4 bg-[#FFFFFF] rounded-lg border border-[#DAD6D1] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* New password Field */}
              <div>
                <label className="block text-base font-medium text-[#75716B] mb-2">
                  New password
                </label>
                <input
                  type="password"
                  placeholder="New password"
                  className="w-full p-3 gap-4 bg-[#FFFFFF] rounded-lg border border-[#DAD6D1] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Confirm new password Field */}
              <div>
                <label className="block text-base font-medium text-[#75716B] mb-2">
                  Confirm new password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="w-full p-3 gap-4 bg-[#FFFFFF] rounded-lg border border-[#DAD6D1] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-start">
              <button className="px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
              type="submit"
              onClick={handleResetPassword}
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
