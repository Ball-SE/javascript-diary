import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const usePosts = () => {
  // State สำหรับจัดการข้อมูล posts
  const [allPosts, setAllPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ดึงข้อมูลทั้งหมดจาก API
  const fetchAllPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("https://blog-post-project-api.vercel.app/posts");
      console.log(response.data.posts);
      setAllPosts(response.data.posts);
      setFilteredPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter posts ตาม category ที่เลือก
  const filterPostsByCategory = useCallback((category) => {
    if (!category || category === "all") {
      setFilteredPosts(allPosts);
    } else {
      const filtered = allPosts.filter(post => post.category === category);
      setFilteredPosts(filtered);
    }
  }, [allPosts]);

  // Handle category change
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    filterPostsByCategory(category);
  }, [filterPostsByCategory]);

  // Load data เมื่อ component mount
  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  // Filter posts เมื่อ selectedCategory หรือ allPosts เปลี่ยนแปลง
  useEffect(() => {
    filterPostsByCategory(selectedCategory);
  }, [selectedCategory, allPosts, filterPostsByCategory]);

  return {
    allPosts,
    filteredPosts,
    selectedCategory,
    loading,
    error,
    handleCategoryChange,
    refetch: fetchAllPosts
  };
};