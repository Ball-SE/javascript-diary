import moodeng from "../../assets/images/moodeng.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";

export function ProfileForm() {
  const { state, updateProfile, uploadProfilePicture } = useAuth();
  const { user, getUserLoading, loading } = state;
  
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const navigate = useNavigate();

  // ดึงข้อมูล user มาใส่ใน form เมื่อ component โหลด
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleResetPassword = () => {
    navigate("/reset-password");
  };

  const handleUploadProfilePicture = (event) => {
    const file = event.target.files[0];

    // ตรวจสอบประเภทของไฟล์
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a valid image file (JPEG, PNG, GIF, WebP).");
      return;
    }

    // ตรวจสอบขนาดของไฟล์ (เช่น ขนาดไม่เกิน 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("The file is too large. Please upload an image smaller than 5MB.");
      return;
    }

    // เก็บข้อมูลไฟล์
    setImageFile(file); // ✅ บันทึก file โดยตรง
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();

    let profileUpdated = false;

    // 1. อัปโหลดรูปก่อนถ้ามี
    if (imageFile) {
      setUploadingImage(true);
      const uploadResult = await uploadProfilePicture(imageFile);
      setUploadingImage(false);
      
      if (uploadResult.success) {
        alert("Profile picture uploaded successfully!");
        setImageFile(null); // ล้างไฟล์ที่เลือก
        profileUpdated = true;
      } else {
        alert(`Error uploading image: ${uploadResult.error}`);
        return; // หยุดถ้า upload ไม่สำเร็จ
      }
    }

    // 2. อัปเดตข้อมูล name และ username
    if (formData.name !== user.name || formData.username !== user.username) {
      const result = await updateProfile({
        name: formData.name,
        username: formData.username,
      });

      if (result.success) {
        alert("Profile updated successfully!");
        profileUpdated = true;
      } else {
        alert(`Error: ${result.error}`);
      }
    } else if (!profileUpdated) {
      alert("No changes to save");
    }
  };

  // แสดง loading ขณะดึงข้อมูล
  if (getUserLoading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-xl">Loading...</div>
    </div>;
  }

  // แสดงถ้ายังไม่มีข้อมูล user
  if (!user) {
    return <div className="flex justify-center items-center h-screen">
      <div className="text-xl">Please login first</div>
    </div>;
  }

  return (
    <div className="flex flex-col mx-auto max-w-7xl">
      {/* Left Sidebar */}
      <div className="w-[800px] p-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 mb-2">
          <img
            src={user.profilePic || moodeng}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex items-center gap-2">
            <span className="text-2xl font-semibold text-[#75716B] ">
              {user.name}
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

        <form className="flex flex-col w-full max-w-2xl bg-[#EFEEEB] gap-4 mb-4 p-8" onSubmit={handleSaveProfile}>
          {/* Profile Picture Section */}
          <div className="flex items-center gap-4 mb-3">
            <img
              src={
                imageFile && imageFile instanceof File
                  ? URL.createObjectURL(imageFile)
                  : user.profilePic || moodeng
              }
              alt="picture"
              className="w-20 h-20 rounded-full object-cover"
            />
            <input 
            className="px-4 py-2 text-base font-medium border border-[#75716B] bg-[#FFFFFF] rounded-full hover:bg-gray-300 transition-colors"
            type="file"
            onChange={handleUploadProfilePicture}
            accept="image/jpeg,image/png,image/gif,image/webp"
            disabled={loading || uploadingImage}
            placeholder="Upload profile picture"
            />
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
                name="name"
                value={formData.name}
                onChange={handleInputChange}
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
                name="username"
                value={formData.username}
                onChange={handleInputChange}
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
                name="email"
                value={formData.email}
                disabled
                className="w-full p-3 gap-4 text-[#75716B] bg-[#EFEEEB] "
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="mt-6 flex justify-start">
            <button 
              type="submit"
              disabled={loading || uploadingImage}
              className="px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors"
            >
              {uploadingImage ? "Uploading image..." : loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}