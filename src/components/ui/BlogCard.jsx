import { useState, useEffect } from "react";
import axios from "axios";

function BlogCard({ categories }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ใช้ categories prop ที่ส่งมาจาก parent component
  useEffect(() => {
    if (categories && categories.length > 0) {
      setPosts(categories);
      setLoading(false);
    }
  }, [categories]);

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
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full pt-[20px]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full pt-[20px]">
    {posts && posts.length > 0 ? 
      posts.map((post, index) => (
      <div className="flex flex-col gap-4 p-[10px]" key={index}>
        <a href="#" className="relative h-[212px] sm:h-[360px]">
          <img
            className="w-full h-full object-cover rounded-md"
            src={post.image}
            alt={post.title}
          />
        </a>
        <div className="flex flex-col">
          <div className="flex">
            <span className="bg-green-200 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">
              {post.category}
            </span>
          </div>
          <a href="#">
            <h2 className="text-start font-bold text-xl mb-2 line-clamp-2 hover:underline">
              {post.title}
            </h2>
          </a>
          <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
            {post.description}
          </p>
          <div className="flex items-center text-sm">
            <img
              className="w-8 h-8 rounded-full mr-2"
              src={post.image}
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