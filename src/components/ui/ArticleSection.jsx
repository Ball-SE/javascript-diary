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
} from "@/components/ui/select";
import { category } from "../../data/category";
import { useState, useEffect } from "react";
import axios from "axios";

function ArticleSection() {
  const [allCategories] = useState(category);
  const [selectedCategory, setSelectedCategory] = useState("all"); // เปลี่ยนจาก "" เป็น "all"
  const [categories, setCategories] = useState([]);
  const [allPosts, setAllPosts] = useState([]);

  // ดึงข้อมูลทั้งหมดครั้งแรก
  const getAllPosts = async () => {
    try {
      const response = await axios.get("https://blog-post-project-api.vercel.app/posts");
      setAllPosts(response.data.posts);
      setCategories(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Filter posts ตาม category ที่เลือก
  const filterPostsByCategory = (category) => {
    if (!category || category === "all") {
      setCategories(allPosts); // แสดงทั้งหมด
    } else {
      const filtered = allPosts.filter(post => post.category === category);
      setCategories(filtered);
    }
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  useEffect(() => {
    filterPostsByCategory(selectedCategory);
  }, [selectedCategory, allPosts]);

  // Handle select change สำหรับมือถือ
  const handleSelectChange = (value) => {
    setSelectedCategory(value);
  };

  return (
    <div className="w-full h-[236px] sm:w-[1200px] sm:h-[2034px] gap-[48px] mx-auto sm:mt-[80px]">
      <h3 className="p-[10px] text-2xl text-[#26231E] font-semibold">
        Latest articles
      </h3>

      <div className=" bg-[#EFEEEB] sm:rounded-[16px] w-full h-[172px] p-[16px] gap-[16px] sm:w-[1200px] sm:h-[80px] flex flex-col sm:flex-row justify-center sm:justify-between pt-[16px] pr-[24px] pb-[16px] pl-[24px]">
        <div className="hidden w-full h-[48px] gap-[8px] sm:flex flex-row items-center">
          <button 
            key="all" 
            onClick={() => setSelectedCategory("all")} 
            className={`w-[113px] h-[48px] rounded-[8px] pt-[12px] pr-[20px] pb-[12px] pl-[20px] gap-[10px] text-[#43403B] font-medium text-base ${selectedCategory === "all" ? "bg-[#DAD6D1]" : ""}`}>
              All
          </button>
          {allCategories.map((category, index) => (
            <button 
            key={index} 
            onClick={() => setSelectedCategory(category)} 
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
          <SelectTrigger className="sm:hidden w-full h-[48px] rouded-[8px] border pt-[12px] pr-[12px] pb-[12px] pl-[16px] gap-[4px] bg-[#FFFFFF] font-medium text-base text-[#75716B]">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              {allCategories.map((category, index) => (
                <SelectItem key={index} value={category}>{category}</SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <BlogCard categories={categories} />
      
      <div className="flex justify-center mt-8">
        <button className="h-[48px] px-8 flex justify-center items-center text-[#26231E] font-medium underline text-base">
          View All
        </button>
      </div>
    </div>
  );
}

export default ArticleSection;