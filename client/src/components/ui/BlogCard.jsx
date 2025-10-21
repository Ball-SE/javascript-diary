import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import heroImage from "../../assets/images/image.jpg";
import axios from "axios";
import { Skeleton } from "@mui/material";

function BlogCard({ categories }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';

  // ดึงข้อมูลจาก Supabase ผ่าน backend ถ้าไม่มี props ส่งมา
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        // ถ้า parent ส่ง prop มา (แม้เป็น array ว่าง) ให้ใช้ตามนั้นและไม่ดึงซ้ำ
        if (typeof categories !== 'undefined') {
          setPosts(categories);
          setLoading(false);
          return;
        }
        const res = await axios.get(`${API_BASE_URL}/posts`, { params: { limit: 6 } });
        setPosts(res.data?.posts || []);
      } catch (err) {
        console.error("Failed to load posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [API_BASE_URL, categories]);

  // Function to format date in readable format
  const formatDateReadable = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      };
      
      return date.toLocaleDateString('en-US', options);
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full pt-[20px]">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4 p-[10px]">
            <Skeleton variant="rectangular" height={212} sx={{ borderRadius: 2 }} />
            <div className="flex flex-col gap-2">
              <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 3 }} />
              <Skeleton variant="text" height={32} />
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} width="80%" />
              <div className="flex items-center gap-2">
                <Skeleton variant="circular" width={32} height={32} />
                <Skeleton variant="text" width={100} height={16} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full pt-[20px]">
    {posts && posts.length > 0 ? 
      posts.map((post, index) => (
      <div className="flex flex-col gap-4 p-[10px]" key={index}>
        <Link to={`/post/${post.id}`} className="relative h-[212px] sm:h-[360px]">
          <img
            className="w-full h-full object-cover rounded-md"
            src={post.image}
            alt={post.title}
          />
        </Link>
        <div className="flex flex-col">
          <div className="flex">
            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
              {post.category}
            </span>
          </div>
          <Link to={`/post/${post.id}`}>
            <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
              {post.title}
            </h2>
          </Link>
          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
            {post.description}
          </p>
          <div className="flex items-center text-sm">
            <img
              className="w-8 h-8 rounded-full mr-2 object-cover"
              src={post.author_pic || heroImage}
              alt={post.author}
            />
            <span>{post.author}</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>{formatDateReadable(post.date)}</span>
          </div>
        </div>
      </div>
    )):(
      <p>No posts found in this category.</p>
    )}
    </div>
  );
}

export default BlogCard;