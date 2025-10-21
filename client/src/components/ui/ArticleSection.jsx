import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import BlogCard from "./BlogCard";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../hooks/usePosts";
import { Skeleton } from "@mui/material";

function ArticleSection() {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4001';
  const [allCategories, setAllCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // ใช้ custom hooks
  const { 
    filteredPosts, 
    selectedCategory, 
    loading: postsLoading, 
    error: postsError, 
    handleCategoryChange 
  } = usePosts();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [catRes, postsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/posts/categories`),
          axios.get(`${API_BASE_URL}/posts?limit=100`)
        ]);
        const names = (catRes.data?.categories || []).map((c) => c.name);
        const presentSet = new Set((postsRes.data?.posts || []).map((p) => p.category).filter(Boolean));
        const filtered = names.filter((n) => presentSet.has(n));
        setAllCategories(["all", ...filtered]);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCategories();
  }, [API_BASE_URL]);

  // Handle select change สำหรับมือถือ
  const handleSelectChange = (value) => {
    handleCategoryChange(value);
    setShowAll(false); // รีเซ็ต showAll เมื่อเปลี่ยน category
  };

  // Handle category change สำหรับ desktop
  const handleCategoryClick = (category) => {
    handleCategoryChange(category);
    setShowAll(false); // รีเซ็ต showAll เมื่อเปลี่ยน category
  };

  // Handle view more button
  const handleViewMore = () => {
    setShowAll(true);
  };

  // ใช้ filteredPosts + keyword สำหรับการแสดงผล
  const normalizedKeyword = keyword.trim().toLowerCase();
  const searchFilteredPosts = normalizedKeyword
    ? filteredPosts.filter((p) => {
        const haystack = `${p.title || ""} ${p.description || ""} ${p.content || ""}`.toLowerCase();
        return haystack.includes(normalizedKeyword);
      })
    : filteredPosts;

  const titleSuggestions = normalizedKeyword
    ? filteredPosts
        .filter((p) => (p.title || "").toLowerCase().includes(normalizedKeyword))
        .slice(0, 6)
    : [];

  // State สำหรับแสดงผล 6 รายการแรก
  const [showAll, setShowAll] = useState(false);
  const displayPosts = showAll ? searchFilteredPosts : searchFilteredPosts.slice(0, 6);

  // Debug information
  console.log('ArticleSection Debug:', {
    selectedCategory,
    filteredPostsCount: filteredPosts.length,
    searchFilteredPostsCount: searchFilteredPosts.length,
    displayPostsCount: displayPosts.length,
    showAll,
    keyword: normalizedKeyword,
    allCategories
  });

  return (
    <div className="w-full h-[236px] sm:w-[1200px] sm:h-[2034px] gap-[48px] mx-auto sm:mt-[80px]">
      <h3 className="p-[10px] text-2xl text-[#26231E] font-semibold">
        Latest articles
      </h3>

      <div className=" bg-[#EFEEEB] sm:rounded-[16px] w-full h-[172px] p-[16px] gap-[16px] sm:w-[1200px] sm:h-[80px] flex flex-col sm:flex-row justify-center sm:justify-between pt-[16px] pr-[24px] pb-[16px] pl-[24px]">
        <div className="hidden w-full h-[48px] gap-[8px] sm:flex flex-row items-center">
          
          {allCategories.map((category, index) => (
            <button 
            key={index} 
            onClick={() => handleCategoryClick(category)} 
            className={`w-[113px] h-[48px] rounded-[8px] pt-[12px] pr-[20px] pb-[12px] pl-[20px] gap-[10px] text-[#43403B] font-medium text-base ${selectedCategory === category ? "bg-[#DAD6D1]" : ""}`}>
                {category}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <Input
            type="search"
            placeholder="Search"
            className="w-full sm:w-[360px] h-[48px] gap-[4px] border border-[#DAD6D1] rounded-[8px] pt-[12px] pr-[48px] pb-[12px] pl-[16px] bg-[#FFFFFF] font-medium text-base text-[#75716B]"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setShowSuggestions(Boolean(e.target.value.trim()));
            }}
            onFocus={() => setShowSuggestions(Boolean(keyword.trim()))}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-3 text-[#75716B] w-[24px] h-[24px]" />

          {showSuggestions && titleSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-md shadow-md border border-[#E8E6E2] z-20">
              <ul className="py-2 max-h-[320px] overflow-auto">
                {titleSuggestions.map((p) => (
                  <li key={p.id}>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-[#F5F4F2] text-[#26231E]"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setShowSuggestions(false);
                        setKeyword("");
                        navigate(`/post/${p.id}`);
                      }}
                    >
                      {p.title}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Select className="sm:hidden w-[343px] h-[76px] gap-[4px] " onValueChange={handleSelectChange} value={selectedCategory}>
          <p className="sm:hidden text-[#75716B] font-medium text-base">
            Category
          </p>
          <SelectTrigger className="sm:hidden w-full h-[48px] rounded-[8px] border pt-[12px] pr-[12px] pb-[12px] pl-[16px] gap-[4px] bg-[#FFFFFF] font-medium text-base text-[#75716B]">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              {allCategories.map((category, index) => (
                <SelectItem key={index} value={category}>{category}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* แสดง skeleton loading */}
      {postsLoading && (
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
      )}
      
      {/* แสดง error */}
      {postsError && <div className="text-center py-8 text-red-500">Error: {postsError}</div>}
      
      {/* แสดง posts */}
      {!postsLoading && !postsError && (
        <>
          <BlogCard categories={displayPosts} />
          {/* แสดง View More button เมื่อมีข้อมูลมากกว่า 6 รายการ และยังไม่ได้แสดงทั้งหมด */}
          {searchFilteredPosts.length > 6 && !showAll && (
            <div className="flex justify-center mt-8">
              <button 
                className="hover:text-muted-foreground h-[48px] px-8 flex justify-center items-center text-[#26231E] font-medium underline text-base"
                onClick={handleViewMore}
              >
                View More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ArticleSection;