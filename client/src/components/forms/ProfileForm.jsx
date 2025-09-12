import moodeng from "../../assets/images/moodeng.png";
import { useNavigate } from "react-router-dom";

export function ProfileForm() {
  const navigate = useNavigate();
  const handleResetPassword = () => {
    navigate("/reset-password");
  };
  return (
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
          <div className="flex items-center gap-3 p-3 rounded-lg">
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
            <button className="text-[#26231E] font-medium">Profile</button>
          </div>
          <div className="flex items-center gap-3 p-3 text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                clipRule="evenodd"
              />
            </svg>
            <button className="font-medium whitespace-nowrap"
            onClick={handleResetPassword}
            >Reset password</button>
          </div>
        </nav>

        <form className="flex flex-col w-full max-w-2xl bg-[#EFEEEB] gap-4 mb-4 p-8">
          {/* Profile Picture Section */}
          <div className="flex items-center gap-4 mb-3">
            <img
              src={moodeng}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <button className="px-4 py-2 text-base font-medium border border-[#75716B] bg-[#FFFFFF] rounded-full hover:bg-gray-300 transition-colors">
              Upload profile picture
            </button>
          </div>

          <div className="border border-t border-[#DAD6D1] w-full"></div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-base font-medium text-[#75716B] mb-2">
                Name
              </label>
              <input
                type="text"
                defaultValue="Moodeng ja"
                className="w-full p-3 gap-4 bg-[#FFFFFF] rounded-lg border border-[#DAD6D1] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-base font-medium text-[#75716B] mb-2">
                Username
              </label>
              <input
                type="text"
                defaultValue="moodeng.cute"
                className="w-full p-3 gap-4 bg-[#FFFFFF] rounded-lg border border-[#DAD6D1] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-base font-medium text-[#75716B] mb-2">
                Email
              </label>
              <input
                type="email"
                defaultValue="moodeng.cute@gmail.com"
                disabled
                className="w-full p-3 gap-4 text-[#75716B] bg-[#EFEEEB] "
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-start">
            <button className="px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
