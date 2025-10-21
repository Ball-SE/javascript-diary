import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Navbar } from "../ui/Navbar";
import { Footer } from "../ui/Footer";
import { toast } from "sonner";

export function ResetPassForm() {
  const navigate = useNavigate();
  const { state, resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    navigate("/reset-password");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // ล้าง error ของ field นั้นๆ เมื่อผู้ใช้เริ่มพิมพ์
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "กรุณากรอกรหัสผ่านปัจจุบัน";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "กรุณากรอกรหัสผ่านใหม่";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "กรุณายืนยันรหัสผ่านใหม่";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword = "รหัสผ่านใหม่ต้องไม่เหมือนกับรหัสผ่านเดิม";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await resetPassword(
      formData.currentPassword,
      formData.newPassword
    );

    if (result.success) {
      toast.success("เปลี่ยนรหัสผ่านสำเร็จ!");
      // ล้างฟอร์ม
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // หรือ navigate กลับไปหน้า profile
      // navigate("/profile");
    } else {
      toast.error(result.error || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col">
      <Navbar />
      <div className="flex flex-col w-full mx-auto max-w-7xl">
      {/* Left Sidebar */}
      <div className="w-full sm:w-[800px] p-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4 mb-2">
            <img
              src={state.user?.profilePic || "/default-avatar.png"}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-[#75716B]">
                {state.user?.name || "User"}
              </span>
              <span className="text-[#DAD6D1]">|</span>
              <span className="text-2xl font-semibold text-[#26231E]">
                Profile
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile: Horizontal navigation at top, Desktop: Vertical sidebar */}
        <nav className="flex flex-row lg:flex-col lg:min-w-auto space-x-4 lg:space-x-0 lg:space-y-2">
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
              <button className="font-medium" onClick={handleProfile}>
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

          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-2xl bg-[#EFEEEB] gap-4 mb-4 p-8"
          >
            {/* Form Fields */}
            <div className="space-y-4">
              {/* Current password Field */}
              <div>
                <label className="block text-base font-medium text-[#75716B] mb-2">
                  Current password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Current password"
                  className={`w-full p-3 gap-4 bg-[#FFFFFF] rounded-lg border ${
                    errors.currentPassword
                      ? "border-red-500"
                      : "border-[#DAD6D1]"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              {/* New password Field */}
              <div>
                <label className="block text-base font-medium text-[#75716B] mb-2">
                  New password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="New password"
                  className={`w-full p-3 gap-4 bg-[#FFFFFF] rounded-lg border ${
                    errors.newPassword ? "border-red-500" : "border-[#DAD6D1]"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm new password Field */}
              <div>
                <label className="block text-base font-medium text-[#75716B] mb-2">
                  Confirm new password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  className={`w-full p-3 gap-4 bg-[#FFFFFF] rounded-lg border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-[#DAD6D1]"
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-start">
              <button
                className="px-8 py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                type="submit"
                disabled={state.loading}
              >
                {state.loading ? "กำลังเปลี่ยนรหัสผ่าน..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}