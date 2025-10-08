import { useState, useEffect } from "react";

export default function UploadPicture() {
  const [imageFile, setImageFile] = useState(null);

  const handleUploadPicture = (event) => {
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

  // Cleanup URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (imageFile?.file) {
        URL.revokeObjectURL(URL.createObjectURL(imageFile.file));
      }
    };
  }, [imageFile]);

  return (
    <div>
      {imageFile ? (    
        <img
          src={URL.createObjectURL(imageFile.file)}
          alt="Preview"
          style={{ width: "300px", height: "auto" }}
        />
      ) : (
        <div>No image selected</div>
      )}

      <input type="file" onChange={handleUploadPicture} />
    </div>
  );
}
