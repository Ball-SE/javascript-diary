import { Linkedin } from "lucide-react";
import { Instagram } from "lucide-react";
import { Twitter } from "lucide-react";

export function Footer(){
    return (
        <footer className="bg-[#EFEEEB] border border-[#DAD6D1] mt-[2900px] sm:mt-auto pt-[40px] pr-[16px] pb-[40px] pl-[16px] w-full h-[144px] sm:pt-[60px] sm:pr-[120px] sm:pb-[60px] sm:pl-[120px] flex flex-col sm:flex-row sm:justify-between items-center">
            <div className="w-full h-[24px] gap-[24px] flex flex-row justify-center sm:justify-start">
                <p>
                    Get in touch
                </p>
                <div className="w-[104px] h-[24px] gap-[16px] flex flex-row">
                    <Linkedin />
                    <Instagram />
                    <Twitter />
                </div>
            </div>

            <div className="flex justify-center w-full sm:w-auto mt-4 sm:mt-0">
                <button className="w-[95px] h-[24px] gap-[6px] text-[#26231E] text-base underline font-medium">
                    <a href="#">
                        Home Page
                    </a>
                </button>
            </div>
        </footer>
    )
}
