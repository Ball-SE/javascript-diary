import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext();

function AuthProvider(props) {
  const [state, setState] = useState({
    loading: null,
    getUserLoading: null,
    error: null,
    user: null,
  });

  const navigate = useNavigate();

  // ดึงข้อมูลผู้ใช้โดยใช้ Supabase API
  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState((prevState) => ({
        ...prevState,
        user: null,
        getUserLoading: false,
      }));
      return;
    }

    try {
      setState((prevState) => ({ ...prevState, getUserLoading: true }));
      const response = await axios.get(
        "http://localhost:4001/auth/get-user"
      );
      setState((prevState) => ({
        ...prevState,
        user: response.data,
        getUserLoading: false,
      }));
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        error: error.message,
        user: null,
        getUserLoading: false,
      }));
    }
  };

  useEffect(() => {
    fetchUser(); // โหลดข้อมูลผู้ใช้เมื่อแอปเริ่มต้น
  }, []);

  // ล็อกอินผู้ใช้
  const login = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await axios.post(
        "http://localhost:4001/auth/login",
        data
      );
      const token = response.data.access_token;
      localStorage.setItem("token", token);

      // ดึงและตั้งค่าข้อมูลผู้ใช้
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/");
      await fetchUser();
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: error.response?.data?.error || "Login failed",
      }));
      return { error: error.response?.data?.error || "Login failed" };
    }
  };

  // ลงทะเบียนผู้ใช้
  const register = async (data) => {
    try {
      console.log("📝 Registering with data:", data);
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      
      const response = await axios.post(
        "http://localhost:4001/auth/register",
        data
      );
      
      console.log("✅ Registration successful:", response.data);
      setState((prevState) => ({ ...prevState, loading: false, error: null }));
      navigate("/login");
    } catch (error) {
      console.error("❌ Registration failed:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.error || error.response?.data?.details || "Registration failed";
      
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));
      return { error: errorMessage };
    }
  };

  // ล็อกเอาท์ผู้ใช้
  const logout = () => {
    localStorage.removeItem("token");
    setState({ user: null, error: null, loading: null });
    navigate("/");
  };

  const isAuthenticated = Boolean(state.user);

  // เพิ่มฟังก์ชัน updateProfile
  const updateProfile = async (data) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await axios.put(
        "http://localhost:4001/auth/update-profile",
        data
      );
      
      // อัปเดต user state ด้วยข้อมูลใหม่
      setState((prevState) => ({ 
        ...prevState, 
        user: response.data.user,
        loading: false, 
        error: null 
      }));
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to update profile";
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

    // เพิ่มฟังก์ชัน uploadProfilePicture
  const uploadProfilePicture = async (file) => {
    try {
      console.log("🔍 File to upload:", file); // เพิ่มบรรทัดนี้
      console.log("🔍 File type:", file.type); // เพิ่มบรรทัดนี้
      console.log("🔍 File size:", file.size); // เพิ่มบรรทัดนี้
      
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      
      const formData = new FormData();
      formData.append("profilePicture", file);
      
      // Debug FormData
      console.log("🔍 FormData entries:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      const token = localStorage.getItem("token");
      
      // ใช้ fetch แทน axios เพื่อหลีกเลี่ยง interceptor
      const response = await fetch(
        "http://localhost:4001/auth/upload-profile-picture",
        {
          method: "POST",
          headers: {
            'Authorization': `Bearer ${token}`,
            // ไม่ต้องระบุ Content-Type ให้ browser ตั้งค่า boundary เอง
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload profile picture");
      }
      
      // อัปเดต user state ด้วยข้อมูลใหม่
      setState((prevState) => ({ 
        ...prevState, 
        user: data.user,
        loading: false, 
        error: null 
      }));
      
      return { success: true, profilePic: data.profilePic };
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error.message || "Failed to upload profile picture";
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  // เพิ่มฟังก์ชัน resetPassword
  const resetPassword = async (oldPassword, newPassword) => {
    try {
      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      const response = await axios.put(
        "http://localhost:4001/auth/reset-password",
        { oldPassword, newPassword }
      );
      
      setState((prevState) => ({ 
        ...prevState, 
        loading: false, 
        error: null 
      }));
      
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Failed to reset password";
      setState((prevState) => ({
        ...prevState,
        loading: false,
        error: errorMessage,
      }));
      return { success: false, error: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        login,
        logout,
        register,
        isAuthenticated,
        fetchUser,
        updateProfile,
        uploadProfilePicture,
        resetPassword,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

// Export AuthContext เพื่อให้ useAuth hook สามารถใช้งานได้
export { AuthContext };

export { AuthProvider };

