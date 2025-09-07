import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const usePagination = (selectedCategory) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ฟังก์ชันดึงข้อมูลแบบ pagination
  const fetchPosts = useCallback(async (pageNum = 1, category = "all") => {
    setLoading(true);
    setError(null);
    try {
      const categoryParam = category === "Highlight" || category === "all" ? "" : category;
      
      const response = await axios.get(
        "https://blog-post-project-api.vercel.app/posts", {
          params: {
            page: pageNum,
            limit: 6,
            category: categoryParam
          }
        }
      );
      
      if (pageNum === 1) {
        // ถ้าเป็นหน้าแรก ให้ reset posts
        setPosts(response.data.posts);
      } else {
        // ถ้าเป็นหน้าต่อไป ให้เพิ่ม posts
        setPosts(prevPosts => [...prevPosts, ...response.data.posts]);
      }
      
      // ตรวจสอบว่าได้ข้อมูลหน้าสุดท้ายแล้วหรือยัง
      setHasMore(response.data.currentPage < response.data.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load more posts
  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPosts(nextPage, selectedCategory);
    }
  }, [page, loading, hasMore, selectedCategory, fetchPosts]);

  // Reset pagination เมื่อ category เปลี่ยน
  useEffect(() => {
    setPage(1);
    setPosts([]);
    setHasMore(true);
    fetchPosts(1, selectedCategory);
  }, [selectedCategory, fetchPosts]);

  return {
    posts,
    page,
    hasMore,
    loading,
    error,
    handleLoadMore,
    refetch: () => fetchPosts(1, selectedCategory)
  };
};