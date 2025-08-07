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

function ArticleSection() {
  return (
    <div className="w-full h-[236px] sm:w-[1200px] sm:h-[2034px] gap-[48px] mx-auto sm:mt-[80px]">
      <h3 className="p-[10px] text-2xl text-[#26231E] font-semibold">
        Latest articles
      </h3>

      <div className=" bg-[#EFEEEB] sm:rounded-[16px] w-full h-[172px] p-[16px] gap-[16px] sm:w-[1200px] sm:h-[80px] flex flex-col sm:flex-row justify-center sm:justify-between pt-[16px] pr-[24px] pb-[16px] pl-[24px]">
        <ul className="hidden w-[438px] h-[48px] gap-[8px] sm:flex flex-row items-center">
          <li>
            <a
              href="#"
              className="bg-[#DAD6D1] w-[113px] h-[48px] rounded-[8px] pt-[12px] pr-[20px] pb-[12px] pl-[20px] gap-[10px] text-[#43403B] font-medium text-base"
            >
              Highlight
            </a>
          </li>
          <li>
            <a
              href="#"
              className="w-[113px] h-[48px] rounded-[8px] pt-[12px] pr-[20px] pb-[12px] pl-[20px] gap-[10px] text-[#43403B] font-medium text-base"
            >
              Cat
            </a>
          </li>
          <li>
            <a
              href="#"
              className="w-[113px] h-[48px] rounded-[8px] pt-[12px] pr-[20px] pb-[12px] pl-[20px] gap-[10px] text-[#43403B] font-medium text-base"
            >
              Inspiration
            </a>
          </li>
          <li>
            <a
              href="#"
              className="w-[113px] h-[48px] rounded-[8px] pt-[12px] pr-[20px] pb-[12px] pl-[20px] gap-[10px] text-[#43403B] font-medium text-base"
            >
              Ganeral
            </a>
          </li>
        </ul>
        <div className="relative">
          <Input
            type="search"
            placeholder="Search"
            className="w-full sm:w-[360px] h-[48px] gap-[4px] border border-[#DAD6D1] rounded-[8px] pt-[12px] pr-[48px] pb-[12px] pl-[16px] bg-[#FFFFFF] font-medium text-base text-[#75716B]"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#75716B] w-[24px] h-[24px]" />
        </div>

        <Select className="sm:hidden w-[343px] h-[76px] gap-[4px] ">
          <p className="sm:hidden text-[#75716B] font-medium text-base">
            Category
          </p>
          <SelectTrigger className="sm:hidden w-full h-[48px] rouded-[8px] border pt-[12px] pr-[12px] pb-[12px] pl-[16px] gap-[4px] bg-[#FFFFFF] font-medium text-base text-[#75716B]">
            <SelectValue placeholder="Select a Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Categories</SelectLabel>
              <SelectItem value="Highlight">Highlight</SelectItem>
              <SelectItem value="Cat">Cat</SelectItem>
              <SelectItem value="Inspiration">Inspiration</SelectItem>
              <SelectItem value="Ganeral">Ganeral</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full pt-[20px]">
        <BlogCard 
        category="General"
        title="The Art of Mindfulness: Finding Peace in a Busy World"
        description="Discover the transformative power of mindfulness and how it can help you navigate the challenges of modern life with greater ease and contentment."
        image="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/e739huvlalbfz9eynysc.jpg"
        author="Thompson P."
        date="11 September 2024"
        />

        <BlogCard 
        category="Cat"
        title="The Secret Language of Cats: Decoding Feline Communication"
        description="Unravel the mysteries of cat communication and learn how to better understand your feline friend's needs and desires."
        image="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/gsutzgam24abrvgee9r4.jpg"
        author="Thompson P."
        date="21 August 2024"
        />

        <BlogCard 
        category="Inspiration"
        title="Embracing Change: How to Thrive in Times of Transition"
        description="Learn powerful strategies to navigate life's changes with grace and emerge stronger on the other side."
        image="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/zzye4nxfm3pmh81z7hni.jpg"
        author="Thompson P."
        date="23 March 2024"
        />

        <BlogCard 
        category="General"
        title="The Future of Work: Adapting to a Digital-First Economy"
        description="Explore how technology is reshaping the workplace and learn skills to succeed in the evolving job market."
        image="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/e0haxst38li4g8i0vpsr.jpg"
        author="Thompson P."
        date="23 May 2024"
        />

        <BlogCard 
        category="Inspiration"
        title="The Power of Habits: Small Changes, Big Results"
        description="Discover how small, consistent habits can lead to significant personal and professional growth over time."
        image="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/g8qpepvgnz6gioylyhrz.jpg"
        author="Thompson P."
        date="23 June 2024"
        />

        <BlogCard 
        category="Cat"
        title="Cat Nutrition: A Guide to Feeding Your Feline Friend"
        description="Learn about the nutritional needs of cats and how to provide a balanced diet for optimal health and longevity."
        image="https://res.cloudinary.com/dcbpjtd1r/image/upload/v1728449771/my-blog-post/koydfh6jpmzhtxvwein3.jpg"
        author="Thompson P."
        date="21 July 2024"
        />
      </div>
      
      <div className="flex justify-center mt-8">
        <button className="h-[48px] px-8 flex justify-center items-center text-[#26231E] font-medium underline text-base">
          View All
        </button>
      </div>
    </div>
  );
}

export default ArticleSection;
