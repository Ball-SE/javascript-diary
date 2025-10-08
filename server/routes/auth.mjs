import { Router } from "express";
import { createClient } from "@supabase/supabase-js";
import connectionPool from "../utils/db.mjs";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const authRouter = Router();

// ตั้งค่า multer สำหรับรับไฟล์
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // จำกัดขนาดไฟล์ 5MB
  }
});

// จะเพิ่ม routes ต่างๆ ที่นี่
authRouter.post("/register", async (req, res) => {
  const { email, password, username, name } = req.body;

  console.log("📝 Registration attempt:", { email, username, name });

  // ตรวจสอบ environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error("❌ Missing Supabase credentials");
      return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    // ตรวจสอบว่า username มีในฐานข้อมูลหรือไม่ (ใช้ Supabase)
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (existingUser) {
      console.log("⚠️ Username already exists:", username);
      return res.status(400).json({ error: "This username is already taken" });
    }
    
    console.log("🔐 Creating Supabase user...");
    // สร้างผู้ใช้ใหม่ผ่าน Supabase Auth
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
    });

    // ตรวจสอบ error จาก Supabase
    if (supabaseError) {
      console.error("❌ Supabase error:", supabaseError);
      if (supabaseError.code === "user_already_exists") {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      return res
        .status(400)
        .json({ error: supabaseError.message || "Failed to create user. Please try again." });
    }

    const supabaseUserId = data.user.id;
    console.log("✅ Supabase user created:", supabaseUserId);

    console.log("💾 Inserting into Supabase database...");
    // เพิ่มข้อมูลผู้ใช้ในฐานข้อมูล Supabase (ใช้ Supabase Client)
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert([
        {
          id: supabaseUserId,
          username: username,
          name: name,
          role: 'user'
        }
      ])
      .select()
      .single();

    if (insertError) {
      console.error("❌ Insert error:", insertError);
      return res.status(500).json({ 
        error: "Failed to create user profile",
        details: insertError.message 
      });
    }

    console.log("✅ User inserted into Supabase:", insertedUser);
    
    res.status(201).json({
      message: "User created successfully",
      user: insertedUser,
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });
    res.status(500).json({ 
      error: "An error occurred during registration",
      details: error.message 
    });
  }
});

authRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
  
      if (error) {
        // ตรวจสอบว่า error เกิดจากข้อมูลเข้าสู่ระบบไม่ถูกต้องหรือไม่
        if (
          error.code === "invalid_credentials" ||
          error.message.includes("Invalid login credentials")
        ) {
          return res.status(400).json({
            error: "Your password is incorrect or this email doesn't exist",
          });
        }
        return res.status(400).json({ error: error.message });
      }
  
      return res.status(200).json({
        message: "Signed in successfully",
        access_token: data.session.access_token,
      });
    } catch (error) {
      return res.status(500).json({ error: "An error occurred during login" });
    }
});

authRouter.get("/get-user", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // ดึงข้อมูลผู้ใช้จาก Supabase
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: "Unauthorized or token expired" });
    }

    const supabaseUserId = data.user.id;
    
    // ดึงข้อมูลจาก Supabase table (ใช้ Supabase Client)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', supabaseUserId)
      .single();

    if (userError) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      id: data.user.id,
      email: data.user.email,
      username: userData.username,
      name: userData.name,
      role: userData.role,
      profilePic: userData.profile_pic,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
  
authRouter.put("/reset-password", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // ดึง token จาก Authorization header
    const { oldPassword, newPassword } = req.body;
  
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }
  
    if (!newPassword) {
      return res.status(400).json({ error: "New password is required" });
    }
  
    try {
      // ตั้งค่า session ด้วย token ที่ส่งมา
      const { data: userData, error: userError } = await supabase.auth.getUser(
        token
      );
  
      if (userError) {
        return res.status(401).json({ error: "Unauthorized: Invalid token" });
      }
  
      // ตรวจสอบรหัสผ่านเดิมโดยลองล็อกอิน
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: userData.user.email,
          password: oldPassword,
        });
  
      if (loginError) {
        return res.status(400).json({ error: "Invalid old password" });
      }
  
      // อัปเดตรหัสผ่านของผู้ใช้
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
  
      if (error) {
        return res.status(400).json({ error: error.message });
      }
  
      res.status(200).json({
        message: "Password updated successfully",
        user: data.user,
      });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
});

authRouter.put("/update-profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name, username } = req.body;

  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // ดึงข้อมูลผู้ใช้จาก token
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: "Unauthorized or token expired" });
    }

    const supabaseUserId = data.user.id;

    // ตรวจสอบว่า username ซ้ำกับคนอื่นหรือไม่ (ยกเว้นตัวเอง)
    if (username) {
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .neq('id', supabaseUserId)
        .single();

      if (existingUser) {
        return res.status(400).json({ error: "This username is already taken" });
      }
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    const updateData = {};
    if (name) updateData.name = name;
    if (username) updateData.username = username;

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', supabaseUserId)
      .select()
      .single();

    if (updateError) {
      return res.status(500).json({ 
        error: "Failed to update profile",
        details: updateError.message 
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: data.user.id,
        email: data.user.email,
        username: updatedUser.username,
        name: updatedUser.name,
        role: updatedUser.role,
        profilePic: updatedUser.profile_pic,
      }
    });
  } catch (error) {
    console.error("❌ Update profile error:", error);
    res.status(500).json({ 
      error: "An error occurred while updating profile",
      details: error.message 
    });
  }
});
  
// endpoint สำหรับ upload รูป profile
authRouter.post("/upload-profile-picture", upload.single("profilePicture"), async (req, res) => {
  console.log("📤 Upload request received");
  console.log("Headers:", req.headers);
  console.log("File:", req.file);
  console.log("Body:", req.body);
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // ดึงข้อมูลผู้ใช้จาก token
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: "Unauthorized or token expired" });
    }

    const userId = data.user.id;
    const file = req.file;
    
    // สร้างชื่อไฟล์ที่ไม่ซ้ำกัน
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `profile-pictures/${fileName}`;

    // อัปโหลดไปยัง Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('my-personal-blog')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true
      });

    if (uploadError) {
      console.error("❌ Upload error:", uploadError);
      return res.status(500).json({ 
        error: "Failed to upload file",
        details: uploadError.message 
      });
    }

    // สร้าง public URL
    const { data: publicUrlData } = supabase.storage
      .from('my-personal-blog')
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;

    // อัปเดต profile_pic ในฐานข้อมูล
    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update({ profile_pic: publicUrl })
      .eq('id', userId)
      .select()
      .single();

    if (updateError) {
      console.error("❌ Update error:", updateError);
      return res.status(500).json({ 
        error: "Failed to update profile picture",
        details: updateError.message 
      });
    }

    res.status(200).json({
      message: "Profile picture uploaded successfully",
      profilePic: publicUrl,
      user: {
        id: data.user.id,
        email: data.user.email,
        username: updatedUser.username,
        name: updatedUser.name,
        role: updatedUser.role,
        profilePic: updatedUser.profile_pic,
      }
    });
  } catch (error) {
    console.error("❌ Upload profile picture error:", error);
    res.status(500).json({ 
      error: "An error occurred while uploading profile picture",
      details: error.message 
    });
  }
});
  
  
  

export default authRouter;

