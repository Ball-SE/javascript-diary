import { Linkedin } from "lucide-react";
import { Instagram } from "lucide-react";
import { Twitter } from "lucide-react";

export function Footer(){
    return (
        <footer className="bg-[#EFEEEB] border border-[#DAD6D1]  w-full h-[144px] pt-[60px] pr-[120px] pb-[60px] pl-[120px] flex justify-between items-center">
            <div className="w-[226px] h-[24px] gap-[24px] flex flex-row">
                <p>
                    Get in touch
                </p>
                <div className="w-[104px] h-[24px] gap-[16px] flex flex-row">
                    <Linkedin />
                    <Instagram />
                    <Twitter />
                </div>
            </div>

            <button className="w-[95px] h-[24px] gap-[6px] text-[#26231E] text-base underline font-medium">
                <a href="#">
                    Home Page
                </a>
            </button>
        </footer>
    )
}
