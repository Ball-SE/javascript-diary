// ส่วนของ component ที่ใช้อัปโหลดไฟล์
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreatePostComponent() {
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    description: "",
    content: "",
    category_id: null,
    status_id: null,
  });
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

  // ฟังก์ชันสำหรับจัดการเมื่อมีการเลือกไฟล์
  const handleFileChange = (event) => {
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
    setImageFile({ file });
  };

  // ฟังก์ชันสำหรับจัดการเมื่อมีการเปลี่ยนแปลงค่าใน input fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPost((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ฟังก์ชันสำหรับการบันทึกข้อมูลโพสต์
  const handleSave = async (statusId) => {
    if (!imageFile) {
      alert("Please select an image file.");
      return;
    }

    setIsLoading(true);

    // สร้าง FormData สำหรับการส่งข้อมูลแบบ multipart/form-data
    const formData = new FormData();

    // เพิ่มข้อมูลทั้งหมดลงใน FormData
    formData.append("title", post.title);
    formData.append("category_id", post.category_id);
    formData.append("description", post.description);
    formData.append("content", post.content);
    formData.append("status_id", statusId);
    formData.append("imageFile", imageFile.file); // เพิ่มไฟล์รูปภาพ

    try {
      // ส่งข้อมูลไปยัง Backend
      await axios.post(
        `${API_BASE_URL}/posts`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${localStorage.getItem("token")}`, // ถ้ามีการใช้ token สำหรับการยืนยันตัวตน
          },
        }
      );

      alert("Post created successfully!");
      navigate("/admin/posts"); // นำทางไปยังหน้ารายการโพสต์
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Create New Post</h2>

      <form>
        {/* ส่วนแสดงตัวอย่างรูปภาพและปุ่มอัปโหลด */}
        <div>
          <label>Thumbnail Image</label>
          <div>
            {imageFile ? (
              <img
                src={URL.createObjectURL(imageFile.file)}
                alt="Preview"
                style={{ width: '300px', height: 'auto' }}
              />
            ) : (
              <div>No image selected</div>
            )}

            <input
              type="file"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* ฟอร์มสำหรับกรอกข้อมูลโพสต์ */}
        <div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={post.title}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Description</label>
          <textarea
            name="description"
            value={post.description}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Content</label>
          <textarea
            name="content"
            value={post.content}
            onChange={handleInputChange}
          />
        </div>

        {/* ปุ่มสำหรับบันทึกข้อมูล */}
        <div>
          <button
            type="button"
            onClick={() => handleSave(1)}
            disabled={isLoading}
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSave(2)}
            disabled={isLoading}
          >
            Save and Publish
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePostComponent;

