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
import { category } from "../../data/category";
import { useState } from "react";
import { usePosts } from "../../hooks/usePosts";
import { usePagination } from "../../hooks/usePagination";

function ArticleSection() {
  const [allCategories] = useState(category);
  
  // ใช้ custom hooks
  const { 
    filteredPosts, 
    selectedCategory, 
    loading: postsLoading, 
    error: postsError, 
    handleCategoryChange 
  } = usePosts();
  
  const { 
    posts: paginatedPosts, 
    hasMore, 
    loading: paginationLoading, 
    error: paginationError, 
    handleLoadMore 
  } = usePagination(selectedCategory);

  // Handle select change สำหรับมือถือ
  const handleSelectChange = (value) => {
    handleCategoryChange(value);
  };

  // ใช้ filteredPosts สำหรับการแสดงผล (ไม่ใช้ pagination)
  const displayPosts = filteredPosts;

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
            onClick={() => handleCategoryChange(category)} 
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
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-2 text-[#75716B] w-[24px] h-[24px]" />
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

      {/* แสดง loading หรือ error */}
      {postsLoading && <div className="text-center py-8">Loading posts...</div>}
      {postsError && <div className="text-center py-8 text-red-500">Error: {postsError}</div>}
      
      {/* แสดง posts */}
      {!postsLoading && !postsError && (
        <>
          <BlogCard categories={displayPosts} />
          {hasMore && (
          <div className="flex justify-center mt-8">
            <button 
              className="hover:text-muted-foreground h-[48px] px-8 flex justify-center items-center text-[#26231E] font-medium underline text-base"
              onClick={handleLoadMore}
              disabled={paginationLoading}
            >
              {paginationLoading ? "Loading..." : "View More"}
            </button>
          </div>
          )}
        </>
      )}
    </div>
  );
}

export default ArticleSection;