import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
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
    <div className="w-full  h-[236px] sm:w-[1200px] sm:h-[2034px] gap-[48px] mx-auto sm:mt-[120px]">
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
    </div>
  );
}

export default ArticleSection;
